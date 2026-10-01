// In-process Postgres (PGlite) with a minimal shim of the Supabase pieces the migrations rely on:
// roles anon/authenticated, auth.users + auth.uid(), a stub storage schema, the realtime publication.
// Scope: SQL only (migrations, constraints, grants, RLS). PostgREST/Auth/Storage/Realtime services
// themselves are exercised against a real Supabase project.
import { PGlite } from "@electric-sql/pglite";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SHIM = `
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;

create schema auth;
create table auth.users (id uuid primary key, email text);
create function auth.uid() returns uuid language sql stable as $$
  select (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid
$$;
grant usage on schema auth to anon, authenticated, service_role;

create schema storage;
create table storage.buckets (
  id text primary key, name text not null, public boolean default false,
  file_size_limit bigint, allowed_mime_types text[]
);
create table storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text references storage.buckets (id), name text, owner uuid
);
alter table storage.objects enable row level security;
grant usage on schema storage to anon, authenticated;
grant select, insert, update, delete on storage.objects to anon, authenticated;

grant usage on schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
create publication supabase_realtime;
`;

export type Actor = { role: "anon" } | { role: "authenticated"; uid: string };

export async function createLocalDb() {
  const db = new PGlite();
  await db.exec(SHIM);
  const dir = join(process.cwd(), "supabase", "migrations");
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    await db.exec(readFileSync(join(dir, f), "utf8"));
  }

  /** Run `fn` as an API actor (PostgREST-style role + JWT claims), then reset to superuser. */
  async function as<T>(actor: Actor, fn: () => Promise<T>): Promise<T> {
    const claims = actor.role === "anon" ? "" : JSON.stringify({ sub: actor.uid, role: "authenticated" });
    await db.query("select set_config('request.jwt.claims', $1, false)", [claims]);
    await db.exec(`set role ${actor.role}`);
    try {
      return await fn();
    } finally {
      await db.exec("reset role; select set_config('request.jwt.claims', '', false);");
    }
  }

  return { db, as };
}
