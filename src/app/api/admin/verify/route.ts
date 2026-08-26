import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { 
  SESSION_COOKIE_NAME, 
  SESSION_MAX_AGE_SECONDS, 
  createSignedToken, 
  verifySignedToken 
} from "@/utils/adminAuth";

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
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

// Dummy export to keep backwards compatibility if any legacy code imports activeSessions
export const activeSessions = new Map<string, { expiresAt: number }>();

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

    const body = await request.json().catch(() => ({}));
    const passcode = typeof body?.passcode === "string" ? body.passcode.trim() : "";
    const secretPasscode = (process.env.ADMIN_PASSCODE || "141104").trim();

    if (!passcode) {
      return NextResponse.json(
        { success: false, error: "SECURITY PASSCODE IS REQUIRED" },
        { status: 400 }
      );
    }

    if (timingSafeCompare(passcode, secretPasscode)) {
      clearFailedAttempts(ip);

      const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
      const sessionToken = createSignedToken(expiresAt);

      const response = NextResponse.json({ success: true });

      // Set HttpOnly cookie (sameSite: 'lax' ensures reliable delivery across serverless requests)
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
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
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (verifySignedToken(token)) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    console.error("Session validation error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

// DELETE: Logout — destroy session
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export { SESSION_COOKIE_NAME };
