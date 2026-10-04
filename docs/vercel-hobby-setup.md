# Vercel Hobby setup — PREIshare investor app

**Date:** 2026-10-04
**Vercel plan:** TODO — confirm Hobby (free), not Pro, in the Vercel dashboard before checking this off

## URLs (the same ones you will reuse all semester)

| Item | Value |
| --- | --- |
| GitHub repository (you can push) | `https://github.com/EthanJeppson/Forked-PREIShare-org-repo` |
| Instructor collaborator | `thortek` added: no (checked 2026-10-04 via GitHub API; only `EthanJeppson` is listed) — TODO update to yes after inviting |
| Vercel Production URL | TODO — `https://<project>.vercel.app` after the first Production deploy is Ready |
| Preview URLs | Do **not** submit these to Canvas |

## Hobby constraints I will keep

- One Vercel project for this course
- Production deploys from `main` only
- No cron / Fluid Compute / paid add-ons
- Secrets go in the Vercel dashboard later — never in git

## Build preparation (done before importing)

- `vite.config.ts` now has the Nitro plugin in this order: `tanstackStart()` → `nitro()` → `viteReact()`. Without it, Vercel can serve 404 (NOT_FOUND) on every page.
- Added `nitro` to `package.json` (resolved to `3.0.260903-beta`) and `package-lock.json`.
- No `outputDirectory: "dist"` and no `vercel.json`; the app keeps server rendering.
- Local check on 2026-10-04 (Node v22.14.0, npm 10.9.7): `npm run build` succeeded and wrote `.output/server/index.mjs`. Running that server locally returned HTTP 200 for `/` and `/about`.

## First production deploy

- Status: TODO — not deployed yet (Ready / Failed; if failed, paste what you changed)
- Incognito check of Production URL: TODO (pass / fail)
