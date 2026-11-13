import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <p className="m-0 max-w-prose text-base text-[var(--sea-ink-soft)]">
      Placeholder for the investor profile card. Demo details only, not a signed-in account.
    </p>
  )
}
