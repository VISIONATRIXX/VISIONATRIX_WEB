import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

// In-memory session store with expiry (resets on server restart — acceptable for admin)
const activeSessions = new Map<string, { expiresAt: number }>();

const SESSION_COOKIE_NAME = "vx_admin_session";
const SESSION_MAX_AGE_SECONDS = 4 * 60 * 60; // 4 hours

// Rate limiting: track failed attempts per IP
const failedAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const RATE_WINDOW_MS = 60 * 1000; // 1 minute

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (!entry || now > entry.resetAt) return false;
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    failedAttempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip);
}

function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Compare against self to burn constant time, then return false
    const bufA = Buffer.from(a);
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// Cleanup expired sessions periodically
function cleanupSessions() {
  const now = Date.now();
  for (const [token, session] of activeSessions) {
    if (now > session.expiresAt) {
      activeSessions.delete(token);
    }
  }
}

// POST: Login with passcode
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Rate limit check
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "TOO MANY ATTEMPTS — TRY AGAIN LATER" },
        { status: 429 }
      );
    }

    const { passcode } = await request.json();
    const secretPasscode = process.env.ADMIN_PASSCODE;

    if (!secretPasscode) {
      console.error("ADMIN_PASSCODE environment variable is not set!");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!passcode || typeof passcode !== "string") {
      return NextResponse.json(
        { success: false, error: "Bad request" },
        { status: 400 }
      );
    }

    if (timingSafeCompare(passcode, secretPasscode)) {
      // Success: generate random session token
      clearFailedAttempts(ip);
      cleanupSessions();

      const sessionToken = crypto.randomUUID();
      const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
      activeSessions.set(sessionToken, { expiresAt });

      const response = NextResponse.json({ success: true });

      // Set HttpOnly cookie
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: "/",
      });

      return response;
    } else {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { success: false, error: "INCORRECT SECURITY PASSCODE" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Admin verification API error:", error);
    return NextResponse.json(
      { success: false, error: "Server error during verification" },
      { status: 500 }
    );
  }
}

// GET: Validate existing session cookie
export async function GET() {
  try {
    cleanupSessions();
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = activeSessions.get(token);
    if (!session || Date.now() > session.expiresAt) {
      activeSessions.delete(token || "");
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("Session validation error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

// DELETE: Logout — destroy session
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      activeSessions.delete(token);
    }

    cookieStore.delete(SESSION_COOKIE_NAME);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// Export for use by other API routes
export { activeSessions, SESSION_COOKIE_NAME };
