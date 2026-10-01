// Applies supabase/migrations/*.sql to the project in SUPABASE_DB_URL (read from .env.local).
//   npm run db:push
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const url = process.env.SUPABASE_DB_URL;
if (!url || url.includes("YOUR-PROJECT")) {
  console.error("Set SUPABASE_DB_URL in .env.local (Supabase → Project Settings → Database → Session pooler).");
  process.exit(1);
}
// npx needs a shell on Windows; quote the URL so &/? in the password survive.
const r = spawnSync(`npx --yes supabase db push --db-url "${url}"`, { stdio: "inherit", shell: true });
process.exit(r.status ?? 1);
