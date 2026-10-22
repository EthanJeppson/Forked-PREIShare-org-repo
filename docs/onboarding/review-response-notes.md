# Review response notes — first PREIshare PR

## PR under review
- Branch name: `docs/first-contribution-ethanjeppson`
- PR title (after any edits): `docs: add CONTRIBUTORS entry for Ethan Jeppson (first onboarding contribution)`
- Link or local identifier: https://github.com/EdTechForLearning/PREIShare-org-repo/pull/21 (earlier practice PR on my fork: https://github.com/EthanJeppson/Forked-PREIShare-org-repo/pull/5)
- Related files: CONTRIBUTORS.md, docs/onboarding/pr-description.md, docs/onboarding/first-contribution-notes.md

## Simulated reviewer setup
- Tool used (chat-assistant / coding-agent): coding-agent (Cursor Cloud agent). The same agent session played the mentor reviewer and then made the fixes, so this is a role-play, not independent review. I limited the review to what a stranger could see on the PR: the PR #21 title, body, commit list and Files changed list, read through GitHub.
- What context I pasted for the reviewer: the live PR #21 data (title, body, 6 commit messages, 7 changed files), plus `CONTRIBUTORS.md`, `docs/onboarding/pr-description.md`, and `docs/onboarding/first-contribution-notes.md`. Instruction: kind but strict mentor, stay inside onboarding docs and PR quality only, label each comment blocking or non-blocking.
- Date of simulation: 2026-10-04

## Feedback received

### Comment 1
- **Theme:** PR clarity
- **Blocking?** yes
- **Reviewer said:** The body of PR #21 is a paste of `first-contribution-notes.md` ("# First contribution implementation notes ... Multi-cycle log"). It has no Problem, Approach, or Test plan, so a reviewer cannot tell what to check without opening the files. The body also says "Paths changed in this step (uncommitted)", which is false for a pushed PR.
- **My decision:** accept-now
- **Why:** This is a fair catch. The accurate description already exists in `docs/onboarding/pr-description.md`, but it was never pasted into the team PR. A reviewer only sees the PR page.
- **Action taken:** (a) follow-up commit `dbaf6dc` fixed the stale "(uncommitted)" wording in the notes file. (b) I prepared a replacement body (Problem, Approach, note on extra files, Test plan) for PR #21 but could not apply it: my PR tool only edits PRs on my fork and returned "PR URL must belong to the current repository". **Still open:** I must paste the body into PR #21 myself in the GitHub UI (Edit on the PR description).
- **Evidence:** commit `dbaf6dc` "docs: fix stale notes wording and add verification evidence to PR text". Tool error text: `PR URL must belong to the current repository`.

### Comment 2
- **Theme:** scope
- **Blocking?** yes
- **Reviewer said:** "Files changed" shows 7 files and the commit list shows 6 commits, but your description says four. `docs/requirements-brief.md`, `docs/hockey-ops-player-directory-requirements-brief.md`, `docs/onboarding/team-orientation-notes.md` and two commits ("Add Sprint 1 requirements brief and team orientation notes.", "Add docs/requirements-brief.md for the hockey ops directory.") are not in your plan. Either explain them or remove them.
- **My decision:** accept-now for the explanation; decline for removing them from history.
- **Why:** I checked with a GitHub compare: the branch is 0 commits behind and 6 ahead of the team `main`, and those three files and two commits come from my fork's `main`, which the team `main` does not have. I did not write them. Removing them would need rebasing or force-pushing, which I should not do on a pushed PR, and it would change what my fork's `main` contains. That decision belongs to a mentor.
- **Action taken:** follow-up commit `dbaf6dc` added a "Verification evidence" section to `pr-description.md` stating the compare result (0 behind, 7 files before this step, 8 with the notes file). The "extra files" explanation was already in `pr-description.md` and is in the replacement body for PR #21. I also asked in the merge-readiness statement below for a mentor decision on splitting them out.
- **Evidence:** `gh api .../compare/main...EthanJeppson:docs/first-contribution-ethanjeppson` returned `ahead_by: 6, behind_by: 0` and the 7 filenames above.

### Comment 3
- **Theme:** verification
- **Blocking?** no
- **Reviewer said:** Test plan step 3 says to search the diff for tokens, emails and local paths, but nothing shows you did it. "Nothing was built or run" is honest, but reviewers want results, not just steps.
- **My decision:** accept-now
- **Why:** Claimed checks need shown results. The check is cheap to run.
- **Action taken:** ran a text search over `CONTRIBUTORS.md` and the three onboarding docs for `/workspace`, `/home/`, `token`, `password`, `secret`, `api key` and email patterns. It found only prose using the words "token" and "secret" and "key" in sentences saying not to commit them, with no values, emails, or paths. Also confirmed `git ls-files | grep '^\.env'` printed nothing. Recorded this in `pr-description.md`.
- **Evidence:** commit `dbaf6dc`; section "Verification evidence" in `docs/onboarding/pr-description.md`.

### Comment 4
- **Theme:** commits
- **Blocking?** no
- **Reviewer said:** The commit subjects mix styles: "Add scoped first-contribution plan for onboarding" and "Add first contributor entry and implementation notes" versus the later `docs:`-prefixed ones. Six commits for a one-row change is also a lot of history.
- **My decision:** decline (parked)
- **Why:** The commits are already pushed and in an open PR. Rewriting them means force-pushing, which I should not do without a mentor. The messages are clear about what and why, and the later ones use the `docs:` style. I will use the `docs:` style from here on.
- **Action taken:** none to history. New follow-up commits use the `docs:` prefix.
- **Evidence:** N/A (declined)

### Comment 5
- **Theme:** other (plan consistency)
- **Blocking?** no
- **Reviewer said:** The plan's file list and "diff has only these paths" check must include this review notes file, or the plan contradicts the diff again.
- **My decision:** accept-now
- **Why:** Same issue as the earlier `pr-description.md` addition. The plan is the scope contract and should match the diff.
- **Action taken:** added `docs/onboarding/review-response-notes.md` to the plan's files table, acceptance criterion, and verification step (now five paths).
- **Evidence:** commit `dbaf6dc`.

## Follow-up commits (if any)
| Commit message | Files touched | Addresses which comment # |
| --- | --- | --- |
| `docs: fix stale notes wording and add verification evidence to PR text` (`dbaf6dc`) | `docs/onboarding/first-contribution-notes.md`, `docs/onboarding/first-contribution-plan.md`, `docs/onboarding/pr-description.md` | 1 (stale wording), 2 (compare evidence), 3, 5 |
| This notes file, committed after `dbaf6dc` with the message `docs: add review response notes` | `docs/onboarding/review-response-notes.md` | all |

## PR description edits (if any)
- Sections changed (summary / test plan / risk / other): approach (adds review notes file), test plan (five paths), notes (plan edited twice), new "Verification evidence" section.
- Before → after (short paraphrase is fine): before, the saved description listed four files and claimed a secrets search without results. After, it lists five files, shows the compare result and search results, and still explains the three inherited files.
- Why the edit helps a reviewer: they can match the test plan to the Files changed tab and see what was actually checked. **Not yet done:** the live PR #21 body on GitHub still holds the pasted notes file; the replacement body is ready but must be applied by me in the GitHub UI.

## Re-verification checklist
- [x] Still on the same feature branch (not main) — `git branch --show-current` printed `docs/first-contribution-ethanjeppson`
- [x] Latest commits pushed; PR shows updated head — checked after pushing (see the final push below)
- [x] Diff includes only intended onboarding files — my five paths; the three inherited docs are explained, not mine
- [x] No secrets, .env values, or machine-specific paths added — search described in Comment 3
- [x] Manual or scripted checks claimed in the PR still pass — the only checks claimed are the file-list and text-search checks, re-run above; nothing was built or run
- [ ] Blocking comments all have a written resolution — Comment 2 is resolved (explained and declined with reason). Comment 1 is only half resolved: the stale wording is fixed, but the PR #21 body on GitHub is still the pasted notes until I edit it
- [x] Non-blocking items either fixed or parked with a reason — Comments 3 and 5 fixed, Comment 4 parked with a reason

## Merge-readiness statement
The content is ready from an onboarding perspective: one accurate roster row, docs only, no secrets, and a plan that matches the diff. It is not ready to merge until the body of PR #21 is replaced with the Problem/Approach/Test plan text, because that is what a reviewer will read first. A human mentor should still double-check two things: whether the three inherited docs and two earlier commits (from my fork's `main`) should be split out of this PR, and whether I should add an `upstream` remote and sync so they stop showing up. I have not merged anything.

## What I learned about review culture
- One habit I will keep: read the PR the way a stranger sees it (title, body, commit list, Files changed) before asking for review, instead of trusting my local files.
- One mistake I will avoid next time: pasting the wrong document into the PR body and calling the PR ready. Next time I will check the live PR page after opening it.
