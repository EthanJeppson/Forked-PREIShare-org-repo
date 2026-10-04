# Pull request description — first PREIshare contribution

**PR URL:** https://github.com/EdTechForLearning/PREIShare-org-repo/pull/21
**Earlier PR on my fork (practice, base is my fork's `main`):** https://github.com/EthanJeppson/Forked-PREIShare-org-repo/pull/5
**Base repository (target for team review):** EdTechForLearning/PREIShare-org-repo
**Base branch:** main
**Head repository (my fork):** EthanJeppson/Forked-PREIShare-org-repo
**Compare branch:** docs/first-contribution-ethanjeppson
**Author:** Ethan Jeppson / @EthanJeppson
**Date opened:** 2026-10-04 (team PR #21)

## Problem
PREIshare had no clear, reviewed onboarding contribution from this engineer yet.
The team needs a small, low-risk change that proves the Git → review → merge path works
for a new teammate without touching product runtime code.

## Approach
- Added a new `CONTRIBUTORS.md` at the repo root (the repo had no roster file) with one row for me: Ethan Jeppson, @EthanJeppson, Onboarding engineer, 2026-10-04.
- Added the written scope contract `docs/onboarding/first-contribution-plan.md`, the implementation log `docs/onboarding/first-contribution-notes.md`, and this file.
- Kept the change documentation only: no `src/`, package, lockfile, config, or `.env` edits.
- Followed the plan in `docs/onboarding/first-contribution-plan.md` and the notes in `docs/onboarding/first-contribution-notes.md`.

## What reviewers should look at
- [ ] `CONTRIBUTORS.md` — exactly one entry, accurate, plain Markdown, only link is `https://github.com/EthanJeppson`
- [ ] My changes are these four files: `CONTRIBUTORS.md` and three files under `docs/onboarding/` (see the note on extra files below)
- [ ] Commit messages explain why the change exists

## Test plan
1. Open the Files changed tab and confirm these four paths are mine (the other three listed in the notes below are inherited from my fork's `main`): `CONTRIBUTORS.md`, `docs/onboarding/first-contribution-plan.md`, `docs/onboarding/first-contribution-notes.md`, `docs/onboarding/pr-description.md`.
2. Open `CONTRIBUTORS.md` in the PR diff (or rendered view) and confirm the table has one row with name, handle, role and date.
3. Search the diff for tokens, passwords, emails, or local absolute paths — expect none.
4. (Optional) Check out the branch locally and run `git diff --name-only main` to see the same four paths.

## Screenshots / notes
No UI screenshots (docs-only change). Nothing was built or run.
Implementation decisions and verification notes: see `docs/onboarding/first-contribution-notes.md`.
The plan was edited once during this step to add `docs/onboarding/pr-description.md` to its file list; see the commit history for that change.
Files changed on the team PR also lists `docs/requirements-brief.md`, `docs/hockey-ops-player-directory-requirements-brief.md` and `docs/onboarding/team-orientation-notes.md`. I did not edit those. They are on my fork's `main` but not yet on the team repo's `main`, so GitHub counts them as new in this PR. Reviewers can ignore them or ask me to split them out.
Companion docs referenced by the plan (`repo-map.md`, `ai-tooling-verification.md`) live on other branches and are intentionally not part of this PR.

## Checklist before requesting review
- [x] Feature branch is pushed and up to date with this description
- [x] PR title is specific (not "update" or "fixes")
- [x] Description states problem, approach, and test plan
- [x] I can explain every changed line if a reviewer asks
- [x] Cross-fork PR to `EdTechForLearning/PREIShare-org-repo` opened by me in the GitHub UI (#21)
