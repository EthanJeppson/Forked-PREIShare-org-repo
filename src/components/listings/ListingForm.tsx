import type { FormEvent, ReactNode } from 'react'
import {
  LISTING_STATUSES,
  PROPERTY_TYPES,
} from '../../lib/listings/schema'
import type {
  ListingFieldErrors,
  ListingFormValues,
} from '../../lib/listings/schema'
import { formatListingStatus, formatPropertyType } from '../../lib/format'

export type ListingFormProps = {
  onSubmit: (values: ListingFormValues) => void | Promise<void>
  submitLabel?: string
  /** Form-wide message, shown as an alert above the fields. */
  errorMessage?: string | null
  /** Messages per field, keyed by the same names as the schema. */
  fieldErrors?: ListingFieldErrors
  isSubmitting?: boolean
}

const FIELD_NAMES = [
  'title',
  'summary',
  'property_type',
  'status',
  'address_line1',
  'address_line2',
  'city',
  'region',
  'postal_code',
  'country',
  'asking_price',
] as const satisfies ReadonlyArray<keyof ListingFormValues>

// aria-invalid is set by Field when the server returns an error for this input,
// so the same attribute drives both screen readers and the red outline.
const inputClass =
  'h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 text-base font-normal text-[var(--sea-ink)] aria-invalid:border-2 aria-invalid:border-[rgb(214,84,84)]'

type FieldProps = {
  name: (typeof FIELD_NAMES)[number]
  label: string
  required?: boolean
  hint?: string
  error: string | undefined
  children: (props: {
    id: string
    'aria-required': boolean | undefined
    'aria-invalid': boolean | undefined
    'aria-describedby': string | undefined
  }) => ReactNode
}

function Field({ name, label, required, hint, error, children }: FieldProps) {
  const id = `listing-${name}`
  const describedBy =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
      .filter(Boolean)
      .join(' ') || undefined

  return (
    <div className="grid content-start gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-[var(--sea-ink)]">
        {label}
        {required ? (
          <span aria-hidden="true"> *</span>
        ) : (
          <span className="font-normal text-[var(--sea-ink-soft)]"> (optional)</span>
        )}
      </label>
      {children({
        id,
        'aria-required': required ? true : undefined,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })}
      {hint ? (
        <p id={`${id}-hint`} className="m-0 text-xs text-[var(--sea-ink-soft)]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="m-0 text-sm font-semibold text-[rgb(214,84,84)]">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/**
 * Create-listing fields, named exactly like the columns and schema in
 * src/lib/listings/schema.ts. Presentational: it hands the typed text to
 * `onSubmit` and shows whatever errors the parent passes back. The server
 * does the real validation, so the form is not blocked by the browser's own
 * checks (`noValidate`) and the same friendly messages always appear.
 */
export function ListingForm({
  onSubmit,
  submitLabel = 'Save listing',
  errorMessage = null,
  fieldErrors = {},
  isSubmitting = false,
}: ListingFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const values: ListingFormValues = {}
    for (const name of FIELD_NAMES) {
      const value = data.get(name)
      if (typeof value === 'string') values[name] = value
    }
    void onSubmit(values)
  }

  const firstError = (name: (typeof FIELD_NAMES)[number]) =>
    fieldErrors[name]?.[0]

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      {errorMessage ? (
        <p
          role="alert"
          className="m-0 rounded-lg border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-2 text-sm font-semibold text-[var(--sea-ink)]"
        >
          {errorMessage}
        </p>
      ) : null}

      <fieldset
        disabled={isSubmitting}
        className="m-0 grid min-w-0 gap-4 border-0 p-0"
      >
        <legend className="sr-only">Listing details</legend>

        <Field name="title" label="Title" required error={firstError('title')}>
          {(a11y) => (
            <input {...a11y} name="title" type="text" className={inputClass} />
          )}
        </Field>

        <Field name="summary" label="Summary" required error={firstError('summary')}>
          {(a11y) => (
            <textarea
              {...a11y}
              name="summary"
              rows={3}
              className={`${inputClass} h-auto py-2`}
            />
          )}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            name="property_type"
            label="Property type"
            required
            error={firstError('property_type')}
          >
            {(a11y) => (
              <select {...a11y} name="property_type" defaultValue="" className={inputClass}>
                <option value="">Choose a type</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {formatPropertyType(type)}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field name="status" label="Status" required error={firstError('status')}>
            {(a11y) => (
              <select {...a11y} name="status" defaultValue="draft" className={inputClass}>
                {LISTING_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {formatListingStatus(status)}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>

        <Field
          name="address_line1"
          label="Street address"
          required
          error={firstError('address_line1')}
        >
          {(a11y) => (
            <input
              {...a11y}
              name="address_line1"
              type="text"
              autoComplete="address-line1"
              className={inputClass}
            />
          )}
        </Field>

        <Field
          name="address_line2"
          label="Unit, suite or floor"
          error={firstError('address_line2')}
        >
          {(a11y) => (
            <input
              {...a11y}
              name="address_line2"
              type="text"
              autoComplete="address-line2"
              className={inputClass}
            />
          )}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="city" label="City" required error={firstError('city')}>
            {(a11y) => (
              <input
                {...a11y}
                name="city"
                type="text"
                autoComplete="address-level2"
                className={inputClass}
              />
            )}
          </Field>

          <Field
            name="region"
            label="State or region"
            required
            error={firstError('region')}
          >
            {(a11y) => (
              <input
                {...a11y}
                name="region"
                type="text"
                autoComplete="address-level1"
                className={inputClass}
              />
            )}
          </Field>

          <Field
            name="postal_code"
            label="Postal code"
            required
            error={firstError('postal_code')}
          >
            {(a11y) => (
              <input
                {...a11y}
                name="postal_code"
                type="text"
                autoComplete="postal-code"
                className={inputClass}
              />
            )}
          </Field>

          <Field
            name="country"
            label="Country"
            hint="Two-letter code, such as US."
            error={firstError('country')}
          >
            {(a11y) => (
              <input
                {...a11y}
                name="country"
                type="text"
                maxLength={2}
                defaultValue="US"
                autoComplete="country"
                className={inputClass}
              />
            )}
          </Field>
        </div>

        <Field
          name="asking_price"
          label="Asking price (USD)"
          hint="Leave blank if not set. Must be greater than zero."
          error={firstError('asking_price')}
        >
          {(a11y) => (
            <input
              {...a11y}
              name="asking_price"
              type="text"
              inputMode="decimal"
              className={inputClass}
            />
          )}
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 justify-self-start rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 text-sm font-semibold text-[var(--lagoon-deep)] disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </fieldset>
    </form>
  )
}
