# Sprint 4: Auth & Listings Verification Checklist

**Project:** PREIshare dashboard
**Date drafted:** 2026-11-14
**Verifier:** ____________________ (the human who runs the NOT RUN rows)
**Environment:** local build of this repo. Supabase project: ____________________ (name or ref only, no keys). **None has been connected yet.**

**Status: INCOMPLETE, NOT SIGNED OFF.** The rows that need a real Supabase project and a person at a browser are NOT RUN. Nothing below claims they passed. Section 7 stays unchecked until they are run.

## How to use this doc

- **PASS**: the check was run and the evidence is written next to it.
- **FAIL**: the check was run and did not pass. Write the fix prompt used under section 6, fix only that gap, re-run, then change the row.
- **NOT RUN**: the check has not been run against the real app. The Evidence column says what to do. Appendix A has the full step-by-step.
- Rows marked **(agent-run)** were run by the coding agent on 2026-11-14 from the repo and the built app. They need no Supabase project. Re-run them yourself with Appendix C if you want your own evidence.
- Never paste a real key, password, project ref or `.env` content into this file. Write "present in local .env only" or "NOT found in repo".

Wording follows [`../setup/supabase-env-checklist.md`](../setup/supabase-env-checklist.md) (variable names, public vs server-only) and [`../data-model/rls-policy-review.md`](../data-model/rls-policy-review.md) (policy names, SQL checks, two-account test).

---

## 1. Database & migration

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1.1 | `property_listings` exists in the Supabase project | NOT RUN | Run `select to_regclass('public.property_listings');` in the SQL Editor. Expect `property_listings`, not null. |
| 1.2 | RLS is **enabled** on `property_listings` | NOT RUN | Run the first query in Appendix A, step 1. Expect `true`. |
| 1.3 | The four policies exist and match `rls-policy-review.md` | NOT RUN | **Live check not done.** File check only (agent-run): the migration declares `property_listings_select_own`, `_insert_own`, `_update_own`, `_delete_own`, each `to authenticated`; no `using (true)` or `with check (true)` anywhere (0 matches). Live check: second query in Appendix A, step 1 should return the same four names. |
| 1.4 | Migration file is in the repo: `supabase/migrations/20250321000000_sponsors_properties_rls.sql` | PASS | (agent-run) File exists on this branch. It enables RLS, revokes all table access from `public`, `anon` and `authenticated`, then grants only SELECT, INSERT, UPDATE and DELETE to `authenticated`. |

## 2. Authentication & session

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 2.1 | A sponsor can sign up with email and password (`src/routes/auth/signup.tsx`) | NOT RUN | Record User A's email here (never the password): ____________________. Note whether the project requires email confirmation (Authentication settings). If it does, signup shows "Account created. Check your email to confirm it, then log in." and you must confirm before 2.2. |
| 2.2 | A sponsor can log in (`src/routes/auth/login.tsx`) and lands on the dashboard | NOT RUN | |
| 2.3 | A signed-out visitor to any `/dashboard` URL is redirected to login | PASS | (agent-run, production build, no cookie, no Supabase variables set). `/dashboard`, `/dashboard/listings`, `/dashboard/listings/new`, `/dashboard/portfolio`, `/dashboard/deals`, `/dashboard/profile` each returned HTTP 307 to `/auth/login`. `/dashboard/` returns 307 to `/dashboard`, which then redirects. `/`, `/about`, `/auth/login`, `/auth/signup` returned 200. Repeat in a browser: open `/dashboard/listings` while signed out and note the URL you end up on. |
| 2.4 | Sign-out clears the session; protected pages stop loading | NOT RUN | Click "Sign out", then open `/dashboard/listings`. Expect the login page. Code path (agent-run read): `signOut()` in `src/lib/auth/session.ts` deletes the `sb-access-token` cookie. |

## 3. Listings happy path (User A)

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 3.1 | Creating a listing through the form succeeds | NOT RUN | Listing title used: ____________________. Fill every required field: title, summary, property type, street address, city, state or region, postal code. |
| 3.2 | The new row shows on `/dashboard/listings` (`src/routes/dashboard/listings/index.tsx`) with the values you typed | NOT RUN | Also reload the page and confirm the row is still there. |
| 3.3 | The row exists in Postgres (Table Editor), not in a client array | NOT RUN | In the Table Editor open `property_listings`: one row, `owner_id` equals User A's id (Authentication, Users), not User B's. |
| 3.4 | Create and read go through `src/server/listings.ts` | PASS | (agent-run, code check) `src/routes/dashboard/listings/index.tsx` imports only `listMyListings` and `new.tsx` imports only `createListing`, both from `src/server/listings.ts`. The word "supabase" does not appear in either route or in `ListingForm.tsx`. `ListingCard.tsx` has a type-only import from `src/lib/supabase/types` (erased at build). No `mock` or `fixtures` reference in the listings routes, components, server module or schema. Runtime confirmation (a `_serverFn` request in the Network tab on create) is still to do with a real project. |

## 4. Row Level Security (User B)

Do not skip this section. It is the only proof that one sponsor cannot read another's rows.

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 4.1 | A second, different account (User B) can sign up and log in, in a private window | NOT RUN | User B's email: ____________________ |
| 4.2 | User B's `/dashboard/listings` does **not** show User A's listing | NOT RUN | Expect the empty state, "No properties yet." |
| 4.3 | A direct read as User B also returns no foreign rows | NOT RUN | Appendix A, step 6 (SQL Editor, impersonating User B). Expect 0 rows. |
| 4.4 | User B can create a listing and sees only their own; User A still sees only A's | NOT RUN | Switch back to the first window and reload: only A's rows. |

## 5. Secret-hygiene audit

All rows in this section were run by the agent on 2026-11-14 against this branch. Commands are in Appendix C.

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 5.1 | A `.env` with real values is **not** committed | PASS | `git check-ignore -v` matches `.gitignore:6` for `.env` and `.gitignore:7` for `.env.local` and `.env.production`. `git ls-files` lists only `.env.example`. No `.env` or `.env.local` has ever been in any commit on any branch (`git log --all -- .env .env.local` is empty). `git status` lists no env files. No `.env` exists in this checkout. **On your machine:** run `git status` after creating `.env` and confirm it is not listed. |
| 5.2 | `.env.example` has placeholders only | PASS | Its four value lines are `https://your-project-ref.supabase.co` (twice), `your-anon-or-publishable-key` and `your-service-role-key`. |
| 5.3 | No service-role key material in source, docs or config | PASS | The name `SERVICE_ROLE` appears only in documentation, `.env.example` (placeholder) and one comment in `src/lib/supabase.server.ts` saying the server client does **not** read it. Zero matches in `vite.config.ts`, `package.json` and the tsconfig files. No code path reads `SUPABASE_SERVICE_ROLE_KEY`. Key-shaped strings across all commits on all branches: JWT shape (`eyJ….eyJ….sig`) 0; `sb_secret_` or `sb_publishable_` 0; a real-looking `*.supabase.co` project URL 0; a `postgres://user:pass@` connection string 0. A looser JWT search matched one string, which is a substring of an npm `sha512` integrity hash in `package-lock.json`, not a key. |
| 5.4 | Only public-safe names are read in client-reachable code, as in the env checklist | PASS | Every env read in `src/`: `src/lib/supabase.client.ts` reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. `src/lib/supabase.server.ts` reads `process.env.SUPABASE_URL` inside the server-only function (not at module scope) and the public `VITE_SUPABASE_ANON_KEY`. `src/lib/auth/session.ts` reads `NODE_ENV` only. Nothing else. This matches the "Variables" table in `supabase-env-checklist.md`. |
| 5.5a | The browser bundle contains no service-role value and no server-only config | PASS | Built the app with a distinct fake value in each of the four variables. In `.output/public` (what browsers download): the `SUPABASE_SERVICE_ROLE_KEY` value 0 files, the `SUPABASE_URL` value 0 files, the two `VITE_` values 1 file each (expected, they are public by design). The text "service_role" 0 matches. The cookie name `sb-access-token`, `createServerSupabaseClient` and `property_listings` 0 matches. The service-role value also does not appear in the server bundle, because nothing reads it. |
| 5.5b | The browser's Network tab never sends a service-role header | NOT RUN | With a real project: sign in, open DevTools, Network, and look at requests to your Supabase host. Expect the public anon key and the user's own token only. Never copy header values into this file. |

## 6. Gaps fixed this session

| Gap | Agent fix summary | Re-test result |
|-----|-------------------|----------------|
| None found by the checks that were run (sections 1.4, 2.3, 3.4 and 5). | n/a | n/a |

The rows that could find real gaps (RLS on a live database, two-user isolation, sign-up) have not been run, so this table is not evidence of "no gaps". Update it after Appendix A.

### Open items for handoff (not failures, found while building)

- **"Signed in" is not "sponsor".** Every authenticated user can create listings (`rls-policy-review.md`, risk 1). Needs a sign-up policy decision.
- **Email confirmation** is a project setting. Decide on or off and record it in 2.1.
- **No sidebar link to Listings.** Sponsors reach `/dashboard/listings` by URL. `nav-config.ts` has four areas by decision D1.
- **The dashboard Header still says "Mock data" and "Investor (demo)"** on live pages.
- **Asking price display** rounds to whole dollars (`formatCurrency`), although the column stores cents.
- **The Deals, Portfolio, Overview and Profile pages are still mock data** by design.
- Local `/favicon.ico` returns 404 (cosmetic, predates this sprint).

## 7. Sign-off

- [ ] Client story covered: sponsors can log in; listings load from Postgres under RLS; secrets kept out of the client bundle
- [ ] All critical rows above are PASS (or FAIL accepted with written follow-up). Critical rows: 1.1 to 1.3, 2.1 to 2.3, 3.1 to 3.3, 4.2, 4.3, 5.1, 5.3, 5.5a
- [x] No real secrets written into this markdown file

**Overall:** NOT SIGNED OFF. 8 rows PASS (agent-run), 0 FAIL, 14 rows NOT RUN (listed above).

**Notes for handoff (Step 12):**
- Apply the migration to a Supabase project and fill rows 1.1 to 1.3 first. Every later row depends on it.
- Run section 4 even if sections 2 and 3 look fine.
- `rls-policy-review.md` says its own two-account test was done on a local Postgres with stand-ins, not Supabase. Section 4 here is the first real test.

---

## Appendix A: How to run the NOT RUN rows

1. **Apply and check the migration (1.1 to 1.3).** Supabase dashboard, SQL Editor, New query: paste the whole migration file and run it. Then run these three and compare with the expected results in `rls-policy-review.md`:

   ```sql
   select relrowsecurity from pg_class where oid = 'public.property_listings'::regclass;
   select policyname, cmd, roles from pg_policies where tablename = 'property_listings' order by policyname;
   select grantee, privilege_type from information_schema.role_table_grants
     where table_name = 'property_listings' and grantee in ('anon', 'authenticated') order by 1, 2;
   ```

   Expect `true`; four rows, role `authenticated` on each; and grants only to `authenticated` (nothing for `anon`).
2. **Local env.** `cp .env.example .env.local` and paste your own values in by hand (names only are in `.env.example`). `SUPABASE_SERVICE_ROLE_KEY` is not read by any code yet and can stay unset. Run `npm run dev`.
3. **User A (2.1, 2.2, 2.4).** In a normal window go to `/auth/signup`, create User A, then sign out, then log in at `/auth/login`. Confirm you land on `/dashboard`.
4. **Create and list (3.1 to 3.3).** Open `/dashboard/listings`, expect the empty state. Click "Add listing", fill the required fields, submit. Confirm you return to the list and the row shows. Reload. Open the Table Editor and check the row and its `owner_id`.
5. **User B (4.1, 4.2, 4.4).** In a private window sign up as a different email. Open `/dashboard/listings`. Expect "No properties yet." Create one listing as B. Switch back to window 1 and reload: only A's rows.
6. **Direct read as B (4.3).** In the SQL Editor, replace the placeholder with User B's id from Authentication, Users, then run:

   ```sql
   begin;
   set local role authenticated;
   select set_config('request.jwt.claims', '{"sub":"<USER_B_ID>","role":"authenticated"}', true);
   select id, title, owner_id from public.property_listings;
   rollback;
   ```

   Expect only User B's rows. Then repeat with User A's id and expect only A's.
7. **Network tab (5.5b).** DevTools, Network, filter by your Supabase host. Look at request headers without copying values anywhere.

If any row fails, write a narrow fix prompt that names only the failing symptom and the file (for example "User B can read User A's listings: review the policies in `supabase/migrations/20250321000000_sponsors_properties_rls.sql` and the queries in `src/server/listings.ts`; do not weaken RLS"). Never paste a key into a prompt.

## Appendix B: What the simulated runs do and do not prove

Before this checklist was written, the agent ran the server functions and the listings pages against a small **fake Supabase server** it wrote (it imitates login, per-user row visibility and the table's CHECK rules). In that simulation, sponsor A, B and C each saw only their own rows, create ignored a client-supplied owner id, and the pages showed empty, error, saving and success states.

That is useful for finding bugs in the app code. It is **not** Postgres and it is **not** Supabase, so none of it counts as PASS in this checklist. In particular it cannot show that the real policies, grants and tokens behave as designed. That is what sections 1 and 4 are for.

## Appendix C: Commands behind the agent-run rows

```bash
# 5.1
git check-ignore -v .env .env.local .env.production
git ls-files | grep -E '(^|/)\.env'
git log --all --oneline -- .env .env.local
git status --short | grep env

# 5.2
grep -v -E '^\s*(#|$)' .env.example

# 5.3
git grep -n -i -c -E 'service_role|SERVICE_ROLE'
git grep -n -i -E 'service_role|SERVICE_ROLE' -- src vite.config.ts package.json tsconfig.json
git grep -I -c -E 'eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}' $(git rev-list --all)
git grep -I -c -E 'sb_(secret|publishable)_[A-Za-z0-9_-]{10,}' $(git rev-list --all)

# 5.4
grep -rn -E 'import\.meta\.env|process\.env' src --include='*.ts' --include='*.tsx'

# 5.5a  (use made-up values; never your real ones)
SUPABASE_SERVICE_ROLE_KEY=fake-server-secret SUPABASE_URL=https://fake-server.invalid \
VITE_SUPABASE_ANON_KEY=fake-public-anon VITE_SUPABASE_URL=https://fake-public.invalid npm run build
grep -rlF fake-server-secret .output/public    # expect no output
grep -rli service_role .output/public          # expect no output

# 2.3  (after: node .output/server/index.mjs)
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://127.0.0.1:3000/dashboard/listings
```
