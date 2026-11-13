export type HoldingSnapshot = {
  id: string
  name: string
  allocationLabel: string
  valueLabel: string
}

export type PortfolioSummaryProps = {
  title?: string
  totalLabel: string
  holdings?: ReadonlyArray<HoldingSnapshot>
  isSampleData?: boolean
}

export const MOCK_HOLDINGS: ReadonlyArray<HoldingSnapshot> = [
  {
    id: 'h1',
    name: 'Sample Multifamily Fund A',
    allocationLabel: '40%',
    valueLabel: '$120,000',
  },
  {
    id: 'h2',
    name: 'Sample Industrial Note B',
    allocationLabel: '35%',
    valueLabel: '$105,000',
  },
  {
    id: 'h3',
    name: 'Sample Cash Reserve',
    allocationLabel: '25%',
    valueLabel: '$75,000',
  },
]

/** Compact portfolio snapshot. Presentational only: no data fetching. */
export function PortfolioSummary({
  title = 'Portfolio summary',
  totalLabel,
  holdings = MOCK_HOLDINGS,
  isSampleData = true,
}: PortfolioSummaryProps) {
  return (
    <section
      aria-labelledby="portfolio-summary-heading"
      className="island-shell rounded-2xl p-4 sm:p-5"
    >
      <h2
        id="portfolio-summary-heading"
        className="m-0 text-xl font-semibold text-[var(--sea-ink)]"
      >
        {title}
      </h2>
      {isSampleData ? (
        <p
          role="note"
          className="m-0 mt-1 text-xs font-semibold text-[var(--sea-ink-soft)]"
        >
          Sample data: placeholders only, not live balances
        </p>
      ) : null}
      <p className="m-0 mt-3 flex items-baseline justify-between gap-3">
        <span className="island-kicker">Total (sample)</span>
        <span className="text-xl font-semibold text-[var(--sea-ink)]">
          {totalLabel}
        </span>
      </p>
      <ul className="m-0 mt-3 list-none divide-y divide-[var(--line)] p-0">
        {holdings.map((item) => (
          <li
            key={item.id}
            className="flex items-baseline justify-between gap-3 py-2 text-sm first:pt-0 last:pb-0"
          >
            <span className="min-w-0 text-[var(--sea-ink)]">{item.name}</span>
            <span className="shrink-0 text-[var(--sea-ink-soft)]">
              {item.allocationLabel} · {item.valueLabel}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
