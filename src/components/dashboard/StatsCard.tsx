import type { ReactNode } from 'react'

export type StatsCardProps = {
  /** Short metric name, for example "Total portfolio value". */
  label: string
  /** Already-formatted value. The card never computes or hard-codes an amount. */
  value: string
  /** Optional quieter line under the value, for example "Sample total". */
  hint?: string
  /** Optional icon or badge slot for later polish. */
  icon?: ReactNode
}

/** Reusable, prop-driven metric tile for the investor dashboard home. */
export function StatsCard({ label, value, hint, icon }: StatsCardProps) {
  return (
    <article
      aria-label={label}
      className="island-shell rounded-2xl p-4 sm:p-5"
    >
      <header className="flex items-start justify-between gap-2">
        <p className="island-kicker m-0">{label}</p>
        {icon ? <span aria-hidden="true">{icon}</span> : null}
      </header>
      <p className="m-0 mt-2 break-words text-2xl font-semibold text-[var(--sea-ink)]">
        {value}
      </p>
      {hint ? (
        <p className="m-0 mt-1 text-sm text-[var(--sea-ink-soft)]">{hint}</p>
      ) : null}
    </article>
  )
}
