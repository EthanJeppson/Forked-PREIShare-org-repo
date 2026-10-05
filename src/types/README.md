# PREIshare investor listing types

This folder will hold the shared TypeScript definitions for **PREIshare investor listings**: the property opportunities investors review on PREIshare.

Right now it is intentionally empty of code. This step only sets up the workspace and proves the checker runs. The listing definitions come in later steps.

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

## How to check

From the project root, after `npm install`:

```bash
npm run typecheck
```

This runs `tsc --noEmit`. TypeScript reads the project's `.ts` and `.tsx` files, reports any problems, and writes no output files. A clean run prints nothing after the command echo and exits with code 0.

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

This repository is also the TanStack Start app, so `package.json` and `tsconfig.json` are shared with the app rather than being a separate types package. The checker covers all `.ts` and `.tsx` files in the project, which includes everything under `src/types/`.
