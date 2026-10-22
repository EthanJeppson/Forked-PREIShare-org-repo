# ADR-001: Investor listing TypeScript types (PREIshare)

- **Status:** Accepted (Sprint 2, Topic 1)
- **Date:** 2026-10-22
- **Owners:** PREIshare types working group (learner + coach)
- **Related code:** `src/types/index.ts` (the single import point for these types)

## Context

PREIshare shows investors property opportunities, called investor listings. Listings were passed around as loose data, which caused real production bugs:
- a missing price
- a status spelled three different ways
- an address field that disappeared on one screen

Sprint 2 Topic 1 describes a listing as strict TypeScript types. When someone writes a listing with the wrong shape, the project's check command fails while the code is being written, before any investor sees it.

Business inputs:

- Domain brief: `docs/domain/investor-listing-domain-brief.md`
- Field inventory: `docs/domain/listing-field-inventory.md`
- Safety evidence: `docs/type-safety/expected-type-errors.md` and `docs/type-safety/verification-checklist.md`

The code does not match these two domain docs everywhere. Where they differ, the code follows the decisions made in each lesson step. Every difference is listed under Follow-ups so the docs and code can be brought back together.

## Decision

We define one main type, `InvestorListing`, plus small supporting types. All of them are exported from `src/types/index.ts`:
- `Address`
- `FinancialSummary`
- `ContactRole`
- `InvestorContact`
- `Ownership`
- `ListingStatus`
- `PropertyType`
- the helper types `InvestorListingBase`, `ClosedInvestorListing`, and `OpenInvestorListing`

Other code imports from `src/types/index.ts`, not from the individual files.

The three biggest decisions:

1. **Closed lists, not free text.** Status, property type, contact role, and currency only accept exact listed values. A typo is an error.
2. **Grouped data stays grouped.** Address, money summary, contacts, and ownership are each their own nested object, so they can't be half-filled across loose fields.
3. **Status decides what else is required.** A closed listing must say when it closed (`closedAt`). Any other listing must not have a close date.

## Type choices mapped to business rules

| Business rule (plain language) | Type choice | Why this shape |
| --- | --- | --- |
| Every listing has identity, a name, a summary, a type, an address, contacts, ownership, and timestamps | Required fields on `InvestorListingBase`:<br>`id`, `title`, `summary`, `propertyType`, `address`, `contacts`, `primaryContactId`, `ownership`, `createdAt`, `updatedAt` | A listing missing any of these fails the check |
| Status is one of a known set | `ListingStatus` is the union `draft \| active \| under_contract \| closed` (`listing-status.ts`) | A free `string` would allow typos and several spellings of one status |
| Property type is one of a known set | `PropertyType` is the union `single_family \| multi_family \| commercial \| land` (`property-type.ts`) | Same reason as status |
| Address parts travel together | Nested `Address` with required:<br>`line1`, `city`, `region`, `postalCode`, `country`<br>and optional `line2` (`address.ts`) | Stops the "address field disappears on one screen" bug |
| Postal codes keep leading zeros | `Address.postalCode` is text, not a number | `"02134"` stored as a number becomes `2134` |
| Money is a structured summary | Nested `FinancialSummary`:<br>`askingPrice: number`, `currency: "USD"`<br>optional `projectedIrrPercent` and `capRatePercent` (`financial-summary.ts`) | A price written as text, or a currency other than USD, fails the check |
| A listing may be saved before pricing is known | `financials` is **optional** on every listing | Lets editors save unfinished work.<br>Trade-off: an active listing with no price still passes (see Follow-ups) |
| Investors need someone to contact | `contacts` must have at least one `InvestorContact`<br>Each contact has `id`, `fullName`, `role`, `email`, and optional `phone` (`investor-contact.ts`) | An empty contact list fails the check |
| Contact roles are a known set | `ContactRole` is the union `broker \| owner_representative \| property_manager` | Stops free-text roles like `"listing_agent"` |
| One contact is the main contact | `primaryContactId` is required text | Gives every listing a main contact.<br>The type can't prove the id matches a real contact, so that needs a runtime check later |
| Ownership is described with the listing | Nested `Ownership`:<br>`ownerName`, optional `notes`, optional `ownershipPercent` (`ownership.ts`)<br>One object, not a list | Keeps owner details grouped with the listing |
| Closed deals record when they closed | `InvestorListing` is a union decided by `status`:<br>`closed` requires `closedAt` text, and other statuses must leave it out<br>`ClosedInvestorListing` and `OpenInvestorListing` name the two shapes | Stops closed deals without a date and open listings with one |
| Identity and history timestamps don't change casually | `id`, `createdAt`, and `updatedAt` are `readonly` | Code can't quietly overwrite them.<br>Changing `updatedAt` means building a new listing object |

## Alternatives considered

1. **Keep listings as untyped data, free `string`, or `any`.** Rejected. It is fastest at first, but every mistake shows up in production instead of at check time.
2. **One flat type with many optional fields.** Rejected. "Everything optional" brings back missing-field bugs, and a flat shape loses the address and money groupings.
3. **TypeScript `enum` for the closed lists.** Not used. Plain string unions read more simply in sample data and error messages. Revisit only if there is a real need for enum objects at runtime.
4. **A runtime validation library as the source of truth.** Out of scope for this topic. Types and sample data come first; runtime checks can mirror these same decisions later.
5. **A separate shape for every status.** Not used. Only `closed` carries an extra field (`closedAt`), so two shapes are enough.

## Consequences

**Positive**

- **Valid samples:** `src/fixtures/sample-investor-listings.ts` has four realistic listings, one per status, covering all four property types. They all pass the check, which proves the types are usable.
- **Rejected bad data:** `src/fixtures/invalid-listings.errors.ts` has 8 deliberately bad listings, and each produces exactly one error. They cover:
  - a status typo
  - a missing city
  - a price written as text
  - no contacts
  - an unknown contact role
  - an unknown ownership field
  - a closed listing with no close date
  - an open listing with a close date

  `docs/type-safety/expected-type-errors.md` explains each one.
- **Two repeatable commands:**
  - `npm run typecheck` is the clean gate and must pass.
  - `npm run typecheck:errors` checks the bad samples on their own and must fail with exactly those 8 errors.

**Trade-offs**

- Authors must use the exact listed values; "almost right" strings fail on purpose.
- Sample data and future API code must supply whole `Address` and `FinancialSummary` objects, not scattered fields.
- Some rules can't be checked by types alone, so they still need runtime checks:
  - a price above zero
  - percentages between 0 and 100
  - non-empty text
  - date format and order
  - `primaryContactId` matching a real contact
- Every listing needs at least one contact, including drafts. That is stricter than the brief, which only requires contacts on investor-visible listings.
- `financials` is optional for every status, so the types don't yet prevent the "missing price" bug on active listings.
- `docs/domain/` doesn't match the code yet, and that will confuse readers until it is updated.

## Out of scope for Sprint 2 Topic 1

- Database tables, migrations, and Supabase types
- API routes and runtime validation of incoming data
- Screens, forms, and form validation messages
- Login, permissions, and user roles
- Payments, offers, and document uploads
- Deploying or changing production data

## Follow-ups (for the next topic / implementers)

1. Import listing types from `src/types/index.ts` when building screens or API code.
2. Keep `npm run typecheck` passing and `npm run typecheck:errors` failing with the documented 8 errors. Use `docs/type-safety/verification-checklist.md` whenever the types change.
3. If product adds a status or property type, add it to `ListingStatus` or `PropertyType` and update the samples and this ADR. Don't widen the field back to a free `string`.
4. Add runtime checks for the rules types can't enforce (listed under Trade-offs) once API boundaries exist.
5. Decide with the client whether active, under-contract, and closed listings must have `financials`.
6. Update `docs/domain/investor-listing-domain-brief.md` and `docs/domain/listing-field-inventory.md` to match the code, or change the code, for each of these differences:

   | Topic | Docs say | Code says |
   | --- | --- | --- |
   | Statuses | `draft`, `published`, `under_offer`, `sold`, `archived` | `draft`, `active`, `under_contract`, `closed` |
   | Property types | `multifamily`, `office`, `retail`, `industrial`, `mixed_use`, `land` | `single_family`, `multi_family`, `commercial`, `land` |
   | Listing summary field name | `description` | `summary` |
   | Contact name field | `name` | `fullName` |
   | Contact reach | email *or* phone | email required |
   | Ownership | a list of entries linked to contacts by `contactId`, with a `relationship` | one `Ownership` object |
   | `notes` field | forbidden | `Ownership.notes` exists |
   | `closedAt` | not defined | required for closed listings |

## Evidence links

- Domain brief: `docs/domain/investor-listing-domain-brief.md`
- Field inventory: `docs/domain/listing-field-inventory.md`
- Expected compile errors: `docs/type-safety/expected-type-errors.md`
- Verification checklist: `docs/type-safety/verification-checklist.md`
- Types entrypoint: `src/types/index.ts`
- Valid samples: `src/fixtures/sample-investor-listings.ts`
- Invalid samples: `src/fixtures/invalid-listings.errors.ts`
