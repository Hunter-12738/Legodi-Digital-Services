// Allowed AND denied paths, run on real Postgres (PGlite) with the real migration.
import { randomUUID } from "node:crypto";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createLocalDb, type Actor } from "./local-db";

let ctx: Awaited<ReturnType<typeof createLocalDb>>;
const anon: Actor = { role: "anon" };
const user: Actor = { role: "authenticated", uid: randomUUID() }; // a signed-in account has no extra rights

const rows = async (sql: string, params: unknown[] = []) => (await ctx.db.query<Record<string, unknown>>(sql, params)).rows;
const run = (actor: Actor, sql: string, params: unknown[] = []) => ctx.as(actor, () => rows(sql, params));

const REVIEW = "insert into reviews (name, company, email, rating, review) values ($1,$2,$3,$4,$5)";
const ENQUIRY = "insert into enquiries (name, email, phone, company, service, message) values ($1,$2,$3,$4,$5,$6)";
let n = 0;
const uniqueText = () => `A genuinely useful review number ${++n} for testing.`;

beforeAll(async () => {
  ctx = await createLocalDb();
});
beforeEach(async () => {
  await ctx.db.exec("delete from reviews; delete from enquiries;");
});

describe("reviews", () => {
  it("anyone can submit, and it is immediately public (without the email)", async () => {
    await run(anon, REVIEW, ["Client One", "Acme", "one@example.test", 5, uniqueText()]);
    expect(await run(anon, "select name, company, rating from reviews")).toEqual([{ name: "Client One", company: "Acme", rating: 5 }]);
    expect(await run(user, "select name from reviews")).toHaveLength(1);
    await expect(run(anon, "select email from reviews")).rejects.toThrow(/permission denied/);
    await expect(run(anon, "select * from reviews")).rejects.toThrow(/permission denied/);
  });

  it("nobody can edit or delete reviews", async () => {
    await run(anon, REVIEW, ["Client One", null, "one@example.test", 5, uniqueText()]);
    for (const actor of [anon, user]) {
      await expect(run(actor, "update reviews set rating = 1")).rejects.toThrow(/permission denied/);
      await expect(run(actor, "delete from reviews")).rejects.toThrow(/permission denied/);
    }
    expect((await rows("select rating from reviews"))[0].rating).toBe(5);
  });

  it("callers cannot set id or created_at", async () => {
    await expect(
      run(anon, "insert into reviews (id, name, email, rating, review) values (gen_random_uuid(),'Ab','a@example.test',5,$1)", [uniqueText()]),
    ).rejects.toThrow(/permission denied/);
    await expect(
      run(anon, "insert into reviews (name, email, rating, review, created_at) values ('Ab','a@example.test',5,$1,'2000-01-01')", [uniqueText()]),
    ).rejects.toThrow(/permission denied/);
  });

  it("validates rating, lengths and email", async () => {
    const bad = [
      ["Ab", null, "a@example.test", 0, uniqueText()],
      ["Ab", null, "a@example.test", 6, uniqueText()],
      ["A", null, "a@example.test", 5, uniqueText()],
      ["Ab", null, "not-an-email", 5, uniqueText()],
      ["Ab", null, "a@example.test", 5, "too short"],
      ["Ab", null, "a@example.test", 5, "x".repeat(1201)],
      ["Ab", "", "a@example.test", 5, uniqueText()],
    ];
    for (const b of bad) await expect(run(anon, REVIEW, b)).rejects.toThrow(/check/);
  });

  it("rejects exact duplicates and caps the hourly rate", async () => {
    const text = uniqueText();
    await run(anon, REVIEW, ["Ab", null, "a@example.test", 5, text]);
    await expect(run(anon, REVIEW, ["Cd", null, "c@example.test", 4, `  ${text.toUpperCase()} `])).rejects.toThrow(/duplicate_review/);
    for (let i = 0; i < 19; i++) await run(anon, REVIEW, ["Ab", null, "a@example.test", 5, uniqueText()]);
    await expect(run(anon, REVIEW, ["Ab", null, "a@example.test", 5, uniqueText()])).rejects.toThrow(/rate_limited/);
  });

  it("is in the realtime publication", async () => {
    expect(await rows("select tablename from pg_publication_tables where pubname='supabase_realtime'")).toContainEqual({ tablename: "reviews" });
  });
});

describe("enquiries", () => {
  it("anyone can submit; nobody can read, change or delete them through the API", async () => {
    await run(anon, ENQUIRY, ["Client", "client@example.test", "068 344 0637", "Co", "Websites", "We need a new website please."]);
    for (const actor of [anon, user]) {
      await expect(run(actor, "select * from enquiries")).rejects.toThrow(/permission denied/);
      await expect(run(actor, "select count(*) from enquiries")).rejects.toThrow(/permission denied/);
      await expect(run(actor, "update enquiries set name='x'")).rejects.toThrow(/permission denied/);
      await expect(run(actor, "delete from enquiries")).rejects.toThrow(/permission denied/);
    }
    expect((await rows("select count(*)::int c from enquiries"))[0].c).toBe(1);
  });

  it("validates fields", async () => {
    await expect(run(anon, ENQUIRY, ["C", "c@example.test", null, null, null, "Long enough message"])).rejects.toThrow(/check/);
    await expect(run(anon, ENQUIRY, ["Client", "c@example.test", "call me", null, null, "Long enough message"])).rejects.toThrow(/check/);
    await expect(run(anon, ENQUIRY, ["Client", "c@example.test", null, null, null, "short"])).rejects.toThrow(/check/);
  });

  it("caps the hourly rate", async () => {
    for (let i = 0; i < 30; i++) await run(anon, ENQUIRY, ["Client", "c@example.test", null, null, null, "A long enough message"]);
    await expect(run(anon, ENQUIRY, ["Client", "c@example.test", null, null, null, "A long enough message"])).rejects.toThrow(/rate_limited/);
  });

  it("only these two tables exist in the public schema", async () => {
    const tables = await rows("select table_name from information_schema.tables where table_schema='public' order by 1");
    expect(tables.map((t) => t.table_name)).toEqual(["enquiries", "reviews"]);
  });
});
