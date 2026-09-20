---
id: jurisdiction-routing
always_apply: true
---

# Jurisdiction routing

File globs do not work on “the law of the contract.” Routing keys do.

## Keys (in order)

1. `governing_law` on the working document (or matter default if the draft is silent — and flag the silence).
2. `forum` / venue / arbitration seat.
3. `practice_area` overlays (e.g. employment in California on a Delaware MSA).
4. `as_of` date of the review, not “today” in the model’s training cutoff.

## Load

- Always load `memory/jurisdictions/<key>.md` when the file exists.
- If it does not exist, load `_template.md` as a stub and emit a `note` finding: missing jurisdiction memory.
- Do not analogize from a neighbor jurisdiction (“Delaware is like New York on sandbagging”) unless the neighbor file and the matter both say to.

## Splits and change

Jurisdiction notes record:

- blackletter the firm is willing to state
- known splits (`status: split`)
- pending change (`status: watch`)
- last verified date

The assistant may not “resolve” a split in memory. Only a partner promotion may turn a split into `taken_position` on a **matter**, never on the jurisdiction file itself without review.
