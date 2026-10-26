# PREIshare Investor Dashboard — Information Architecture

Floor plan for the investor dashboard shell: which pages exist, their URLs, and how an investor walks between them. Source: `docs/investor-dashboard-brief.md`. The furniture list is `docs/component-plan.md`; the two files must stay consistent.

## Purpose

Map of investor-facing pages for a **shell-only sprint with mock data**. No sign-in, no live Supabase or database queries, no payments, and no admin tools are planned or built from this file.

## URL map and page purposes

| URL path | Route name | Nav label | Page title | Page purpose | Primary content |
|----------|------------|-----------|------------|--------------|-----------------|
| `/dashboard` | Dashboard home | Overview | Overview | Let the investor scan portfolio value and recent activity in one glance | Stats row (3 to 4 cards), portfolio summary block, recent-activity list (3 to 5 mock rows) |
| `/dashboard/portfolio` | Portfolio | Portfolio | Portfolio | Let the investor review every holding in one table | Holdings table (3 to 5 mock rows: property name, property type, value) |
| `/dashboard/deals` | Deals | Deals | Deals | Let the investor see which deals are open | List of 3 to 5 mock deals (title, property type, status, asking price); only `active` and `under_contract` |
| `/dashboard/profile` | Profile | Profile | Profile | Let the investor see who they are in PREIshare | Read-only profile card (name, email, phone placeholders) |

Rules for this table:

- Exactly four pages. Each URL is unique and nested under `/dashboard`.
- Nav label and page title are the same word. They are defined once, in the nav config described in `docs/component-plan.md`, and nowhere else.
- Nav labels are one word on purpose. The brief calls the first page "Overview", so the nav label is "Overview", not "Home". Do not rename it in only one of the docs.
- No page exists for settings, notifications, login, or admin.

## Navigation rules

- **Shared chrome** on every `/dashboard/*` page: a navigation region (sidebar on desktop), a header, and a main content region. Only the main content region changes between pages.
- **Four nav links, in this order:** Overview, Portfolio, Deals, Profile. No other links in the dashboard nav.
- **Active state:** the link for the current URL is visibly marked. `/dashboard` matches only the exact path, so Overview is not highlighted on the other three pages.
- **Narrow screens (about 375px):** the same four links stay reachable. A menu button in the header opens a mobile navigation panel with the same four links. There is no sideways scroll.
- **Mock labeling:** every page shows a visible "Mock data" badge in the header region.
- **Leaving the dashboard:** `/` and `/about` stay as they are. Whether `/` links to `/dashboard` is an open question (see brief).

## Page-to-component mapping (summary)

Details and boundaries live in `docs/component-plan.md`.

| Page | Page widgets rendered in the main region |
|------|-------------------------------------------|
| Overview | `MetricCard` (3 to 4), `PortfolioSummary`, `RecentActivity` |
| Portfolio | `PortfolioTable` |
| Deals | `DealsList` |
| Profile | `ProfileCard` |

## Brief goals covered

| Investor goal (from the brief) | Covered by |
|--------------------------------|------------|
| See a home overview with a portfolio snapshot and recent activity | `/dashboard` |
| Reach Portfolio, Deals, and Profile without typing a URL | The four-link navigation on every page |
| Tell open deals apart at a glance | `/dashboard/deals` |
| Check who they are in PREIshare | `/dashboard/profile` |
| Know which numbers are mock | "Mock data" badge on every page |

## Out of scope for this shell

- Sign-in, sign-up, sessions, roles
- Live Supabase or PostgreSQL queries
- Admin, listing-editor, or sponsor tools
- Payments, funding or withdrawals, document vaults, e-signing
- Profile editing, forms, search, filters, notifications

## Notes for later route files

TanStack Start file routes in `src/routes/` (do not hand-edit `src/routeTree.gen.ts`). The exact file map lives in `docs/dashboard-routing-plan.md`; the folder form below is the one to follow.

| File | URL | Role |
|------|-----|------|
| `src/routes/dashboard/route.tsx` | `/dashboard` (layout) | Parent layout. Renders `AppShell` around an `<Outlet />`. |
| `src/routes/dashboard/index.tsx` | `/dashboard` | Overview page |
| `src/routes/dashboard/portfolio.tsx` | `/dashboard/portfolio` | Portfolio page |
| `src/routes/dashboard/deals.tsx` | `/dashboard/deals` | Deals page |
| `src/routes/dashboard/profile.tsx` | `/dashboard/profile` | Profile page |
