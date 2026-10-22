# PREIshare investor listing types

This folder holds the shared TypeScript definitions for **PREIshare investor listings**: the property opportunities investors review on PREIshare.

Import everything from `src/types/index.ts` (for example `import type { InvestorListing } from "../types"`). Sample data that uses these types lives in `src/fixtures/`.

## Why this exists

The business goal comes from `docs/domain/investor-listing-domain-brief.md`: investors must be able to trust every listing they see. The client story names the bugs that break that trust today:

- a missing price,
- a status spelled three different ways,
- a nested address field that disappears on one screen.

The definitions that will live here exist so mistakes like these are caught when the code is checked (compile time), before an investor ever sees them.

## Source of truth

Business vocabulary and rules come from these two files. If code and these files disagree, the code is wrong:

- `docs/domain/investor-listing-domain-brief.md` (statuses, nested groups, success criteria)
- `docs/domain/listing-field-inventory.md` (every field, its shape, and whether it is required)

## What belongs here

- Definitions for listings and their parts (address, financial summary, contacts, ownership, statuses, property classifications).
- Nothing else: no screens, no API handlers, no database code.

## Typecheck

From the project root, after `npm install`, run:

```bash
npm run typecheck
```

**What success looks like:** the command prints only its own echo line (`> tsc --noEmit`), shows no `error TS...` lines, and exits with code 0. Any `error TS...` line means something is wrong and must be fixed before review.

Notes for beginners:

- `tsc --noEmit` means "check types only; do not write compiled JavaScript files."
- The clean gate checks the whole project, including `src/types/**` and `src/fixtures/sample-investor-listings.ts`.
- Intentional bad examples live in `src/fixtures/invalid-listings.errors.ts`, and each one is explained in `docs/type-safety/expected-type-errors.md`. `tsconfig.json` excludes every `src/fixtures/*.errors.ts` file, so they never break the clean gate.

To check the intentional bad examples on their own:

```bash
npm run typecheck:errors
```

This one is **supposed to fail**. Success here means exactly one `error TS...` line per row in `docs/type-safety/expected-type-errors.md` (8 today), each in `invalid-listings.errors.ts`, and a non-zero exit code. If it passes, or the errors don't match the doc, the types have become too loose.

Before review, also walk `docs/type-safety/verification-checklist.md`.

## What "strict" means here

`tsconfig.json` turns on `strict`, which makes the checker refuse loose or incomplete data. In plain terms:

- **No accidental "anything goes" values.** A value must have a known shape; the checker will not quietly accept a guess.
- **No forgetting that something might be missing.** If a value can be empty, the code must handle that before using it.
- **No missing properties.** An object that leaves out a required field, like a price, is an error.

Extra safety flags are also on:

- `noUncheckedIndexedAccess` — picking an item out of a list or lookup treats it as possibly missing, so code cannot assume the first contact exists.
- `exactOptionalPropertyTypes` — an optional field is either left out or has a real value; it cannot be set to "undefined" on purpose.
- `noImplicitOverride` — forces code to say when it replaces something inherited.
- `forceConsistentCasingInFileNames` — file names must be written with the same capitalization everywhere, so the project behaves the same on every operating system.

## Note on the shared project config

This repository is also the TanStack Start app, so `package.json` and `tsconfig.json` are shared with the app rather than being a separate types package. The checker covers all `.ts` and `.tsx` files in the project, including everything under `src/types/`, except the intentional `src/fixtures/*.errors.ts` files. Those are checked by `tsconfig.errors.json` instead.
