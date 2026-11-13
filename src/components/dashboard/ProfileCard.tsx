import type { MockProfile } from '../../mock/dashboard-data'

export type ProfileCardProps = {
  profile: MockProfile
}

/**
 * Read-only member card: name, email, and phone. Presentational only: no edit,
 * save, password, or sign-in controls.
 */
export function ProfileCard({ profile }: ProfileCardProps) {
  const fields = [
    { label: 'Name', value: profile.displayName },
    { label: 'Email', value: profile.email },
    { label: 'Phone', value: profile.phone },
  ]

  return (
    <section
      aria-labelledby="profile-heading"
      className="island-shell rounded-2xl p-4 sm:p-5"
    >
      <h2
        id="profile-heading"
        className="m-0 text-xl font-semibold text-[var(--sea-ink)]"
      >
        Your profile
      </h2>
      <p className="m-0 mt-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
        Demo details only, not a signed-in account
      </p>
      <dl className="m-0 mt-3 grid gap-3 sm:grid-cols-3">
        {fields.map((field) => (
          <div key={field.label} className="min-w-0">
            <dt className="island-kicker">{field.label}</dt>
            <dd className="m-0 mt-1 break-words text-sm font-semibold text-[var(--sea-ink)]">
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
