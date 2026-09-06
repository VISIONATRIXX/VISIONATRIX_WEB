import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabaseAdminInstance: SupabaseClient | null = null;

/**
 * Returns a server-only Supabase client initialized with the service role key.
 * Lazy-initialized so module evaluation does not crash at build/dev startup.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdminInstance) return _supabaseAdminInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be set in environment.");
  }

  if (!serviceRoleKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL: SUPABASE_SERVICE_ROLE_KEY environment variable is required in production!"
      );
    } else {
      console.warn(
        "⚠️ [SECURITY NOTICE] SUPABASE_SERVICE_ROLE_KEY is missing in local environment. Falling back to anon key."
      );
      serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!serviceRoleKey) {
        throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.");
      }
    }
  }

  _supabaseAdminInstance = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _supabaseAdminInstance;
}
