# PREIshare Investor Dashboard — Component Inventory

Furniture list for the investor dashboard shell (names and props are locked by `docs/dashboard-component-architecture.md`, which wins if the two disagree): which pieces exist, which are shared chrome and which belong to one room (page). The floor plan is `docs/dashboard-ia.md`; the two files must stay consistent. Source: `docs/investor-dashboard-brief.md`.

## Scope

Reusable UI pieces for a responsive shell with **mock data only**. Components present structure and placeholder content. They do not call APIs, read the database, handle sign-in, or process payments.

Planned location: `src/components/dashboard/` (one file per component). The mock data module is `src/mock/dashboard-data.ts`. These paths are planning decisions, not requirements from the brief.

## Ownership rules (one owner per job)

| Job | Single owner |
|-----|--------------|
| Nav labels, URLs, and page titles | `navConfig` |
| Rendering the navigation links and active state on tablet and desktop | `Sidebar` |
| Rendering the navigation links on small screens (the slide-over panel) | `MobileNav` |
| Whether the `MobileNav` panel is open | `AppShell` |
| Picking the page title for the current URL | `AppShell` (from `navConfig`) |
| Showing the page title, the "Mock data" badge, and the menu button (which only reports presses) | `Header` |
| Arranging Sidebar, MobileNav, Header, and the main region | `AppShell` |
| Mock numbers and rows | `src/mock/dashboard-data.ts` |
| Choosing which listings count as open deals (`active`, `under_contract`) | `getMockDeals` in `src/mock/dashboard-data.ts` |

## Layout components (shared chrome)

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `AppShell` | Frame for every dashboard page: places `Header`, `Sidebar`, `MobileNav`, and the main content region (children); owns the `MobileNav` open state and picks the page title | `src/routes/dashboard/route.tsx`, wrapping all four pages | Render page widgets; define nav labels; fetch data |
| `Sidebar` | Render the four links from the `items` it is given and mark the active one; shown on tablet and desktop only | `AppShell` | Define labels or paths; show on mobile; render page titles; contain deal, holding, or profile content |
| `MobileNav` | Render the same four links in a slide-over panel on small screens, controlled by `open` and `onClose` from `AppShell` | `AppShell` | Own the open state; define labels or paths; show on tablet or desktop |
| `Header` | Show the product name, the `pageTitle` it is given, the "Mock data" badge, and the menu button on small screens | `AppShell` | Render navigation links; decide the page title; own the open state; fetch data |
| `navConfig` | Hold the single list of nav entries: label, path, and page title for Overview, Portfolio, Deals, Profile | `AppShell` (which passes `items` to `Sidebar` and `MobileNav`) | Render anything; import React components; hold page content |

Notes:

- The "Mock data" badge is part of `Header`, not a separate component. That gives every page the label from one place.
- Pages do not render their own `<h1>`. `AppShell` picks the title from `navConfig` and passes it to `Header`, so it cannot disagree with the nav.

## Overview widgets (`/dashboard`)

| Component | Responsibility | Used on | Must NOT do |
|-----------|----------------|---------|-------------|
| `MetricCard` | Display one metric: a label, a value, and an optional hint | Overview (3 to 4 instances: total portfolio value, holdings count, open deals count) | Fetch data; compute totals; own page layout |
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
| Overview `/dashboard` | `MetricCard` x3-4, `PortfolioSummary`, `RecentActivity` | `Header`, `Sidebar`, `MobileNav` |
| Portfolio `/dashboard/portfolio` | `PortfolioTable` | `Header`, `Sidebar`, `MobileNav` |
| Deals `/dashboard/deals` | `DealsList` | `Header`, `Sidebar`, `MobileNav` |
| Profile `/dashboard/profile` | `ProfileCard` | `Header`, `Sidebar`, `MobileNav` |

Check results:

- Every page has at least one page widget.
- Every widget is used by a page, and every layout component is used by `AppShell` or the parent route.
- No component is unused. `navConfig` is used by `AppShell`.
- No two components own the same job (see the ownership table).

## Acceptance checks from the brief and who satisfies them

| Brief check | Owner |
|-------------|-------|
| Four nav links, active one marked | `Sidebar` and `MobileNav`, fed by `navConfig` through `AppShell` |
| Visible page title on each page | `Header`, with the title picked by `AppShell` from `navConfig` |
| Same frame on every page | `AppShell` |
| "Mock data" label on every page | `Header` |
| Only `active` and `under_contract` deals shown | `getMockDeals` |
| Works at about 375px with nav reachable | `MobileNav`, `Header` (menu button), and `AppShell` |
| No login, payment, or admin UI | Composition rule 5 |

