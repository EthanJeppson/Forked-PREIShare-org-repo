---
name: discovery-privilege-log
description: Screen productions and draft privilege-log lines. Use for discovery-production, privilege-log, and RFP response tasks.
triggers:
  document_types: [discovery-production, privilege-log, rfp-response]
---

# Skill: Discovery privilege log

Privilege screening is a **classification** task with a high false-negative cost. When unsure, hold and ask; do not produce.

## Do

- Identify families (email + attachments travel together).
- Map custodians to `parties.md` (client, counsel, vendor, adversary, consultant).
- Propose log lines with: date, author, recipients, privilege type, **non-waiving** description.
- Flag third-party recipients that may destroy privilege (and whether a common-interest agreement is on the document index).

## Do not

- Put legal advice content in the description (“email advising that we should settle because liability is likely”).
- Use web search.
- Auto-produce a document that has no privilege call.

## Description pattern (sendable log)

`Email from [counsel] to [client] regarding legal advice on [transaction/dispute topic at high altitude].`

Not: the advice itself.
