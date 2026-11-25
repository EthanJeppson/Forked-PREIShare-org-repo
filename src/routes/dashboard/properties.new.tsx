import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { ListingForm } from '../../components/listings/ListingForm'
import type {
  ListingFieldErrors,
  ListingFormValues,
} from '../../lib/listings/schema'
import { createListing } from '../../server/listings'

// The form never sends an owner. createListing (src/server/listings.ts) runs on
// the server, reads the session, sets owner_id from it, and inserts with the
// server client from src/lib/supabase.server.ts, so RLS WITH CHECK
// (owner_id = auth.uid()) must also pass. This page navigates to the list only
// after result.ok; every failure stays on the form with a visible error.
export const Route = createFileRoute('/dashboard/properties/new')({
  component: NewListingPage,
})

function NewListingPage() {
  const navigate = useNavigate()
  const createListingFn = useServerFn(createListing)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<ListingFieldErrors>({})

  async function handleSubmit(values: ListingFormValues) {
    setIsSubmitting(true)
    setErrorMessage(null)
    setFieldErrors({})
    try {
      const result = await createListingFn({ data: values })
      if (result.ok) {
        await navigate({ to: '/dashboard/properties' })
        return
      }
      if (result.code === 'unauthenticated') {
        await navigate({ to: '/login' })
        return
      }
      setErrorMessage(
        [result.error, ...(result.fieldErrors?._form ?? [])].join(' '),
      )
      setFieldErrors(result.fieldErrors ?? {})
    } catch (caught) {
      console.error('Could not create listing', caught)
      setErrorMessage(
        'Could not save the listing. Check your connection and try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="new-listing-heading" className="grid max-w-2xl gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="new-listing-heading" className="m-0 text-xl font-semibold text-[var(--sea-ink)]">
          Add a property listing
        </h2>
        <Link to="/dashboard/properties" className="text-sm font-semibold">
          Back to listings
        </Link>
      </div>
      <p className="m-0 text-xs text-[var(--sea-ink-soft)]">
        Fields marked * are required.
      </p>
      <ListingForm
        onSubmit={handleSubmit}
        submitLabel="Create listing"
        errorMessage={errorMessage}
        fieldErrors={fieldErrors}
        isSubmitting={isSubmitting}
      />
    </section>
  )
}
