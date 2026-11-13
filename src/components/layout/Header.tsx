import type { ReactNode } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { getPageTitle } from './navConfig'

type HeaderProps = {
  /** Overrides the title taken from navConfig for the current route. */
  title?: string | undefined
  children?: ReactNode
}

/** Top bar: page title and an optional actions slot. */
export function Header({ title, children }: HeaderProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  return (
    <header className="flex items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3">
      <div className="min-w-0">
        <p className="island-kicker m-0">PREIshare</p>
        <h1 className="m-0 truncate text-lg font-semibold text-[var(--sea-ink)]">
          {title ?? getPageTitle(pathname)}
        </h1>
      </div>
      <div>{children}</div>
    </header>
  )
}
