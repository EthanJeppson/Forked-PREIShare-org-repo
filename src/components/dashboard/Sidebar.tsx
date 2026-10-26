import { Link } from '@tanstack/react-router'
import type { NavItem } from './nav-config'

export type SidebarProps = {
  /** Links to show, from navConfig. */
  items: ReadonlyArray<NavItem>
}

/**
 * Vertical navigation for tablet and desktop. Hidden below 768px, where
 * MobileNav takes over. It owns no labels or paths.
 */
export function Sidebar({ items }: SidebarProps) {
  return (
    <aside className="hidden w-48 shrink-0 border-r border-[var(--line)] p-4 md:block lg:w-60">
      <nav aria-label="Dashboard" className="lg:sticky lg:top-20">
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {items.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: true }}
                className="flex min-h-11 items-center rounded-lg border px-3 text-sm font-semibold no-underline"
                activeProps={{ className: 'border-[var(--chip-line)] bg-[var(--chip-bg)] text-[var(--sea-ink)]' }}
                inactiveProps={{ className: 'border-transparent text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]' }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
