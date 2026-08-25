import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "vx_admin_session";

// In-memory session store — shared reference with verify route
// We import lazily to avoid circular dependency issues
let _activeSessions: Map<string, { expiresAt: number }> | null = null;

async function getActiveSessions(): Promise<Map<string, { expiresAt: number }>> {
  if (!_activeSessions) {
    // Dynamic import to get the shared session store
    const mod = await import("@/app/api/admin/verify/route");
    _activeSessions = mod.activeSessions;
  }
  return _activeSessions;
}

/**
 * Validates the admin session cookie from the incoming request.
 * Returns true if the session is valid and not expired.
 */
export async function validateAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return false;

    const sessions = await getActiveSessions();
    const session = sessions.get(token);

    if (!session || Date.now() > session.expiresAt) {
      if (session) sessions.delete(token);
      return false;
    }

    return true;
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
