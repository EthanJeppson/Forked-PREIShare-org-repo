# PREIshare Investor Dashboard Shell: Verification Checklist

**Sprint:** 3 (TanStack Start UI shell)
**Verifier:** Cursor cloud agent (Claude), for review by Ethan Jeppson
**Date:** 2026-11-13
**Code tested:** `main` at `7116e8d` (PRs #32 and #34 merged) plus the two fix commits listed in section 6, on branch `cursor/dashboard-verification-e7ac`
**App URL tested:** `http://localhost:4173` (production build, `node .output/server/index.mjs`) in headless Google Chrome driven by a script. The dev server (`npm run dev`, port 3000) was also started and returned 200 for `/`, `/about` and the four dashboard routes, but the browser checks ran against the production build because headless Chrome could not finish loading pages against the dev server's hot-reload socket in this sandbox.
**Sources of truth:** `docs/investor-dashboard-brief.md`, `docs/dashboard-ia.md`, `docs/component-plan.md`

## How to use this checklist

- **Pass**: requirement met; evidence describes what was seen.
- **Fail**: in-scope shell issue; fix before handoff or note the fix commit.
- **Deferred**: intentionally out of scope for this sprint; reason required.

**What was not checked:** a human clicking in a visible browser, Firefox, Safari, a real phone, or a screen reader. Every "clicked" below means a scripted click in headless Chrome. Viewports used: 1280x800 (desktop) and 375x800 (phone width).

---

## 1. Routing and information architecture

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| R1 | `/dashboard` loads dashboard home inside AppShell | Pass | HTTP 200. `<h1>` "Overview", one `<main>`, sidebar and dashboard header present, three stat cards plus summary and activity sections. |
| R2 | `/dashboard/portfolio` loads the portfolio page shell | Pass | HTTP 200. `<h1>` "Portfolio", `<h2>` "Your holdings", same sidebar and header. |
| R3 | `/dashboard/deals` loads the deals page shell | Pass | HTTP 200. `<h1>` "Deals", `<h2>` "Open deals", same sidebar and header. |
| R4 | `/dashboard/profile` loads the profile page shell | Pass | HTTP 200. `<h1>` "Profile", `<h2>` "Your profile", same sidebar and header. |
| R5 | Unknown paths do not break the whole app | Pass | `/dashboard/nope` and `/dashboard/activity` return HTTP 404 and render the dashboard shell (sidebar still present) with the framework's plain "Not Found" text in the main region. No JS errors. |
| R6 | `/dashboard/` (trailing slash) works | Pass | HTTP 200, `<h1>` "Overview". |
| R7 | `/` and `/about` still work; home links into the dashboard | Pass | `/` 200 with an "Open investor dashboard" link to `/dashboard`; `/about` 200. |

**IA notes:** Routes and URLs match `docs/dashboard-ia.md` exactly, and there is no activity page (activity is a widget on Overview). The layout file is `src/routes/dashboard.tsx` (the IA doc and routing plan were updated to that path).

---

## 2. Navigation labels and active states

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| N1 | Sidebar labels match brief/IA | Pass | Desktop sidebar shows exactly four links in order: Overview to `/dashboard`, Portfolio to `/dashboard/portfolio`, Deals to `/dashboard/deals`, Profile to `/dashboard/profile`. The label is "Overview" (brief and IA), not "Home". |
| N2 | Active nav item highlights the current route | Pass | On each of the four pages exactly one sidebar link has `aria-current="page"` and the active style: Overview, Portfolio, Deals, Profile respectively. Overview is not marked on the other three pages. |
| N3 | Header page title updates when changing routes | Pass | After clicking each sidebar link the header `<h1>` read Portfolio, Deals, Profile, then Overview. |
| N4 | Nav links use client routing | Pass | A marker set on `window` before clicking all four links survived every click (no full page reload), and the URL changed each time. |
| N5 | Mobile menu reaches all four areas | Pass | At 375px the Menu button opens a panel listing Overview, Portfolio, Deals, Profile. Choosing each one went to the right URL, showed the right title, and closed the panel. |

---

## 3. Layout shell and responsiveness

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| L1 | AppShell shows sidebar + header + main on desktop | Pass | At 1280px each dashboard page has one visible `<aside>` nav, the dashboard header (brand kicker, page title, "Mock data" badge, demo user) and one `<main>`. |
| L2 | Narrow viewport: nav remains usable | Pass | At 375px the sidebar is hidden and a 44px-high Menu button appears. Opening it sets `aria-expanded="true"`, moves focus to "Close menu", and Escape closes it and returns focus to the Menu button. |
| L3 | No permanent horizontal scroll at ~375px | Pass | Page-level overflow was 0px on `/dashboard`, `/portfolio`, `/deals` and `/profile` at 375px (and at 1280px). |
| L4 | Cards and tables stack or scroll intentionally | Pass | Overview stat grid is 1 column at 375 and 639px, 2 columns at 640 to 1279px, 3 at 1280px. At 375px the portfolio table (448px wide) scrolls inside its `dashboard-table-wrap` container (275px) while the page does not scroll sideways. |
| L5 | Basic accessibility: focusable controls with names | Pass | Tab order on desktop: site header links, then "Skip to main content", then Overview, Portfolio, Deals, Profile. Dashboard controls show a 2px solid outline when focused. The Menu button's name is "Open navigation menu" / "Close navigation menu" and it carries `aria-expanded`, `aria-haspopup` and `aria-controls`. |

---

## 4. Mock content clarity (demo readiness)

| ID | Check | Status | Evidence |
|----|--------|--------|----------|
| M1 | Home: stat cards show labeled mock metrics | Pass | Three cards: Total portfolio value $6,850,000 ("Mock value, not a real balance"), Holdings 4, Open deals 2 ("Active or under contract (mock count)"). Plus a portfolio summary and a 3-row recent-activity list. |
| M2 | Portfolio shows clear placeholder holdings | Pass | Table with Property, Type, Value: Riverfront Lofts (Multi-family) $2,000,000; Maple Court Apartments (Multi-family) $1,100,000; Cedar Commercial Center (Commercial) $1,950,000; Harbor Business Park (Commercial) $1,800,000. Labeled "Mock data: sample holdings, not real balances". |
| M3 | Deals shows open-deal placeholders | Pass | Two rows from the shared fixtures: "Riverfront Multi-Family — 24 Units" (Multi-family, Austin TX, Active, $4,250,000) and "Cedar Commercial Center — Under Contract" (Commercial, Houston TX, Under contract, $6,100,000). The draft and closed fixtures do not appear. The brief says "about 3 to 5" deals; only two investor-visible fixtures exist (see section 6, open items). |
| M4 | Profile shows member-style placeholder fields | Pass | Name "Alex Morgan (demo)", Email alex.morgan@example.com, Phone +1-555-0100, with the note "Demo details only, not a signed-in account". No inputs, forms or edit controls. |
| M5 | No raw "TODO" or empty broken panels | Pass | Page text on all four dashboard pages contains no TODO, lorem, "undefined" or "NaN"; every main region has content (129 to 729 characters). No JS or console errors during the whole walkthrough. |
| M6 | Every page shows a visible "Mock data" label | Pass | The "Mock data" badge is in the dashboard header on all four pages at both widths; each content block also carries its own mock/sample/demo note. |
| M7 | Mock numbers agree across pages | Pass (after fix) | Initially failed: see D2. After the fix, Overview open deals = 2 = Deals page rows; Overview total $6,850,000 = sum of the four Portfolio rows; summary breakdown (Multi-family $3,100,000, Commercial $3,750,000) = Portfolio rows by type. |

---

## 5. Out-of-scope boundaries (must stay deferred)

| ID | Check | Status | Evidence / reason |
|----|--------|--------|-------------------|
| O1 | No real authentication / login gate | Deferred | Shell only. The header user is a labeled demo placeholder; `src/lib/user.ts` `getUser()` still returns `null`. No login form found. |
| O2 | No live Supabase/PostgreSQL data | Deferred | All content comes from `src/mock/dashboard-data.ts` and `src/fixtures/`. No fetch, loader, or server function in the dashboard files. |
| O3 | No production deploy required | Deferred | Local build and local server are enough for this verification. |
| O4 | No payments, document vault, admin tools, or edit forms | Pass | `<main>` contains 0 input, textarea, select or form elements on all four pages. No extra dashboard pages exist (`/dashboard/activity` returns 404). |

---

## 5b. Brief success criteria cross-check (`docs/investor-dashboard-brief.md`)

| Brief criterion | Status | Evidence |
|---|---|---|
| `/dashboard` is titled "Overview" with stat cards, summary block, activity list | Pass | R1, M1 |
| Exactly four nav links, each loads its page | Pass | N1, N4 |
| Link for the current page is marked active | Pass | N2 |
| Each of the three other pages shows its own title | Pass | R2 to R4 |
| Same frame on every page | Pass | L1 |
| Every page shows a "Mock data" label | Pass | M6 |
| Deals shows only `active` and `under_contract` | Pass | M3 |
| At ~375px no sideways scroll, nav reachable | Pass | L2, L3, N5 |
| No login, payment, admin or edit screen | Pass | O1 to O4 |
| No other dashboard pages; `/` and `/about` work | Pass | R5, R7 |
| `npm run build` and `npm run typecheck` pass | Pass | Both run clean on the tested code. |

---

## 6. Defects found and resolution

| Defect | Severity (blocker / polish) | Resolution | Re-check |
|--------|----------------------------|------------|----------|
| D1. `PortfolioTable` on `main` still used a plain Tailwind scroll wrapper instead of the shared `dashboard-table-wrap`. PR #35 had been merged into the #34 branch after #34 merged, so its one-line change never reached `main`. | polish | One-line fix: `PortfolioTable` now uses `dashboard-table-wrap` (commit "fix(dashboard): apply the shared dashboard-table-wrap to PortfolioTable"). | Pass (L4): table scrolls inside the wrapper at 375px, page overflow 0. |
| D2. Mock content disagreed across pages: Overview said "Open deals: 3" but Deals lists 2; the Overview summary listed Retail and Industrial lines while the Portfolio table calls both holdings "Commercial" (the real `PropertyType` value); an activity row mentioned a "retail holding". | blocker for demo credibility, not for the brief | Overview open-deal count is now computed from `getMockDeals()`; summary shows Multi-family 45% and Commercial 55%; activity text says "a commercial holding" (commit "fix(dashboard): make Overview open-deal count, summary breakdown and activity text agree…"). | Pass (M1, M7). |
| D3. Menu button label wrapped to "Men / u" at 375px (button was `w-11`). | polish | Fixed earlier in PR #34 (`min-w-11 px-3`). | Pass (L2): button is about 66x44px, one line. |

### Open items (not fixed, not brief failures)

- **Two headers and a footer.** `__root.tsx` still renders the site header (brand "TanStack Start") and footer around the dashboard, so a viewer sees the starter site chrome above the PREIshare dashboard header. This was an open question in `docs/dashboard-routing-plan.md` and needs a product decision (keep, hide on `/dashboard/*`, or split layouts).
- **Skip link position.** The "Skip to main content" link is the 8th tab stop because it sits inside the dashboard shell, after the site header links.
- **Deals shows 2 rows, brief says about 3 to 5.** Only two sample listings are investor-visible. Adding more means extending the shared Sprint 2 fixtures, which carry their own validation, so it was left alone.
- **MobileNav does not trap focus** (already listed as a known limitation in `docs/responsive-qa-checklist.md`).
- **Stale doc lines.** `docs/stakeholder-handoff-dashboard.md` and `docs/responsive-qa-checklist.md` still say "Open deals" is a hard-coded 3; that is no longer true after D2. They were not edited here; step 13 should correct them.

---

## 7. Sign-off for handoff

- [x] All **blocker** fails fixed or explicitly accepted with reason (D2 fixed and re-checked)
- [x] Deferred items only cover agreed out-of-scope work (auth, live data, deploy)
- [ ] Shell is demoable against the PREIshare client story for Sprint 3, as confirmed by a person in a visible browser (not yet done)

**Overall result:** Ready for stakeholder handoff, subject to the director's own browser pass and a decision on the open items above (especially the two headers).

**Director sign-off:** __________________
