"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** Browser client (anon key only) — used for Realtime review updates. */
export function getBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || url.includes("YOUR-PROJECT")) return null;
  client ??= createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
