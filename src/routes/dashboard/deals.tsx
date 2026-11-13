import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/deals')({
  component: DealsPage,
})

function DealsPage() {
  return (
    <main>
      <h1 className="m-0 text-2xl font-semibold text-[var(--sea-ink)]">Deals</h1>
      <p className="text-[var(--sea-ink-soft)]">Placeholder for open and past investment deals.</p>
    </main>
  )
}
