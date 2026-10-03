# First contribution plan — PREIshare onboarding

## Author
- Name / GitHub handle: Ethan Jeppson / @EthanJeppson
- Feature branch: `docs/first-contribution-ethanjeppson` (created from an up-to-date `main` on my fork `EthanJeppson/Forked-PREIShare-org-repo`)
- Date: 2026-10-03

## One-sentence goal
Add myself (Ethan Jeppson, @EthanJeppson) as a new contributor in a new root-level `CONTRIBUTORS.md` so the team can practice reviewing one tiny docs-only first PR, with no second touch.

## Why this surface (link to prior artifacts)
- From `docs/onboarding/repo-map.md` (section 6, "Safe first-touch"): "`docs/onboarding/` — Docs-only; this is where setup-log, orientation notes, and this map live." Section 8 also says to "Pick a first contribution only from **Safe first-touch** unless a mentor expands scope." The map's "Do not edit yet" table blocks `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `src/routeTree.gen.ts`, `src/`, `.cursorrules` / `AGENTS.md`, and anything Supabase, migrations, or `.env`. `CONTRIBUTORS.md` is a new Markdown file with no runtime impact and does not touch any of those paths.
- From `docs/onboarding/team-orientation-notes.md`: the definition of done says work on a copy is proposed for main rather than dropped onto it, checked against the team's standards, reviewed by the group, and only then incorporated. This plan keeps the change on a feature branch of my fork, small enough for a group review, and I will not merge it myself.
- From `docs/onboarding/ai-tooling-verification.md`: all four smoke tests (ST1 structure, ST2 secrets, ST3 scope, ST4 stack) passed and the decision is "GO for using this AI tooling on the first contribution," with the caveat that a first PR "should still stay in **Safe first-touch** (`docs/onboarding/`) unless a mentor expands scope." The agent rules are therefore verified enough to help implement this plan in the next step.

Note: on `main` of my fork only `team-orientation-notes.md` is currently present. `repo-map.md` lives on branch `cursor/setup-log-f543` and `ai-tooling-verification.md` lives on branch `cursor/project-rules-f543`. I read both from those branches for this plan and did not copy them onto this feature branch.

## In scope (only these)
1. Create `CONTRIBUTORS.md` at the repository root (it does not exist yet; verified with `ls`) containing a short heading and one entry: Ethan Jeppson, GitHub handle @EthanJeppson, role "Onboarding engineer".
2. Second touch: **none**. I deliberately chose zero secondary touches so the diff is one new file. The safe `docs/onboarding/` files in the repo-map are not edited in this PR.
3. This planning step only adds `docs/onboarding/first-contribution-plan.md`. Implementation notes go in `docs/onboarding/first-contribution-notes.md` in the next step, not here.

## Out of scope (explicitly not this PR)
- Auth, sessions, `src/lib/user.ts`, or any environment secrets (`.env`, keys, tokens, connection strings)
- Database schema, migrations, Supabase config or policies, or pgvector changes
- Dependency upgrades, `package.json` edits, or `package-lock.json` churn
- Any file under `src/`, including `src/routeTree.gen.ts`, and any UI or copy change
- `vite.config.ts`, `tsconfig.json`, `tsr.config.json`, `.cursorrules`, and `AGENTS.md`
- Creating `apps/`, `packages/`, `supabase/`, or `.github/` (the repo-map confirms none exist; this repo is a single package)
- Multi-file refactors, renames, or reformatting the repo
- CI/CD workflow edits unless a mentor explicitly assigns them
- Editing `README.md`, `docs/requirements-brief.md`, or the existing onboarding docs

## Likely files to change
| File | Action | Why |
|------|--------|-----|
| `CONTRIBUTORS.md` | create | Add my contributor entry (name, handle, one-line role) |
| `docs/onboarding/first-contribution-plan.md` | create (this step) | The written scope contract, committed with the implementation |
| `docs/onboarding/first-contribution-notes.md` | create (next step) | Record what the agent did and what I verified |

No other paths should appear in the PR diff.

## Acceptance criteria
- [ ] `git branch --show-current` prints `docs/first-contribution-ethanjeppson`, and the PR is opened from that branch, not from `main`.
- [ ] `CONTRIBUTORS.md` exists at the repo root and contains exactly one contributor entry: `Ethan Jeppson`, `@EthanJeppson`, `Onboarding engineer`.
- [ ] `CONTRIBUTORS.md` is plain Markdown (a heading plus a list or table) with no HTML, images, or links other than `https://github.com/EthanJeppson`.
- [ ] `git diff --name-only main` lists only `CONTRIBUTORS.md`, `docs/onboarding/first-contribution-plan.md`, and `docs/onboarding/first-contribution-notes.md`.
- [ ] No `src/`, `package.json`, `package-lock.json`, config, `.env`, or build-output files appear in the diff.
- [ ] A teammate can read the whole diff in under 10 minutes without product-context deep dives.

## Verification plan (how I will know it worked)
1. Run `git branch --show-current` and confirm it prints `docs/first-contribution-ethanjeppson`.
2. Run `git status --short` and confirm only the three files in the likely-files table are new, with nothing else modified or untracked (no `.env`, no `node_modules` or build output).
3. Run `git diff --name-only main` after committing and confirm the same three paths, and no others.
4. Open `CONTRIBUTORS.md` (or the GitHub preview) and confirm my name, handle, and role render as plain Markdown.
5. Skim `git diff main` once and confirm every changed line is a Markdown doc line.
6. No UI touch is included, so I will not run the dev server and will skip `npm run dev`.

## Risks and mitigations
- Risk: The agent expands scope into app code, config, or dependencies. Mitigation: refuse any diff that touches a file outside the likely-files table and re-prompt with the out-of-scope list.
- Risk: Editing `main` by mistake. Mitigation: run `git branch --show-current` before every edit session.
- Risk: The repo-map and AI-tooling docs are not on `main`, so a fresh agent session may miss that context. Mitigation: paste the repo-map section 6 and the AI-tooling go/no-go excerpts into the prompt, or read them from their branches.
- Risk: A secret or `.env` file gets committed by accident. Mitigation: stage files by explicit path (never `git add .`) and check `git status --short` before committing.
- Risk: Role text or handle is wrong. Mitigation: copy the handle from the setup-log (`@EthanJeppson`) and have a reviewer check it.

## Definition of done for this planning step
- [x] Feature branch `docs/first-contribution-ethanjeppson` created from an updated `main`.
- [x] This plan file saved at `docs/onboarding/first-contribution-plan.md` with all sections filled (no angle-bracket placeholders left).
- [x] Ready to implement in the next step without re-deciding scope.
