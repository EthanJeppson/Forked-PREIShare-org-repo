# PREIshare Sponsor Auth & Property Listings — Security Requirements

This is the short security contract for sponsor sign-in and property listings. It is written for beginners: each rule is something a person can pass or fail in a browser or in the database. It names environment variables but never shows a value.

Related documents (this file does not replace them):

- `docs/requirements/sponsor-auth-and-listings-brief.md` — the longer Sprint 4 product brief.
- `docs/verification/sprint4-auth-listings-checklist.md` — the checklist that records what has actually been run.
- `docs/handoff/sprint4-auth-listings-decisions.md` — what shipped and what is still open.

## 1. Context

PREIshare sponsors need a dashboard where they can sign in, view property listings they are allowed to manage, and add new properties. Data lives in Postgres via Supabase (table `property_listings`). Secret keys must never ship to the browser.

How this repo names things (so the stories below match the code):

- A "property" in this document is a row in `public.property_listings`.
- The owning account is the column `owner_id`, a link to the Supabase account (`auth.users`). There is no separate `sponsors` table.
- Sign-in is email and password through Supabase Auth. The server keeps the session token in an httpOnly cookie named `sb-access-token`.
- The route `/dashboard` and every page under it are protected by one session check in `src/routes/dashboard.tsx`.

## 2. Actors

| Actor | Description | Signed in? |
| --- | --- | --- |
| Anonymous visitor | Anyone not logged in. Can open the public pages (`/`, `/about`) and the sign-in and sign-up pages (`/login`, `/auth/signup`). | No |
| Sponsor | A partner who owns and manages their own listings. In the current code a sponsor is any signed-in account; there is no separate sponsor role yet (see Open questions). | Yes |
| Admin | Internal operator who could review or moderate listings. **Out of scope** for this topic. Not built. | N/A this sprint topic |

## 3. User stories (in scope)

1. As a **sponsor**, I can sign in with my email and password so the app knows who I am.
2. As a **sponsor**, after I sign in I see a list of **only my** properties, never another sponsor's.
3. As a **sponsor**, I can create a new property, and it is owned by my account without me choosing the owner.
4. As an **anonymous visitor**, I can reach the login page, but I cannot open any `/dashboard` page and I cannot create, change or delete any property.

## 4. Non-goals (out of scope this topic)

- Public (anonymous) create, update or delete of properties.
- A full admin console, an approver role, or any screen that moderates or reads other sponsors' listings.
- Putting the Supabase **service-role** (secret) key in any client or browser code, in a `VITE_*` variable, in git, or in a screenshot.
- Password-reset email polish, OAuth or social login, magic links, or multi-factor authentication.
- Investors browsing sponsors' listings (there is deliberately no policy that lets one account read another's rows).
- Editing or deleting properties from the UI. The database has update and delete rules, but the screens are not part of this topic.

## 5. Success criteria

Each box is a pass/fail check. Boxes stay **unticked** here: this file states the rules, and results are recorded in the verification checklist, not by ticking boxes in this contract.

- [ ] A sponsor can sign in with email and password and land on the protected `/dashboard`.
- [ ] A signed-out visitor who opens `/dashboard`, `/dashboard/properties`, `/dashboard/properties/new` or any other `/dashboard` URL is redirected to `/login` and sees no dashboard content.
- [ ] Signing out clears the session: after "Sign out", opening `/dashboard/properties` sends the visitor to `/login`.
- [ ] After sign-in, `/dashboard/properties` shows only rows whose `owner_id` is the signed-in account. A second account (Sponsor B) never sees Sponsor A's rows, in the UI or when querying the database with Sponsor B's session.
- [ ] Creating a property stores a row whose `owner_id` is the signed-in account. The browser form has no owner field, and a database insert with someone else's `owner_id` is rejected.
- [ ] The browser bundle and the browser's network requests contain only the public Supabase URL and the anon (publishable) key. No service-role key, database password or connection string appears.
- [ ] Access to `property_listings` is enforced by Row Level Security (RLS) in Postgres, not only by hiding buttons or filtering in React. The anonymous role has no access to the table.
- [ ] No `.env` file with real values is committed, and `.env.example` lists variable names only.

## 6. Simple threat list

Each threat below becomes a test in the end-of-sprint verification step. The last column says where that test lives.

| Threat | What goes wrong | Requirement to mitigate | Test later |
| --- | --- | --- | --- |
| Stolen or reused session cookie | An attacker who has a sponsor's cookie acts as that sponsor. | The session cookie is httpOnly (page scripts cannot read it), is sent only to this site, and is marked secure in production. The server checks the token with Supabase on every protected request, not just once. Sign-out clears the cookie. Tokens expire (the cookie lasts one hour). The attacker still only reaches that one sponsor's rows, because RLS is tied to the token's account. | Checklist rows 2.3 and 2.4. Still to confirm: that a copied token stops working after sign-out (not tested). |
| Guessing another sponsor's property id | An attacker puts someone else's listing id in a URL or request and reads or edits it. | RLS must deny cross-sponsor access even when the id is known. Server queries also filter by the signed-in owner. The id alone is never proof of permission. | Checklist rows 4.1 to 4.4. As Sponsor B, request Sponsor A's row id and expect no row. |
| Leaked service-role key | An attacker with the key bypasses RLS and can read or change every row. | The key is never in client code, a `VITE_*` variable, git history, docs or screenshots. No application code reads it today. If a future task needs it, it is read with `process.env` in server-only code, with a written reason. | Checklist rows 5.1 to 5.5b. |
| "Security by hiding buttons" | The UI hides edit controls, but the API or database still accepts the write. | Rules are enforced in Postgres RLS and in server code that checks the session. React components are never the only guard. | Checklist rows 4.3 and 1.2 to 1.3. Also try the write from outside the UI as a signed-out caller. |

## 7. Environment & secret hygiene notes (requirements only)

Names and purpose only. Real values live in Vercel (Production) and in a local `.env.local`, both outside git.

| Variable | Where it may run | Secret? | Purpose |
| --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | Browser and server | No | Public Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | Browser and server | No (public), but not a bypass | Public anon or publishable key. RLS is what protects the data. |
| `SUPABASE_URL` | Server only | No | Same project URL, for server code. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | **Yes** | Bypasses RLS. Not read by any code today. |

Rules:

- Only variables with the `VITE_` prefix may reach the browser. Anything secret never gets that prefix.
- Do not write real key values, project refs or passwords into this file or into chat.
- `.env.example` and the server and browser Supabase clients already exist. `docs/setup/supabase-env-checklist.md` is the setup checklist.

## 8. Open questions for the team

- **Login method.** Default for this topic: email and password. Magic links and OAuth stay out of scope unless the director changes this.
- **Sponsor profile table.** Working assumption: no separate `sponsors` table. A sponsor is an account in `auth.users`, and ownership is `property_listings.owner_id`. This is enough for stories 1 to 4. A role or profile table is a later decision.
- **"Signed in" is not "sponsor".** Today any account that signs up can create listings. Should sponsors be a distinct role, and should sign-up be open, invite-only or require email confirmation? Not decided.
- **Session after sign-out.** Does a copied access token stop working immediately after sign-out, or only when it expires? Not tested against a real Supabase project.
- **Real proof.** The two-account RLS test (Sponsor A and Sponsor B) has not been recorded against a real Supabase project, so the isolation rule is a design, not yet a verified fact.

## 9. How later steps use this brief

This file is the contract for environment separation, RLS policy design, the login and dashboard routes, the property list and create flows, and the end-to-end security verification checklist. If code or a later prompt disagrees with it, raise the difference with the director instead of changing the rule silently.
