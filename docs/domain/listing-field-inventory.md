# Listing Field Inventory (PREIshare)

Sprint 2, Topic 1 — Step 1 (domain map). Business language only: this document contains no code. It is the field-by-field companion to `docs/domain/investor-listing-domain-brief.md`.

Use these tables as the source of truth when later steps define code. Field names are the names later code should use; meanings, shapes, and required rules are mandatory.

**How to read the tables**

- **Shape** is one of: text, number, datetime, fixed choice, nested object, or list.
- **Required?** means required for a listing that is visible to investors (`published`, `under_offer`, `sold`). A `draft` only needs `id`, `title`, `status`, `propertyType`, `createdAt`, and `updatedAt`. "No" means the field may be absent in every status.
- Dotted names such as `address.city` mean "the `city` field inside the `address` group". Names ending in `[]` mean "each entry in this list".
- Items marked **TODO** are proposals I could not verify from the client story or repo; see the brief's open questions.

## Identity and classification (top level of the listing)

| Field | Meaning | Shape | Required? | Examples / allowed values |
| --- | --- | --- | --- | --- |
| `id` | Stable, unique identifier for the listing; never reused | text | Yes, always | `lst_dev_1001` |
| `title` | Short name shown to investors | text | Yes, always | `Riverfront Multifamily Offering` |
| `description` | Short investor-facing summary of the opportunity | text | Yes for investor-visible statuses; no for `draft` and `archived` | `Value-add apartment community near transit.` |
| `status` | Lifecycle state of the listing | fixed choice | Yes, always | exactly one of `draft`, `published`, `under_offer`, `sold`, `archived` |
| `propertyType` | Property classification (asset class) | fixed choice | Yes, always | exactly one of `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land` |
| `address` | Where the property is | nested object | Yes for investor-visible statuses | see Address below |
| `financials` | Money summary for the listing | nested object | Yes for investor-visible statuses | see Financial summary below |
| `contacts` | People investors can reach about this listing | list (of nested objects) | Yes, at least one entry, for investor-visible statuses | see Investor contacts below |
| `ownership` | How the contacts relate to the property | list (of nested objects) | Yes, at least one entry, for investor-visible statuses (TODO: confirm) | see Ownership below |
| `createdAt` | When the listing record was created | datetime | Yes, always | `2026-03-01T10:00:00Z` |
| `updatedAt` | When the listing was last meaningfully edited; not earlier than `createdAt` | datetime | Yes, always | `2026-03-15T16:30:00Z` |

Status and `propertyType` are closed lists. Any other value, other spelling, or different capitalization is invalid.

## Address (nested object: `address`)

| Field | Meaning | Shape | Required? | Examples / allowed values |
| --- | --- | --- | --- | --- |
| `address.line1` | Street number and name | text | Yes | `500 River Rd` |
| `address.line2` | Unit, suite, or floor | text | No | `Suite 200` |
| `address.city` | City or town | text | Yes | `Austin` |
| `address.region` | State, province, or region | text | Yes | `TX` |
| `address.postalCode` | Postal or ZIP code, kept as text so leading zeros survive | text | Yes | `78701` |
| `address.country` | Country, as a two-letter uppercase code (TODO: confirm format) | text | Yes | `US` |

## Financial summary (nested object: `financials`)

| Field | Meaning | Shape | Required? | Examples / allowed values |
| --- | --- | --- | --- | --- |
| `financials.askingPrice` | Listed price, greater than zero, in the major unit of the currency (TODO: confirm) | number | Yes | `12500000` |
| `financials.currency` | Currency of the asking price | fixed choice | Yes | `USD` (TODO: only `USD` until the client names more) |
| `financials.projectedIrrPercent` | Projected internal rate of return, as a percentage | number | No | `12.5` |
| `financials.capRatePercent` | Capitalization rate, as a percentage | number | No | `5.8` |

Optional percentage figures, when present, are between 0 and 100 (TODO: confirm the upper bound with the client).

## Investor contacts (list: `contacts[]`)

The list must have at least one entry for investor-visible statuses. Each entry is a nested object with the fields below.

| Field | Meaning | Shape | Required? | Examples / allowed values |
| --- | --- | --- | --- | --- |
| `contacts[].id` | Identifier unique within this listing, so ownership can point at a contact (added by me; not in the lesson scaffold) | text | Yes, each contact | `ct_1` |
| `contacts[].name` | Person or firm name | text | Yes, each contact | `Jordan Lee` |
| `contacts[].role` | Why this person is on the listing | fixed choice | Yes, each contact | exactly one of `broker`, `owner_representative`, `property_manager` (TODO: proposed list) |
| `contacts[].email` | Email address | text | One of email or phone is required | `jordan@example.com` |
| `contacts[].phone` | Phone number | text | One of email or phone is required | `+1-512-555-0142` |

## Ownership (list: `ownership[]`)

Each entry says how one contact relates to the property.

| Field | Meaning | Shape | Required? | Examples / allowed values |
| --- | --- | --- | --- | --- |
| `ownership[].contactId` | Which contact this entry refers to; must match a `contacts[].id` on the same listing | text | Yes, each entry | `ct_1` |
| `ownership[].relationship` | The contact's relationship to the asset | fixed choice | Yes, each entry | exactly one of `primary_owner`, `co_owner`, `broker`, `property_manager` (TODO: proposed list) |
| `ownership[].sharePercent` | Ownership share, as a percentage; all shares on one listing add up to no more than 100 | number | No | `60` |

## Inventory rules (must hold)

1. Do not add top-level groups beyond identity, address, financials, contacts, and ownership without first updating the domain brief.
2. `status` and `propertyType` are closed lists. They are never free text, and no extra values may be added without updating both documents.
3. `address` and `financials` are nested objects, not flat loose fields.
4. `contacts` is a list. Investor-visible listings need at least one contact, and every contact needs a reachable channel (email or phone).
5. `contacts[].role`, `ownership[].relationship`, and `financials.currency` are fixed choices, not free text.
6. Every field marked required above must appear in later code definitions, unless a written decision record deliberately relaxes it.
7. There is no catch-all field such as "details", "metadata", or "notes".

## Differences from the lesson scaffold (for review)

- Added `contacts[].id` and replaced the scaffold's `ownership[].contactNameOrId` with `ownership[].contactId`, because "name or id" is ambiguous when names repeat.
- Made `contacts[].role` a fixed choice instead of "fixed choice or text" to honor the no-free-text rule.
- Made `financials.currency` a fixed choice (single value for now) instead of "fixed choice or text code".
- Changed the scaffold's example id `lst_ ev_1001` (it contains a stray space) to `lst_dev_1001`.
