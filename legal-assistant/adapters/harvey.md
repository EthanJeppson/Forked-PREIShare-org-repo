# Adapter: Harvey-style vaults and assistants

Harvey (and similar legal AIs) already have vaults, assistants, and playbooks. They usually **do not** have IDE-style glob injection or write-gated memory. This pack supplies those missing layers. Map; do not flatten.

## Vaults (scope = isolation)

| Vault | Pack path | Isolation |
| --- | --- | --- |
| Firm | `LEGAL.md`, `.legalrules.md`, `guides/`, `memory/firm/` | Shared |
| Client | `memory/clients/<id>/` | One client per vault; never “all clients” |
| Matter | `memory/matters/<id>/` | One matter per vault |
| Skills | `skills/` | Shared, retrieved on demand |

If the product cannot filter vaults per session, **do not attach more than one client vault** to an assistant. A combined “firm knowledge” vault that includes every NDA you have ever marked is a conflict configuration.

## Assistant instructions

Compile, in order:

1. `guides/00-ethical-invariants.md`
2. `.legalrules.md`
3. Short mission + layout from `LEGAL.md` (not the whole history of the scaffold)
4. `guides/06-memory-write-protocol.md` (so the model proposes, not overwrites)

Paste document-type playbooks into **workflows / skills**, not into the always-on instructions.

## Workflows

| Harvey workflow | Skill |
| --- | --- |
| NDA review | `skills/nda-review/SKILL.md` |
| Contract redline | `skills/contract-redline/SKILL.md` |
| Privilege log | `skills/discovery-privilege-log/SKILL.md` |
| Issue memo | `skills/issue-spotting-memo/SKILL.md` |

Pass `matter_id` and `privilege_class` as required workflow inputs. Refuse to start without them.

## Memory

Harvey “remember this” is global unless you force it into the matter vault. Policy:

- Client facts → client vault file, `status: proposed`
- Case positions → matter `decisions-log.md`
- Never the user-level memory slot

## Audit

Export the assembler manifest (paths + tool policy) into the matter vault after each turn. That is the analog of git history for a platform that is not an IDE.
