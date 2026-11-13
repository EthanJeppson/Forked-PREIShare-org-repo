import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div data-area="dashboard-layout" className="page-wrap px-4 py-6">
      <p className="island-kicker m-0">
        PREIshare investor dashboard layout (shell comes next)
      </p>
      <Outlet />
    </div>
  )
}
