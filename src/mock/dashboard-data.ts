import type { ActivityItem } from '../components/dashboard/RecentActivity'

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
