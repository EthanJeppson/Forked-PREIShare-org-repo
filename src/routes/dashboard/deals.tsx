import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/deals')({
  component: DealsPage,
})

function DealsPage() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="m-0 text-xl font-semibold text-[var(--sea-ink)]">Open deals</h2>
      <p className="m-0 max-w-prose text-base text-[var(--sea-ink-soft)]">
        Placeholder for open deals. Mock data only; the deals list comes in a later step.
      </p>
    </div>
  )
}
