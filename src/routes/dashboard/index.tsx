import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHome,
})

function DashboardHome() {
  return (
    <section
      aria-labelledby="dashboard-home-heading"
      className="island-shell rounded-2xl p-6 sm:p-8"
    >
      <h2
        id="dashboard-home-heading"
        className="mb-2 text-2xl font-semibold text-[var(--sea-ink)]"
      >
        Overview
      </h2>
      <p className="m-0 max-w-prose text-base text-[var(--sea-ink-soft)]">
        Portfolio metrics and recent activity will appear here. This
        placeholder confirms the /dashboard route is wired correctly. It shows
        no real data.
      </p>
    </section>
  )
}
