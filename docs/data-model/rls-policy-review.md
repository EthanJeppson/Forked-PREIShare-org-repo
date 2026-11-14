# RLS policy review: `property_listings`

Review of `supabase/migrations/20250321000000_property_listings.sql` against [`property-listings-schema.md`](property-listings-schema.md) (the design doc wins on any difference) and the server-only boundary in [`../requirements/sponsor-auth-and-listings-brief.md`](../requirements/sponsor-auth-and-listings-brief.md).

**Status:** the migration is written and was tested on a local Postgres 16 with stand-ins for Supabase. It has **not** been applied to a Supabase project. Applying it is a manual step (below).

## Migration file

- Path: `supabase/migrations/20250321000000_property_listings.sql`
- Creates: the `public.property_listings` table, one index on `owner_id`, a `before update` trigger, row level security, the table grants, and four policies.
- Everything is wrapped in one transaction (`begin` / `commit`). If any statement fails, nothing is created, so there is no half-applied table without RLS.
- Contains no keys, no service-role usage and no application code.

## How to apply

Run this against your Supabase project (not a blank local Postgres: it needs Supabase's `auth.users` table and `auth.uid()` function).

**Option A: SQL Editor (no tools to install)**

1. Supabase Dashboard -> **SQL Editor** -> **New query**.
2. Paste the full contents of the migration file.
3. Click **Run**. Expect "Success. No rows returned".
4. **Table Editor** -> `property_listings`: the table exists and RLS shows as enabled.
5. **Authentication -> Policies** (or the table's policy list): four policies appear.

**Option B: Supabase CLI.** Only if you already use it: `supabase link` to the project, then `supabase db push`. This repo has no `supabase/config.toml` and does not install the CLI, so Option A is the documented path.

**Checks to run in the SQL Editor afterwards**

```sql
select relrowsecurity from pg_class where oid = 'public.property_listings'::regclass;
select policyname, cmd, roles from pg_policies where tablename = 'property_listings' order by policyname;
select grantee, privilege_type from information_schema.role_table_grants
  where table_name = 'property_listings' and grantee in ('anon', 'authenticated') order by 1, 2;
```

Expected: `true`; four rows, each with role `authenticated`; and only `authenticated` with `DELETE`, `INSERT`, `SELECT`, `UPDATE` (nothing for `anon`).

**Running it twice** fails with "already exists". That is intended: the migration deliberately does not use `if not exists`, so drift is loud. Do not drop the table to re-run it once it holds data.

## Policies in plain language

| Policy | Operation | Who | Rule |
| --- | --- | --- | --- |
| `property_listings_select_own` | SELECT | `authenticated` | A signed-in user can read a row only if `owner_id` is their own id. |
| `property_listings_insert_own` | INSERT | `authenticated` | A signed-in user can add a row only if the new row's `owner_id` is their own id (WITH CHECK). |
| `property_listings_update_own` | UPDATE | `authenticated` | Can change only rows they own (USING), and the row must still be theirs afterwards (WITH CHECK). |
| `property_listings_delete_own` | DELETE | `authenticated` | Can delete only rows they own. |

All four compare `owner_id` to `(select auth.uid())`. That is the same value as `auth.uid()`; the wrapper only lets Postgres compute it once per query. The logged-out role (`anon`) has no policy and no table grant, so it gets nothing. There is no `USING (true)` anywhere.

Two protections beyond RLS, from the design doc:

- **Grants.** Supabase gives new `public` tables to `anon` and `authenticated` by default. The migration removes all of that, then grants `authenticated` only SELECT, INSERT, UPDATE and DELETE. `TRUNCATE` is not granted because it ignores RLS.
- **Trigger.** `property_listings_before_update` sets `updated_at` on every update and refuses any change to `id`, `owner_id` or `created_at` (the design says these never change).

## Alignment with the design doc

| Design requirement | In the migration |
| --- | --- |
| 16 columns, types and nullability from section 2 | Yes, same names, types and nullability |
| `owner_id` required, FK to `auth.users(id)`, `ON DELETE RESTRICT` | Yes |
| Status and property type limited to the listed values | Yes, `check` constraints on text columns (not enums) |
| `asking_price` null or greater than zero | Yes |
| `closed_at` present exactly when status is `closed` | Yes |
| `updated_at` never earlier than `created_at`; bumped on update | Yes, a check and the trigger |
| Country is a two-letter uppercase code, default `US` | Yes |
| Index on `owner_id`, nothing else yet | Yes |
| RLS enabled; own-row policies for all four commands; `anon` gets nothing | Yes |
| `owner_id` never edited after creation | Yes, the trigger |

Differences from the lesson scaffold, on purpose: the scaffold's `description`, `state`, `price_cents` and `published` / `archived` columns and values are not used (the design doc has `summary`, `region`, `asking_price` in dollars and `active` / `under_contract` / `closed`); `owner_id` is `on delete restrict`, not `cascade`; there is no `status` index; and there is no `pgcrypto` extension, because `gen_random_uuid()` is built into current Postgres.

- Missing policies: none.
- Overly open grants or policies: none found (checked below).

## Risks and open questions

1. **"Signed in" is not "sponsor".** The policies apply to every `authenticated` user. There is no sponsor role yet, so anyone who can sign up can create listings. This depends on the sign-up policy (brief, question 4; design doc, question 8).
2. **Ownership is all the policies check.** A sponsor can set `status` to `active` or `closed` and any other allowed value freely. The database does not require a price or a complete record before a listing goes `active` (design doc, questions 2 and 4).
3. **Timestamps on insert.** `created_at` and `updated_at` default to now, but a client can supply its own values on insert, within the check rules. Low risk; the server function should not pass them.
4. **No investor read.** There is no policy for anyone but the owner, so investor-facing pages cannot read real listings. Adding a "read all active" policy later adds a second permissive rule on top of these and needs a written decision (design doc, question 5).
5. **The service-role key ignores all of this.** It bypasses RLS and the grants. It must stay server-only, and no sponsor operation should use it (brief, server-only boundary; env checklist).
6. **`on delete restrict`.** Deleting a user in the dashboard fails while that user still owns listings. That is intended.
7. **UPDATE and DELETE policies are included**, although the brief says create and read only for this sprint (design doc, question 3). No UI uses them yet. To leave them out, delete those two policies; no policy means no access.
8. **Tested on stand-ins, not Supabase.** See below.
9. **Data API exposure.** A table in `public` is reachable through Supabase's REST API. That is expected here, and RLS plus the grants are what protect it. Check the project's Data API settings if you restrict exposed schemas.

## What was tested

Applied the migration to a throwaway local Postgres 16 with a stub `auth` schema, a stub `auth.uid()` that reads the request's user id, `anon` and `authenticated` roles, and Supabase's default table grants. Two users, A and B:

| Check | Result |
| --- | --- |
| A inserts own row | allowed |
| A inserts a row owned by B | blocked by RLS |
| A sees only A's rows; B sees only B's rows | confirmed |
| A updates or deletes B's row | 0 rows affected; B's row unchanged |
| A reassigns own row to B; changes `id` or `created_at` | blocked by the trigger |
| A edits own row | allowed; `updated_at` moved |
| A runs TRUNCATE | permission denied |
| Bad status, bad property type, price 0, closed without `closed_at`, `closed_at` on a non-closed row, country `USA` | each rejected by its check |
| Valid closed listing with `closed_at` | allowed |
| A deletes own row | allowed |
| Signed-in role with no user id (`auth.uid()` null) | reads 0 rows, insert blocked |
| `anon` select and insert | permission denied |
| Deleting an auth user who owns listings | blocked by the foreign key |
| Policies, grants, RLS flag | four `authenticated` policies, RLS on, no `anon` grants |

**Not tested:** a real Supabase project, real sign-in tokens (the stub reads the user id in a simpler way than Supabase does), PostgREST or the Data API, the Table Editor display, or the CLI path. The two-account test must be repeated against Supabase once sign-in exists.

## Sign-off

- Reviewed by: ____________________
- Date: ____________________
- Applied to Supabase project (yes/no): ____________________
