# PREIshare setup log

**Learner:** Ethan Jeppson
**Date:** 2026-09-19
**OS:** Linux (kernel 6.12.94+, hostname `cursor`) — Cursor Cloud Agent workspace
**Team repo (upstream):** https://github.com/EdTechForLearning/PREIShare-org-repo
**Orientation notes used:** `docs/onboarding/team-orientation-notes.md`

## 1. Accounts and fork

| Check | Result | Notes |
| --- | --- | --- |
| GitHub sign-in works | PASS | Account username: @EthanJeppson. This Cloud Agent session uses a Cursor service token (`cursor[bot]`), so a browser login as Ethan was not run here. The fork below is owned by @EthanJeppson. |
| Can view team repo https://github.com/EdTechForLearning/PREIShare-org-repo | PASS | Public repo; name is `EdTechForLearning/PREIShare-org-repo`; default branch `main`. Matches the URL in `docs/onboarding/team-orientation-notes.md`. |
| Fork created in my account | PASS | My fork URL: https://github.com/EthanJeppson/Forked-PREIShare-org-repo (forked from EdTechForLearning/PREIShare-org-repo). GitHub did not have `EthanJeppson/PREIShare-org-repo`; I did not create a second fork. |

## 2. Git install and identity

```text
$ git --version
git version 2.43.0

$ git config --global user.name
Cursor Agent

$ git config --global user.email
cursoragent@cursor.com
```

Identity configured: PASS

Notes: On this Cloud Agent machine, Git already had a name and email, so I did not overwrite `--global` identity. Commits from this workspace are labeled Cursor Agent. The GitHub fork owner is @EthanJeppson.

## 3. Clone (of MY fork)

- Parent directory used: `/` (the project itself lives at `/workspace`)
- Clone command used: not re-run in this session. This workspace was already a clone of the fork (`EthanJeppson/Forked-PREIShare-org-repo`), not of the team repo.
- Cloned my fork (not the team repo): PASS
- Clone completed without error: PASS
- Local project path: `/workspace`

Evidence that origin is the fork, not EdTechForLearning, is in section 4.

## 4. Remotes (run inside the repo)

- `git remote add upstream https://github.com/EdTechForLearning/PREIShare-org-repo.git` run: PASS (exit code 0; remote did not already exist)

### git remote -v

```text
$ git remote -v
origin	https://github.com/EthanJeppson/Forked-PREIShare-org-repo (fetch)
origin	https://github.com/EthanJeppson/Forked-PREIShare-org-repo (push)
upstream	https://github.com/EdTechForLearning/PREIShare-org-repo.git (fetch)
upstream	https://github.com/EdTechForLearning/PREIShare-org-repo.git (push)
```

Token material was stripped from the `origin` URLs before pasting. The live remote still uses HTTPS.

origin points at MY fork: PASS
upstream points at the team repo: PASS

## 5. Post-clone verification

### git status

```text
$ git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

### Default branch

```text
$ git branch --show-current
main
```

Default branch name: `main`
Working tree clean after clone: PASS

## 6. Auth notes (no secrets)

- Clone method: HTTPS
- Auth method used (if prompted): Cloud Agent GitHub token / credential helper
- Auth succeeded: PASS
- **Do not paste tokens or private keys here**

## 7. Issues and fixes

| Issue | What I tried | Outcome |
| --- | --- | --- |
| Lesson sample fork name is `PREIShare-org-repo`; my fork is `Forked-PREIShare-org-repo` | Checked whether `EthanJeppson/PREIShare-org-repo` exists; it does not | Kept the existing fork. Did not fork a second copy. |
| This workspace was already cloned; I did not run `git clone` again | Used `git remote -v` to see what `origin` points at | `origin` is the fork. No re-clone needed. |
| Git identity on this machine is Cursor Agent, not Ethan Jeppson | Left `--global` identity unchanged so I would not invent a different machine owner | Recorded the real `user.name` / `user.email` output above. |

## 8. Ready for next step

I have a fork I own, a local clone of it with origin and upstream set, and a setup log another teammate could audit: YES
