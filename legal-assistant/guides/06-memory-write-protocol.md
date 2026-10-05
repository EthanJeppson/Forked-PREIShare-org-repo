---
id: memory-write-protocol
always_apply: true
---

# Memory write protocol

Evolving memory is allowed. Silent mutation of the firm’s brain is not. This is the analog of “work on a copy, propose, standards check, merge to main.”

## Layers and write rights

| Store | Model may | Promotion required |
| --- | --- | --- |
| Session | Anything ephemeral | Destroyed at turn end unless promoted |
| `matters/*/decisions-log.md` | Append `status: proposed` | Assigned attorney |
| `matters/*` other files | Propose a patch | Assigned attorney |
| `clients/*/preferences.md` | Propose after **two** consistent observations | Relationship partner |
| `jurisdictions/*` | Propose with authority + as_of | Practice group partner |
| `firm/precedent-rules.json` | Propose only | Management committee / GC analog |
| `guides/00-ethical-invariants.md` and `.legalrules.md` hard stops | **Never** | Humans only, out of band |

## Required envelope

Every proposed memory record must validate against `schemas/memory-record.schema.json`:

- `layer`, `scope_id`, `statement`, `source_document_ids`, `observed_at`, `author` (attorney id, not `assistant`)
- `status`: `proposed` | `active` | `superseded`
- `confidence` and `as_of`

## Anti-patterns

- Do not store “the client is difficult.” Store operational preferences (“reject best efforts; use commercially reasonable efforts”).
- Do not store gossip, medical, or irrelevant personal data.
- Do not overwrite `active` records. Supersede them so the audit trail remains.
- Do not promote a client preference into a firm hard_stop.
- Do not write another matter’s facts into this matter to “save time.”

## Observation threshold (clients)

1. First mention in a document or email: `note` on the matter, not the client file.
2. Second independent mention: proposed client-memory record.
3. Partner confirmation: `active`.
