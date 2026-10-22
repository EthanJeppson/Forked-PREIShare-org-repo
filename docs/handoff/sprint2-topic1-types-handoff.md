# Sprint 2 Topic 1 — Types Handoff: PREIshare Investor Listings

**Audience:** next sprint topic owners, PREIshare engineering, product partners
**Status:**
- Topic 1 (TypeScript foundations) is complete on the PR branch and not yet merged to `main`.
- Implementation topics (forms, database, API) have not started.

**Date:** 2026-10-22

## 1. Client story recap

PREIshare passed investor listing data around as loose objects, and bad data reached production:
- a missing price
- a status spelled three different ways
- an address field that disappeared on one screen

Sprint 2 Topic 1 describes a listing as strict TypeScript types, so mistakes like these fail at **compile time**, while a developer is still writing code, instead of in front of investors. The decisions and their reasons are in `docs/decisions/ADR-001-investor-listing-types.md`. This handoff points at that record instead of repeating it.

## 2. What we shipped this topic

| Deliverable | Path | Why it matters |
| --- | --- | --- |
| Domain brief and field inventory | `docs/domain/investor-listing-domain-brief.md`, `docs/domain/listing-field-inventory.md` | Business rules written before code. **These still differ from the code** (see section 3) |
| Types barrel | `src/types/index.ts` | The single import point for `InvestorListing` and its supporting types |
| Core, nested, and supporting types | `src/types/*.ts` | Covers:<br>• a status-based union (`closed` requires `closedAt`)<br>• closed lists for `ListingStatus`, `PropertyType`, `ContactRole`, and currency<br>• nested `Address`, `FinancialSummary`, `InvestorContact`, and `Ownership` |
| Valid fixtures | `src/fixtures/sample-investor-listings.ts` | Four realistic listings, one per status, plus `sampleInvestorListings`. Proves good data passes |
| Invalid fixtures and expected errors | `src/fixtures/invalid-listings.errors.ts`, `docs/type-safety/expected-type-errors.md` | Eight deliberately bad listings, each rejected with one documented error |
| Typecheck scripts | `package.json` (`typecheck`, `typecheck:errors`), `tsconfig.json`, `tsconfig.errors.json` | One repeatable gate, plus a separate check that the bad data is still rejected |
| Verification checklist | `docs/type-safety/verification-checklist.md` | Step-by-step proof that types, fixtures, and docs agree |
| Decision record | `docs/decisions/ADR-001-investor-listing-types.md` | Stakeholder-facing record of the type decisions |
| Types README | `src/types/README.md` | How to run the gate and what success looks like |

**How to verify locally** (from the project root, after `npm install`):

- `npm run typecheck` must finish with no `error TS...` lines and exit code 0.
- `npm run typecheck:errors` must **fail**, with exactly the 8 errors listed in `docs/type-safety/expected-type-errors.md`.
- Then walk `docs/type-safety/verification-checklist.md`.

## 3. What we must NOT claim is done yet

**Not built yet**

- No TanStack Start screens or listing forms use these types yet. The app is still the starter `/` and `/about` pages.
- No Supabase or PostgreSQL tables or migrations. There is also no Supabase client in the repo yet.
- No API routes or server functions for listings, and no checking of incoming data at the network boundary.
- No login, permissions, or deployed create/edit flow.

**Rules the types cannot enforce yet.** A runtime check must catch these (see ADR-001, Trade-offs):

- asking price above zero
- percentages between 0 and 100
- non-empty text
- date format and order
- `primaryContactId` matching a real contact

**Known gaps in the model**

- `financials` is optional for every status, so an active listing with no price still passes typecheck. This does not yet fully fix the "missing price" bug.
- `docs/domain/` disagrees with the code on several points:
  - status and property-type values
  - `description` vs `summary`
  - the contact name field
  - ownership as a list vs one object
  - the email-or-phone rule
  - the `notes` field

  The full list is in ADR-001, Follow-ups.
- None of this work is merged to `main` yet.

If a demo only shows a green typecheck on fixtures, say: **"the data model is typed and verified; product surfaces are next."**

## 4. Next sprint pickups (use the types, don't reinvent them)

Every track below imports listing types from `src/types/index.ts`. No track should redefine the listing shape or copy status, property-type, or role strings by hand.

### A. TanStack Start forms (UI)

- Build create/edit listing forms whose values are typed as `InvestorListing` (or `Address`, `FinancialSummary`, and so on), imported from `src/types/index.ts`.
- Drive status, property-type, and contact-role dropdowns from the `ListingStatus`, `PropertyType`, and `ContactRole` unions. Don't hand-type option strings in components.
- Use `src/fixtures/sample-investor-listings.ts` for realistic defaults and examples.
- Show a close-date input only when status is `closed`, matching the `ClosedInvestorListing` shape.
- Acceptance sketch: a form value with a status outside `ListingStatus`, or a closed listing without `closedAt`, fails typecheck during development.

### B. Supabase / PostgreSQL schema alignment (data)

- Design tables from `InvestorListing` as exported by `src/types/index.ts`:
  - columns for the required fields
  - `address` and `financials` as grouped columns or related tables
  - check constraints or enums matching the `ListingStatus` and `PropertyType` values
- Settle the `docs/domain/` differences first, especially ownership (one object vs a list) and whether visible listings need `financials`. Record the outcome in a new ADR so the database and the types don't drift apart silently.
- Add database constraints for the rules types can't enforce: price above zero, percentages from 0 to 100, and `primaryContactId` pointing at a real contact.
- Add a shared Supabase client before any queries; none exists in the repo yet.
- Acceptance sketch: a row that couldn't be assigned to `InvestorListing` is rejected by a constraint or by insert validation.

### C. API boundaries (server)

- Define list, get, create, and update with TanStack Start server functions (`createServerFn`). Their inputs and outputs should be typed with types imported from `src/types/index.ts`, not anonymous JSON.
- Check incoming data at runtime before treating it as an `InvestorListing`, since types disappear once code runs. Write endpoints must never accept a free-form status string.
- Test with fixture-shaped valid payloads, and with bad payloads that mirror `src/fixtures/invalid-listings.errors.ts`.
- Acceptance sketch: no handler widens `status` or `propertyType` back to plain `string`.

```text
Client pain (loose data)
        |
        v
 Domain brief + field inventory
        |
        v
 Strict TS types + fixtures + typecheck + ADR-001   <-- you are here
        |
        +--> TanStack Start forms (UI)
        +--> Supabase/PostgreSQL schema (data)
        +--> API routes & validation (boundary)
```

## 5. Prompting and review self-assessment

*To be completed by me (the learner), in my own words.*

- **Prompting habit that helped:** I ...
- **Second prompting habit that helped:** I ...
- **Review habit that caught an agent mistake:** I ...
- **What I would do differently next topic:** I ...
- **Confidence (1–5) explaining InvestorListing to a teammate:** ...

Things that actually happened in this series, to draw from or replace:

- Each lesson prompt started with the exact repo state (branch, last commit, the type files and their fields), so the agent edited the real model instead of guessing.
- Fixed rules went into every prompt:
  - no force-push
  - run `npm run typecheck` after each step
  - no `as` casts or `as const` in fixtures
  - flag every difference from the docs
- I asked for proof with deliberately broken cases (a temporary file of valid and invalid examples) to confirm errors landed only on the intended lines.
- I asked the agent to compare scaffold field names against the real type files instead of copying the scaffold. This caught `state` vs `region`, `noi`/`capRate`, `name` vs `fullName`, and the made-up roles and property types.
- After each lesson I asked follow-up questions to explain one contract in plain words.
- Possible "do differently": settle the `docs/domain/` differences before building, instead of carrying them to the end.

## 6. Handoff checklist for the next owner

- [ ] Read ADR-001 and this handoff before opening a UI or SQL PR.
- [ ] Import listing types from `src/types/index.ts` only.
- [ ] Keep `npm run typecheck` green, and `npm run typecheck:errors` failing with the documented 8 errors.
- [ ] Don't delete or "fix" `src/fixtures/invalid-listings.errors.ts`; it documents safety.
- [ ] File a new ADR if product changes allowed statuses, required fields, or the ownership shape.
- [ ] Resolve the `docs/domain/` differences listed in ADR-001 before designing database tables.
