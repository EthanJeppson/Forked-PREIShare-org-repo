import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

type SidebarProps = {
  brandLabel?: string
  children?: ReactNode
}

/** Left navigation chrome for the investor dashboard shell. */
export function Sidebar({ brandLabel = 'PREIshare', children }: SidebarProps) {
  return (
    <aside
      aria-label="Investor navigation"
      className="w-44 shrink-0 border-r border-[var(--line)] p-4 sm:w-56"
    >
      <p className="island-kicker m-0 mb-4">{brandLabel}</p>
      <nav aria-label="Dashboard">
        <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm font-semibold">
          <li>
            <Link to="/dashboard">Home</Link>
          </li>
          <li>
            <Link to="/dashboard/portfolio">Portfolio</Link>
          </li>
          <li>
            <Link to="/dashboard/deals">Deals</Link>
          </li>
          <li>
            <Link to="/dashboard/profile">Profile</Link>
          </li>
        </ul>
        {children}
      </nav>
    </aside>
  )
}
