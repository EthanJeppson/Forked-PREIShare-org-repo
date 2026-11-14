import {
  formatCurrency,
  formatListingStatus,
  formatPropertyType,
} from '../../lib/format'
import type { PropertyListing } from '../../lib/supabase/types'

export type ListingCardProps = {
  listing: Pick<
    PropertyListing,
    | 'title'
    | 'summary'
    | 'property_type'
    | 'status'
    | 'address_line1'
    | 'address_line2'
    | 'city'
    | 'region'
    | 'postal_code'
    | 'asking_price'
  >
}

/**
 * One of the sponsor's listings. Presentational only: it gets a row as a prop
 * and never reads env vars or talks to the database.
 */
export function ListingCard({ listing }: ListingCardProps) {
  const street = [listing.address_line1, listing.address_line2]
    .filter(Boolean)
    .join(', ')

  return (
    <article className="island-shell rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="m-0 min-w-0 break-words text-base font-semibold text-[var(--sea-ink)]">
          {listing.title}
        </h3>
        <span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--sea-ink)]">
          {formatListingStatus(listing.status)}
        </span>
      </div>
      <p className="m-0 mt-1 text-sm text-[var(--sea-ink-soft)]">
        {formatPropertyType(listing.property_type)} · {listing.city},{' '}
        {listing.region}
      </p>
      <p className="m-0 mt-0.5 text-sm text-[var(--sea-ink-soft)]">
        {street}, {listing.city}, {listing.region} {listing.postal_code}
      </p>
      <p className="m-0 mt-2 line-clamp-2 text-sm text-[var(--sea-ink)]">
        {listing.summary}
      </p>
      <p className="m-0 mt-2 text-sm font-semibold text-[var(--sea-ink)]">
        {listing.asking_price === null
          ? 'Asking price not set'
          : formatCurrency(listing.asking_price)}
      </p>
    </article>
  )
}
