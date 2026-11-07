import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let publicClient: SupabaseClient | undefined;

/** Anonymous public reads must never depend on the visitor's auth cookies. */
export function createPublicClient() {
  if (publicClient) return publicClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("A configuração pública do Supabase está incompleta.");
  }

  publicClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, init) => fetch(input, {
        ...init,
        cache: "no-store",
        signal: init?.signal ?? AbortSignal.timeout(8_000),
      }),
    },
  });

  return publicClient;
}
