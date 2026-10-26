export type MetricCardProps = {
  /** Short name of the metric, for example "Total portfolio value". */
  label: string
  /** Already-formatted value. The card never computes or hard-codes an amount. */
  value: string
  /** Optional quieter line under the value. */
  hint?: string
}

/**
 * One metric tile. Presentational only: the Overview page passes the label and
 * the formatted value in. Layout (grid, columns) is the parent's job.
 */
export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div className="island-shell rounded-2xl p-4 sm:p-5">
      <p className="island-kicker m-0">{label}</p>
      <p className="m-0 mt-2 break-words text-2xl font-semibold text-[var(--sea-ink)]">
        {value}
      </p>
      {hint ? (
        <p className="m-0 mt-1 text-sm text-[var(--sea-ink-soft)]">{hint}</p>
      ) : null}
    </div>
  )
}
