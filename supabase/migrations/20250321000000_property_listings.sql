-- Implements docs/data-model/property-listings-schema.md (design doc wins on any difference).
-- Review notes: docs/data-model/rls-policy-review.md
-- Needs a Supabase project (the auth schema and auth.uid() must exist).

begin;

create table public.property_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete restrict,
  title text not null,
  summary text not null,
  property_type text not null,
  status text not null default 'draft',
  address_line1 text not null,
  address_line2 text,
  city text not null,
  region text not null,
  postal_code text not null,
  country text not null default 'US',
  asking_price numeric(14, 2),
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint property_listings_property_type_check
    check (property_type in ('single_family', 'multi_family', 'commercial', 'land')),
  constraint property_listings_status_check
    check (status in ('draft', 'active', 'under_contract', 'closed')),
  constraint property_listings_country_check
    check (country ~ '^[A-Z]{2}$'),
  constraint property_listings_asking_price_check
    check (asking_price is null or asking_price > 0),
  constraint property_listings_closed_at_check
    check ((status = 'closed') = (closed_at is not null)),
  constraint property_listings_updated_after_created_check
    check (updated_at >= created_at)
);

create index property_listings_owner_id_idx
  on public.property_listings (owner_id);

-- Keeps updated_at current, and refuses edits to the columns the design says never change.
create function public.property_listings_before_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
     or new.owner_id is distinct from old.owner_id
     or new.created_at is distinct from old.created_at then
    raise exception 'property_listings: id, owner_id and created_at cannot be changed';
  end if;
  new.updated_at = now();
  return new;
end;
$$;

create trigger property_listings_before_update
  before update on public.property_listings
  for each row
  execute function public.property_listings_before_update();

alter table public.property_listings enable row level security;

-- Supabase grants new public tables to anon and authenticated by default.
-- Start from nothing, then give signed-in users only the four row operations.
-- (TRUNCATE is deliberately not granted: it ignores RLS.)
revoke all on public.property_listings from public, anon, authenticated;
grant select, insert, update, delete on public.property_listings to authenticated;

-- (select auth.uid()) is the same value as auth.uid(); the wrapper lets Postgres evaluate it once per query.
create policy "property_listings_select_own"
  on public.property_listings
  for select
  to authenticated
  using (owner_id = (select auth.uid()));

create policy "property_listings_insert_own"
  on public.property_listings
  for insert
  to authenticated
  with check (owner_id = (select auth.uid()));

create policy "property_listings_update_own"
  on public.property_listings
  for update
  to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "property_listings_delete_own"
  on public.property_listings
  for delete
  to authenticated
  using (owner_id = (select auth.uid()));

commit;
