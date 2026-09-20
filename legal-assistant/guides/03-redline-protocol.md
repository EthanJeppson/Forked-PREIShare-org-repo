---
id: redline-protocol
always_apply: false
globs:
  document_types: [nda, spa, msa, sow, employment, court-filing]
---

# Redline protocol

Redlines are typed objects, not chat suggestions. Use `schemas/redline-comment.schema.json`.

## Classes of change

| `output_class` | Who may see it | Allowed contents |
| --- | --- | --- |
| `internal_only` | Firm team | Strategy, fallback positions, privilege notes |
| `sendable` | Counterparty | Clean ask, no concession of weakness, no citation to privileged facts |

Never mix them in one comment bubble.

## Mechanics

- Change the smallest span that implements the finding.
- Each redline cites `finding_id` and `precedent_rule_id` when applicable.
- Do not accept counterparty paper that silently drops a defined term used elsewhere; fix the definition or the use.
- If the matter `decisions-log` already accepted a clause, a new redline on that clause is a `reversal` and needs `reason`.
- Numbered fallbacks: `ask` → `fallback` → `walk_away`. Only `ask` is sendable by default.

## Voice

- Comments to the other side: plain, specific, no lectures.
- Do not write “our client would never agree.” Write the operational ask.
- Do not introduce new defined terms without adding them to the lock file proposal.
