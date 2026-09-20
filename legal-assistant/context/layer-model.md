# Layer model

Context is a stack. Higher rows outrank lower rows when they conflict. The assembler injects from the top of **priority**, and drops from the bottom of **drop_order** when the budget is exceeded.

```
priority (high → low)              drop_order (first dropped → last)
─────────────────────────          ────────────────────────────────
ethical_invariants                 session
firm_rules                         working_documents (summarize, don't drop all)
matter_constitution                attorney_style
privilege_policy                   client_style
jurisdiction                       jurisdiction (color commentary only)
client_preferences                 skill (if a shorter skill exists)
skill                              — never drop ethics, firm hard_stops,
working_documents                    matter taken positions, or privilege policy
session
```

## Coding analog

| Layer | Cursor analog |
| --- | --- |
| `ethical_invariants` | System / safety rules |
| `firm_rules` | `.cursorrules` + `AGENTS.md` durable decisions |
| `matter_constitution` | Repo `AGENTS.md` + issue tracker |
| `privilege_policy` | Secret / `.env` handling |
| `jurisdiction` | Language / framework skills |
| `client_preferences` | User rules |
| `skill` | `SKILL.md` loaded on match |
| `working_documents` | Open files / current diffs |
| `session` | The user message |

## Invariant

A lower layer may **narrow** (client wants a tighter cap) but may not **waive** a higher layer (client cannot waive a conflicts wall).
