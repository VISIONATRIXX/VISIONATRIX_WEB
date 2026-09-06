import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { 
  SESSION_COOKIE_NAME, 
  SESSION_MAX_AGE_SECONDS, 
  createSignedToken, 
  verifySignedToken,
  RATE_LIMIT_COOKIE_NAME,
  RATE_LIMIT_MAX_ATTEMPTS,
  RATE_LIMIT_WINDOW_MS,
  createRateLimitToken,
  verifyRateLimitToken,
  consumeRateLimitToken
} from "@/utils/adminAuth";

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function timingSafeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  const lengthsMatch = a.length === b.length;
  const hashesMatch = crypto.timingSafeEqual(hashA, hashB);
  return lengthsMatch && hashesMatch;
}

// POST: Login with passcode
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const cookieStore = await cookies();

    // Rate limit check using stateless token
    const rateLimitCookie = cookieStore.get(RATE_LIMIT_COOKIE_NAME)?.value;
    const rateLimitResult = consumeRateLimitToken(rateLimitCookie, ip, RATE_LIMIT_MAX_ATTEMPTS, RATE_LIMIT_WINDOW_MS);
    
    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil(rateLimitResult.retryAfterMs / 1000);
      return NextResponse.json(
        { success: false, error: `TOO MANY ATTEMPTS — TRY AGAIN IN ${retryAfter}s` },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
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
      // Clear rate limit on successful login
      const response = NextResponse.json({ success: true });

      const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
      const sessionToken = createSignedToken(expiresAt);

      // Set HttpOnly session cookie
      response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE_SECONDS,
        path: "/",
      });

      // Clear rate limit cookie
      response.cookies.delete(RATE_LIMIT_COOKIE_NAME);

      return response;
    } else {
      // Increment rate limit on failed attempt
      const newRateLimitToken = createRateLimitToken(ip, rateLimitResult.count + 1, rateLimitResult.resetAt);
      
      const response = NextResponse.json(
        { success: false, error: "INCORRECT SECURITY PASSCODE" },
        { status: 401 }
      );
      
      response.cookies.set(RATE_LIMIT_COOKIE_NAME, newRateLimitToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
        path: "/",
      });

      return response;
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
