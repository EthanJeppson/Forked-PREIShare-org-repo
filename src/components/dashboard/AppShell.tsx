import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'
import { navConfig } from './nav-config'

export type AppShellProps = {
  /** The current dashboard page. Rendered in the main content region. */
  children: ReactNode
}

/**
 * Shared frame for every /dashboard page: Header on top, Sidebar (tablet and
 * desktop), MobileNav (small screens), and the main content slot. It owns the
 * MobileNav open state and picks the page title from navConfig. It renders no
 * page widgets.
 */
export function AppShell({ children }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const openMobileNav = useCallback(() => setMobileNavOpen(true), [])
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), [])

  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const currentPath =
    pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const pageTitle =
    navConfig.find((item) => item.to === currentPath)?.pageTitle ?? 'Dashboard'

  return (
    <div className="page-wrap px-4 py-6">
      <div className="island-shell overflow-clip rounded-2xl">
        <Header pageTitle={pageTitle} onMenuClick={openMobileNav} />
        <div className="flex min-h-[60vh]">
          <Sidebar items={navConfig} />
          <main id="main-content" className="min-w-0 flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
      <MobileNav
        items={navConfig}
        open={mobileNavOpen}
        onClose={closeMobileNav}
      />
    </div>
  )
}
