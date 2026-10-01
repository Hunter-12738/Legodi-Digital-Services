# Legodi's Digital Systems — website

Public business website: services and pricing, portfolio, founder section, live client reviews and an
enquiry form. There is deliberately **no admin side**.

**Stack:** Next.js 16 (App Router, React 19, TypeScript) · Tailwind CSS v4 · Supabase (Postgres + Realtime).

## Editing the content

All copy — services and prices, projects, process steps, phone/WhatsApp — lives in
[`src/content/site.ts`](src/content/site.ts). Screenshots are in `public/portfolio/`, the founder photo in
`public/founder/`.

## Setup

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings → API)
   - `NEXT_PUBLIC_SITE_URL` (your live domain)
   - `SUPABASE_DB_URL` (Project Settings → Database → Session pooler URI) — only used by `db:push`

   The app never uses the `service_role` key. Don't add it.
3. Create the tables:
   ```bash
   npm install
   npm run db:push
   ```
4. `npm run dev` → <http://localhost:3000>

**Enquiries** are stored in the `enquiries` table — read them in Supabase → Table Editor.
**Reviews** publish immediately. To remove an inappropriate review, delete the row in Supabase → Table Editor.

## Security

- RLS (`ENABLE` + `FORCE`) on both tables; privileges start from nothing.
- Visitors can **insert** reviews and enquiries and **read** reviews. Nobody can update or delete anything through
  the API, read enquiries, or read a reviewer's email (column-level privilege).
- Database constraints validate every field (rating 1–5, review 20–1,200 characters, email/phone formats).
  A trigger caps submissions per hour and rejects duplicate reviews; forms also carry a honeypot field.
- Review text is cleaned server-side (control/invisible characters stripped) and always rendered as plain text.
- Realtime pushes new reviews to open pages; it honours RLS and never delivers the email column.

## Checks

```bash
npm test          # database tests (real migration on in-process Postgres) + content/validation tests
npm run typecheck
npm run lint
npm run build
```

## Content notes

- Portfolio descriptions were written from the live sites (1 October 2026). Technologies, statistics and results
  are not listed because they can't be verified from the sites.
- The SADF website itself uses the name "Southern Africa Development Foundation"; the portfolio uses
  "South African Development Foundation (SADF)" as instructed — confirm which is the registered name.
