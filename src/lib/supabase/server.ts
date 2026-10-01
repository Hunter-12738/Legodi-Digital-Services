import "server-only";

import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/env";

/** Anonymous client (anon key, no session). RLS decides what it may read and insert. */
export function createPublicClient() {
  const cfg = supabaseConfig();
  if (!cfg) return null;
  return createClient(cfg.url, cfg.anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
