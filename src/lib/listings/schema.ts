import { z } from 'zod'
import type { ListingStatus, PropertyType } from '../../types'

// Mirrors the `property_listings` table in
// supabase/migrations/20250321000000_property_listings.sql and
// docs/data-model/property-listings-schema.md. Change all three together.
//
// Not accepted from the browser, on purpose:
//   - owner_id: the server sets it from the verified session.
//   - id, created_at, updated_at: the database owns them.
//   - closed_at: the server derives it from `status` (the table requires it
//     exactly when status is 'closed').
// Zod drops keys it does not know, so a request that includes them is ignored.

// A Record forces every value to be listed exactly once, so adding or removing
// a status or property type in src/types stops compiling here until this file
// is updated.
const STATUS_VALUES: Record<ListingStatus, true> = {
  draft: true,
  active: true,
  under_contract: true,
  closed: true,
}
const PROPERTY_TYPE_VALUES: Record<PropertyType, true> = {
  single_family: true,
  multi_family: true,
  commercial: true,
  land: true,
}

export const LISTING_STATUSES = Object.keys(STATUS_VALUES) as [
  ListingStatus,
  ...ListingStatus[],
]
export const PROPERTY_TYPES = Object.keys(PROPERTY_TYPE_VALUES) as [
  PropertyType,
  ...PropertyType[],
]

// numeric(14,2) in the migration.
const MAX_ASKING_PRICE = 999_999_999_999.99

function requiredText(label: string, max: number) {
  return z
    .string({ error: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be ${max} characters or fewer`)
}

const fields = {
  title: requiredText('Title', 200),
  summary: requiredText('Summary', 5000),
  property_type: z.enum(PROPERTY_TYPES, { error: 'Choose a property type' }),
  status: z.enum(LISTING_STATUSES, { error: 'Choose a status' }),
  address_line1: requiredText('Address', 300),
  address_line2: z
    .string({ error: 'Address line 2 must be text' })
    .trim()
    .max(300, 'Address line 2 must be 300 characters or fewer')
    .nullable(),
  city: requiredText('City', 120),
  region: requiredText('State or region', 120),
  postal_code: requiredText('Postal code', 20),
  country: z
    .string({ error: 'Country must be a two-letter code, such as US' })
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, 'Country must be a two-letter code, such as US'),
  asking_price: z
    .number({ error: 'Asking price must be a number' })
    .positive('Asking price must be greater than zero')
    .max(MAX_ASKING_PRICE, 'Asking price is too large')
    .refine(
      (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-6,
      'Asking price can have at most two decimal places',
    )
    .nullable(),
}

// Defaults live only here, not on `fields`, because `.partial()` on a field
// with a default would fill the default into an update that never mentioned it.
export const createListingSchema = z.object({
  ...fields,
  status: fields.status.default('draft'),
  address_line2: fields.address_line2.optional(),
  country: fields.country.default('US'),
  asking_price: fields.asking_price.optional(),
})

// Every field is optional: a key that is absent stays unchanged, and a key
// that is present must be valid. `null` clears address_line2 and asking_price.
export const updateListingSchema = z
  .object(fields)
  .partial()
  .extend({ id: z.uuid('Listing id must be a valid UUID') })

export type CreateListingInput = z.output<typeof createListingSchema>
export type UpdateListingInput = z.output<typeof updateListingSchema>

type ListingFieldName = keyof z.input<typeof createListingSchema>

/** What a form (or a plain object built from one) can send. */
export type ListingFormValues = {
  [K in ListingFieldName]?: string | number | null
}
export type CreateListingFormInput = ListingFormValues
export type UpdateListingFormInput = ListingFormValues & { id: string }

/** Field name to messages. Form-wide problems use the key `_form`. */
export type ListingFieldErrors = Record<string, string[]>

export function toFieldErrors(error: z.ZodError): ListingFieldErrors {
  const fieldErrors: ListingFieldErrors = {}
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join('.') : '_form'
    ;(fieldErrors[key] ??= []).push(issue.message)
  }
  return fieldErrors
}

/**
 * Turns form-style values (everything a text input sends is a string) into
 * what the schemas expect: a blank address line 2 becomes null (so it clears
 * the value), a blank asking price becomes null and a numeric string becomes a
 * number, and a blank country is dropped so the default or the existing value
 * applies. Anything that is not a plain object is passed through for the
 * schema to reject.
 */
export function normalizeListingInput(raw: unknown): unknown {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return raw
  const source: Record<string, unknown> = { ...raw }

  if (isBlankString(source.address_line2)) source.address_line2 = null
  if (isBlankString(source.country)) delete source.country
  if (isBlankString(source.asking_price)) {
    source.asking_price = null
  } else if (typeof source.asking_price === 'string') {
    source.asking_price = Number(source.asking_price.trim())
  }
  return source
}

function isBlankString(value: unknown): boolean {
  return typeof value === 'string' && value.trim() === ''
}
