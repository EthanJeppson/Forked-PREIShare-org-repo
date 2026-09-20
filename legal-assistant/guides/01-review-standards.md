---
id: review-standards
always_apply: true
overridable: false
---

# Firm review standards

How Harbor & Quill expects a first-pass review to look. Document-type extras live in skills.

## Pass order (do not skip)

1. **Identity.** Parties, document type, governing law, counterparties, version vs the document index.
2. **Defined-terms lock.** Compare the draft’s definitions to `memory/matters/<id>/defined-terms.lock.json` if present. Drift is a finding, not a silent fix.
3. **Hard stops.** Run `memory/firm/precedent-rules.json` filters for this doc type and jurisdiction.
4. **Matter positions.** Apply `decisions-log.md`. Do not re-open a position marked `taken_with_counterparty` without flagging it as a reversal.
5. **Client preferences.** Apply after hard stops, never over them.
6. **Issue spot.** Use the skill’s issue codes. Do not invent parallel taxonomies.
7. **Output.** Structured findings first; prose summary second; proposed redlines third if asked.

## Severity

| Severity | Meaning | Default disposition |
| --- | --- | --- |
| `hard_stop` | Firm will not send / sign as-is | Block sendable output on that clause |
| `partner_approval` | Allowed only with named partner | Finding + approval checkbox |
| `material` | Changes risk allocation or rights | Propose markup |
| `housekeeping` | Consistency, definitions, cross-refs | Propose markup |
| `note` | Watch item, no markup required | Log only |

## What “done” means for a pass

- Every `hard_stop` and `partner_approval` rule that matches was evaluated (hit or explicit N/A with reason).
- Findings validate against `schemas/review-finding.schema.json`.
- The context manifest is stored (which guides, memory files, and docs were loaded).
- No sendable text includes internal strategy or authority_gap speculation.

## Out of scope for a standard pass

- Tax, regulatory specialty, or local-counsel opinions unless that skill is loaded.
- Re-negotiation strategy memos (use `skills/issue-spotting-memo`).
- Document translation or notarial formalities.
