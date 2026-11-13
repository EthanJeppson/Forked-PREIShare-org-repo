import type { ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

type AppShellProps = {
  title?: string
  children: ReactNode
}

/**
 * Shared investor chrome: sidebar, header, and a main region.
 * Child routes render inside `children`.
 */
export function AppShell({
  title = 'Investor Dashboard',
  children,
}: AppShellProps) {
  return (
    <div className="page-wrap py-4 sm:px-4 sm:py-6">
      <div className="island-shell flex min-h-[60vh] overflow-clip rounded-2xl">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header title={title} />
          <main id="main-content" className="min-w-0 flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
