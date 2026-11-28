# Sprint 4 Topic 2 Handoff — PREIshare Sponsor Auth & Protected Listings

**Date:** 2026-11-27  
**State of `main`:** commit `b21b00f` (after PR #61)  
**Evidence:** every "verified" claim below points to a row in `docs/security-verification-checklist.md`. Anything not in that checklist is called a design or a plan, not a fact.

This file names environment variables only. It contains no key values, project refs or passwords.

## Client story outcomes

What a sponsor can do today:

- **Sign in and out.** A sponsor signs in with email and password at `/login` (new accounts sign up at `/auth/signup`) and reaches the protected `/dashboard`. A wrong password is refused. After "Sign out", the dashboard sends them back to `/login`. *Verified: checklist rows 2.1–2.4.*
- **Signed-out visitors are kept out.** Every `/dashboard` URL, including `/dashboard/properties` and `/dashboard/properties/new`, redirects to `/login` when there is no session. *Verified: rows 2.1 and 4.1.*
- **See only their own properties.** `/dashboard/properties` lists the sponsor's listings, with a safe empty state ("No properties yet…") when there are none. *Verified with one sponsor account: rows 3.1–3.3.*
- **Create properties they own.** `/dashboard/properties/new` creates a listing owned by the signed-in account. The form has no owner field, and invalid input stays on the form with a highlighted, plain-language error. *Verified: rows 4.1–4.3.*
- **Other sponsors cannot read their rows (database level).** A SQL check acting as a made-up signed-in user saw 0 of the sponsor's rows. *Verified: row 5.2a.* A second real sponsor logging into the app has **not** been tested (row 5.1, not-run).
- **Secrets stay off the browser.** The browser gets only the public Supabase URL and anon key. The service-role key is not in the browser bundle, and **no code reads it at all**. *Verified: rows 1.1–1.4.*

What this topic does **not** deliver: editing or deleting listings from the UI, a sponsor role separate from "any signed-in account", invites, an admin view, or listing images and documents.

## Architecture decisions (why we built it this way)

- **Auth sessions.** Supabase Auth (email and password). After sign-in in the browser, a server function stores the access token in an httpOnly cookie named `sb-access-token`, so page scripts cannot read it. One guard in `src/routes/dashboard.tsx` asks the server who the user is (the server checks the token with Supabase) and redirects to `/login` when there is no valid session. This one guard covers every page under `/dashboard`.
- **Data and ownership.** Listings live in one table, `public.property_listings`. The column `owner_id` points at the Supabase account (`auth.users.id`). There is **no** separate `sponsors`, `properties` or `profiles` table; the lesson scaffold's names map to these real names (see `docs/data-model-and-rls-matrix.md`, "Names used in this repo").
- **RLS isolation.** Row Level Security is on for `property_listings`. Four policies (`property_listings_select_own`, `_insert_own`, `_update_own`, `_delete_own`) each allow a row only when `owner_id = auth.uid()`. The anonymous role has no access at all. A trigger blocks changing `id`, `owner_id` or `created_at`. The app also filters by owner on the server, but RLS is the rule that cannot be skipped.
- **Server-only secrets and the client split.** `src/lib/supabase.client.ts` (browser) reads only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. `src/lib/supabase.server.ts` (server) makes every query **as the signed-in sponsor**, using their own token plus the anon key, so RLS applies to server code too. There is deliberately no service-role helper. TanStack Start blocks `*.server.*` files from the browser build and `*.client.*` files from the server build.
- **Env hygiene.** Names are listed in `.env.example` (placeholders only) and `docs/env-var-checklist.md`. Real values live only in each person's local `.env.local` and in Vercel. `.env` and `.env.*` files are gitignored, except `.env.example`.

## Source documents (read these first)

| Doc | Path | Purpose |
| --- | --- | --- |
| Requirements | `docs/sponsor-auth-requirements.md` | Who can see or change what: stories, non-goals, success criteria, threats |
| Data model & RLS | `docs/data-model-and-rls-matrix.md` | The `property_listings` table, `owner_id`, and the policy matrix |
| Env checklist | `docs/env-var-checklist.md` | Which variables are public and which are server-only or secret |
| Security verification | `docs/security-verification-checklist.md` | What was actually tested on 2026-11-27, the fixes made, and the gaps that remain |

The verification checklist is the newest of the four. The "Verification status" note in `docs/data-model-and-rls-matrix.md` was written before those tests and is now partly out of date (see Known limitations).

## Key implementation files

| File | What it does |
| --- | --- |
| `src/lib/supabase.client.ts` | Browser-safe Supabase client (public URL and anon key only) |
| `src/lib/supabase.server.ts` | Server-only Supabase client that acts as the signed-in sponsor |
| `src/lib/auth/session.ts` | Reads and checks the `sb-access-token` session cookie on the server |
| `src/routes/login.tsx` | Sponsor sign-in page (`/login`) |
| `src/routes/auth/signup.tsx` | Account sign-up page (`/auth/signup`) |
| `src/routes/dashboard.tsx` | Dashboard shell and the session guard for every `/dashboard` page |
| `src/routes/dashboard/properties.tsx` | Protected property list (`/dashboard/properties`) |
| `src/routes/dashboard/properties.new.tsx` | Create-property page (`/dashboard/properties/new`) |
| `src/server/listings.ts` | Server functions `listMyListings`, `createListing` and `updateListing` (update has no screen yet) |
| `src/lib/listings/schema.ts` | Input validation, shared by the form and the server |
| `src/components/listings/ListingForm.tsx` | The create form and its field errors |
| `supabase/migrations/20250321000000_sponsors_properties_rls.sql` | Table, RLS policies, grants and the ownership trigger |

## Known limitations

Copied from `docs/security-verification-checklist.md` sections 5 and 7. The system is **not** "fully secure" or fully verified:

- **Two-sponsor test in the app was not run (row 5.1).** Only one test account was used. Isolation between two real sponsors rests on the RLS policies plus a SQL read check, not on a two-login test.
- **Update denial not proven (row 5.2b).** The SQL check's update result was not recorded.
- **Copied token after sign-out not tested.** It is unknown whether a copied access token stops working right away or only when it expires (open question in `docs/sponsor-auth-requirements.md`).
- **Tested locally only.** All app checks ran on `npm run dev` against the real Supabase project. The Vercel production deployment was not re-tested, and whether its Production env vars are set has not been confirmed in this repo.
- **"Signed in" is not "sponsor".** Any account that signs up can create listings. There is no role, invite or approval step.
- **Listing fields are minimal.** Title, summary, type, status, address and asking price only. No contacts, financials, images or documents.
- **No edit or delete screens.** An `updateListing` server function exists, and RLS has update and delete policies, but no page uses them.
- **Navigation gap.** There is no sidebar link to Properties; the list is reached by URL. The header still shows "Mock data" and "Investor (demo)".
- **A 500 page if Supabase env vars are missing.** It names the missing variables (names only, no values).
- **No CI pipeline in this repo.** There is no `.github/` folder and no test or lint script. The only checks on pull requests are Vercel's build and preview comments.
- **Outdated status note.** `docs/data-model-and-rls-matrix.md` still says the migration has not been confirmed live. The 2026-11-27 tests created and read rows in the real project's `property_listings` table, so that note should be updated in a later change.

## Recommended next work (next topic / sprint)

1. **Close the open verification rows first.** Sign up a second sponsor and confirm it sees an empty list (row 5.1). Re-run the SQL check and record the update result (row 5.2b). Re-run the main flows on the Vercel deployment.
2. **Richer property listing fields.** Add the fields listed as out of scope in the data model (contacts, ownership, financials such as cap rate, images, documents) by updating `docs/data-model-and-rls-matrix.md` first, then a new migration. Add an edit screen that uses the existing `updateListing` function.
3. **Sponsor role and invites.** Decide whether sign-up is open, invite-only or needs email confirmation, and whether sponsors get their own role or profile. Until then every signed-in account counts as a sponsor.
4. **CI secret injection.** Add a CI workflow (for example GitHub Actions) that runs `npm run typecheck` and `npm run build` on every pull request. It should get any needed values from the CI host's secret store, never from the repo, and must never be given `SUPABASE_SERVICE_ROLE_KEY` or any `VITE_`-prefixed secret. Add a deploy-time check that the required env var names are set in Vercel Production.
5. **Automated RLS isolation tests.** Turn the Sponsor A / Sponsor B check into a repeatable test. This needs a decision about a test runner and a test Supabase project, which this repo does not have yet.
6. **Navigation.** Add a Properties link to the dashboard sidebar as part of the four-area navigation decision (D1).

## Handoff checklist for the next learner

- [ ] Read the four source docs above, newest first: `docs/security-verification-checklist.md`, then `docs/sponsor-auth-requirements.md`, `docs/data-model-and-rls-matrix.md` and `docs/env-var-checklist.md`.
- [ ] Copy `.env.example` to `.env.local` and fill it in from Supabase. Never commit real values, and never give a secret a `VITE_` prefix.
- [ ] Run the PowerShell checks in `docs/env-var-checklist.md` before every commit.
- [ ] Use `/dashboard/properties` (not the old `/dashboard/listings`) and `/login` (not `/auth/login`).
- [ ] Keep service-role usage out of the app. If a server task truly needs it, read it with `process.env` inside server-only code and write down why.
- [ ] Change the matrix doc before changing any RLS policy or table, then add a new migration. Never edit the existing one.
- [ ] Re-run `docs/security-verification-checklist.md` after any change to auth, RLS, the Supabase clients or env vars, and record pass, fail or not-run honestly.
- [ ] Start with "Recommended next work" item 1 before building new features.
