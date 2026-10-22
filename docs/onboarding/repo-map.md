# PREIshare repository map

> Onboarding map for first contribution planning. Built with AI-assisted
> inventory + human path verification. Do not treat this as architecture law
> if the real tree disagrees—update this file when you learn more.

## Meta

- Clone path (from setup-log): `/workspace` (see `docs/onboarding/setup-log.md`, local project path)
- Date mapped: `2026-09-20`
- Agent tool used: coding-agent (five inventory cycles) + learner file-tree spot-checks
- Mapper: Ethan Jeppson (@EthanJeppson)

## 1. Overview (5–8 sentences)

PREIshare appears to be organized as: **single package** (one root `package.json`, no `workspaces`, no `packages/` folder).
In plain language, the product code seems to live mainly in `src/` (routes, components, styles), with the Vite/TanStack Start wiring at `vite.config.ts` and `src/router.tsx`.
Shared libraries or packages appear in **none found** (no `packages/` workspace; only a small helper at `src/lib/user.ts`).
Docs and onboarding notes live in `docs/` (including this file).
I am intentionally not editing application code while building this map.
There is no `.github/` CI folder and no `supabase/` data folder in this clone.
`.cursorrules` mentions `lib/supabase.ts`, but that file was **not found**; Sprint docs also say live Supabase is later.
The root package name is `preishare-org-repo` in `package.json`; the running UI is still the TanStack Start starter (Home `/` and About `/about`).

## 2. Top-level inventory

| Path | Kind (app / package / config / docs / other) | One-sentence purpose | Verified by me? (yes/no) |
|------|-----------------------------------------------|----------------------|---------------------------|
| `src/` | app | Web app: routes, components, styles, router | yes |
| `docs/` | docs | Onboarding and project documentation | yes |
| `.vscode/` | config | Editor settings (marks generated route tree read-only) | yes |
| `.git/` | other | Git history for this clone; do not edit | yes |
| `package.json` | config | Root (only) package manifest and npm scripts | yes |
| `package-lock.json` | config | npm lockfile for this single package | yes |
| `README.md` | docs | How to run the TanStack Start starter | yes |
| `AGENTS.md` | docs | Scaffold notes for coding agents | yes |
| `.cursorrules` | config | Cursor rules for this repo | yes |
| `.gitignore` | config | Ignores `node_modules`, `.env`, build output | yes |
| `.cta.json` | config | TanStack CLI scaffold metadata (npm, React, file-router) | yes |
| `tsconfig.json` | config | TypeScript strict config and `#/*` `@/*` path aliases | yes |
| `tsr.config.json` | config | TanStack Router generate config | yes |
| `vite.config.ts` | config | Vite plugins: TanStack Start, React, Tailwind | yes |

Top-level names **not found** (do not invent them): `apps/`, `packages/`, `backend/`, `frontend/`, `supabase/`, `.github/`.

## 3. Frontend concerns (TypeScript, React, TanStack Start)

- Likely app root(s): `src/`
- Clues I used (file names, frameworks mentioned in package.json): `package.json` depends on `react`, `react-dom`, `@tanstack/react-start`, `@tanstack/react-router`; `vite.config.ts` calls `tanstackStart()` and `viteReact()`; route files export `createFileRoute` / `createRootRoute`.
- Entry / routes / UI areas worth knowing:
  - `src/router.tsx` — creates the TanStack Router from `src/routeTree.gen.ts`
  - `src/routeTree.gen.ts` — generated route tree (do not edit by hand)
  - `src/routes/__root.tsx` — HTML shell (header, children, footer)
  - `src/routes/index.tsx` — home screen `/`
  - `src/routes/about.tsx` — about screen `/about`
  - `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/ThemeToggle.tsx`
  - `src/styles.css` — Tailwind / visual tokens
- How this area relates to user-facing screens: files under `src/routes/` are the pages a browser shows; `src/components/` is chrome shared on every page via `__root.tsx`.

## 4. Backend / data concerns (Supabase, PostgreSQL, pgvector, APIs)

- Supabase or data config paths: **not found yet** (no `supabase/` folder, no `src/lib/supabase.ts`)
- Migrations / SQL / schema-related paths: **not found yet**
- Env examples (NOT secret values): **not found yet** (no `.env.example`; `.gitignore` lists `.env` so secrets stay untracked)
- Notes on what a beginner should not touch in production data: do not create a Supabase project, paste keys, or add `supabase.ts` for this onboarding step. `src/lib/user.ts` is a placeholder (`getUser()` returns `null`), not live auth. `docs/requirements-brief.md` says real Supabase Auth is later; seed/demo data is enough for Sprint 1.

## 5. Tooling and CI

- TypeScript / lint / format config: `tsconfig.json` (strict TypeScript). ESLint / Prettier / Vitest configs: **not found yet**
- CI workflows (e.g. GitHub Actions): **not found yet** (no `.github/` directory)
- Editor or agent config already present: `.vscode/settings.json`, `.cursorrules`, `AGENTS.md`, `.cta.json`, `tsr.config.json`, `vite.config.ts`
- Scripts from package manifests that look like dev/build/test: `dev`, `build`, `preview`, `generate-routes` (no `test`, `lint`, or `format` script in `package.json`)

## 6. Safe first-touch vs do-not-edit-yet

### Safe first-touch (good candidates for a tiny onboarding PR)

| Path or area | Why it is relatively safe | Risk if handled carelessly |
|--------------|---------------------------|----------------------------|
| `docs/onboarding/` | Docs-only; this is where setup-log, orientation notes, and this map live | Misleading docs |
| `docs/onboarding/setup-log.md` | Already verified clone/remotes evidence; docs-only | Wrong URLs or invented command output |
| `docs/onboarding/team-orientation-notes.md` | Mission and first-PR notes; no runtime impact | Wrong product story |
| `docs/requirements-brief.md` | Requirements text, not app code | Scope drift if rewritten carelessly |
| `README.md` | Getting-started text for the starter | Broken run instructions |

### Do not edit yet (wait until you have tests, review, and a real task)

| Path or area | Why wait | What could break |
|--------------|----------|------------------|
| `package-lock.json` | Root lockfile / dependency graph | Install failures for everyone |
| `package.json` | Only package manifest; scripts and dependencies | Dev/build scripts and the whole app install |
| `vite.config.ts` | Shared Start/Vite plugin wiring | Dev server and production build |
| `tsconfig.json` | Shared TypeScript / path aliases | Typecheck and imports across `src/` |
| `src/routeTree.gen.ts` | Generated file (also marked read-only in `.vscode/settings.json`) | Router mismatch; gets overwritten by `generate-routes` |
| `src/` (routes, components, `src/lib/user.ts`) | Application UI and placeholder user helper | User-facing screens and later auth work |
| `.cursorrules` / `AGENTS.md` | Shared agent rules | Agents follow wrong instructions |
| `.github/` CI | **Not present yet**; if added later, it is a shared pipeline | Everyone’s builds |
| Supabase / migrations / `.env` | **Not present yet**; secrets and production data | Data loss or leaked secrets |
| Shared packages used by multiple apps | **Not found** (single package) | N/A until a workspace exists |

## 7. Open questions for the team

- When should `src/lib/supabase.ts` be added, given `.cursorrules` names it but the file is **not found**?
- Is GitHub Actions CI expected later, since `.github/` is **not found** in this clone?
- Official app entry is this single app (`src/router.tsx` + `src/routes/`); there are not multiple apps — confirm that stays true.
- Which package is the source of truth for shared UI or types? **None found** beyond `src/components/` in this one app.
- `docs/` describes a Hockey Ops player directory (`/players`, `/games`) but `src/routes/` currently only has `/` and `/about` — which product surface is the next feature: PREIshare intelligence UI, or that directory brief?

## 8. How I will use this map next

- Configure AI project rules/memory using the paths above (next tooling steps).
- Pick a first contribution only from **Safe first-touch** unless a mentor expands scope.
- Revisit and edit this file when a path claim is proven wrong.
