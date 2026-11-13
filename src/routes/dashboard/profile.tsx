import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="m-0 text-xl font-semibold text-[var(--sea-ink)]">Investor profile</h2>
      <p className="m-0 max-w-prose text-base text-[var(--sea-ink-soft)]">
        Placeholder for the investor profile card. Demo details only, not a signed-in account.
      </p>
    </div>
  )
}
