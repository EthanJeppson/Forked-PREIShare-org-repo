import { createFileRoute } from '@tanstack/react-router'
import { PortfolioTable } from '../../components/dashboard/PortfolioTable'
import { MOCK_HOLDINGS } from '../../mock/dashboard-data'

export const Route = createFileRoute('/dashboard/portfolio')({
  component: PortfolioPage,
})

function PortfolioPage() {
  return (
    <PortfolioTable
      holdings={MOCK_HOLDINGS}
      emptyMessage="No holdings to show yet. Investments you make will appear here."
    />
  )
}
