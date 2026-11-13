# PREIshare investor dashboard shell: Sprint 3 handoff

**Date:** 2026-11-13
**Audience:** the next developer or reviewer who picks this up cold
**Status of everything below:** mock data only. There is no sign-in, no live database, no vector search and no CI.

This document supersedes `docs/stakeholder-handoff-dashboard.md` (a 2026-10-26 snapshot from when only the Overview page existed).

## Summary

Sprint 3 built a responsive investor dashboard shell in the existing TanStack Start app. A visitor can open `/dashboard`, move between four areas (Overview, Portfolio, Deals, Profile) through a sidebar on desktop and tablet or a menu on a phone, and see placeholder content on each. Every figure on every page is mock data, and every dashboard page says so with a "Mock data" badge or note.

It is a shell, not a product: nothing reads from a database or an API, nothing is saved, and anyone who can reach the site can open `/dashboard`.

The requirements are in `docs/investor-dashboard-brief.md`. The decisions behind the structure are in [`docs/architecture-decisions.md`](architecture-decisions.md). The test record is in [`docs/verification-checklist.md`](verification-checklist.md).

## What shipped

### Routes

| URL | File | Shows |
| --- | --- | --- |
| `/dashboard` | `src/routes/dashboard/index.tsx` | Overview: three metric cards, a portfolio summary, a recent-activity list |
| `/dashboard/portfolio` | `src/routes/dashboard/portfolio.tsx` | Portfolio: a table of four mock holdings |
| `/dashboard/deals` | `src/routes/dashboard/deals.tsx` | Deals: the investor-visible sample listings (`active` and `under_contract` only) |
| `/dashboard/profile` | `src/routes/dashboard/profile.tsx` | Profile: a demo profile card |
| (layout for all of the above) | `src/routes/dashboard.tsx` | Wraps every `/dashboard/*` page in `AppShell` |

`/` and `/about` are the original starter pages. `/` now has an "Open investor dashboard" link to `/dashboard`. There is no separate activity page; recent activity is a list on Overview.

### Components (`src/components/dashboard/`)

| File | Job |
| --- | --- |
| `AppShell.tsx` | The frame: skip link, `Header`, `Sidebar`, `MobileNav`, and a `<main>` for the page. Owns the mobile menu open state and picks the page title for the current URL. |
| `Header.tsx` | Page title (`h1`), "Mock data" badge, the "Investor (demo)" placeholder, and the Menu button on phones. |
| `Sidebar.tsx` | The four nav links on tablet and desktop. |
| `MobileNav.tsx` | The same four links in a panel on phones. |
| `nav-config.ts` | The single list of nav labels, paths and page titles. |
| `MetricCard.tsx`, `PortfolioSummary.tsx`, `RecentActivity.tsx` | Overview widgets. |
| `PortfolioTable.tsx`, `DealsList.tsx`, `ProfileCard.tsx` | Page widgets for Portfolio, Deals and Profile. |

Widgets only receive props. They do not fetch anything and do not import mock data.

### Supporting files

- `src/mock/dashboard-data.ts`: all dashboard mock data (`MOCK_*` constants, `getMockDeals()`, and the mock-only `MockHolding` and `MockProfile` types).
- `src/fixtures/sample-investor-listings.ts` and `src/types/`: the Sprint 2 listing types and fixtures. Deals reuses them.
- `src/lib/format.ts`: currency and label formatting. `src/lib/user.ts` is the starter placeholder (`getUser()` returns `null`) and is not used by the dashboard.
- `src/styles/dashboard.css`: shared responsive and accessibility rules (card grids, scrolling table wrapper, focus ring, skip link, reduced motion), scoped to `.dashboard-shell` and imported by `src/styles.css`.

### Docs

`docs/investor-dashboard-brief.md` (requirements), `docs/dashboard-ia.md` (pages and URLs), `docs/dashboard-routing-plan.md`, `docs/dashboard-component-architecture.md` (wins if docs disagree), `docs/component-plan.md`, `docs/responsive-qa-checklist.md`, `docs/verification-checklist.md`, and the two docs added in this step.

## How to run

You need Node.js 22.12 or newer. Commands come straight from `package.json`:

```bash
npm install
npm run dev
```

Then open http://localhost:3000/dashboard.

| Command | Use |
| --- | --- |
| `npm run typecheck` | TypeScript check. Passes. |
| `npm run build` | Production build. Passes. |
| `npm run preview` | Serves the production build at http://localhost:3000 (not Vite's usual 4173). Run `npm run build` first. |
| `npm run generate-routes` | Regenerates `src/routeTree.gen.ts`. The dev server and build do this already. |
| `npm run typecheck:errors` | Reports errors on purpose: it checks the intentionally broken `src/fixtures/*.errors.ts` files. |

There is no test runner and no lint script. Do not hand-edit `src/routeTree.gen.ts`.

A cold start (fresh clone, `npm install`, `npm run typecheck`, `npm run build`, `npm run dev`, then a request to `/`, `/dashboard` and the three child pages) was run on 2026-11-13. All five routes returned HTTP 200.

## Demo script

About five minutes. Start `npm run dev`, then use a normal browser window.

1. **Open `/`.** Click "Open investor dashboard". You land on `/dashboard`.
2. **Overview.** Point out the title "Overview", the "Mock data" badge and "Investor (demo)" in the header, and the sidebar with four links (Overview is marked as the current page). Read the three metric cards: Total portfolio value $6,850,000, Holdings 4, Open deals 2. Then the portfolio summary (Multi-family 45%, Commercial 55%) and three recent-activity rows.
3. **Portfolio.** Click Portfolio. The title changes, the frame stays put, and a table lists four mock holdings. The four values add up to the $6,850,000 on Overview.
4. **Deals.** Click Deals. Two listings appear (one Active, one Under contract). Say that the draft and closed sample listings are deliberately hidden.
5. **Profile.** Click Profile. A demo profile card appears. Say that no one is signed in; this is placeholder text.
6. **Phone width.** Narrow the browser to about 375px (or use the browser's device toolbar). The sidebar disappears and a Menu button appears. Open it, pick a link, and confirm it closes. Press Escape with it open to show it closes that way too.
7. **Keyboard.** Press Tab from the top of the page: the "Skip to main content" link appears when focused, and every link shows a visible focus ring.

Things to say out loud during the demo: all numbers are mock; there is no login; the site header and footer above and below the dashboard are the starter ones (see limitations).

## Known limitations

Be direct about these when handing off.

**Product and data**

- **All data is mock.** Nothing reads from Supabase, PostgreSQL, vector search or any API. The repo has no Supabase client, no loaders and no server functions.
- **No authentication or access control.** `/dashboard` is open to anyone who can reach the site. "Investor (demo)" and "Alex Morgan (demo)" are labels, not a session.
- **Read-only.** There are no forms, saves, edits, payments or admin screens. That was out of scope on purpose.
- **Portfolio holdings have no real type.** `MockHolding` is a small mock-only shape. The brief leaves open whether "value" means invested amount, current value or both.
- **Deals shows 2 rows; the brief says "about 3 to 5".** Only two sample listings are investor-visible. Adding more means extending the shared Sprint 2 fixtures, which carry their own validation.

**Layout and accessibility**

- **Two headers and a footer.** `src/routes/__root.tsx` still renders the starter site header (brand "TanStack Start") and footer around the dashboard. Whether to keep, hide on `/dashboard/*`, or split layouts is an open product decision (`docs/dashboard-routing-plan.md`).
- **Skip link is the 8th tab stop** because it sits inside the dashboard shell, after the site header links.
- **`MobileNav` does not trap keyboard focus.** It closes on Escape, outside tap, its Close button and link choice, but Tab can move behind it.
- **Menu left open while widening the window** stays open in state (hidden by CSS) and reappears when narrowed.
- **At tablet width** the third Overview metric card sits alone on its row, and at desktop the portfolio summary card has empty space under its content.

**Testing**

- **No automated tests and no CI.** Checks were `npm run typecheck`, `npm run build`, and scripted headless-Chrome runs at 375, 768 and 1280px against the production build (`docs/verification-checklist.md`, `docs/responsive-qa-checklist.md`). The "human browser pass" box in the verification checklist is still unchecked. Not tested: real devices, Safari, Firefox, dark mode, screen readers, touch, browser zoom.

**Repo housekeeping**

- **Do-not-merge PRs.** The lesson-variant PRs [#28](https://github.com/EthanJeppson/Forked-PREIShare-org-repo/pull/28), [#29](https://github.com/EthanJeppson/Forked-PREIShare-org-repo/pull/29), [#30](https://github.com/EthanJeppson/Forked-PREIShare-org-repo/pull/30), [#31](https://github.com/EthanJeppson/Forked-PREIShare-org-repo/pull/31) and [#33](https://github.com/EthanJeppson/Forked-PREIShare-org-repo/pull/33) duplicate or regress code that is already on the default branch. They are marked do-not-merge and can be closed.
- **Scaffold names differ from this repo.** Early lesson wording used `src/components/layout/`, `navConfig.ts`, `StatsCard`, "Home" and `dashboard/route.tsx`. The repo follows the planning docs instead: `src/components/dashboard/`, `nav-config.ts`, `MetricCard`, "Overview" and `src/routes/dashboard.tsx`.

## Next-sprint recommendations

In rough priority order. Nothing here is started. Details and the "why" are in the "Next sprint foundations" table in [`docs/architecture-decisions.md`](architecture-decisions.md).

1. **Decide the double-header question** and remove the starter branding from the site header and footer. It is the most visible thing in a demo.
2. **Authentication (Supabase Auth).** Add a Supabase client, sessions, and protection for `/dashboard`. Replace the "Investor (demo)" placeholder with the real user. The repo has no `src/lib/supabase.ts`, no `.env.example` and no `supabase/` folder today.
3. **Live portfolio data.** Load data in route loaders or server functions and pass it to the existing prop-driven widgets. Define real types for holdings and profile, and settle what "value" means.
4. **GitHub Actions CI.** There is no `.github/` folder. A first workflow can run `npm ci`, `npm run typecheck` and `npm run build`. Add a test runner and a lint script only if the team wants them.
5. **pgvector search.** Only after live data exists. It is not in the Sprint 3 brief and needs a product definition (what is searched, and how results are shown).
6. **Close the testing gap.** A human pass on real devices and a second browser, a focus trap for `MobileNav`, and more investor-visible fixtures so Deals looks like a list.

## References

- Requirements: [`investor-dashboard-brief.md`](investor-dashboard-brief.md)
- Pages and URLs: [`dashboard-ia.md`](dashboard-ia.md)
- Routing plan: [`dashboard-routing-plan.md`](dashboard-routing-plan.md)
- Component architecture (wins on conflict): [`dashboard-component-architecture.md`](dashboard-component-architecture.md)
- Component jobs: [`component-plan.md`](component-plan.md)
- Test record: [`verification-checklist.md`](verification-checklist.md) and [`responsive-qa-checklist.md`](responsive-qa-checklist.md)
- Decisions and next-sprint foundations: [`architecture-decisions.md`](architecture-decisions.md)
- Listing types decision (Sprint 2): [`decisions/ADR-001-investor-listing-types.md`](decisions/ADR-001-investor-listing-types.md)
- Older handoff (superseded): [`stakeholder-handoff-dashboard.md`](stakeholder-handoff-dashboard.md)
- Setup: [`../README.md`](../README.md)
