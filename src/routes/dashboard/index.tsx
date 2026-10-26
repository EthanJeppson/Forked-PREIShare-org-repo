import { createFileRoute } from '@tanstack/react-router'
import { MetricCard } from '../../components/dashboard/MetricCard'
import { PortfolioSummary } from '../../components/dashboard/PortfolioSummary'
import { RecentActivity } from '../../components/dashboard/RecentActivity'
import {
  MOCK_OVERVIEW_METRICS,
  MOCK_PORTFOLIO_SUMMARY_HEADLINE,
  MOCK_PORTFOLIO_SUMMARY_LINES,
  MOCK_RECENT_ACTIVITY,
} from '../../mock/dashboard-data'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
})

function DashboardHome() {
  return (
    <div className="flex flex-col gap-6">
      <p className="m-0 max-w-prose text-base text-[var(--sea-ink-soft)]">
        Your PREIshare home base for portfolio value, open deals and recent
        activity. Every number on this page is mock data.
      </p>

      <section
        aria-label="Key metrics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {MOCK_OVERVIEW_METRICS.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            hint={metric.hint}
          />
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <PortfolioSummary
          headline={MOCK_PORTFOLIO_SUMMARY_HEADLINE}
          summaryLines={MOCK_PORTFOLIO_SUMMARY_LINES}
          emptyMessage="No portfolio data yet. A breakdown by property type will appear here once holdings are available."
        />
        <RecentActivity
          items={MOCK_RECENT_ACTIVITY}
          emptyMessage="No recent activity yet. Distributions, reports and deal updates will appear here."
        />
      </div>
    </div>
  )
}
