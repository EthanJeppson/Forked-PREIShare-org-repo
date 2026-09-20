# Worked example — NDA v3 review pass

This is what a turn looks like when the assembler, guides, client memory, and matter decision log are all in play. The point is **continuity**: v3 is not a blank NDA.

## Request

> Matter `2026-cv-northwind-meridian`. Review `NDA-MER-v3`. Task: review. Privilege: confidential. Do not send.

## What must be loaded (manifest)

Always-on: ethical invariants, `.legalrules.md`, `LEGAL.md`, review standards, citation guide, memory-write protocol, privilege guide (because not public).

Matter: `MATTER.md`, parties, issues, chronology, decisions-log, defined-terms lock.

Client: Acme preferences (no residuals; commercially reasonable efforts; flag NY jury waiver).

Jurisdiction: Delaware (matter default) **and** a conflict finding because the draft selects New York.

Skill: `nda-review`. Context pack: `nda.json`.

Working set: `NDA-MER-v3` excerpt.

Tools: web off, email off, court_file off, memory_write_active off.

## Findings the assistant should emit

| ID | Code | Severity | Why this is not a first-time comment |
| --- | --- | --- | --- |
| F1 | `NDA-RESIDUALS` | `hard_stop` | Residuals **returned** after `DEC-01` / `DEC-06`. This is a reversal by the other side, not a new issue. Cite `HQ-NDA-RESIDUALS` and Acme `residuals_opt_in: false`. |
| F2 | `NDA-USE` | `material` | Purpose widened to “any current or future business relationship,” contradicting `DEC-02` and the defined-terms lock. |
| F3 | `NDA-TERM` | `material` | Five years vs `DEC-03` ask of three + perpetual trade secrets (`HQ-NDA-TERM`). |
| F4 | `NDA-NONSOLICIT` | `material` | §4 still present; `DEC-05` asked delete; Acme max 12 months **employees only** if they insist. |
| F5 | `NDA-GOVLAW` | `material` | NY law vs matter Delaware ask (`DEC-04`). Blocking question `Q-1` remains. Do not concede in sendable text. |
| F6 | `HQ-NY-JURY` | `note` | Jury waiver on NY paper — Acme preference is flag, not auto-accept. |
| F7 | `HQ-K-AI-TRAINING` | `hard_stop` | §6 training on Confidential Information. Firm hard stop; Acme walk-away. |

## What the assistant must not do

- Invent a 2024 SDNY residuals case.
- Accept residuals because “they are common.”
- Write an `active` client memory record (Acme residuals preference is already active).
- Produce sendable comments that mention `hard_stop` or internal decision ids.
- Load another client’s NDA playbook.

## Sendable ask (only if requested)

1. Delete residuals.
2. Restore Purpose to the lock language.
3. Three-year term; perpetual trade secrets.
4. Delete non-solicit.
5. Delaware law; delete jury waiver or defer pending `Q-1`.
6. Delete model-training use.

Internal fallbacks stay in `output_class: internal_only`.
