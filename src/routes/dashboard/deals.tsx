import { createFileRoute } from '@tanstack/react-router'
import { DealsList } from '../../components/dashboard/DealsList'
import { getMockDeals } from '../../mock/dashboard-data'

export const Route = createFileRoute('/dashboard/deals')({
  component: DealsPage,
})

function DealsPage() {
  return (
    <DealsList
      deals={getMockDeals()}
      emptyMessage="No open deals right now. New opportunities will appear here."
    />
  )
}
