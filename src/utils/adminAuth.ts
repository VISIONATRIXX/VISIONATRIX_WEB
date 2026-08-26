import { cookies } from "next/headers";
import crypto from "crypto";

export const SESSION_COOKIE_NAME = "vx_admin_session";
export const SESSION_MAX_AGE_SECONDS = 4 * 60 * 60; // 4 hours

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
