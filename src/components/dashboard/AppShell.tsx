import type { ReactNode } from 'react'
import { Header } from './Header'

export type AppShellProps = {
  /** The current dashboard page. Rendered in the main content region. */
  children: ReactNode
  /** Title shown in the Header. Temporary until nav labels come from navConfig. */
  pageTitle?: string
}

/**
 * Shared frame for every /dashboard page: Header on top, a reserved sidebar
 * region, and the main content slot. It renders no page widgets.
 */
export function AppShell({ children, pageTitle = 'Overview' }: AppShellProps) {
  return (
    <div className="page-wrap px-4 py-6">
      <div className="island-shell overflow-hidden rounded-2xl">
        <Header pageTitle={pageTitle} />
        <div className="flex min-h-[60vh]">
          {/* Reserved for the Sidebar (next step). Hidden below 768px, where MobileNav takes over. */}
          <aside
            aria-label="Dashboard navigation"
            className="hidden w-48 shrink-0 border-r border-[var(--line)] p-4 md:block lg:w-60"
          >
            <p className="m-0 text-sm text-[var(--sea-ink-soft)]">
              Navigation coming soon
            </p>
          </aside>
          <main id="main-content" className="min-w-0 flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
