---
name: issue-spotting-memo
description: Internal issue-spotting memo or brief cite-check. Use for memos, complaints, motions, and authority audits.
triggers:
  document_types: [memo, complaint, answer, motion, brief]
  tasks: [memo, cite-check]
---

# Skill: Issue-spotting memo

## Structure

1. Question presented (one sentence, matter-specific).
2. Short answer (with confidence).
3. Facts from the chronology and working docs only.
4. Discussion — each proposition cited or marked `authority_gap`.
5. Open questions for the attorney.
6. Proposed matter-memory updates.

## Rules

- Internal by default (`work_product`).
- No new cases from parametric memory. If research is enabled and privilege class is `public`, still quote only sources the tool actually returned.
- Adverse authority in the jurisdiction note must appear in the discussion.
