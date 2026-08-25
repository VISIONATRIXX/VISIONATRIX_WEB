interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Periodic cleanup of stale rate limit entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}

/**
 * Checks and increments rate limit for a specific key/IP.
 * @param key Unique identifier (e.g., `upload:${ip}` or `auth:${ip}`)
 * @param maxHits Maximum allowed hits within window
 * @param windowMs Time window in milliseconds
 * @returns `{ allowed: boolean, remaining: number, retryAfterMs: number }`
 */
export function checkRateLimit(
  key: string,
  maxHits: number = 20,
  windowMs: number = 60 * 1000
) {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxHits - 1, retryAfterMs: 0 };
  }

  if (entry.count >= maxHits) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, entry.resetAt - now),
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: maxHits - entry.count,
    retryAfterMs: 0,
  };
}
