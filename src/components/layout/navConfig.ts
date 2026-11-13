export type NavItemConfig = {
  label: string
  path: string
  title: string
}

/** Single source of truth for investor-facing nav labels, paths, and page titles. */
export const dashboardNavItems: ReadonlyArray<NavItemConfig> = [
  { label: 'Home', path: '/dashboard', title: 'Dashboard overview' },
  { label: 'Portfolio', path: '/dashboard/portfolio', title: 'Your portfolio' },
  { label: 'Deals', path: '/dashboard/deals', title: 'Open deals' },
  { label: 'Profile', path: '/dashboard/profile', title: 'Your profile' },
]

function trimTrailingSlash(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

/** Home matches only the exact dashboard index; other items also match nested paths. */
export function isNavItemActive(item: NavItemConfig, pathname: string): boolean {
  const current = trimTrailingSlash(pathname)
  if (item.path === '/dashboard') return current === '/dashboard'
  return current === item.path || current.startsWith(`${item.path}/`)
}

export function getPageTitle(pathname: string): string {
  const match = dashboardNavItems.find((item) => isNavItemActive(item, pathname))
  return match?.title ?? 'Dashboard'
}
