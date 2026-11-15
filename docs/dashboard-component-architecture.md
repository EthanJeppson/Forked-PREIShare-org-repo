# PREIshare Dashboard — Component Architecture & Responsive Layout Map

## Purpose

Blueprint for the investor dashboard **shell** only. Implementation steps must follow the names, regions, props, and responsive rules in this file. It contains no React code. Everything shown is placeholder (mock) content: there is no real portfolio data, no sign-in, and no backend.

If this file and an earlier doc disagree on a component name or job, this file wins. `docs/component-plan.md` has been updated to match it.

## Sources

- `docs/investor-dashboard-brief.md`: the requirements brief. The lesson calls it `docs/preishare-dashboard-requirements.md`, but no file with that name exists in this repo.
- `docs/dashboard-routing-plan.md`: the URLs and route files. Nav labels and paths below must match it exactly.
- Supporting: `docs/dashboard-ia.md` (page purposes) and `docs/component-plan.md` (per-component must-NOT-do rules).

## Navigation destinations (from the routing plan)

| Label | Path |
| --- | --- |
| Overview | `/dashboard` |
| Portfolio | `/dashboard/portfolio` |
| Deals | `/dashboard/deals` |
| Profile | `/dashboard/profile` |

These four are the only destinations. There is no activity page. Both Sidebar and MobileNav show exactly these four, from one shared list (see `navConfig` below).

## Layout regions

| Region | Role | Components |
| --- | --- | --- |
| Header | Top bar: PREIshare name, current page title, "Mock data" badge, and the menu button on small screens | `Header` |
| Sidebar | Vertical navigation on tablet and desktop | `Sidebar` |
| Mobile nav | Slide-over or drawer navigation on small screens | `MobileNav` |
| Main | Scrollable area where the active page's content appears | The route's `<Outlet />`, filled by page widgets |

`AppShell` is the frame. It places Header, Sidebar, MobileNav, and the main region together, and it is rendered by the layout route `src/routes/dashboard/route.tsx`.

Region picture in words:

- **Desktop and tablet:** Header across the top; Sidebar down the left; Main to the right of the Sidebar, below the Header.
- **Mobile:** Header across the top with a menu button; Main fills the rest. MobileNav is hidden until the menu button is pressed.

## Component inventory

### AppShell

- **Responsibility:** Arrange the dashboard frame and own the state of whether MobileNav is open. Pick the page title for the current URL from `navConfig`.
- **Parent:** The dashboard layout route (`src/routes/dashboard/route.tsx`).
- **Children:** Header, Sidebar, MobileNav, and the main content slot.
- **Props (beginner):**
  - `children`: the page content to show in main.
- **Does not:** render page widgets, hold mock data, or define nav labels.

### Header

- **Responsibility:** Show the product name, the current page title, and a visible "Mock data" badge. On small screens, show the menu button.
- **Parent:** AppShell.
- **Children:** None required.
- **Props:**
  - `pageTitle`: text, the title of the current page.
  - `onMenuClick`: an action to run when the menu button is pressed (it only reports the press; AppShell decides what to do).
- **Does not:** render navigation links, decide the page title, or own the open/closed state.

### Sidebar

- **Responsibility:** Vertical navigation on tablet and desktop. Show the four links and mark the current one.
- **Parent:** AppShell.
- **Children:** The nav links (plain `Link` elements are enough).
- **Props:**
  - `items`: list of items, each with `label` (text) and `to` (text, the path).
- **Does not:** define labels or paths, show on mobile, or contain page content.

### MobileNav

- **Responsibility:** Small-screen navigation: a panel that opens from the menu button and lists the same four destinations as Sidebar.
- **Parent:** AppShell.
- **Children:** The nav links.
- **Props:**
  - `items`: list of items, each with `label` and `to` (same shape as Sidebar).
  - `open`: yes/no, whether the panel is showing. The state lives in AppShell, not here.
  - `onClose`: an action to run when the panel should close (after choosing a link, pressing a close control, or tapping outside the panel).
- **Does not:** own the open/closed state, define labels or paths, or show on tablet and desktop.

### MetricCard

- **Responsibility:** One reusable metric tile.
- **Parent:** The Overview page (`src/routes/dashboard/index.tsx`), in a row or grid.
- **Children:** None.
- **Props:**
  - `label`: text, for example "Total portfolio value".
  - `value`: text, already formatted by the caller. The card never hard-codes an amount.
  - `hint`: text, optional.
- **Does not:** fetch data, compute totals, or own page layout.

### PortfolioSummary

- **Responsibility:** A short snapshot block of the (mock) portfolio.
- **Parent:** The Overview page.
- **Children:** None required.
- **Props:**
  - `headline`: text.
  - `summaryLines`: list of text lines, for example a breakdown by property type.
  - `emptyMessage`: text, shown when `summaryLines` is empty.
- **Does not:** replace the holdings table on the Portfolio page, or list individual holdings.

### RecentActivity

- **Responsibility:** A list of recent (mock) activity entries.
- **Parent:** The Overview page.
- **Children:** None required.
- **Props:**
  - `items`: list of items, each with `id` (text), `title` (text), `detail` (text), and `timestamp` (text).
  - `emptyMessage`: text, shown when `items` is empty.
- **Does not:** link to new pages, own navigation, or show full holdings or deals.

### Supporting pieces (already in `docs/component-plan.md`)

These are not in the seven-component core list, but the other pages in the routing plan need them. They are kept to the minimum and are not expanded here.

| Piece | Job | Used on |
| --- | --- | --- |
| `navConfig` | The single list of nav entries (label, path, page title). AppShell reads it and passes `items` to Sidebar and MobileNav. | AppShell |
| `PortfolioTable` | Mock holdings table | Portfolio page |
| `DealsList` | Mock open deals list | Deals page |
| `ProfileCard` | Read-only mock member card | Profile page |

## Composition: dashboard home (Overview)

Inside Main on `/dashboard`, in this order:

1. A row or grid of three or four `MetricCard` tiles (for example total portfolio value, number of holdings, number of open deals). The values come from mock constants passed in by the page.
2. One `PortfolioSummary`.
3. One `RecentActivity` list.

Empty states: `PortfolioSummary` and `RecentActivity` each take an `emptyMessage`, so they show a clear message instead of a blank box when given no data. `MetricCard` has no empty state because the page always passes a `value` (use a dash if a number is missing).

## Responsive behavior

| Viewport | Approx width | Navigation | Main content |
| --- | --- | --- | --- |
| Mobile | under 768px | Sidebar hidden. The Header shows a menu button that opens MobileNav. | Single column; cards stack. |
| Tablet | 768px to 1024px | Sidebar visible and narrower than on desktop. It does not collapse. MobileNav and the menu button are hidden. | Two-column card grid when space allows. |
| Desktop | over 1024px | Sidebar visible at full width and fixed in place while Main scrolls. | Cards in a multi-column grid; summary and activity side by side or stacked, with a readable maximum width. |

One-sentence summary:

- **Phone:** you tap the menu button in the Header to open MobileNav, and choosing a link closes it.
- **Desktop:** the Sidebar is always on screen, so there is nothing to open.

Rules for implementers:

- At about 375px, no page scrolls sideways, no text overlaps, and all four destinations are reachable.
- The menu button must be easy to tap (at least about 44px square).
- Main must stay scrollable, and the Header must not crowd out content.
- Nothing required on mobile may depend on hover.
- The "Mock data" badge stays visible on every width.

## Ownership summary

| Job | Single owner |
| --- | --- |
| Nav labels, paths, and page titles | `navConfig` |
| Open/closed state of MobileNav | `AppShell` |
| Picking the title for the current URL | `AppShell` |
| Showing the page title and "Mock data" badge | `Header` |
| Menu button | `Header` (it only reports presses) |
| Wide-screen navigation links | `Sidebar` |
| Small-screen navigation links | `MobileNav` |
| Metric tile appearance | `MetricCard` |

## File targets (for later steps; do not create them in this step)

- `src/components/dashboard/AppShell.tsx`
- `src/components/dashboard/Header.tsx`
- `src/components/dashboard/Sidebar.tsx`
- `src/components/dashboard/MobileNav.tsx`
- `src/components/dashboard/MetricCard.tsx`
- `src/components/dashboard/PortfolioSummary.tsx`
- `src/components/dashboard/RecentActivity.tsx`
- `src/components/dashboard/nav-config.ts` (the `navConfig` list)
- Mock data module: `src/mock/dashboard-data.ts`

The Portfolio, Deals, and Profile widgets (`PortfolioTable`, `DealsList`, `ProfileCard`) get their own files in the same folder when their pages are built.

## Out of scope (prevent scope creep)

- Real sign-in, sessions, route guards, or any authentication
- Live Supabase or PostgreSQL data; all content is mock constants
- Extra routes beyond the four in `docs/dashboard-routing-plan.md`, including an activity page
- Charts libraries, map views, PDF export, notifications
- Editing holdings, editing the profile, or any form
- Design-system package extraction, animation-heavy UI, a settings panel, or a theme editor (the existing site theme toggle may stay)
- Any new component not listed above, unless a requirement in the brief needs it

## Open points

- `__root.tsx` currently renders the site Header and Footer on every page. Whether the dashboard hides them is an open question in `docs/dashboard-routing-plan.md`. The dashboard `Header` in this file is a different component from the site `src/components/Header.tsx`, so decide how to keep the names from clashing (the dashboard one lives in `src/components/dashboard/`).
- Whether tablet should one day get a collapsible sidebar is not decided. This plan picks "narrower, always visible" and sticks to it.

## Success criteria for this blueprint

- Every named component has one clear responsibility and a place in the tree.
- Props are listed in plain language, and no prop carries hard-coded investor data.
- Mobile, tablet, and desktop navigation behavior are each explicit.
- The home composition matches the Overview needs in the brief.
- Nav destinations match `docs/dashboard-routing-plan.md` exactly.
- The out-of-scope list blocks auth, live data, extra routes, and heavy extras.
