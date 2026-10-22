# PREIshare onboarding handoff

**Author:** Ethan Jeppson (@EthanJeppson)  
**Date:** 2026-10-04  
**Branch / PR:** `docs/first-contribution-ethanjeppson` — https://github.com/EdTechForLearning/PREIShare-org-repo/pull/21 (open, not merged, no human review yet)  
**Audience:** mentor, future self, sprint lead

## 1. Stakeholder summary (plain language)

I completed PREIshare engineering onboarding for Sprint 1 (dev environment and AI tooling). I forked the team repository, kept a local clone of my fork, set up Git identity, verified the repo layout, wrote project rules for AI agents and ran four smoke tests on them, planned a tiny first contribution, and opened a pull request into the team repo. I also ran a simulated review and answered it. PREIshare remains a real-estate intelligence product; this work ships no product feature. It shows I can work inside the team's Git and review workflow safely.

**Definition of done (my own one-sentence version):** onboarding is done when I can show, from files and a live PR, that my environment, AI rules and Git/PR habit work, not when anything is merged.

**Definition of done met:**
- [x] Fork created, local clone of my fork, toolchain verified (see `setup-log.md`). **Partly:** the log records OS and Git only, not Node or npm, and shows no `upstream` remote in the current workspace (see section 6).
- [x] AI rules / project memory in place and smoke-tested (4 of 4 passed)
- [x] First contribution implemented and committed on a feature branch
- [x] PR opened. **Partly:** review feedback was simulated and answered, but the PR description on GitHub still needs updating and no human has reviewed it

## 2. Deliverables index (what exists and where)

Several files live on other branches and are not on `main` or this PR branch. The branch column says where to read each one.

| Artifact | Path | Where it lives | Why it matters |
| --- | --- | --- | --- |
| Team orientation notes | `docs/onboarding/team-orientation-notes.md` | `main` and this branch | Mission, workflow, definition of done |
| Setup log | `docs/onboarding/setup-log.md` | `cursor/setup-log-f543` | Proof of accounts, fork, Git identity, clone, remotes |
| Repo map | `docs/onboarding/repo-map.md` | `cursor/setup-log-f543` | Safe first-touch surfaces; single package, no `apps/` or `packages/` |
| AI tooling verification | `docs/onboarding/ai-tooling-verification.md` | `cursor/project-rules-f543` | Four smoke tests, all pass, GO decision |
| Project rules | `.cursor/rules/preishare.mdc` | `cursor/project-rules-f543` | Persistent agent constraints (stack, safe surfaces, secrets) |
| Agent memory entrypoint | `AGENTS.md` | `main` and this branch | Scaffold notes and project context for coding-agents |
| First contribution plan | `docs/onboarding/first-contribution-plan.md` | this branch (PR #21) | Scoped plan before code |
| Contribution notes | `docs/onboarding/first-contribution-notes.md` | this branch (PR #21) | Cycles, what changed, what was not changed |
| Contributors credit | `CONTRIBUTORS.md` | this branch (PR #21) | The one-row first contribution |
| PR description | `docs/onboarding/pr-description.md` | this branch (PR #21) | Reviewer-facing summary and verification evidence |
| Review response notes | `docs/onboarding/review-response-notes.md` | this branch (PR #21) | Five simulated comments and my decisions |
| This handoff | `docs/onboarding/onboarding-handoff.md` | this branch (PR #21) | Single entry point for mentors |

## 3. Environment and toolchain snapshot

Facts below come from `setup-log.md` (dated 2026-09-19) unless marked otherwise.

- OS: Linux, kernel 6.12.94+, hostname `cursor` (a Cursor Cloud Agent workspace, not a personal laptop)
- Git: version 2.43.0. `user.email` is `ethanhjeppson@gmail.com` (matches my GitHub account, changed from `cursoragent@cursor.com`). `user.name` is still `Cursor Agent`.
- Node / package manager versions: TODO. The setup log does not record them.
- origin (my fork) URL: https://github.com/EthanJeppson/Forked-PREIShare-org-repo
- upstream (team repo) URL: https://github.com/EdTechForLearning/PREIShare-org-repo
- Clone: the workspace at `/workspace` was already a clone of my fork; I did not run `git clone`. Default branch is `main`; working tree was clean after setup.
- Install/build/test commands run and result: TODO. Not recorded. `docs/onboarding/repo-map.md` lists the scripts that exist (`dev`, `build`, `preview`, `generate-routes`) and says there is no `test`, `lint` or `format` script. I have not run `npm install`, `npm run dev` or `npm run build` for this handoff.
- Blockers hit and how resolved (from the setup log's issues table):
  - My fork is named `Forked-PREIShare-org-repo`, not `PREIShare-org-repo` as in the lesson; I kept the existing fork instead of making a second.
  - Git email was a bot address; changed to my GitHub email.

## 4. AI tooling posture

- Rules file purpose: `.cursor/rules/preishare.mdc` is an always-applied rule that tells agents the stack, which paths are safe for first changes, and never to commit secrets.
- `AGENTS.md` purpose: records the scaffold commands, stack table, layout, and the instruction to load TanStack Intent skills before Start/Router edits.
- Smoke tests (2026-10-02, per `ai-tooling-verification.md`): four questions on structure (ST1), secrets (ST2), scope (ST3) and stack (ST4); all four passed on first run. The agent named `src/routes/`, `src/router.tsx` and `src/components/`, said there is no `apps/` or `packages/`, and listed TypeScript, TanStack Start, React, Tailwind and npm with their config files. It named Supabase, PostgreSQL and pgvector as intended but not wired in.
- Context gaps found and fixes: none; "No gaps; all four passed on first run." Accepted limitation: the repo map was not on that branch, so answers were compared against the map on `cursor/setup-log-f543`.
- Decision recorded there: GO for using the tooling on the first contribution.

## 5. First contribution and review outcome

- Plan goal (from `first-contribution-plan.md`): add myself as a contributor in a new root `CONTRIBUTORS.md`, with no second touch.
- Files touched: `CONTRIBUTORS.md` (one row: Ethan Jeppson, @EthanJeppson, Onboarding engineer, 2026-10-04) plus four docs under `docs/onboarding/` (plan, notes, PR description, review-response notes). No `src/`, package, lockfile, config or `.env` files.
- PR title and link: `docs: add CONTRIBUTORS entry for Ethan Jeppson (first onboarding contribution)` — https://github.com/EdTechForLearning/PREIShare-org-repo/pull/21 (base `main` of the team repo, head `EthanJeppson:docs/first-contribution-ethanjeppson`). An earlier practice PR exists on my fork: https://github.com/EthanJeppson/Forked-PREIShare-org-repo/pull/5.
- Review-style feedback received (simulated by the same agent session, so not independent): five comments. Two blocking: the PR #21 body was a paste of the notes file with no Problem/Approach/Test plan; and Files changed showed three extra docs and two extra commits inherited from my fork's `main`. Three non-blocking: no shown results for the secrets search, mixed commit message styles, and the plan not listing the new notes file.
- Changes made in response: commit `dbaf6dc` fixed stale wording, added verification evidence to the PR text, and updated the plan; commit `3812cd3` added `review-response-notes.md`. I declined to rewrite pushed history.
- Merge readiness: **ready with follow-ups.** The files are in good shape, but (a) the live PR #21 description is still the pasted notes file until I replace it in the GitHub UI, (b) no human has reviewed it, and (c) a mentor should decide about the three inherited docs.

## 6. Open risks and environment gaps

1. PR #21 is open and unmerged with no human review; its GitHub description still does not match `pr-description.md`.
2. Files changed on PR #21 includes three docs and two commits I did not write (they are on my fork's `main`, not the team's); a mentor should decide whether to split them out.
3. Node and npm versions and any install/build/dev run are not recorded; no app checks have been run. The repo has no test, lint or format script and no `.github/` CI.
4. `setup-log.md` says `upstream` was added and verified, but `git remote -v` in the current workspace shows only `origin`. I need to re-add `upstream` before syncing with the team repo.
5. Supabase, `.env` examples and `src/lib/supabase.ts` do not exist in this clone (per the repo map), so no data work has been set up or tested.
6. `user.name` is still `Cursor Agent` on this machine, so commits may not carry my name.
7. The rules file, repo map, setup log and AI verification are on separate branches, not on `main`.

## 7. Decisions log (for stakeholders)

| Decision | Choice | Rationale |
| --- | --- | --- |
| First contribution surface | New `CONTRIBUTORS.md`, no second touch | Lowest risk; the repo map lists `docs/onboarding/` as safe and blocks `src/`, config and lockfiles |
| Branch naming | `docs/first-contribution-ethanjeppson` | Short, lowercase, hyphenated, says the kind of work and whose it is |
| Staging | Files added by explicit path, never `git add .` | Avoids committing `.env` or unrelated files |
| History | New small commits, no force-push or amend | Keeps the PR reviewable and the team `main` safe |
| Declined review comment | Did not rewrite pushed commits to drop inherited ones | Needs a mentor's decision |
| AI tool category used most | coding-agent (a Cursor Cloud agent) | It could read the repo and branches directly; I did not use a separate chat-assistant |

## 8. Next-sprint preview (what this unlocks)

The next sprint topic can assume:

1. **Trusted local environment (partly)** — clone, remotes and Git identity are documented in `setup-log.md`; Node/npm and a first `npm run dev` are still unproven (see section 6), so confirm those first.
2. **AI alignment** — `.cursor/rules/preishare.mdc` and `AGENTS.md` exist and passed four smoke tests; extend them as the repo grows instead of starting over.
3. **Git habit** — feature branch, small commits, PR, and a response to review has been practiced once end to end.
4. **First PR path** — PR #21 is open and merge-ready pending the follow-ups above; it is not merged. Feature work should use the same PR quality bar.

**Do not redo:** the fork, the repo map, the rules file and its smoke tests, or the CONTRIBUTORS plan. Reuse them.

**Explicitly out of scope until later:** large product features, production deployments, database migrations, Supabase wiring, and auth.

## 9. Ask for mentor

- Questions still open: Should the three inherited docs and two commits be split out of PR #21? Should the rules, repo map and setup log land on `main`? Is a human review of #21 expected before I start feature work?
- Review of this handoff requested: yes
- Preferred follow-up time or channel: TODO (not set in my notes)

---

*End of handoff. Keep this file updated if merge status or env gaps change before the next sprint starts.*
