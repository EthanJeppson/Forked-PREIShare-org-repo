import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardHomePage,
})

function DashboardHomePage() {
  return (
    <section>
      <h2 className="m-0 text-2xl font-semibold text-[var(--sea-ink)]">Dashboard overview</h2>
      <p className="text-[var(--sea-ink-soft)]">Placeholder for portfolio value, open deals, and recent activity.</p>
    </section>
  )
}
