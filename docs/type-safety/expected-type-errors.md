# Expected type errors for invalid investor listings

`src/fixtures/invalid-listings.errors.ts` is **supposed to fail** typechecking. Each export breaks exactly one rule of `InvestorListing` (from `src/types/`), and each one should produce exactly one TypeScript error. A red error there is proof the types protect PREIshare data. Do not "fix" those errors, and do not hide them with `any`, `@ts-ignore`, or `as` casts.

The happy-path samples live in `src/fixtures/sample-investor-listings.ts` and must keep compiling with no errors.

## Cases

| Export | What is wrong (business terms) | Rule that should catch it | Expected TypeScript error |
| --- | --- | --- | --- |
| `invalidStatusSpelling` | Status is the typo `"availble"`, so status filters and badges would miss the listing | `status` must be a `ListingStatus` (`listing-status.ts`) | Wrong string literal (TS2322): `"availble"` is not assignable to the status union |
| `missingAddressCity` | Address has no city, so the property can't be shown on a map or found by city | `Address.city` is required (`address.ts`) | Missing property (TS2741): `city` is missing but required in `Address` |
| `priceAsString` | Asking price is the text `"610000"`, so sorting and math on prices would break | `FinancialSummary.askingPrice: number` (`financial-summary.ts`) | Wrong primitive type (TS2322): `string` is not assignable to `number` |
| `emptyContacts` | No contacts, so investors have nobody to reach and `primaryContactId` points at nobody | `contacts` must have at least one entry (`investor-listing.ts`) | Wrong list shape (TS2322): `[]` is not assignable to `[InvestorContact, ...InvestorContact[]]` |
| `invalidContactRole` | Contact role is the free text `"listing_agent"`, which is not a role PREIshare uses | `InvestorContact.role` must be a `ContactRole` (`investor-contact.ts`) | Wrong string literal (TS2322): `"listing_agent"` is not assignable to `ContactRole` |
| `ownershipWrongFieldName` | Ownership share is stored under the invented name `percentOwned`, so screens reading `ownershipPercent` would show nothing | `Ownership` only allows its declared fields (`ownership.ts`) | Unknown property (TS2353): `percentOwned` does not exist in type `Ownership` |
| `closedWithoutClosedAt` | A closed deal with no close date, so history and reports can't say when it closed | Status `closed` requires `closedAt: string` (`investor-listing.ts`) | Not assignable to the union (TS2322), with the error on the export name: no union branch matches |
| `openWithClosedAt` | An active listing with a close date, which contradicts its status | Statuses other than `closed` must leave out `closedAt` (`investor-listing.ts`) | Not assignable to the union (TS2322), with the error on the export name: no union branch matches |

## How the file is checked

- `tsconfig.json` excludes `src/fixtures/*.errors.ts`, so `npm run typecheck` stays green for normal work.
- Editors may still show red errors when the file is open. That is expected.
- A later step adds a script that typechecks this file on its own and treats these errors as the expected result.

## Holes found while reviewing the types

**Fixed in this step**

- **Empty contacts list.** `contacts` was `InvestorContact[]`, so `[]` was accepted. The domain brief requires at least one contact, and `primaryContactId` is required on every listing. `contacts` is now `[InvestorContact, ...InvestorContact[]]`, and `emptyContacts` covers it.
- **Drafts.** This rule now also applies to drafts. The brief only requires contacts on investor-visible listings, but our model already required `primaryContactId` for drafts.

**Still accepted today, left for runtime validation** (TypeScript can't express these as plain types):

- `askingPrice` of zero, a negative number, or `NaN`. The brief requires a price greater than zero.
- `ownershipPercent` outside 0 to 100, for example `150`.
- Empty strings for `id`, `title`, `summary`, address lines, or contact names.
- `primaryContactId` that doesn't match any `contacts[].id`.
- Badly formatted dates in `createdAt`, `updatedAt`, or `closedAt`, or `updatedAt` earlier than `createdAt`.
- `country` that isn't a two-letter uppercase code, for example `"usa"`.

**Known model trade-offs, not changed here**

- `financials` is optional for every status. The brief requires it for investor-visible listings, so an active listing with no price still type-checks.
- These names and value lists still differ from `docs/domain/`:
  - The status and property-type value lists.
  - `summary` in code vs `description` in the docs.
  - A single ownership object in code vs an ownership list in the docs.
  - A required email in code vs email-or-phone in the docs.
