# Sponsor Auth & Property Listings: Requirements Brief (Sprint 4)

This brief is the shared contract for every Sprint 4 step: Supabase setup, data model, auth routes, listings UI and handoff. If a later prompt or an agent's output disagrees with this file, this file wins. It is product language only. It contains no SQL, no env files and no component code; those belong to later steps.

**Status of the repo when this brief was written (2026-11-13):** a mock-data-only investor dashboard shell. Nothing in this brief is built yet.

## Client story (restated)

PREIshare sponsors need to sign in securely and manage real property listings that are stored in PostgreSQL, not in mock arrays. Secret keys and privileged database access must stay on the server and must never ship in the browser bundle.

## Actors

| Actor | Goal | Notes |
| --- | --- | --- |
| Sponsor | Sign up and sign in. Create listings. See their own listings, and only theirs. | The primary user this sprint. A sponsor is an authenticated account that owns listings. |
| Unauthenticated visitor | Reach the public pages and the sign-in / sign-up pages. | Cannot see any listing data and cannot open any `/dashboard` page. |
| System (server) | Check the session on every protected request. Talk to Supabase with the right key for the job. Keep secrets out of client code. | Not a person. Runs in TanStack Start server code only. |

Named but **not built** this sprint: an admin / listing-editor role (the domain brief calls this an internal role) and investors browsing listings. See "Open questions" for how "sponsor" relates to the "investor" wording in the Sprint 3 docs.

## Goals for this sprint

1. A visitor can sign up and sign in with email and password (Supabase Auth). A signed-in user can sign out.
2. Every `/dashboard` page requires a valid session. A signed-out request is sent to the sign-in page.
3. Property listings are stored in PostgreSQL, not in client-side arrays or the `src/fixtures/` files.
4. A signed-in sponsor can create a listing and read their own listings. Each listing belongs to exactly one sponsor.
5. Secrets are separated by where they may run. Values that Supabase designs to be public (project URL, anon / publishable key) may reach the browser. The service-role key and any other privileged value stay server-only.
6. The dashboard header shows the signed-in user instead of the "Investor (demo)" placeholder.

## In scope

- Email/password sign-up, sign-in and sign-out through Supabase Auth.
- A server-side session check that protects the `/dashboard` layout route and therefore all four existing dashboard pages.
- One Postgres-backed listings table, created and read by the signed-in sponsor.
- Row-level security so a sponsor can only read and write their own rows.
- A "create listing" form and a "my listings" list inside the existing dashboard shell.
- A `.env.example` that lists variable **names** only.
- Verification notes stating what was and was not tested.

## Out of scope (defer)

- Payments, subscriptions, funding or withdrawal flows.
- Document uploads, e-signing, a document vault.
- Admin or listing-editor roles, approval flows, and screens to manage other people's listings or accounts.
- Editing or deleting listings (create and read only, unless a later prompt adds them).
- Social / OAuth providers, magic links, SSO, multi-factor authentication.
- Investors browsing or searching listings, and any change to who sees which listing statuses beyond what the open questions settle.
- pgvector or any other search, embeddings, notifications and messaging.
- Multi-tenant organisations, teams, and a custom production domain.
- GitHub Actions CI, a test runner, a lint script, and large dependency upgrades. The only new library this sprint may add is the Supabase client, and only in the step that wires it up.
- Replacing the Portfolio, Overview and Profile mock data with live data. Those pages stay mock and keep their "Mock data" labels unless a later prompt says otherwise.

## Current dashboard observations (from the repo, not assumed)

Taken from `main` at `d8e9eab` (PR #38 merged). Sources: [`../sprint3-handoff.md`](../sprint3-handoff.md), [`../architecture-decisions.md`](../architecture-decisions.md) (D1 to D5 and "Next sprint foundations") and [`../verification-checklist.md`](../verification-checklist.md), checked against the files in `src/`.

**Stack:** TanStack Start + React 19 + TypeScript (strict) + Tailwind v4 + Vite, a single npm package at the repo root. Node 22.12 or newer. Scripts in `package.json`: `dev`, `build`, `preview`, `typecheck`, `typecheck:errors` (fails on purpose), `generate-routes`. There is no test runner and no lint script.

**Routes that exist (`src/routes/`):**

| URL | File | What it shows |
| --- | --- | --- |
| `/` | `src/routes/index.tsx` | Starter home page with an "Open investor dashboard" link to `/dashboard` |
| `/about` | `src/routes/about.tsx` | Starter about page |
| (layout for `/dashboard/*`) | `src/routes/dashboard.tsx` | Wraps every dashboard page in `AppShell`. Has no guard. |
| `/dashboard` | `src/routes/dashboard/index.tsx` | Overview: three metric cards, portfolio summary, recent activity |
| `/dashboard/portfolio` | `src/routes/dashboard/portfolio.tsx` | Table of four mock holdings |
| `/dashboard/deals` | `src/routes/dashboard/deals.tsx` | Investor-visible sample listings (`active` and `under_contract` only) |
| `/dashboard/profile` | `src/routes/dashboard/profile.tsx` | Demo profile card ("Alex Morgan (demo)") |

There is no sign-in page, no sign-up page and no listing-create page. `src/routeTree.gen.ts` is generated and is never edited by hand.

**Listings today are mock.** The Deals page reads `getMockDeals()` from `src/mock/dashboard-data.ts`, which filters the four sample listings in `src/fixtures/sample-investor-listings.ts` (`listing-001` to `listing-004`; statuses `active`, `draft`, `under_contract`, `closed`). Two are shown. Nothing is loaded from a database, API, loader or server function. The listing shape is `InvestorListing` in `src/types/` (Sprint 2); it has no owner or sponsor account field (`ownership.ownerName` describes who owns the property, not which account owns the record). The Overview, Portfolio and Profile data are also mock (`src/mock/dashboard-data.ts`), and every dashboard page carries a "Mock data" label.

**Auth today: none.** `/dashboard` is open to anyone who can reach the site. `src/lib/user.ts` has a placeholder `getUser()` that returns `null` and is not used by the dashboard. The header shows "Investor (demo)", which is a label, not a session. No file in `src/` reads `process.env` or `import.meta.env`, and there is no server function.

**Not in the repo:** `src/lib/supabase.ts`, a `supabase/` folder, `.env.example`, a `.github/` folder. `.env` is gitignored. (`.cursorrules` mentions `lib/supabase.ts`; that path does not exist and the docs win.)

**Gaps this sprint must close:** sign-up / sign-in / sign-out pages; a session check on `/dashboard`; a Postgres listings table with ownership and row-level security; create and list flows backed by that table; a documented split between client-safe and server-only environment variables.

**Existing decisions this sprint builds on (do not re-decide silently):**

- The `/dashboard` layout route (D1) (`src/routes/dashboard.tsx`) is the one place to guard the dashboard.
- `AppShell` / `Header` are the one place for the user label (D2).
- Widgets in `src/components/dashboard/` take props and do not fetch (D4). Data loading belongs in route files (loader or `createServerFn`).
- Listing status values are spelled exactly as in `src/types/listing-status.ts`: `draft`, `active`, `under_contract`, `closed`.

## Success criteria (how we know it worked)

Each line is a check a person can do. Items marked (later step) are verified when that step lands, not by this brief.

- [ ] A new visitor can sign up with email and password, then sign in, and lands on `/dashboard`.
- [ ] Opening `/dashboard`, `/dashboard/portfolio`, `/dashboard/deals` or `/dashboard/profile` while signed out does not show dashboard content. The visitor is sent to the sign-in page.
- [ ] Signing out ends the session; going back to `/dashboard` sends the visitor to sign-in again.
- [ ] A signed-in sponsor can create a listing, and it is still there after a full page refresh and after signing out and back in (it is in Postgres, not in memory).
- [ ] Sponsor A cannot see Sponsor B's listings, in the UI or by asking the database directly with Sponsor A's session (row-level security is intentional and was tested with two accounts).
- [ ] The listings the dashboard shows come from the database, not from `src/fixtures/` or `src/mock/`.
- [ ] The dashboard header shows the signed-in user's email or name, not "Investor (demo)".
- [ ] A search of the built client bundle and of git history for the service-role key, and for any other server-only value, finds nothing.
- [ ] No `.env` file is committed. `.env.example` exists and lists variable names with no real values.
- [ ] Any dashboard page that still shows mock data still says "Mock data".
- [ ] `npm run typecheck` and `npm run build` pass. (There is no test runner; the checks above are manual unless a later prompt adds tests.)

## Server-only boundary (must not ship to the browser)

**Never in client-side code, the client bundle, a `VITE_*` variable, a committed file or a log:**

- The Supabase **service-role** key. It bypasses row-level security.
- Any other privileged secret: JWT signing secrets, database passwords, admin or bypass API keys.
- A direct Postgres connection string (host, user and password).
- Any env var used for admin or bypass operations.
- A user's access or refresh token printed to logs or written to docs.

**Allowed in the browser only because Supabase is designed that way:**

- The Supabase project URL.
- The anon / publishable key. It is not a secret, but it is not a bypass either: row-level security is what protects the data.

**Rules that follow from this:**

- Server-only values are read with `process.env` inside server code (`createServerFn` handlers or other server-only modules), never at module scope of a file the client imports, and never with a `VITE_` prefix.
- Client-exposed values use the `VITE_` prefix and are read with `import.meta.env.VITE_*`. Only the two client-safe values above may use it.
- Reads and writes that depend on the user's identity run on the server, check the session first, and use the user's session, not the service-role key. The service-role key is only for a server task that truly needs to bypass RLS, and none is planned this sprint.
- Documents and chat name variables only (for example `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`). Never paste values. The exact variable names are fixed in the Supabase setup step.
- `.env` stays gitignored and is never force-added.

## Open questions for the director (not decided here)

1. **"Sponsor" vs "investor".** The Sprint 3 docs and every current page say "investor". The domain brief names an internal "listing editor" who creates listings, and `docs/dashboard-ia.md` lists "sponsor tools" as out of scope for Sprint 3. This brief follows the lesson and treats the sponsor as the account that owns and creates listings. Decide whether sponsors and investors are separate roles, and whether the `/dashboard` pages (named for investors) are the sponsor's home or a shared one.
2. **Listing visibility.** The Deals page shows only `active` and `under_contract`. A sponsor will need to see their own `draft` listings. Decide whether "my listings" shows all statuses to its owner (assumed here) while Deals keeps the investor filter.
3. **Which fields on create.** `InvestorListing` has many required fields (address, contacts, ownership). Decide whether the first create form collects a small subset, with the rest filled in later, or the full shape. The data-model step needs this answer.
4. **Sign-up policy.** Open sign-up, invite-only, or email confirmation required.
5. **Site header and footer.** The starter header (brand "TanStack Start") still wraps the dashboard. This is the open item from Sprint 3; it matters more once a sign-in page exists. Out of scope here unless decided.

## Implementation notes for later steps

- Prefer server loaders and `createServerFn` for reads and writes that need the session. Pass results to the existing prop-driven widgets as props.
- The data model and RLS policies are designed in a later step; this brief only fixes the product contract.
- Protect the `/dashboard` layout route once, not each page.
- Do not add dependencies other than the Supabase client. Do not hand-edit `src/routeTree.gen.ts`.
- The final handoff maps each deliverable back to the goals and success criteria above, and states plainly what was and was not verified.
