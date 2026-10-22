# PREIshare Investor Dashboard — Component Inventory

Furniture list for the investor dashboard shell: which pieces exist, which are shared chrome and which belong to one room (page). The floor plan is `docs/dashboard-ia.md`; the two files must stay consistent. Source: `docs/investor-dashboard-brief.md`.

## Scope

Reusable UI pieces for a responsive shell with **mock data only**. Components present structure and placeholder content. They do not call APIs, read the database, handle sign-in, or process payments.

Planned location: `src/components/dashboard/` (one file per component). The mock data module is `src/mock/dashboard-data.ts`. These paths are planning decisions, not requirements from the brief.

## Ownership rules (one owner per job)

| Job | Single owner |
|-----|--------------|
| Nav labels, URLs, and page titles | `navConfig` |
| Rendering the navigation links, active state, and the narrow-screen menu | `Sidebar` |
| Showing the current page title and the "Mock data" badge | `Header` |
| Arranging Sidebar, Header, and the main region | `AppShell` |
| Mock numbers and rows | `src/mock/dashboard-data.ts` |
| Choosing which listings count as open deals (`active`, `under_contract`) | `getMockDeals` in `src/mock/dashboard-data.ts` |

## Layout components (shared chrome)

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `AppShell` | Frame for every dashboard page: places `Sidebar`, `Header`, and the main content region (children) | `src/routes/dashboard.tsx`, wrapping all four pages | Render page widgets; define nav labels; fetch data |
| `Sidebar` | Render the four links from `navConfig`, mark the active one, and collapse to a menu or bar at narrow widths | `AppShell` | Define labels or paths; render page titles; contain deal, holding, or profile content |
| `Header` | Show the current page title (looked up in `navConfig` by URL) and the `Mock data` badge | `AppShell` | Render navigation links; define labels; fetch data |
| `navConfig` | Hold the single list of nav entries: label, path, and page title for Overview, Portfolio, Deals, Profile | `Sidebar`, `Header` | Render anything; import React components; hold page content |

Notes:

- The "Mock data" badge is part of `Header`, not a separate component. That gives every page the label from one place.
- Pages do not render their own `<h1>`. The page title comes from `Header`, so it cannot disagree with the nav.

## Overview widgets (`/dashboard`)

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `StatsCard` | Display one metric: a label, a value, and an optional hint | Overview (3 to 4 instances: total portfolio value, holdings count, open deals count) | Fetch data; compute totals; own page layout |
| `PortfolioSummary` | Show a short portfolio snapshot: total mock value and a breakdown by property type | Overview | Duplicate the holdings table; list individual holdings |
| `RecentActivity` | Show a list of 3 to 5 mock recent events (date and one-line description) | Overview | Link to new pages; own navigation; show deals or holdings as full rows |

## Page widgets (one room each)

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `PortfolioTable` | Show mock holdings in a table: property name, property type, value | Portfolio | Show summaries or stats cards; use live market data; add sorting, filtering, or edit actions |
| `DealsList` | Show mock open deals: title, property type, status, asking price | Deals | Decide which statuses count as open (it displays what it is given); offer subscribe, invest, or checkout actions |
| `ProfileCard` | Show the mock member's name, email, and phone placeholders, read-only | Profile | Edit, save, or submit anything; handle passwords or sign-in |

## Mock data (not a component)

`src/mock/dashboard-data.ts` exports constants and small helpers:

- Stats, portfolio summary, recent activity, holdings, and the profile are inline mock constants, typed with small mock-only types.
- `getMockDeals()` takes `sampleInvestorListings` from `src/fixtures/sample-investor-listings.ts`, keeps only listings whose status is `active` or `under_contract`, and returns them for `DealsList`. It reuses the existing `InvestorListing` type from `src/types/` and does not define a second listing shape.
- Every export is labeled mock in a comment or name so nobody mistakes it for real data.

## Composition rules

1. One job per component. If two rows describe the same job, merge or delete one.
2. Layout components wrap pages. Page widgets never re-implement the shell.
3. Pages pass mock data into widgets as props. Widgets do not import mock data themselves.
4. Navigation labels and paths live only in `navConfig`.
5. No component calls an API, imports a Supabase client, or renders a login, payment, or admin screen.
6. Names in this file are locked for later prompts. Do not rename a component without updating both docs.

## Mapping check (IA to components)

| Page (`docs/dashboard-ia.md`) | Rendered inside `AppShell` | Chrome used |
|-------------------------------|----------------------------|-------------|
| Overview `/dashboard` | `StatsCard` x3-4, `PortfolioSummary`, `RecentActivity` | `Sidebar`, `Header` |
| Portfolio `/dashboard/portfolio` | `PortfolioTable` | `Sidebar`, `Header` |
| Deals `/dashboard/deals` | `DealsList` | `Sidebar`, `Header` |
| Profile `/dashboard/profile` | `ProfileCard` | `Sidebar`, `Header` |

Check results:

- Every page has at least one page widget.
- Every widget is used by a page, and every layout component is used by `AppShell` or the parent route.
- No component is unused. `navConfig` is used by `Sidebar` and `Header`.
- No two components own the same job (see the ownership table).

## Acceptance checks from the brief and who satisfies them

| Brief check | Owner |
|-------------|-------|
| Four nav links, active one marked | `Sidebar` with `navConfig` |
| Visible page title on each page | `Header` with `navConfig` |
| Same frame on every page | `AppShell` |
| "Mock data" label on every page | `Header` |
| Only `active` and `under_contract` deals shown | `getMockDeals` |
| Works at about 375px with nav reachable | `Sidebar` and `AppShell` |
| No login, payment, or admin UI | Composition rule 5 |
