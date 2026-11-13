import type { ActivityItem } from '../components/dashboard/RecentActivity'
import { sampleInvestorListings } from '../fixtures/sample-investor-listings'
import type { InvestorListing, PropertyType } from '../types'

/**
 * MOCK DATA ONLY. Placeholder numbers for the investor dashboard shell. None of
 * this is real PREIshare data, and it is not read from Supabase or any API.
 * Replace with real data in a later sprint.
 */

export type MockMetric = {
  label: string
  value: string
  hint: string
}

export const MOCK_OVERVIEW_METRICS: ReadonlyArray<MockMetric> = [
  {
    label: 'Total portfolio value',
    value: '$6,850,000',
    hint: 'Mock value, not a real balance',
  },
  {
    label: 'Holdings',
    value: '4',
    hint: 'Properties in this demo portfolio',
  },
  {
    label: 'Open deals',
    value: '3',
    hint: 'Active or under contract (mock count)',
  },
]

export const MOCK_PORTFOLIO_SUMMARY_HEADLINE = 'Total mock value: $6,850,000'

export const MOCK_PORTFOLIO_SUMMARY_LINES: ReadonlyArray<string> = [
  'Multi-family: $3,100,000 (45%)',
  'Retail: $1,950,000 (28%)',
  'Industrial: $1,800,000 (27%)',
]

export const MOCK_RECENT_ACTIVITY: ReadonlyArray<ActivityItem> = [
  {
    id: 'activity-1',
    timestamp: 'Mar 18, 2026',
    title: 'Distribution posted',
    detail: 'Mock quarterly distribution for the multi-family holding.',
  },
  {
    id: 'activity-2',
    timestamp: 'Mar 15, 2026',
    title: 'Deal moved under contract',
    detail: 'A listing you follow changed from active to under contract.',
  },
  {
    id: 'activity-3',
    timestamp: 'Mar 11, 2026',
    title: 'Quarterly report available',
    detail: 'Mock report for the retail holding is ready to read.',
  },
]

/**
 * MOCK-ONLY holdings shape. Portfolio holdings have no real type yet
 * (docs/investor-dashboard-brief.md), so this small shape is local to the mock.
 */
export type MockHolding = {
  id: string
  propertyName: string
  propertyType: PropertyType
  /** Whole US dollars. */
  value: number
}

/** Four mock holdings that add up to the $6,850,000 mock total on Overview. */
export const MOCK_HOLDINGS: ReadonlyArray<MockHolding> = [
  { id: 'holding-1', propertyName: 'Riverfront Lofts', propertyType: 'multi_family', value: 2000000 },
  { id: 'holding-2', propertyName: 'Maple Court Apartments', propertyType: 'multi_family', value: 1100000 },
  { id: 'holding-3', propertyName: 'Cedar Commercial Center', propertyType: 'commercial', value: 1950000 },
  { id: 'holding-4', propertyName: 'Harbor Business Park', propertyType: 'commercial', value: 1800000 },
]

/**
 * Mock open deals: the shared sample listings, kept to the investor-visible
 * statuses (`active` and `under_contract`). Draft and closed listings stay out.
 */
export function getMockDeals(): InvestorListing[] {
  return sampleInvestorListings.filter(
    (listing) => listing.status === 'active' || listing.status === 'under_contract',
  )
}

/** MOCK-ONLY profile shape. Not a real account or session. */
export type MockProfile = {
  displayName: string
  email: string
  phone: string
}

export const MOCK_PROFILE: MockProfile = {
  displayName: 'Alex Morgan (demo)',
  email: 'alex.morgan@example.com',
  phone: '+1-555-0100',
}
