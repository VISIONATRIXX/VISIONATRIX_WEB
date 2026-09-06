import { cookies } from "next/headers";
import crypto from "crypto";

export const SESSION_COOKIE_NAME = "vx_admin_session";
export const SESSION_MAX_AGE_SECONDS = 4 * 60 * 60; // 4 hours

// Rate limiting configuration (stateless, stored in HttpOnly cookie)
export const RATE_LIMIT_COOKIE_NAME = "vx_admin_ratelimit";
export const RATE_LIMIT_MAX_ATTEMPTS = 5;
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

/**
 * Creates an HMAC signed session token containing expiration timestamp.
 */
export function createSignedToken(expiresAt: number): string {
  const payload = `${expiresAt}`;
  const secret = (process.env.ADMIN_PASSCODE || "141104").trim();
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

/**
 * Verifies if a session token is valid and not expired.
 */
export function verifySignedToken(token?: string): boolean {
  if (!token || typeof token !== "string") return false;
  const dotIdx = token.lastIndexOf(".");
  if (dotIdx === -1) return false;

  const payload = token.substring(0, dotIdx);
  const signature = token.substring(dotIdx + 1);

  const expiresAt = Number(payload);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

  const secret = (process.env.ADMIN_PASSCODE || "141104").trim();
  const expectedHmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  if (signature.length !== expectedHmac.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedHmac));
}

/**
 * Creates a signed rate limit token.
 * Payload: `${ip}:${count}:${resetAt}`
 */
export function createRateLimitToken(ip: string, count: number, resetAt: number): string {
  const payload = `${ip}:${count}:${resetAt}`;
  const secret = (process.env.ADMIN_PASSCODE || "141104").trim();
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

/**
 * Verifies a rate limit token and returns parsed data if valid.
 */
export function verifyRateLimitToken(token?: string): { ip: string; count: number; resetAt: number } | null {
  if (!token || typeof token !== "string") return null;
  const dotIdx = token.lastIndexOf(".");
  if (dotIdx === -1) return null;

  const payload = token.substring(0, dotIdx);
  const signature = token.substring(dotIdx + 1);

  const parts = payload.split(":");
  if (parts.length !== 3) return null;

  const [ip, countStr, resetAtStr] = parts;
  const count = Number(countStr);
  const resetAt = Number(resetAtStr);

  if (isNaN(count) || isNaN(resetAt)) return null;

  const secret = (process.env.ADMIN_PASSCODE || "141104").trim();
  const expectedHmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  if (signature.length !== expectedHmac.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedHmac))) return null;

  return { ip, count, resetAt };
}

/**
 * Consumes a rate limit attempt, returning new state.
 * Returns { allowed: boolean, count: number, resetAt: number, retryAfterMs: number }
 */
export function consumeRateLimitToken(
  token: string | undefined,
  ip: string,
  maxAttempts: number,
  windowMs: number
): { allowed: boolean; count: number; resetAt: number; retryAfterMs: number } {
  const now = Date.now();
  const parsed = verifyRateLimitToken(token);

  // No valid token or token for different IP or expired window
  if (!parsed || parsed.ip !== ip || now > parsed.resetAt) {
    return { allowed: true, count: 1, resetAt: now + windowMs, retryAfterMs: 0 };
  }

  // Rate limited
  if (parsed.count >= maxAttempts) {
    return {
      allowed: false,
      count: parsed.count,
      resetAt: parsed.resetAt,
      retryAfterMs: Math.max(0, parsed.resetAt - now),
    };
  }

  // Increment count
  return { allowed: true, count: parsed.count + 1, resetAt: parsed.resetAt, retryAfterMs: 0 };
}

/**
 * Validates the admin session cookie from the incoming request headers.
 */
export async function validateAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    return verifySignedToken(token);
  } catch {
    return false;
  }
}

/**
 * Returns a 401 JSON response for unauthorized requests.
 */
export function unauthorizedResponse() {
  return Response.json(
    { error: "Unauthorized — valid admin session required" },
    { status: 401 }
  );
}

// Re-export rate limiting utilities for other routes
export { getClientIp, checkRateLimit } from "@/utils/rateLimiter";
