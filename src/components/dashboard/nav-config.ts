export type NavItem = {
  /** Link text shown in Sidebar and MobileNav. */
  label: string
  /** Dashboard path. Must match docs/dashboard-routing-plan.md. */
  to: string
  /** Title shown as the Header h1 while this page is open. */
  pageTitle: string
}

/**
 * The only place nav labels, paths, and page titles are defined.
 * Order is the order links appear in the menu.
 */
export const navConfig: ReadonlyArray<NavItem> = [
  { label: 'Overview', to: '/dashboard', pageTitle: 'Overview' },
  { label: 'Portfolio', to: '/dashboard/portfolio', pageTitle: 'Portfolio' },
  { label: 'Deals', to: '/dashboard/deals', pageTitle: 'Deals' },
  { label: 'Profile', to: '/dashboard/profile', pageTitle: 'Profile' },
]
