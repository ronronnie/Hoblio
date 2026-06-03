import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database, TypedSupabaseClient } from "@/lib/supabase/database.types";

export async function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase server environment variables.");
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {
        // Server Components cannot set cookies. Route handlers will own auth mutations.
      },
      remove() {
        // Server Components cannot remove cookies. Route handlers will own auth mutations.
      }
    }
  }) as unknown as TypedSupabaseClient;
}
