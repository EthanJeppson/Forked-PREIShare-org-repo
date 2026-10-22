# Investor listing types — verification checklist

Use this list before review. Check each box only when you have evidence, such as a file you opened or a command you ran.

Sources:

- Domain rules: `docs/domain/investor-listing-domain-brief.md` and `docs/domain/listing-field-inventory.md`
- Types: `src/types/`
- Fixtures: `src/fixtures/`
- Expected errors: `docs/type-safety/expected-type-errors.md`

Where the code knowingly differs from the domain docs, the item says so. Those items pass only if the difference still matches what is written here. Each one is a decision for the stakeholder decision record, not something to fix quietly.

## A. Domain coverage

- [ ] `InvestorListing` (`src/types/investor-listing.ts`) has every top-level group from the field inventory:
  - [ ] `id`
  - [ ] `title`
  - [ ] a summary
  - [ ] `status`
  - [ ] `propertyType`
  - [ ] `address`
  - [ ] `financials`
  - [ ] `contacts`
  - [ ] `ownership`
  - [ ] `createdAt`
  - [ ] `updatedAt`
- [ ] The listing has no catch-all field such as `details` or `metadata`.
- [ ] The summary field is named `summary`. **Known difference:** the docs call it `description`.
- [ ] `ListingStatus` (`listing-status.ts`) is exactly `draft | active | under_contract | closed`, with no plain `string`.
  - **Known difference:** the docs list `draft | published | under_offer | sold | archived`.
- [ ] `PropertyType` (`property-type.ts`) is exactly `single_family | multi_family | commercial | land`, with no plain `string`.
  - **Known difference:** the docs list `multifamily | office | retail | industrial | mixed_use | land`.
- [ ] `Address` (`address.ts`) matches the inventory: `line1`, optional `line2`, `city`, `region`, `postalCode` (text), `country`.
- [ ] `FinancialSummary` (`financial-summary.ts`) matches the inventory: `askingPrice: number`, `currency: "USD"`, optional `projectedIrrPercent`, optional `capRatePercent`.
- [ ] `InvestorContact` (`investor-contact.ts`) has `id`, `fullName`, `role` (a `ContactRole`: `broker | owner_representative | property_manager`), `email`, and optional `phone`.
  - **Known difference:** the docs name the field `name` and require email *or* phone; the code requires `email`.
- [ ] `contacts` must have at least one entry, for every status. This is stricter than the brief, which only requires contacts for investor-visible listings.
- [ ] `Ownership` (`ownership.ts`) is one object: `ownerName`, optional `notes`, optional `ownershipPercent`.
  - **Known difference:** the docs describe a list of entries, each linked by `contactId` with a fixed `relationship`.
  - **Known difference:** the inventory forbids a `notes` field.
- [ ] `financials` is optional in every status. **Known difference:** the brief requires it for investor-visible listings.

## B. Type safety shape

- [ ] `src/types/index.ts` only re-exports with `export type { ... } from`, and defines nothing itself.
- [ ] `src/types/index.ts` exports all of these:
  - `Address`
  - `FinancialSummary`
  - `ContactRole`
  - `InvestorContact`
  - `InvestorListing`
  - `InvestorListingBase`
  - `ClosedInvestorListing`
  - `OpenInvestorListing`
  - `ListingStatus`
  - `Ownership`
  - `PropertyType`
- [ ] `InvestorListing` is a union on `status`:
  - [ ] `closed` requires `closedAt: string`.
  - [ ] Every other status leaves `closedAt` out.
- [ ] `id`, `createdAt`, and `updatedAt` are `readonly`; other fields are writable.
- [ ] No type uses `any`, and no status or property-type field is typed as plain `string`.
- [ ] The rules TypeScript can't check are listed under "Still accepted today" in `expected-type-errors.md`. Examples:
  - a price above zero
  - a percent between 0 and 100
  - `primaryContactId` matching a contact
  - date formats

## C. Fixtures

- [ ] `src/fixtures/sample-investor-listings.ts` imports from `../types` and has four samples, one per status:
  - `sampleActiveListing`
  - `sampleDraftListing`
  - `sampleUnderContractListing`
  - `sampleClosedListing`
- [ ] Together, the samples cover all four property types.
- [ ] `sampleInvestorListings` is typed `InvestorListing[]` and contains all four samples.
- [ ] Neither fixtures file uses `as` casts, `any`, `@ts-ignore`, or `as const`.
- [ ] `src/fixtures/invalid-listings.errors.ts` has exactly the 8 exports listed in `expected-type-errors.md`, and every row in that doc names a real export:
  - `invalidStatusSpelling`
  - `missingAddressCity`
  - `priceAsString`
  - `emptyContacts`
  - `invalidContactRole`
  - `ownershipWrongFieldName`
  - `closedWithoutClosedAt`
  - `openWithClosedAt`
- [ ] Each invalid export breaks exactly one rule.

## D. Typecheck gate

- [ ] `package.json` has `"typecheck": "tsc --noEmit"`.
- [ ] `npm run typecheck` from the project root shows no `error TS...` lines and exits with code 0.
- [ ] `tsconfig.json` excludes `src/fixtures/*.errors.ts`, so the intentional errors don't block the clean gate.
- [ ] `npm run typecheck:errors` (uses `tsconfig.errors.json`) exits non-zero with exactly 8 `error TS...` lines, all in `invalid-listings.errors.ts`.
- [ ] Those error codes and lines match the "Expected TypeScript error" column in `expected-type-errors.md`.
- [ ] `src/types/README.md` names both commands and says what success looks like for each.

## E. Sign-off

- [ ] I re-ran `npm run typecheck` and `npm run typecheck:errors` after the last fix.
- [ ] Every "Known difference" above is still accurate and is listed for the stakeholder decision record.
- [ ] I would hand this to a teammate without a verbal walkthrough of secret steps.
