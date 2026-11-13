import type { ReactNode } from 'react'
import { NavItems } from './NavItems'

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
      <NavItems />
      {children}
    </aside>
  )
}
