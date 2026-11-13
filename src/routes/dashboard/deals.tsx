import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/deals')({
  component: DealsPage,
})

function DealsPage() {
  return (
    <p className="m-0 max-w-prose text-base text-[var(--sea-ink-soft)]">
      Placeholder for open deals. Mock data only; the deals list comes in a later step.
    </p>
  )
}
