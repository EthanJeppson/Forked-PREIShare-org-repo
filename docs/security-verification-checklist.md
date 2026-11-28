# Security verification checklist — PREIshare sponsor auth & properties

**Date:** 2026-11-27  
**Verifier:** Ethan Jeppson (manual app and Supabase checks); coding agent (file, bundle and redirect checks, marked "agent" below)  
**Build / branch:** `cursor/security-verification-checklist-9ee2` at commit `66b8df1` (main at `4b45d2f` plus the fixes in section 6)  
**Related docs:** docs/sponsor-auth-requirements.md, docs/env-var-checklist.md, docs/data-model-and-rls-matrix.md

Status values: `pass` | `fail` | `not-run`

Where the checks ran: the local dev server (`npm run dev`, http://localhost:3000)
against the verifier's real Supabase project, with one test sponsor account.
The Vercel deployment was not re-tested in this step. No key values, project
refs or passwords appear in this document; env vars are named only.

---

## 1. Environment and secret hygiene

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 1.1 | Browser-safe client (`src/lib/supabase.client.ts`) uses only public URL + anon key | Agent read the file: it reads only `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` and throws if either is missing. Agent also searched the built browser bundle (`.output/public`) for `SERVICE_ROLE`, `process.env.SUPABASE_URL` and the server client: no matches. | pass | Files named `*.client.*` are blocked from the server build and `*.server.*` from the browser build by TanStack Start import protection. |
| 1.2 | Service-role / secret key used only in server module (`src/lib/supabase.server.ts`) or never used in this topic | Agent searched `src/` for `SERVICE_ROLE`: the only hit is a comment in `src/lib/supabase.server.ts` saying there is deliberately no service-role helper. The server client uses the sponsor's own access token plus the anon key. | pass | `SUPABASE_SERVICE_ROLE_KEY` is not read by any code. All sponsor reads and writes go through RLS. |
| 1.3 | No raw secrets committed in source or checklist | Agent ran `git ls-files` (only `.env.example` is tracked; `.env` and `.env.local` are gitignored) and scanned the source and git history for key-like strings. | pass | The history scan had only false positives (an example `postgres://user:pass@` string in an earlier doc). This file contains no key values. |
| 1.4 | `.env.example` documents required vars without real values | Agent compared `.env.example` with docs/env-var-checklist.md: same four names (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`), placeholder values only. | pass | |

**Section result:** pass

---

## 2. Login and session-aware routing

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 2.1 | Unauthenticated visit to dashboard (or properties) redirects or blocks access | Verifier opened `/dashboard/properties` signed out and landed on `/login`. Agent requested all six `/dashboard` URLs with no cookie against the production build: each returned 307 to `/login`. | pass | An early attempt showed "Not found" because the old URL `/dashboard/listings` was used; the list moved to `/dashboard/properties`. Not a security gap. |
| 2.2 | Valid sponsor credentials reach an authenticated dashboard session | Verifier signed in at `/login` (`src/routes/login.tsx`) and reached the dashboard. | pass | The access token is stored in the httpOnly cookie `sb-access-token`; the dashboard guard checks it on the server. |
| 2.3 | Invalid credentials do not grant dashboard access | Verifier tried a wrong password: "Invalid login credentials", stayed on `/login`. | pass | |
| 2.4 | Logout clears session; protected routes no longer load data as that user | Verifier signed out, then opened the dashboard again: sent to `/login`. | pass | Sign-out clears the server cookie and the browser session. |

**Section result:** pass

---

## 3. Property list isolation (RLS)

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 3.1 | Signed-in sponsor sees property list UI from `src/routes/dashboard/properties.tsx` | Verifier opened `/dashboard/properties` after login. | pass | Reached by URL; there is no sidebar link yet (see section 7). |
| 3.2 | List shows only rows owned by the current sponsor (per docs/data-model-and-rls-matrix.md) | Verifier created listings, saw them on the list, and confirmed in the SQL Editor that their `owner_id` is the signed-in account. The query is `.eq('owner_id', user.id)` with the sponsor's token, and RLS `property_listings_select_own` also filters by `owner_id = auth.uid()`. | pass | Only one sponsor has rows, so the UI could not show another sponsor's row being excluded. Row 5.2 checks that filter at the database level. |
| 3.3 | Empty state is safe (no error that leaks other tenants' data) | Verifier saw "No properties yet. Add your first listing to get started." before creating any listing. | pass | |

**Section result:** pass

---

## 4. Property create under RLS

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 4.1 | Create form on `src/routes/dashboard/properties.new.tsx` requires an authenticated session | Agent requested `/dashboard/properties/new` with no cookie: 307 to `/login`. Verifier opened it signed in and saw the form. | pass | `createListing` also calls `requireSession` on the server, so a direct call without a session is refused. |
| 4.2 | Successful create inserts a row owned by the current sponsor | Verifier created a listing (price typed as `1,000,000`); it appeared on `/dashboard/properties`. SQL Editor check: the row's owner is the signed-in account. | pass | The form never sends an owner. The server sets `owner_id` from the session and RLS WITH CHECK (`owner_id = auth.uid()`) must also pass. Passed after the fixes in section 6. |
| 4.3 | Create failure (validation or RLS) does not expose secret keys or raw DB internals in the UI | Verifier submitted with Title empty and with an invalid price: the form stayed open, showed "Please fix the highlighted fields." and a per-field message, and created no row. | pass | Server errors are mapped to safe messages. A forced RLS rejection was not triggered from the UI. |

**Section result:** pass

---

## 5. Cross-sponsor access attempt

| # | Check | How you verified | Status | Notes |
|---|--------|------------------|--------|-------|
| 5.1 | Sponsor B cannot list Sponsor A's properties in the UI | — | not-run | Single test user. No second sponsor account was used. See section 7. |
| 5.2a | Direct read of another sponsor's row is denied by RLS | Verifier ran a SQL Editor transaction as a made-up authenticated user (`set local role authenticated` plus a fake `sub` claim) and counted `property_listings`: `rows_visible_to_stranger` = 0 while the verifier's own rows existed. | pass | Database-level policy check, not a UI login. The transaction was rolled back. |
| 5.2b | Direct update of another sponsor's row is denied by RLS | The same transaction ran `update ... set title = 'hijacked' returning id`. | not-run | The update's result was not reported, so this is not claimed. Policy review: `property_listings_update_own` uses `owner_id = (select auth.uid())` in USING and WITH CHECK, which should return no rows for a stranger. |

**Section result:** not-run (read denial passed at the database level; UI cross-sponsor check and update denial not proven)

---

## 6. Gaps found and fixes applied

| Gap (checklist #) | What was wrong | Fix applied (files) | Re-test status |
|-------------------|----------------|---------------------|----------------|
| 4.2 | An asking price typed with commas (`1,000,000`) was rejected as "must be a number", so a normal create failed. | `normalizeListingInput` strips `$`, commas and spaces before converting (`src/lib/listings/schema.ts`, commit `082237c`). | pass |
| 4.3 | Field errors did not highlight the field, and the message was the same color as normal text, so it was hard to see which field to fix. | Invalid inputs get a red border through `aria-invalid`, and the field messages are red (`src/components/listings/ListingForm.tsx`, commit `082237c`). | pass |
| 4.2 | After a successful create, the new listing did not show on the list until a manual reload (the list route stays mounted behind the form and kept its old data). | `router.invalidate()` before navigating back to the list (`src/routes/dashboard/properties.new.tsx`, commit `66b8df1`). | pass |

No security control failed. All three gaps were usability problems on the create path.

---

## 7. Residual risks (honest leftovers)

- **Cross-sponsor UI check not run (5.1).** Only one test sponsor account exists. Next step: sign up a second account and confirm it sees an empty list.
- **Update denial not proven (5.2b).** The SQL result for the update was not reported. Re-run the transaction and record that `returning id` gives no rows.
- **Cross-sponsor read checked in SQL only (5.2a).** It shows the RLS policy works for the `authenticated` role, but not through a second real login in the app.
- **Tested locally only.** The Vercel deployment was not re-tested here. Production env vars must be set there for the app to work.
- **"Signed in" is not the same as "sponsor."** There is no profiles or roles table, so any signed-up user can create listings.
- **No sidebar link to Properties.** The list is reachable only by URL; the four-area navigation is still decision D1. The header still shows "Mock data" and "Investor (demo)".
- **Delete has a policy but no UI.** `property_listings_delete_own` exists and was not exercised.
- **Missing env vars give a 500 page.** With no Supabase env vars, a forged cookie produces a 500 that names the missing env vars (names only, no values). This cannot happen once env vars are set.
- **Minor.** `formatCurrency` shows whole dollars only. Opening the create form also runs the list query once.
- **Service-role key unused.** `SUPABASE_SERVICE_ROLE_KEY` is not read by any code. Any future use must stay in server-only code and never get a `VITE_` prefix.

---

## 8. Stakeholder verdict

**Ready to show stakeholders?** yes — as a demo, with the residual risks in section 7 stated

**Summary:**  
On 2026-11-27 I verified, in the running app, that signed-out visitors are sent to `/login`, that a wrong password is refused, that a valid login reaches the dashboard, and that sign-out ends the session. As one sponsor I saw only my own listings, created a listing that the database records as mine, and saw invalid submits stay on the form without creating a row. A SQL check as a made-up user saw 0 of my rows. The cross-sponsor UI check (5.1) and the update denial (5.2b) were not run, so isolation between two real sponsors is supported by the RLS policies and that SQL read check, not yet by a two-account test. File review of `src/lib/supabase.client.ts` and `src/lib/supabase.server.ts`, plus a search of the built browser bundle, confirms the service-role key is not in the client bundle and is not read by any code.

**Sign-off:** Ethan Jeppson, 2026-11-27
