---
name: nda-review
description: First-pass review of NDAs and confidentiality agreements. Use when document_type is nda, confidentiality-agreement, or mutual-nda.
triggers:
  document_types: [nda, confidentiality-agreement, mutual-nda]
---

# Skill: NDA review

Load this skill instead of stuffing NDA folklore into always-on rules.

## Checklist (issue codes)

| Code | Look for | Default Harbor & Quill ask |
| --- | --- | --- |
| `NDA-DEF-SCOPE` | Definition of Confidential Information over/under inclusive | Residuals clause only if client file opts in |
| `NDA-EXCL` | Standard exclusions (public, independently developed, third-party lawful) | Require all three |
| `NDA-TERM` | Duration | 3 years commercial; perpetual trade secrets |
| `NDA-USE` | Use limited to the stated Purpose | Purpose must match `MATTER.md` deal description |
| `NDA-RETURN` | Return/destroy vs retention for legal archive | Allow professional-records retention |
| `NDA-RESIDUALS` | Residuals / unaided memory | Hard stop unless client `residuals_opt_in` |
| `NDA-NONSOLICIT` | Hidden non-solicit or non-compete | Flag; employment overlay if CA |
| `NDA-GOVLAW` | Governing law / venue vs matter default | Align or flag conflict |
| `NDA-INJ` | Injunctive relief | Usually accept; watch one-sided fee shifts |
| `NDA-ASSIGN` | Assignment on change of control | Permit assignment to affiliates / acquirers |

## Cross-document memory

Before commenting, read:

- defined-terms lock (do not create a second definition of `Purpose`)
- decisions-log (if we already accepted a five-year term, do not re-redline to three without `reversal`)
- client preferences (effort standards usually N/A; residuals and non-solicit are not)

## Output

1. Findings array (schema).
2. Optional redlines (`ask` only unless asked for fallbacks).
3. Proposed memory records if a new client preference appeared twice.
