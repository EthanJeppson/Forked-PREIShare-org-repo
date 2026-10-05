---
name: contract-redline
description: General commercial contract redline (MSA, SOW, SPA, vendor paper) applying firm precedent rules and matter positions.
triggers:
  document_types: [msa, sow, spa, vendor-paper, professional-services]
---

# Skill: Contract redline

## Order of operations

1. Identify paper (ours vs theirs) from the document index.
2. Run matching `precedent-rules.json` rows.
3. Apply matter `decisions-log` so we do not oscillate.
4. Apply client risk-tolerance (caps, specials, insurance).
5. Produce redlines with `ask` / `fallback` / `walk_away`.

## Recurring issue codes

| Code | Topic |
| --- | --- |
| `K-CAP` | Limitation of liability cap and carve-outs |
| `K-IND` | Indemnity scope, IP, third-party claims |
| `K-EFFORT` | Efforts standards |
| `K-SANDBAG` | Sandbagging / anti-sandbagging |
| `K-SURVIVE` | Survival periods |
| `K-LAW` | Governing law and forum |
| `K-ASSIGN` | Assignment |
| `K-AUDIT` | Audit rights |
| `K-AI` | Training on client data / model use |

## Specials

- Unlimited IP indemnity is `partner_approval` except when selling our own product under house paper.
- California employment overlays beat Delaware MSA non-competes for individuals.
- Do not “improve” a clause that the decisions-log marked `taken_with_counterparty`.
