import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { ListingCard } from '../../../components/listings/ListingCard'
import { listMyListings } from '../../../server/listings'

export const Route = createFileRoute('/dashboard/listings/')({
  loader: () => listMyListings(),
  // No cached copy: coming back after a create must not flash the old list.
  gcTime: 0,
  pendingMs: 300,
  pendingComponent: ListingsLoading,
  errorComponent: ListingsLoadError,
  component: ListingsIndexPage,
})

const actionLinkClass =
  'inline-flex h-11 items-center rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline'

const alertClass =
  'm-0 rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-2 text-sm font-semibold text-[var(--sea-ink)]'

function ListingsIndexPage() {
  const result = Route.useLoaderData()

  if (!result.ok) {
    return (
      <section aria-labelledby="listings-heading" className="grid gap-4">
        <h2 id="listings-heading" className="m-0 text-xl font-semibold text-[var(--sea-ink)]">
          Your property listings
        </h2>
        <p role="alert" className={alertClass}>
          {result.error}
        </p>
        {result.code === 'unauthenticated' ? (
          <Link to="/auth/login" className={`${actionLinkClass} justify-self-start`}>
            Log in
          </Link>
        ) : null}
      </section>
    )
  }

  const { listings } = result

  return (
    <section aria-labelledby="listings-heading" className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="listings-heading" className="m-0 text-xl font-semibold text-[var(--sea-ink)]">
          Your property listings
        </h2>
        <Link to="/dashboard/listings/new" className={actionLinkClass}>
          Add listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="island-shell rounded-2xl p-4 sm:p-5">
          <p className="m-0 text-sm text-[var(--sea-ink-soft)]">
            No properties yet. Add your first listing to get started.
          </p>
        </div>
      ) : (
        <ul className="m-0 grid list-none gap-4 p-0">
          {listings.map((listing) => (
            <li key={listing.id}>
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function ListingsLoading() {
  return (
    <p role="status" className="m-0 text-sm text-[var(--sea-ink-soft)]">
      Loading your listings...
    </p>
  )
}

function ListingsLoadError({ error }: ErrorComponentProps) {
  const router = useRouter()
  console.error('Could not load listings', error)
  return (
    <section aria-labelledby="listings-heading" className="grid gap-4">
      <h2 id="listings-heading" className="m-0 text-xl font-semibold text-[var(--sea-ink)]">
        Your property listings
      </h2>
      <p role="alert" className={alertClass}>
        Could not load your listings. Check your connection and try again.
      </p>
      <button
        type="button"
        onClick={() => void router.invalidate()}
        className={`${actionLinkClass} justify-self-start`}
      >
        Try again
      </button>
    </section>
  )
}
