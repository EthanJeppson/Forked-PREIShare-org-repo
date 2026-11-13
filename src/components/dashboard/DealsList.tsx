import {
  formatCurrency,
  formatListingStatus,
  formatPropertyType,
} from '../../lib/format'
import type { InvestorListing } from '../../types'

export type DealsListProps = {
  /** Listings to show. The caller decides which statuses count as open. */
  deals: ReadonlyArray<InvestorListing>
  /** Shown instead of the list when deals is empty. */
  emptyMessage: string
}

/**
 * Mock open deals: title, location, property type, status, asking price.
 * Presentational only: no invest or checkout actions.
 */
export function DealsList({ deals, emptyMessage }: DealsListProps) {
  return (
    <section
      aria-labelledby="open-deals-heading"
      className="island-shell rounded-2xl p-4 sm:p-5"
    >
      <h2
        id="open-deals-heading"
        className="m-0 text-xl font-semibold text-[var(--sea-ink)]"
      >
        Open deals
      </h2>
      <p className="m-0 mt-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
        Mock data: sample listings, not live offers
      </p>
      {deals.length === 0 ? (
        <p className="m-0 mt-3 text-sm text-[var(--sea-ink-soft)]">
          {emptyMessage}
        </p>
      ) : (
        <ul className="m-0 mt-3 list-none divide-y divide-[var(--line)] p-0">
          {deals.map((deal) => (
            <li
              key={deal.id}
              className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0">
                <h3 className="m-0 text-base font-semibold text-[var(--sea-ink)]">
                  {deal.title}
                </h3>
                <p className="m-0 mt-0.5 text-sm text-[var(--sea-ink-soft)]">
                  {formatPropertyType(deal.propertyType)} · {deal.address.city},{' '}
                  {deal.address.region}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
                <span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--sea-ink)]">
                  {formatListingStatus(deal.status)}
                </span>
                <span className="text-sm font-semibold text-[var(--sea-ink)]">
                  {deal.financials
                    ? formatCurrency(deal.financials.askingPrice)
                    : 'Price to be announced'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
