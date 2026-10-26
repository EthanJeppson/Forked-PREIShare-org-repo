import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <main className="page-wrap px-4 py-8">
      <header className="mb-6 border-b border-[var(--line)] pb-4">
        <p className="island-kicker mb-1">PREIshare</p>
        <h1 className="display-title m-0 text-3xl font-bold text-[var(--sea-ink)]">
          Investor Dashboard
        </h1>
      </header>
      <Outlet />
    </main>
  )
}
