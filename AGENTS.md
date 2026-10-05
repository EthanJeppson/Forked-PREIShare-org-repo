<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `npx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# PREIshare — agent memory

PREIshare is a real-estate intelligence product. It turns property facts and
market data into a picture someone can use to decide what to do next with a
building, neighborhood, or deal.

This checkout is a **single npm package** at the repo root (`preishare-org-repo`),
not an `apps/` + `packages/` monorepo. The running UI is a TanStack Start + React
starter (`src/routes/` currently has `/` and `/about`).

**Standing rules:** `.cursor/rules/preishare.mdc` (always-on for Cursor-style
agents). Root `.cursorrules` also exists; if they disagree, follow the repo-map
and `preishare.mdc` (for example `lib/supabase.ts` is **not** in this tree).

## Onboarding docs

Start here:

- `docs/onboarding/team-orientation-notes.md` — mission, PR workflow, first-PR done
- `docs/onboarding/repo-map.md` — verified folder map (safe vs do-not-edit-yet)
- `docs/onboarding/setup-log.md` — fork, remotes, Git identity (when present)

Human onboarding lives under `docs/onboarding/`. Do not invent `apps/`,
`packages/`, `backend/`, `supabase/`, or `.github/` — those paths were **not
found** in the mapped clone.

## Stack (do not substitute)

| Layer | This repo |
| --- | --- |
| Language | TypeScript (strict) |
| App | TanStack Start + React |
| Styling | Tailwind CSS v4 |
| Package manager | npm |
| Intended data platform | Supabase, PostgreSQL, pgvector (**not wired in this clone**) |
| Collaboration | Fork + pull request; do not push to the team repo directly |

Team repo of record: https://github.com/EdTechForLearning/PREIShare-org-repo

## Layout that exists

- `src/routes/` — file routes (`__root.tsx`, `index.tsx`, `about.tsx`)
- `src/router.tsx` — router factory; `src/routeTree.gen.ts` is generated (do not edit)
- `src/components/` — Header, Footer, ThemeToggle
- `src/lib/user.ts` — placeholder (`getUser()` returns `null`)
- `src/styles.css` — Tailwind tokens
- `vite.config.ts`, `tsconfig.json`, `tsr.config.json`, `package.json`

## Scripts (from `package.json` only)

```bash
npm run dev              # Vite on port 3000
npm run build
npm run preview
npm run generate-routes
```

There is no `test`, `lint`, or `format` script in this manifest. Do not invent one.

## Agent workflow

1. Plan — restate the goal and files to touch.
2. Smallest diff — match neighbors; no drive-by refactors; no extra libraries.
3. Verify — re-read the change; do not commit secrets.
4. Stop — if the tree disagrees with these notes, update `docs/onboarding/repo-map.md` rather than inventing paths.

Safe first-touch: `docs/onboarding/` and other `docs/` files. Do not edit `src/`,
lockfiles, Vite/TS config, generated route tree, or `.env` unless explicitly tasked.

## Secrets and safety

- Never commit `.env`, API keys, tokens, or connection strings
- Never paste secrets into docs, rules, or chat
- Name env vars only (example: `SUPABASE_URL`) — never real values
- Do not connect live Supabase or add migrations until a human asks

## Environment (when config exists later)

- Server-only secrets: `process.env.NAME` inside handlers / `createServerFn` — not at module scope, not with a `VITE_` prefix
- Client-exposed: only `VITE_*` via `import.meta.env.VITE_*` (not secrets)
- `.env` is gitignored
