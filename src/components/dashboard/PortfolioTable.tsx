import { formatCurrency, formatPropertyType } from '../../lib/format'
import type { MockHolding } from '../../mock/dashboard-data'

export type PortfolioTableProps = {
  holdings: ReadonlyArray<MockHolding>
  /** Shown instead of the table when holdings is empty. */
  emptyMessage: string
}

/**
 * Mock holdings table: property, type, and value. Presentational only. The
 * Portfolio page passes the rows in. No sorting, filtering, or editing.
 */
export function PortfolioTable({ holdings, emptyMessage }: PortfolioTableProps) {
  return (
    <section
      aria-labelledby="portfolio-holdings-heading"
      className="island-shell rounded-2xl p-4 sm:p-5"
    >
      <h2
        id="portfolio-holdings-heading"
        className="m-0 text-xl font-semibold text-[var(--sea-ink)]"
      >
        Your holdings
      </h2>
      <p className="m-0 mt-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
        Mock data: sample holdings, not real balances
      </p>
      {holdings.length === 0 ? (
        <p className="m-0 mt-3 text-sm text-[var(--sea-ink-soft)]">
          {emptyMessage}
        </p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--sea-ink-soft)]">
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Property
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Type
                </th>
                <th scope="col" className="py-2 text-right font-semibold">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[var(--line)] last:border-b-0"
                >
                  <th
                    scope="row"
                    className="py-3 pr-3 font-semibold text-[var(--sea-ink)]"
                  >
                    {row.propertyName}
                  </th>
                  <td className="py-3 pr-3 text-[var(--sea-ink-soft)]">
                    {formatPropertyType(row.propertyType)}
                  </td>
                  <td className="py-3 text-right text-[var(--sea-ink)]">
                    {formatCurrency(row.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
