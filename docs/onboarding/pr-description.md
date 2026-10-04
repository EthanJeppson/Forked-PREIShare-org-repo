# Pull request description — first PREIshare contribution

**PR URL:** https://github.com/EthanJeppson/Forked-PREIShare-org-repo/pull/5 (opened on my fork, base `main` of the fork)
**Cross-fork PR to the team repo:** not opened yet. Open it from https://github.com/EdTechForLearning/PREIShare-org-repo/compare/main...EthanJeppson:Forked-PREIShare-org-repo:docs/first-contribution-ethanjeppson and paste the resulting URL here.
**Base repository (target for team review):** EdTechForLearning/PREIShare-org-repo
**Base branch:** main
**Head repository (my fork):** EthanJeppson/Forked-PREIShare-org-repo
**Compare branch:** docs/first-contribution-ethanjeppson
**Author:** Ethan Jeppson / @EthanJeppson
**Date opened:** 2026-10-04

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
- [ ] Diff contains only these four files: `CONTRIBUTORS.md` and three files under `docs/onboarding/`
- [ ] Commit messages explain why the change exists

## Test plan
1. Open the Files changed tab and confirm only these four paths appear: `CONTRIBUTORS.md`, `docs/onboarding/first-contribution-plan.md`, `docs/onboarding/first-contribution-notes.md`, `docs/onboarding/pr-description.md`.
2. Open `CONTRIBUTORS.md` in the PR diff (or rendered view) and confirm the table has one row with name, handle, role and date.
3. Search the diff for tokens, passwords, emails, or local absolute paths — expect none.
4. (Optional) Check out the branch locally and run `git diff --name-only main` to see the same four paths.

## Screenshots / notes
No UI screenshots (docs-only change). Nothing was built or run.
Implementation decisions and verification notes: see `docs/onboarding/first-contribution-notes.md`.
The plan was edited once during this step to add `docs/onboarding/pr-description.md` to its file list; see the commit history for that change.
Companion docs referenced by the plan (`repo-map.md`, `ai-tooling-verification.md`) live on other branches and are intentionally not part of this PR.

## Checklist before requesting review
- [x] Feature branch is pushed and up to date with this description
- [x] PR title is specific (not "update" or "fixes")
- [x] Description states problem, approach, and test plan
- [x] I can explain every changed line if a reviewer asks
- [ ] Cross-fork PR to `EdTechForLearning/PREIShare-org-repo` opened by me in the GitHub UI
