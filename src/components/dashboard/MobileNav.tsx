import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import type { NavItem } from './nav-config'

export type MobileNavProps = {
  /** Links to show, from navConfig. Same list Sidebar gets. */
  items: ReadonlyArray<NavItem>
  /** Whether the panel is showing. The state lives in AppShell. */
  open: boolean
  /** Called when the panel should close. */
  onClose: () => void
}

/**
 * Small-screen navigation panel, opened by the Header menu button.
 * Hidden at 768px and wider. It owns no open/closed state.
 */
export function MobileNav({ items, open, onClose }: MobileNavProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement
    closeButtonRef.current?.focus()
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default border-0 bg-black/40 p-0"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard navigation menu"
        className="relative flex h-full w-72 max-w-[85vw] flex-col gap-4 border-r border-[var(--line)] bg-[var(--surface-strong)] p-4 shadow-xl"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="island-kicker m-0">PREIshare</p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-4 text-sm font-semibold text-[var(--sea-ink)]"
          >
            Close menu
          </button>
        </div>
        <nav aria-label="Dashboard">
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: true }}
                  onClick={onClose}
                  className="flex min-h-11 items-center rounded-lg px-3 text-base font-semibold no-underline"
                  activeProps={{ className: 'bg-[var(--chip-bg)] text-[var(--sea-ink)] border border-[var(--chip-line)]' }}
                  inactiveProps={{ className: 'text-[var(--sea-ink-soft)] hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]' }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
