export type HeaderProps = {
  /** Title of the current dashboard page, shown next to the brand. */
  pageTitle: string
  /** Called when the small-screen menu button is pressed. The button is hidden when this is not passed. */
  onMenuClick?: () => void
}

/**
 * Top chrome for the PREIshare investor dashboard: brand, page title,
 * a "Mock data" badge, and a demo user placeholder. It holds no session or
 * auth state and renders no navigation links.
 */
export function Header({ pageTitle, onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        {onMenuClick ? (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] text-[var(--sea-ink)] md:hidden"
          >
            <span aria-hidden="true">Menu</span>
          </button>
        ) : null}
        <div className="min-w-0">
          <p className="island-kicker m-0">PREIshare</p>
          <h1 className="m-0 truncate text-lg font-semibold text-[var(--sea-ink)]">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
          Mock data
        </span>
        <div
          aria-label="Demo user placeholder. Not a signed-in account."
          className="flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] py-1 pl-1 pr-3"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--sand)] text-xs font-semibold text-[var(--sea-ink)]"
          >
            IN
          </span>
          <span className="hidden text-sm text-[var(--sea-ink-soft)] sm:inline">
            Investor (demo)
          </span>
        </div>
      </div>
    </header>
  )
}
