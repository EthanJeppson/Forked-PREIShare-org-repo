export type ActivityItem = {
  id: string
  title: string
  detail: string
  /** Already-formatted date text. */
  dateLabel: string
}

export type RecentActivityProps = {
  title?: string
  items?: ReadonlyArray<ActivityItem>
  isSampleData?: boolean
}

export const MOCK_ACTIVITY: ReadonlyArray<ActivityItem> = [
  {
    id: 'a1',
    title: 'Distribution posted (sample)',
    detail: 'Sample Multifamily Fund A',
    dateLabel: 'Mar 1, 2026',
  },
  {
    id: 'a2',
    title: 'Capital call notice (sample)',
    detail: 'Sample Industrial Note B',
    dateLabel: 'Feb 18, 2026',
  },
  {
    id: 'a3',
    title: 'Profile document uploaded (sample)',
    detail: 'Accreditation letter',
    dateLabel: 'Feb 5, 2026',
  },
]

/** Short list of latest events. Presentational only: no data fetching. */
export function RecentActivity({
  title = 'Recent activity',
  items = MOCK_ACTIVITY,
  isSampleData = true,
}: RecentActivityProps) {
  return (
    <section
      aria-labelledby="recent-activity-heading"
      className="island-shell rounded-2xl p-4 sm:p-5"
    >
      <h2
        id="recent-activity-heading"
        className="m-0 text-xl font-semibold text-[var(--sea-ink)]"
      >
        {title}
      </h2>
      {isSampleData ? (
        <p
          role="note"
          className="m-0 mt-1 text-xs font-semibold text-[var(--sea-ink-soft)]"
        >
          Sample activity: not connected to a live feed
        </p>
      ) : null}
      <ol className="m-0 mt-3 list-none divide-y divide-[var(--line)] p-0">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="m-0 text-sm font-semibold text-[var(--sea-ink)]">
                {item.title}
              </p>
              <p className="m-0 mt-0.5 text-sm text-[var(--sea-ink-soft)]">
                {item.detail}
              </p>
            </div>
            <span className="shrink-0 text-xs text-[var(--sea-ink-soft)]">
              {item.dateLabel}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
