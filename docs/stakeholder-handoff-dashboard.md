# PREIshare Investor Dashboard — Stakeholder Handoff

**Sprint focus:** Responsive investor dashboard shell (TanStack Start routes and React UI), mock data only
**Audience:** PREIshare product stakeholders and the owners of the next implementation topics
**Date:** 2026-10-26
**Prepared by:** [author of record: add your name]. First draft written by the Cursor cloud agent from the repo docs and code; not yet reviewed by the author.

Requirements source: `docs/investor-dashboard-brief.md`. Earlier lessons call it `docs/preishare-dashboard-requirements.md`, but no file with that name exists in the repo. Every criterion below is copied from the brief's "Success criteria" list.

## 1. Demo today (what investors can click)

Run `npm run dev` and open `http://localhost:3000/dashboard`.

- `/dashboard` shows the Overview page inside the dashboard shell.
- The shell has a header (the page title as the heading, a "Mock data" badge, and a placeholder user labeled "Investor (demo)"), a sidebar, and a main content area.
- Navigation has four links, in this order: Overview, Portfolio, Deals, Profile. The current page's link is marked.
- Desktop (over 1024px): the sidebar is always visible and stays in view while the page scrolls. Tablet (768 to 1024px): a narrower sidebar, always visible. Phone (under 768px): the sidebar is hidden and a "Menu" button in the header opens a panel with the same four links. The panel closes with the Close menu button, the Escape key, a tap outside it, or choosing a link.
- The Overview page shows, all with mock values:
  - three metric cards (Total portfolio value, Holdings, Open deals)
  - a portfolio summary (a headline and a breakdown by property type)
  - a recent activity list of three rows
- `/` and `/about` still work.

Not built yet: the Portfolio, Deals and Profile pages. Their links go to `/dashboard/portfolio`, `/dashboard/deals` and `/dashboard/profile`, which today show "Not Found" inside the dashboard shell (the header title and navigation still work).

**Out of scope for this sprint (by design):** live Supabase or database data, sign-in and access control, editing anything, payments, admin tools, and production hardening.

## 2. Requirements traceability

Status key: **Met** (built and observed), **Partial** (some of it built), **Not yet** (not built).

| Success criterion (verbatim from `docs/investor-dashboard-brief.md`) | Status | Evidence |
| --- | --- | --- |
| Visiting `/dashboard` shows a page titled "Overview" with stat cards, a portfolio summary block, and a recent-activity list. | Met | `src/routes/dashboard/index.tsx` renders `MetricCard` x3, `PortfolioSummary` and `RecentActivity`. The "Overview" title is the heading in the dashboard `Header`, picked by `AppShell` from `navConfig`. Values are mock (`src/mock/dashboard-data.ts`). |
| A persistent navigation (sidebar on desktop) has exactly four links: Overview, Portfolio, Deals, Profile. Clicking each one loads its page without a full broken or blank screen. | Partial | Four links on every dashboard page, from the single list in `src/components/dashboard/nav-config.ts` (`Sidebar`, `MobileNav`). Overview loads. The other three links lead to "Not Found" inside the shell because those pages do not exist yet. |
| The link for the page you are on is visually marked as active. | Met | `Sidebar` and `MobileNav` mark the current link (`aria-current="page"`, exact match so Overview is not active elsewhere). Observed on Overview only; the other pages do not exist yet. |
| Each of `/dashboard/portfolio`, `/dashboard/deals`, and `/dashboard/profile` shows its own visible page title ("Portfolio", "Deals", "Profile"). | Not yet | The header shows the right title on those URLs (from `navConfig`), but the pages themselves are not built, so the title appears next to a "Not Found" message. Planned files: `src/routes/dashboard/portfolio.tsx`, `deals.tsx`, `profile.tsx`. |
| Every dashboard page uses the same frame: navigation, a header, and a main content region. Only the main content changes between pages. | Partial | `src/routes/dashboard/route.tsx` wraps every `/dashboard/*` URL in `AppShell`, and the frame stayed in place when navigating to the unbuilt pages. Only one page (Overview) has content yet. |
| Every page shows a visible "Mock data" label (a badge or a banner) so a viewer knows the numbers are not real. | Met | "Mock data" badge in `src/components/dashboard/Header.tsx`, visible at 375, 768 and 1280px (`docs/responsive-qa-checklist.md`). |
| The Deals page lists only listings whose status is `active` or `under_contract`, spelled exactly as in `src/types/listing-status.ts`. Draft and closed listings do not appear. | Not yet | No Deals page and no deals mock helper yet. Planned: `getMockDeals()` over `src/fixtures/sample-investor-listings.ts` (`docs/component-plan.md`). The Overview "Open deals: 3" is a fixed mock number, not computed from the fixtures. |
| At phone width (about 375px), no page scrolls sideways, no text overlaps, and the four areas are still reachable (the navigation collapses to a menu or moves to a top or bottom bar). | Met for Overview | `docs/responsive-qa-checklist.md` rows M1 to M10 pass: no horizontal scroll, the Menu button opens a panel with all four links. The three unbuilt pages could not be checked. |
| No page shows a login form, a payment form, or an admin or edit screen. | Met | None exist in `src/`. The header user is a labeled placeholder ("Investor (demo)"), not a session. |
| The site has no dashboard pages other than the four above. `/` and `/about` keep working. | Met | Only `src/routes/dashboard/route.tsx` (layout) and `index.tsx` exist under `src/routes/dashboard/`. No activity page. `/` and `/about` returned 200 on the dev server. |
| `npm run build` and the existing `npm run typecheck` pass. | Met | Both run clean on this branch. There is no test runner or lint script in `package.json`. |

## 3. Decisions made (so the next topic does not re-litigate them)

- **Four areas only:** Overview, Portfolio, Deals, Profile. Recent activity is a list on Overview, not a page (`docs/dashboard-routing-plan.md`).
- **Routing:** folder form. `src/routes/dashboard/route.tsx` is the layout and `src/routes/dashboard/index.tsx` is the Overview page (route id `/dashboard/`). `portfolio.tsx`, `deals.tsx` and `profile.tsx` will sit beside them. `src/routeTree.gen.ts` is generated, never hand-edited.
- **One source for nav:** `navConfig` (`src/components/dashboard/nav-config.ts`) owns labels, paths and page titles. `AppShell` passes the same list to `Sidebar` and `MobileNav`, owns the mobile menu's open state, and picks the header title for the current URL.
- **Components:** `AppShell`, `Header`, `Sidebar`, `MobileNav`, `MetricCard`, `PortfolioSummary`, `RecentActivity` in `src/components/dashboard/`. Widgets only receive props: they fetch nothing and do not import mock data, so real data can replace the mock constants later without rewriting them. If docs disagree, `docs/dashboard-component-architecture.md` wins.
- **Responsive approach:** under 768px the sidebar is hidden and the header Menu button opens `MobileNav`; 768 to 1024px a narrower always-visible sidebar; over 1024px a full-width sticky sidebar.
- **Mock data:** all in `src/mock/dashboard-data.ts`, every export named `MOCK_*`. The Deals page is planned to reuse the existing `InvestorListing` types and fixtures (`src/types`, `src/fixtures/sample-investor-listings.ts`) and show only `active` and `under_contract` listings.
- **No fake identity:** the header user is a labeled demo placeholder. No session is simulated.

## 4. Known limitations (honest baseline)

- **Mock data only.** Metrics, portfolio figures and activity rows are placeholders. Nothing reads from Supabase, PostgreSQL or any API, and the repo has no Supabase client and no loaders or server functions.
- **No authentication.** Anyone who can reach the site can open `/dashboard`. There is no sign-in, session or role check.
- **Read-only.** No forms or actions that save anything.
- **Three of the four pages are not built.** Portfolio, Deals and Profile show "Not Found" inside the shell.
- **Two headers.** The starter site header and footer from `src/routes/__root.tsx` still appear above and below the dashboard (they still carry starter text such as "TanStack Start"). On a phone this adds about 115px above the dashboard header. Whether to hide them on `/dashboard/*` is undecided (`docs/dashboard-routing-plan.md`, open questions).
- **"Open deals" is a fixed mock number** (3), not derived from the deals fixtures.
- **Responsive QA was an emulated, automated run** (headless Chrome at 375, 768 and 1280px), not done on real devices. Not tested: touch, Safari, Firefox, dark mode, screen readers, browser zoom.
- **Residual items from `docs/responsive-qa-checklist.md`:** at tablet width the third metric card sits alone on its row; at desktop the Portfolio summary card has empty space under its content; the open mobile menu does not trap keyboard focus; if the menu is open when the window is widened past 768px it stays open in state (hidden by CSS) and reappears when narrowed.
- **No automated tests.** The repo has no test runner. Checks were typecheck, build, and the manual and scripted browser runs above.

## 5. Recommended next sprint work

1. Build the three remaining pages with mock data: `PortfolioTable`, `DealsList` (with `getMockDeals()` filtering to `active` and `under_contract`) and `ProfileCard`, then derive the Overview "Open deals" and "Holdings" numbers from the same mock data.
2. Decide the double-header question (keep, hide for `/dashboard/*`, or move the site chrome into its own layout route) and remove the starter branding from the site header and footer.
3. Settle the open product questions in the brief: should `/` link to `/dashboard`, should `closed` listings ever show in Deals, and what the real portfolio figures mean (invested amount, current value or both).
4. Connect real data: typed server functions or loaders reading from Supabase, replacing the `MOCK_*` props. Keep the widgets presentational.
5. Add authentication and protect `/dashboard` for signed-in investors, replacing the "Investor (demo)" placeholder with the real user.
6. Re-run the responsive QA checklist on all four pages and with real content lengths (long property names, empty and full lists), on real devices and in more than one browser. Decide on a test runner if the team wants regression checks.

## 6. Artifact index (for handoff package)

- Requirements brief: `docs/investor-dashboard-brief.md`
- Pages and URLs: `docs/dashboard-ia.md`
- Component jobs and must-not rules: `docs/component-plan.md`
- Routing plan: `docs/dashboard-routing-plan.md`
- Component architecture (wins if docs disagree): `docs/dashboard-component-architecture.md`
- Responsive QA record: `docs/responsive-qa-checklist.md`
- Routes: `src/routes/dashboard/route.tsx`, `src/routes/dashboard/index.tsx`
- Dashboard components: `src/components/dashboard/` (`AppShell.tsx`, `Header.tsx`, `Sidebar.tsx`, `MobileNav.tsx`, `MetricCard.tsx`, `PortfolioSummary.tsx`, `RecentActivity.tsx`, `nav-config.ts`)
- Mock data: `src/mock/dashboard-data.ts`
- Existing listing types and fixtures the Deals page will reuse: `src/types/`, `src/fixtures/sample-investor-listings.ts`
