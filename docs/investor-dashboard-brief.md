# PREIshare Investor Dashboard — Client Brief (Sprint 3 Shell)

This brief is the checklist every later routing, UI, and assessment step compares against. It restates the PREIshare client story in plain language. If a later prompt or an agent's output disagrees with this file, this file wins.

## Product summary

PREIshare shows investors real-estate investment opportunities (investor listings). Today the app is still the starter site with only `/` and `/about`, so an investor has no single place to see "what do I hold, what is open, and who am I in the system."

This sprint builds the **investor dashboard shell**: one app frame (navigation, header, content area) and four pages inside it. The shell uses clearly labeled **mock data only**. There is no sign-in, no database, and no payments. The goal is that an investor, or a stakeholder watching a demo, can open the dashboard and reach the portfolio, the open deals, and the profile in one click each, without hunting through clutter.

"Done" for this sprint, in one sentence: from `/dashboard`, a stakeholder can click through Home, Portfolio, Deals, and Profile using persistent navigation, and every page is visibly labeled as mock data.

## Primary actors

| Actor | Role in this sprint | In scope to build? |
|-------|---------------------|--------------------|
| Investor (PREIshare member) | The only person the shell is designed for. Scans their holdings, looks at open deals, checks their profile. | Yes, the primary user |
| Stakeholder / demo viewer | Watches the demo and checks it against the success criteria below. Does not use a separate screen. | No separate UI, they use the investor view |
| Future admin / listing editor | May manage investors and listings later. The domain brief (`docs/domain/investor-listing-domain-brief.md`) already names the listing editor as an internal role. | No. Named here only so nobody builds admin screens by accident. |

## Investor goals

1. Open the dashboard and see a home overview: a portfolio snapshot and a recent-activity list, both with placeholder values.
2. Reach Portfolio, Deals, and Profile from the app shell without typing a URL or going back to the marketing home page.
3. See which deals are open and tell them apart at a glance (title, property type, status, asking price), using the same listing vocabulary the team already defined in Sprint 2.
4. Check who they are in PREIshare (name and contact placeholders) on a profile page.
5. Trust what they see: every page says which numbers are mock, so nobody mistakes a placeholder for a real balance.

## Must-have dashboard areas (this sprint)

These are the only four areas. Anything else is out of scope (see below).

| Area | Route idea (for later steps) | What the investor should see (mock data OK) |
|------|------------------------------|----------------------------------------------|
| Home overview | `/dashboard` | Page title "Overview". Three or four stat cards (for example total portfolio value, number of holdings, number of open deals). A short portfolio summary block. A recent-activity list of about 3 to 5 placeholder rows. |
| Portfolio | `/dashboard/portfolio` | Page title "Portfolio". A table or list of about 3 to 5 mock holdings, each with a property name, property type, and a value. |
| Deals | `/dashboard/deals` | Page title "Deals". A list of about 3 to 5 mock open deals. Each row shows title, property type, status, and asking price. Rows only show investor-visible statuses (`published`, `under_offer`). |
| Profile | `/dashboard/profile` | Page title "Profile". A profile card with name, email, and phone placeholders. No edit controls. |

Notes for implementers:

- Deals mock data should reuse the existing listing vocabulary and fixtures (`src/types`, `src/fixtures/sample-investor-listings.ts`) instead of inventing a second shape. Portfolio holdings have no type yet, so a small mock-only shape is fine, but it must be labeled as mock.
- Do not hand-edit `src/routeTree.gen.ts`. It is generated from the files in `src/routes/`.

## Success criteria (demo-ready shell)

Each line is a yes/no check a person can do in a browser without live data.

- [ ] Visiting `/dashboard` shows a page titled "Overview" with stat cards, a portfolio summary block, and a recent-activity list.
- [ ] A persistent navigation (sidebar on desktop) has exactly four links: Overview, Portfolio, Deals, Profile. Clicking each one loads its page without a full broken or blank screen.
- [ ] The link for the page you are on is visually marked as active.
- [ ] Each of `/dashboard/portfolio`, `/dashboard/deals`, and `/dashboard/profile` shows its own visible page title ("Portfolio", "Deals", "Profile").
- [ ] Every dashboard page uses the same frame: navigation, a header, and a main content region. Only the main content changes between pages.
- [ ] Every page shows a visible "Mock data" label (a badge or a banner) so a viewer knows the numbers are not real.
- [ ] The Deals page lists no more than the investor-visible statuses `published` and `under_offer`, and spells them as the team defined them.
- [ ] At phone width (about 375px), no page scrolls sideways, no text overlaps, and the four areas are still reachable (the navigation collapses to a menu or moves to a top or bottom bar).
- [ ] No page shows a login form, a payment form, or an admin or edit screen.
- [ ] The site has no dashboard pages other than the four above. `/` and `/about` keep working.
- [ ] `npm run build` and the existing `npm run typecheck` pass.

## Out of scope (explicit non-goals for this sprint)

- Real sign-in, sign-up, sessions, roles, or any authentication or authorization (including Supabase Auth)
- Live Supabase/PostgreSQL data for portfolio, deals, or profile (all content is mock)
- Payments, subscriptions, funding or withdrawal flows, and document e-signing
- Admin tools: creating, editing, approving, or deleting investors or listings
- Editing the profile, saving settings, or submitting any form
- Notifications, messaging, search, filtering, charts with real calculations, and a dark-mode settings page (the existing theme toggle may stay)
- Multi-portfolio switching, multiple investor accounts, and compliance or reviewer screens
- Production hardening, CI, and new deployment setup beyond the current Vercel Hobby project

## Prompting notes for later AI steps

- Attach or quote this brief in every routing or UI prompt for this sprint.
- Require: TypeScript in strict mode, TanStack Start file-based routes under `src/routes/`, reusable React components under `src/components/`, Tailwind styling using the tokens in `src/styles.css`, and mock data only.
- Use the router's `Link` for navigation, and never hand-edit `src/routeTree.gen.ts`.
- Name the four pages exactly: Overview, Portfolio, Deals, Profile. Reject any output that adds a page, feature, or dependency from the Out of scope list.
- For deals, require reuse of the existing `InvestorListing` types and sample fixtures, and no `any`.
- Ask the agent to check its own work against the Success criteria checklist and say which lines it could not verify.
- If the agent invents a feature, tell it to delete it and re-read the Out of scope section.

## Open questions / assumptions

Assumptions (change these here if they are wrong, and later steps will follow):

- UI copy is in English.
- There is a single investor persona who sees only their own mock data. There is no portfolio switcher.
- "Deals" means investor listings that investors can see, using the Sprint 2 statuses. Whether `sold` listings also appear is not decided, so this sprint shows only `published` and `under_offer`.
- The dashboard lives under `/dashboard` and sits beside the existing `/` and `/about` pages. It does not replace them.
- Visual design stays simple and professional. A full brand system is not required.

Open questions (to confirm with the client before they become real work):

- Should the root `/` page link to `/dashboard`, or stay as the starter page for now?
- Should sold listings show in Deals later, as the domain brief's open question also asks?
- What should the real portfolio figures mean (invested amount, current value, or both)? This decides the holdings shape in a later sprint.
- When authentication arrives, should `/dashboard` redirect signed-out visitors to a login page?
