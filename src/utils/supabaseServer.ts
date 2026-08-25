import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabaseAdminInstance: SupabaseClient | null = null;

/**
 * Returns a server-only Supabase client initialized with the service role key.
 * Lazy-initialized so module evaluation does not crash at build/dev startup.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdminInstance) return _supabaseAdminInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Fall back to anon key if service role key is not yet set in environment
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment."
    );
  }

  _supabaseAdminInstance = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _supabaseAdminInstance;
}
