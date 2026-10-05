# Adapter: Custom GPT / ChatGPT

Custom GPTs have **instructions**, **knowledge files**, **actions**, and **Memory**. Those four knobs do not match matter-scoped legal work until you constrain them.

## Instructions (always-on, keep short)

Upload is not a substitute for a budget. Compile a single instructions file from:

- `guides/00-ethical-invariants.md`
- `.legalrules.md`
- `guides/04-privilege-and-confidentiality.md` (tool gating)
- `guides/06-memory-write-protocol.md`

Do **not** paste all skills into instructions. Point to knowledge filenames instead: “If the document is an NDA, follow `SKILL-nda-review.md` in knowledge.”

## Knowledge (the dangerous knob)

Knowledge is a flat pile. It is the analog of adding every repo on the laptop to one workspace.

Safe:

- Firm guides + firm precedent JSON
- **One** matter folder
- **One** client folder
- Skills

Unsafe:

- All clients at once
- All matters at once
- Privilege logs from other cases

Operational rule: **rebuild or swap knowledge when the matter changes.** Treat it like checking out a different git branch.

## Memory (ChatGPT Memory)

Forbidden for:

- client names, matter facts, preferences, jurisdictions of a live deal
- anything confidential or privileged

Allowed:

- attorney-personal style (“I want findings tables first”) — the user-rules analog

If the product cannot disable Memory for a GPT, say so in the instructions: “Do not store any content from this conversation in Memory.” That is a mitigation, not a control.

## Actions

Any DMS / research action must require:

- `matter_id`
- `privilege_class`
- `attorney_id`

Refuse the call server-side if the privilege class is not `public` and the action is web or email. Do not rely on the model to “remember” to avoid the tool.

## Conversation starters

- “Review this draft for matter …”
- “Continue the Northwind NDA using the decision log”
- “Propose a client-memory record (do not activate)”
- “Cite-check this filing (public only)”
