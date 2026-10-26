export type PortfolioSummaryProps = {
  /** Already-formatted headline, for example "Total mock value: $4,200,000". */
  headline: string
  /** One short line per breakdown row, for example "Multifamily: 45%". */
  summaryLines: ReadonlyArray<string>
  /** Shown instead of the list when summaryLines is empty. */
  emptyMessage: string
}

/**
 * Short portfolio snapshot. It shows a headline and a breakdown, not
 * individual holdings (that is the Portfolio page's table). Presentational
 * only: the Overview page passes everything in.
 */
export function PortfolioSummary({
  headline,
  summaryLines,
  emptyMessage,
}: PortfolioSummaryProps) {
  return (
    <section
      aria-label="Portfolio summary"
      className="island-shell rounded-2xl p-4 sm:p-5"
    >
      <p className="island-kicker m-0">Portfolio summary</p>
      <h2 className="m-0 mt-2 break-words text-xl font-semibold text-[var(--sea-ink)]">
        {headline}
      </h2>
      {summaryLines.length === 0 ? (
        <p className="m-0 mt-3 text-sm text-[var(--sea-ink-soft)]">
          {emptyMessage}
        </p>
      ) : (
        <ul className="m-0 mt-3 list-none divide-y divide-[var(--line)] p-0">
          {summaryLines.map((line) => (
            <li
              key={line}
              className="py-2 text-sm text-[var(--sea-ink-soft)] first:pt-0 last:pb-0"
            >
              {line}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
