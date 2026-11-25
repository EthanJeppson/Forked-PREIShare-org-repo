import { createServerFn } from '@tanstack/react-start'
import { getSession } from '../lib/auth/session'
import type { ServerSession } from '../lib/auth/session'
import {
  createListingSchema,
  normalizeListingInput,
  toFieldErrors,
  updateListingSchema,
} from '../lib/listings/schema'
import type {
  CreateListingFormInput,
  ListingFieldErrors,
  UpdateListingFormInput,
} from '../lib/listings/schema'
import { createServerSupabaseClient } from '../lib/supabase.server'
import type {
  PropertyListing,
  PropertyListingChanges,
} from '../lib/supabase/types'

// Server functions for the signed-in sponsor's property listings.
//
// Every function reads the session itself, because a server function is an
// endpoint that can be called without the dashboard route ever loading. The
// Supabase client acts as the signed-in user, so Row Level Security applies;
// the owner filters below are a second line, not the only one. Nothing here
// throws a database error at the browser: failures come back as
// `{ ok: false, code, error }` with a message that is safe to show.

export type ListingErrorCode =
  | 'unauthenticated'
  | 'unavailable'
  | 'validation'
  | 'not_found'
  | 'database'

// The list page reads only what a listing card shows (docs/data-model-and-rls-matrix.md).
const LIST_COLUMNS =
  'id, title, summary, property_type, status, address_line1, address_line2, city, region, postal_code, asking_price, created_at'

export type ListingSummary = Pick<
  PropertyListing,
  | 'id'
  | 'title'
  | 'summary'
  | 'property_type'
  | 'status'
  | 'address_line1'
  | 'address_line2'
  | 'city'
  | 'region'
  | 'postal_code'
  | 'asking_price'
  | 'created_at'
>

export type ListingsResult =
  | { ok: true; listings: ListingSummary[] }
  | { ok: false; code: ListingErrorCode; error: string }

export type ListingMutationResult =
  | { ok: true; listing: PropertyListing }
  | {
      ok: false
      code: ListingErrorCode
      error: string
      fieldErrors?: ListingFieldErrors
    }

type SessionResult =
  | { ok: true; session: ServerSession }
  | { ok: false; code: ListingErrorCode; error: string }

async function requireSession(action: string): Promise<SessionResult> {
  try {
    const session = await getSession()
    if (session) return { ok: true, session }
    return {
      ok: false,
      code: 'unauthenticated',
      error: `You must be signed in to ${action}.`,
    }
  } catch (error) {
    console.error('[listings] could not read the session', error)
    return {
      ok: false,
      code: 'unavailable',
      error: 'Listings are temporarily unavailable. Try again.',
    }
  }
}

function databaseFailure(
  action: string,
  error: { code?: string; message: string },
) {
  console.error(`[listings] ${action} failed`, error.code, error.message)
  return {
    ok: false as const,
    code: 'database' as const,
    error: `Could not ${action}. Try again.`,
  }
}

const NOT_FOUND = {
  ok: false as const,
  code: 'not_found' as const,
  error: 'Listing not found.',
}

/** Loader: the signed-in sponsor's listings, newest first. An empty list is a success. */
export const listMyListings = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ListingsResult> => {
    const auth = await requireSession('view listings')
    if (!auth.ok) return auth
    const { accessToken, user } = auth.session

    const { data, error } = await createServerSupabaseClient(accessToken)
      .from('property_listings')
      .select(LIST_COLUMNS)
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    if (error) return databaseFailure('load listings', error)
    return { ok: true, listings: data ?? [] }
  },
)

/** Action: create a listing owned by the session user. */
export const createListing = createServerFn({ method: 'POST' })
  .validator((input: CreateListingFormInput) => input)
  .handler(async ({ data }): Promise<ListingMutationResult> => {
    const auth = await requireSession('create a listing')
    if (!auth.ok) return auth
    const { accessToken, user } = auth.session

    const parsed = createListingSchema.safeParse(normalizeListingInput(data))
    if (!parsed.success) {
      return {
        ok: false,
        code: 'validation',
        error: 'Please fix the highlighted fields.',
        fieldErrors: toFieldErrors(parsed.error),
      }
    }
    const input = parsed.data

    const { data: row, error } = await createServerSupabaseClient(accessToken)
      .from('property_listings')
      .insert({
        title: input.title,
        summary: input.summary,
        property_type: input.property_type,
        status: input.status,
        address_line1: input.address_line1,
        city: input.city,
        region: input.region,
        postal_code: input.postal_code,
        country: input.country,
        ...(input.address_line2 !== undefined && {
          address_line2: input.address_line2,
        }),
        ...(input.asking_price !== undefined && {
          asking_price: input.asking_price,
        }),
        closed_at: input.status === 'closed' ? new Date().toISOString() : null,
        owner_id: user.id,
      })
      .select('*')
      .single()

    if (error || !row) {
      return databaseFailure(
        'create the listing',
        error ?? { message: 'insert returned no row' },
      )
    }
    return { ok: true, listing: row }
  })

/** Action: change some fields of one of the session user's listings. */
export const updateListing = createServerFn({ method: 'POST' })
  .validator((input: UpdateListingFormInput) => input)
  .handler(async ({ data }): Promise<ListingMutationResult> => {
    const auth = await requireSession('update a listing')
    if (!auth.ok) return auth
    const { accessToken, user } = auth.session

    const parsed = updateListingSchema.safeParse(normalizeListingInput(data))
    if (!parsed.success) {
      return {
        ok: false,
        code: 'validation',
        error: 'Please fix the highlighted fields.',
        fieldErrors: toFieldErrors(parsed.error),
      }
    }

    const { id, ...fields } = parsed.data
    const patch: PropertyListingChanges = Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== undefined),
    )
    if (Object.keys(patch).length === 0) {
      return {
        ok: false,
        code: 'validation',
        error: 'There is nothing to update.',
        fieldErrors: { _form: ['Change at least one field.'] },
      }
    }

    const supabase = createServerSupabaseClient(accessToken)

    // The table requires closed_at exactly when status is 'closed', so it
    // follows a status change. A row that is not visible to this sponsor
    // looks the same as a row that does not exist.
    if (patch.status !== undefined) {
      const { data: current, error } = await supabase
        .from('property_listings')
        .select('status')
        .eq('id', id)
        .eq('owner_id', user.id)
        .maybeSingle()
      if (error) return databaseFailure('update the listing', error)
      if (!current) return NOT_FOUND
      if (current.status !== patch.status) {
        patch.closed_at =
          patch.status === 'closed' ? new Date().toISOString() : null
      }
    }

    const { data: row, error } = await supabase
      .from('property_listings')
      .update(patch)
      .eq('id', id)
      .eq('owner_id', user.id)
      .select('*')
      .maybeSingle()

    if (error) return databaseFailure('update the listing', error)
    if (!row) return NOT_FOUND
    return { ok: true, listing: row }
  })
