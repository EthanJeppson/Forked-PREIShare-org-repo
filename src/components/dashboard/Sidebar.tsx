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
    <aside className="hidden w-48 shrink-0 border-r border-[var(--line)] p-4 md:block lg:sticky lg:top-20 lg:w-60 lg:self-start">
      <nav aria-label="Dashboard">
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {items.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: true }}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-[var(--sea-ink-soft)] no-underline hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
                activeProps={{
                  className:
                    'block rounded-lg px-3 py-2 text-sm font-semibold no-underline bg-[var(--chip-bg)] text-[var(--sea-ink)] border border-[var(--chip-line)]',
                }}
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
