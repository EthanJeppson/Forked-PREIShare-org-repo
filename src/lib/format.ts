import type { ListingStatus, PropertyType } from '../types'

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

/** Whole-dollar USD text for display, for example "$50,000". */
export function formatCurrency(amount: number): string {
  return usd.format(amount)
}

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  single_family: 'Single-family',
  multi_family: 'Multi-family',
  commercial: 'Commercial',
  land: 'Land',
}

/** Investor-friendly name for a property type. */
export function formatPropertyType(type: PropertyType): string {
  return PROPERTY_TYPE_LABELS[type]
}

const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  under_contract: 'Under contract',
  closed: 'Closed',
}

/** Investor-friendly name for a listing status. */
export function formatListingStatus(status: ListingStatus): string {
  return LISTING_STATUS_LABELS[status]
}
