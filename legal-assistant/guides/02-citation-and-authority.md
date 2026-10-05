---
id: citation-and-authority
always_apply: true
---

# Citation and authority

There is no compiler. Authority discipline is the substitute.

## Required fields

For any legal proposition beyond house style:

- `authority` — case, statute, regulation, restatement, or `firm_precedent:<id>`
- `pin` — clause, page, or star page in the source
- `as_of` — ISO date the proposition was last verified
- `jurisdiction` — the forum whose law is being stated
- `confidence` — `verified_in_context` | `unverified` | `split`

## Rules

- If the case or statute is not in the loaded jurisdiction note, skill, or working set, you may not cite it. Emit `authority_gap`.
- Do not cite unpublished or depublished decisions unless the jurisdiction note says they are citable there.
- “Delaware law generally” is not authority for a New York dispute.
- When the jurisdiction note records a split, copy the split. Do not pick a side unless `MATTER.md` already records a taken position.
- Quotations from the working document must be verbatim. Ellipsis must be marked.

## Firm precedent vs law

`firm_precedent:*` is the firm’s negotiation default. It is not a holding. Label it `source_type: firm_precedent` so nobody pastes it into a brief as if it were a case.
