import type { ReactNode } from 'react'

type HeaderProps = {
  title?: string
  children?: ReactNode
}

/** Top bar: page title and an optional actions slot. */
export function Header({ title = 'Investor Dashboard', children }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3">
      <div className="min-w-0">
        <p className="island-kicker m-0">PREIshare</p>
        <h1 className="m-0 truncate text-lg font-semibold text-[var(--sea-ink)]">
          {title}
        </h1>
      </div>
      <div>{children}</div>
    </header>
  )
}
