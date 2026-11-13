import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/portfolio')({
  component: PortfolioPage,
})

function PortfolioPage() {
  return (
    <main>
      <h1 className="m-0 text-2xl font-semibold text-[var(--sea-ink)]">Portfolio</h1>
      <p className="text-[var(--sea-ink-soft)]">Placeholder for holdings and performance.</p>
    </main>
  )
}
