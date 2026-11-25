# Sprint 4 Handoff: Sponsor Auth & Postgres Property Listings

**Project:** PREIshare dashboard
**Sprint:** 4 (Topic 1): Supabase auth and database
**Audience:** PREIshare sponsors and the next-sprint implementer
**Status date:** 2026-11-17

## In 30 seconds

- **Built:** email/password sign-up and login, a login guard on every `/dashboard` page, a `property_listings` table in Postgres with row-level security (RLS), server code to list and create listings, and a "my listings" screen with an "Add listing" form.
- **Not yet proven:** nothing has been tested against a real Supabase project or in a browser by a person. The verification checklist is **INCOMPLETE and NOT SIGNED OFF**: 8 checks passed, 0 failed, 14 not run.
- **Secrets:** the service-role key is not read by any code. A build with fake keys put no server-only value in the browser files. That check was run by the coding agent, and you can re-run it yourself.
- **What a sponsor should do next:** run the checklist's Appendix A against your own Supabase project, then pick the next theme in section 6.

## 1. Client story recap

PREIshare sponsors need a secure way to sign in and manage real property listings stored in PostgreSQL, not mock data in the browser. Secret keys and privileged database access must stay on the server and never ship in the browser bundle.

Source: "Client story" in `docs/requirements/sponsor-auth-and-listings-brief.md`.

## 2. Delivered vs original request

"Built" means the code, migration and docs exist in the repo. "Verified" means a check was actually run. Evidence is from `docs/verification/sprint4-auth-listings-checklist.md` (row numbers in brackets).

| Client need | Built? | Verified? | Where / evidence |
| --- | --- | --- | --- |
| **Secure sponsor login** (sign up, log in, sign out, protected dashboard) | Yes | **Partial.** Only the "signed-out visitor is redirected" check ran. Sign-up, login and sign-out are NOT RUN. | Pages `src/routes/auth/signup.tsx` and `login.tsx`; session code `src/lib/auth/session.ts`; guard in `src/routes/dashboard/route.tsx`. Production build with no cookie: every `/dashboard` URL tested returned a redirect (HTTP 307) to `/auth/login` [2.3, agent-run]. Sign-up [2.1], login [2.2], sign-out [2.4]: NOT RUN. |
| **Postgres-backed listings** (create and read, shown in the dashboard) | Yes | **Partial.** The code path was checked by reading it. No row has been created in a real database. | Server functions `src/server/listings.ts`; screens `src/routes/dashboard/listings/index.tsx` and `new.tsx`. The listings routes import only from the server module and contain no mock or fixture data [3.4, agent-run code check]. Create, show, reload and "row is in Postgres" [3.1 to 3.3]: NOT RUN. |
| **RLS: a sponsor sees only their own rows** | Yes (in a migration file) | **No.** The migration has never been applied to a Supabase project in this checklist. The two-account test is NOT RUN. | `supabase/migrations/20250321000000_sponsors_properties_rls.sql`. File check only: RLS is enabled, four own-row policies exist for the `authenticated` role, access for `anon` is revoked, and there is no `using (true)` [1.3 file check, 1.4]. Live table and policy checks [1.1 to 1.3] and the User A / User B tests [4.1 to 4.4]: NOT RUN. |
| **Secrets kept out of the client bundle** | Yes | **Yes for repo-level checks. The live browser check is NOT RUN.** | `.env.example` has placeholders only; no real `.env` was ever committed; the service-role name appears only in docs, `.env.example` and one comment; a test build with fake values left the server-only values out of the browser files [5.1 to 5.5a, all agent-run PASS]. Network-tab check with a real project [5.5b]: NOT RUN. |

**Gaps in one paragraph.** The three things that matter most to the client story have not been proven live: that sign-up and login work against real Supabase, that a listing really lands in Postgres, and that Sponsor A cannot see Sponsor B's listings. The tests of these that did run used a small **fake Supabase server** that the coding agent wrote. That was useful for finding bugs in the app code, but it is a simulation. It is not Postgres, not Supabase, and not counted as a PASS (checklist Appendix B). The earlier RLS review also used a local Postgres with stand-ins, not Supabase.

**Two items from the brief's success criteria are not met yet:** the dashboard header still shows "Investor (demo)" instead of the signed-in user, and the project has not been through the checklist's sign-off boxes.

## 3. Architecture decisions

- **Auth:** Supabase Auth with email and password. The access token is kept in an httpOnly cookie named `sb-access-token`, so page scripts cannot read it. The `/dashboard` layout route (`src/routes/dashboard/route.tsx`) checks the session once for all dashboard pages. The app puts no limit on who can sign up; the policy (open, invite-only, or email confirmation) is undecided.
- **Data:** one table, `public.property_listings`, one row per listing, each owned by one account (`owner_id`, a foreign key to `auth.users`). Columns and rules are in `docs/data-model/property-listings-schema.md`. Status values are `draft`, `active`, `under_contract`, `closed`; `asking_price` is optional; `closed_at` is set only for closed listings.
- **Authorization:** RLS is enabled, and the table grants go only to the `authenticated` role (nothing for `anon`). There are four own-row policies (select, insert, update, delete) that compare `owner_id` with the caller's id. A database trigger blocks changing `id`, `owner_id` or `created_at`. No policy lets one account read another's rows.
- **Server vs browser clients:**
  - `src/lib/supabase.client.ts` runs in the browser. It uses only the public project URL and the anon key.
  - `src/lib/supabase.server.ts` is server-only. It acts as the signed-in user, so RLS applies. It reads `SUPABASE_URL` inside the function, not at module scope.
  - **The service-role key (`SUPABASE_SERVICE_ROLE_KEY`) bypasses RLS and must never reach the browser. No code reads it.** If a later task needs it, it must be read with `process.env` on the server only, with a written reason.
- **Owner comes from the session, not the form.** `src/server/listings.ts` ignores any `owner_id`, `id` or `closed_at` sent by the browser, and the database also rejects an insert whose owner is not the caller. Inputs are validated on the server with Zod (`src/lib/listings/schema.ts`).
- **Env hygiene:**

| Variable | Public or server-only | Secret? |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Public (browser and server) | No |
| `VITE_SUPABASE_ANON_KEY` | Public (browser and server) | No, but not a bypass; RLS protects the data |
| `SUPABASE_URL` | Server only | No |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | **Yes** (bypasses RLS) |

  Only values with the `VITE_` prefix can reach the browser. Real values live only in a local `.env.local`, which is gitignored. This document names variables and never shows values.

## 4. How to run locally

These steps match `docs/setup/supabase-env-checklist.md` and Appendix A of the verification checklist. Needs Node 22.12 or newer. PowerShell commands are shown; macOS/Linux users replace `Copy-Item` with `cp`.

1. **Create a Supabase project** in the Supabase dashboard. Keep its database password in a password manager.
2. **Apply the migration.** Dashboard, SQL Editor, New query: paste the whole file `supabase/migrations/20250321000000_sponsors_properties_rls.sql` and run it. Then run the three check queries in Appendix A, step 1 of the verification checklist. Expect RLS `true`, four policies for `authenticated`, and no grants for `anon`. Do not re-run the migration on a table that already holds data.
3. **Create your local env file.** From the repo root:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Open `.env.local` and paste your own values from Supabase, Project Settings, API, into `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and `SUPABASE_URL`. `SUPABASE_SERVICE_ROLE_KEY` is not used by any code and can stay as the placeholder. Never paste these values into chat, docs or a commit. Run `git status` and confirm `.env.local` is not listed.
4. **Install and start:**

   ```powershell
   npm install
   npm run dev
   ```

   The app is at `http://localhost:3000`. Restart `npm run dev` after any change to `.env.local`.
5. **Walk through it.** Go to `/auth/signup` and create a test account (if your project requires email confirmation, confirm the email first). Log in at `/auth/login`, open `/dashboard/listings`, click "Add listing", fill the required fields (title, summary, property type, street address, city, state or region, postal code), and submit. Reload the page: the listing should still be there. Check the row in the Supabase Table Editor.
6. **Run the User B test** (checklist section 4). Sign up a second account in a private window and confirm it sees "No properties yet." and not the first account's listing. This is the only real proof of RLS.
7. **Checks that need no Supabase project:** `npm run typecheck` and `npm run build`. The repo has no test runner and no lint script.

## 5. Known limitations

**Verification status (from the checklist):** NOT SIGNED OFF. 8 PASS (agent-run, repo-level), 0 FAIL, 14 NOT RUN. The 14 are rows 1.1 to 1.3, 2.1, 2.2, 2.4, 3.1 to 3.3, 4.1 to 4.4 and 5.5b. Nothing below should be read as "tested live".

**Product limits and open decisions:**

- **"Signed in" is not "sponsor".** Any account that signs up can create listings. There is no sponsor role and no sign-up policy yet.
- **Email confirmation** is a Supabase project setting. It has not been decided or recorded.
- **No link to Listings in the sidebar.** Sponsors reach `/dashboard/listings` by URL. The navigation has four areas by an earlier decision, and adding a fifth needs a director decision.
- **The dashboard header still says "Mock data" and "Investor (demo)"** on live pages, not the signed-in user.
- **Asking price displays in whole dollars,** although the column stores dollars and cents.
- **Portfolio, Deals, Overview and Profile are still mock data** by design and are labelled "Mock data". Real listings are not shown to investors, because there is no cross-account read policy.
- **Create and read only in the UI.** `src/server/listings.ts` also has an `updateListing` function, but no screen calls it and it has not been run against a real database. The database has a delete policy, but there is no delete function or screen. There is no password-reset screen. There are no OAuth or magic-link logins.
- **Listing fields are minimal.** Contacts, ownership lists, IRR and cap rate, images and documents are not in the table.
- **No search of any kind.** pgvector and embeddings are not built.
- **No CI and no automated tests.** There is no `.github/` folder, no test runner and no lint script.
- **Local `/favicon.ico` returns 404** (cosmetic).

**Documentation drift to fix at the start of the next sprint:**

- `docs/data-model/property-listings-schema.md` still says "design only" and suggests policy names `listings_*_own`. The migration actually uses `property_listings_select_own`, `_insert_own`, `_update_own` and `_delete_own`. The migration is the source of truth.
- `docs/architecture-decisions.md` ("Next sprint foundations") and `docs/sprint3-handoff.md` still say Supabase auth is not built.
- The success-criteria boxes in `docs/requirements/sponsor-auth-and-listings-brief.md` are unticked, because none were signed off.

## 6. Recommended next-sprint work (pick with stakeholders)

Do the verification first: run the NOT RUN rows against a real project and fix anything they find. Then pick one theme. Every option below builds on the current auth, the `property_listings` table and its RLS. None replaces them, and none should move secrets into the browser.

1. **Richer listing fields, plus edit and delete.**
   - What: add the fields left out of version 1 (contacts, ownership, IRR, cap rate), connect the existing `updateListing` server function to an edit screen, and add a delete function and screen.
   - Builds on: the same table and the same own-row policies. The update and delete policies already exist; this adds new columns through a new migration file and extends the Zod schema in `src/lib/listings/schema.ts`.
   - Needs from you: confirm which fields matter, and whether a draft may be saved with missing fields (the schema's open question 2).
   - Dependency: the RLS two-account test should pass first, so new columns inherit rules that are proven.
2. **Approvals workflow.**
   - What: listing states move through draft, submitted, approved or rejected, with a rule for who may make each move.
   - Builds on: the existing `status` column and own-row policies. Today a sponsor can set any status on their own listing, so a reviewer role needs new RLS policies and probably a new status value.
   - Needs from you: who the approver is (an admin or listing-editor role is out of scope in the original brief), and whether "sponsor" and "investor" are separate roles.
   - Dependency: the sign-up policy decision, since "signed in" does not yet mean "sponsor". Prefer RLS policies for approver access over the service-role key.
3. **pgvector search.**
   - What: store an embedding per listing and search by similarity.
   - Builds on: the real listings in Postgres and the signed-in server functions, so search results still respect RLS. Any key for an embedding service stays server-only.
   - Needs from you: a product definition (what is searched, by whom, and how results appear) and richer listing text to search over.
   - Dependency: do this after the listing fields settle, since the embedding depends on what the listing contains. Today the table has only a short title and summary.

Smaller follow-ups that any theme can include: show the signed-in user in the header, decide whether to add Listings to the sidebar, fix the price display, refresh the out-of-date docs listed in section 5.

## 7. Open questions for stakeholders

- Who may create listings, and who may only view them? Are sponsors and investors separate roles?
- What should the sign-up policy be: open, invite-only, or email confirmation required?
- Is multi-sponsor isolation (A cannot see B) a hard requirement for the next sprint? It is already the design, but it is not yet proven.
- Should "my listings" always show every status to its owner, with the Deals page keeping the investor filter?
- Should Listings get its own sidebar link?
- Preferred next theme: richer fields, approvals, or search?

## 8. Source artifacts

- `docs/requirements/sponsor-auth-and-listings-brief.md`
- `docs/verification/sprint4-auth-listings-checklist.md`
- `docs/data-model/property-listings-schema.md`
- `docs/setup/supabase-env-checklist.md`

Also consulted to confirm names and behaviour: `supabase/migrations/20250321000000_sponsors_properties_rls.sql`, `docs/data-model/rls-policy-review.md`, `.env.example`, and the files under `src/` named above.
