export type ActivityItem = {
  id: string
  title: string
  detail: string
  /** Already-formatted date or time text. */
  timestamp: string
}

export type RecentActivityProps = {
  items: ReadonlyArray<ActivityItem>
  /** Shown instead of the list when items is empty. */
  emptyMessage: string
}

/**
 * Plain list of recent events. Presentational only: no links, no navigation,
 * and no data of its own. The Overview page passes the items in.
 */
export function RecentActivity({ items, emptyMessage }: RecentActivityProps) {
  return (
    <section
      aria-label="Recent activity"
      className="island-shell rounded-2xl p-4 sm:p-5"
    >
      <p className="island-kicker m-0">Recent activity</p>
      {items.length === 0 ? (
        <p className="m-0 mt-3 text-sm text-[var(--sea-ink-soft)]">
          {emptyMessage}
        </p>
      ) : (
        <ul className="m-0 mt-3 list-none divide-y divide-[var(--line)] p-0">
          {items.map((item) => (
            <li key={item.id} className="py-3 first:pt-0 last:pb-0">
              <p className="m-0 text-xs text-[var(--sea-ink-soft)]">
                {item.timestamp}
              </p>
              <p className="m-0 mt-0.5 text-sm font-semibold text-[var(--sea-ink)]">
                {item.title}
              </p>
              <p className="m-0 mt-0.5 text-sm text-[var(--sea-ink-soft)]">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
