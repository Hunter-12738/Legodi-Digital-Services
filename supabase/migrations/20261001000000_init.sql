-- Legodi's Digital Systems — public reviews + contact enquiries. No admin side.
--
-- Security model (anon = every website visitor; authenticated = treated the same, no extra rights)
--   reviews:   insert (validated) + read. Never update/delete. The reviewer email is write-only.
--   enquiries: insert only. Read them in the Supabase dashboard (Table Editor).
--   No service_role usage anywhere in the app.

create schema if not exists private;
revoke all on schema private from public;

-- ---------------------------------------------------------------------------------------------
-- Reviews (published immediately)
-- ---------------------------------------------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 80),
  company text check (company is null or char_length(btrim(company)) between 1 and 120),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  rating smallint not null check (rating between 1 and 5),
  review text not null check (char_length(btrim(review)) between 20 and 1200),
  created_at timestamptz not null default now()
);
create index reviews_created_idx on public.reviews (created_at desc);

-- ---------------------------------------------------------------------------------------------
-- Enquiries (write-only from the website)
-- ---------------------------------------------------------------------------------------------
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (phone is null or phone ~ '^[+\d][\d\s()-]{6,30}$'),
  company text check (char_length(company) <= 160),
  service text check (char_length(service) <= 160),
  message text not null check (char_length(btrim(message)) between 10 and 5000),
  created_at timestamptz not null default now()
);
create index enquiries_created_idx on public.enquiries (created_at desc);

-- ---------------------------------------------------------------------------------------------
-- Flood protection. With no moderation, cap how fast rows can arrive and reject exact duplicate
-- reviews. SECURITY DEFINER so the check can count rows the caller itself cannot read.
-- ---------------------------------------------------------------------------------------------
create function private.throttle_reviews() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if (select count(*) from public.reviews where created_at > now() - interval '1 hour') >= 20 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  if exists (
    select 1 from public.reviews
    where created_at > now() - interval '1 day' and lower(btrim(review)) = lower(btrim(new.review))
  ) then
    raise exception 'duplicate_review' using errcode = 'P0001';
  end if;
  return new;
end
$$;
create trigger reviews_throttle before insert on public.reviews
  for each row execute function private.throttle_reviews();

create function private.throttle_enquiries() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if (select count(*) from public.enquiries where created_at > now() - interval '1 hour') >= 30 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  return new;
end
$$;
create trigger enquiries_throttle before insert on public.enquiries
  for each row execute function private.throttle_enquiries();

-- ---------------------------------------------------------------------------------------------
-- Privileges: Supabase grants everything on new public tables by default — start from nothing.
-- Column lists mean callers cannot choose id/created_at, and cannot read the email column.
-- ---------------------------------------------------------------------------------------------
revoke all on public.reviews, public.enquiries from anon, authenticated;
grant select (id, name, company, rating, review, created_at) on public.reviews to anon, authenticated;
grant insert (name, company, email, rating, review) on public.reviews to anon, authenticated;
grant insert (name, email, phone, company, service, message) on public.enquiries to anon, authenticated;

alter table public.reviews enable row level security;
alter table public.reviews force row level security;
alter table public.enquiries enable row level security;
alter table public.enquiries force row level security;

create policy reviews_public_read on public.reviews for select to anon, authenticated using (true);
create policy reviews_public_insert on public.reviews for insert to anon, authenticated with check (true);
create policy enquiries_public_insert on public.enquiries for insert to anon, authenticated with check (true);
-- No update or delete policies (and no grants): nobody can edit or remove a review through the API.

-- ---------------------------------------------------------------------------------------------
-- Realtime: new reviews are pushed to visitors on the page. Realtime honours RLS and column
-- privileges, so the email column is never delivered.
-- ---------------------------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.reviews;
  end if;
end
$$;
