import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/portfolio')({
  component: PortfolioPage,
})

function PortfolioPage() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="m-0 text-xl font-semibold text-[var(--sea-ink)]">Portfolio overview</h2>
      <p className="m-0 max-w-prose text-base text-[var(--sea-ink-soft)]">
        Placeholder for holdings and performance. Mock data only; the holdings table comes in a later step.
      </p>
    </div>
  )
}
