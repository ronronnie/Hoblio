import { createBrowserClient } from "@supabase/ssr";
import type { Database, TypedSupabaseClient } from "@/lib/supabase/database.types";

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase browser environment variables.");
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey) as unknown as TypedSupabaseClient;
}
