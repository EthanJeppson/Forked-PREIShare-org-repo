import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/portfolio')({
  component: PortfolioPage,
})

function PortfolioPage() {
  return (
    <p className="m-0 max-w-prose text-base text-[var(--sea-ink-soft)]">
      Placeholder for holdings and performance. Mock data only; the holdings table comes in a later step.
    </p>
  )
}
