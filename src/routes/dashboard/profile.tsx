import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  return (
    <main>
      <h1 className="m-0 text-2xl font-semibold text-[var(--sea-ink)]">Profile</h1>
      <p className="text-[var(--sea-ink-soft)]">Placeholder for investor profile details.</p>
    </main>
  )
}
