import { Link, useRouterState } from '@tanstack/react-router'
import { dashboardNavItems, isNavItemActive } from './navConfig'

/** Renders the dashboard links from navConfig and marks the active one. */
export function NavItems() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <nav aria-label="Dashboard">
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {dashboardNavItems.map((item) => {
          const isActive = isNavItemActive(item, pathname)
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                activeOptions={{ exact: item.path === '/dashboard' }}
                aria-current={isActive ? 'page' : undefined}
                className={
                  isActive
                    ? 'flex min-h-11 items-center rounded-lg border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 text-sm font-semibold text-[var(--sea-ink)] no-underline'
                    : 'flex min-h-11 items-center rounded-lg border border-transparent px-3 text-sm font-semibold text-[var(--sea-ink-soft)] no-underline hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]'
                }
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
