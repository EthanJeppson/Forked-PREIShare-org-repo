# Vercel Hobby setup — PREIshare investor app

**Date:** 2026-10-04
**Vercel plan:** TODO — confirm Hobby (free), not Pro, in the Vercel dashboard before checking this off

## URLs (the same ones you will reuse all semester)

| Item | Value |
| --- | --- |
| GitHub repository (you can push) | `https://github.com/EthanJeppson/Forked-PREIShare-org-repo` |
| Instructor collaborator | `thortek` added: yes, invitation sent 2026-10-04 (reported by me; the GitHub API lists only `EthanJeppson` as an accepted collaborator, so the invite is likely pending until the instructor accepts) |
| Vercel Production URL | `https://forked-prei-share-org-repo-coral.vercel.app/` (no `-git-` or hash in the host; confirm it is listed under Project → Domains as Production) |
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

- Status: first build on `main` was blocked by Vercel because `@tanstack/react-start@1.168.32` was flagged vulnerable. Fixed by updating to `1.168.60` (PR #7) and redeploying. After that the Production URL serves the app. TODO: confirm the deployment shows Ready in the Vercel dashboard.
- Reachability check (curl, 2026-10-04): `/` and `/about` both returned HTTP 200 and the page title is "TanStack Start Starter" (the app is still the starter UI).
- Incognito check of Production URL: pass (2026-10-04, private Chrome window showed the TanStack Start base template home page, not the Vercel dashboard)
