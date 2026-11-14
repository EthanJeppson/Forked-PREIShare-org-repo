# Supabase environment setup checklist (PREIshare Sprint 4)

## Purpose

Set up the Supabase project and the environment-variable layout so later steps can add sponsor sign-in and Postgres-backed listings without shipping a secret to the browser. This step is configuration only: no login page, no tables, no Supabase client code.

## Source requirements

[`../requirements/sponsor-auth-and-listings-brief.md`](../requirements/sponsor-auth-and-listings-brief.md), especially the "Server-only boundary" section. If this checklist and the brief disagree, the brief wins.

## What exists in the repo after this step

| File | Committed? | What it is |
| --- | --- | --- |
| `.env.example` | Yes | Variable names with placeholder values only |
| `docs/setup/supabase-env-checklist.md` | Yes | This checklist |
| `.gitignore` | Yes | Ignores real env files, keeps `.env.example` tracked |
| `.env.local` (or `.env`) | **Never** | Your real values. You create it by hand on your machine. |

Not in the repo, and not added by this step: `src/lib/supabase.ts`, a `supabase/` folder, migrations, auth routes, or any code that reads these variables.

## Variables

| Name | Where it may run | Secret? | Notes |
| --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | Browser and server | No | Project URL. Read with `import.meta.env.VITE_SUPABASE_URL`. |
| `VITE_SUPABASE_ANON_KEY` | Browser and server | No, but not a bypass | The dashboard may call it "anon" or "publishable". RLS protects the data. |
| `SUPABASE_URL` | Server only | No | Same URL, for server code that reads non-`VITE_` variables. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | **Yes** | Bypasses Row Level Security. Treat it like a password. |

The `VITE_` prefix is what makes Vite put a value into the browser bundle. That is why the service-role key must never carry it.

## Supabase project (you do this in the dashboard)

- [ ] Sign in at the Supabase dashboard and create a project for PREIshare (or open an empty one you will use this sprint).
- [ ] Choose a strong database password and store it in a password manager. It is not an API key and it never goes in the repo or in `.env.example`.
- [ ] Wait until the project shows as ready. Provisioning takes a minute or two.
- [ ] Open **Project Settings -> API**.
- [ ] Copy the **Project URL** into a private note (not a tracked file).
- [ ] Copy the **anon / publishable** key into the same private note.
- [ ] Copy the **service_role** key into the same private note. Do not put it in chat, screenshots or commits.

## Repo files

- [ ] `.env.example` is committed and contains placeholders only (`your-project-ref`, `your-anon-or-publishable-key`, `your-service-role-key`).
- [ ] Copy it: `cp .env.example .env.local`
- [ ] Paste the real values into `.env.local` yourself. Do not ask an agent to store them.
- [ ] `git check-ignore -v .env .env.local` prints a matching `.gitignore` rule for both.
- [ ] `git status` does not list `.env.local` or `.env`.

## Public vs server-only rules

- [ ] Browser-safe variables use the `VITE_` prefix: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` has **no** `VITE_` prefix.
- [ ] The service-role key must never ship in the client bundle. No file the browser loads may read it.
- [ ] Server-only variables are read with `process.env` inside server functions (`createServerFn`), not at module scope of a shared file.
- [ ] Neither `.env.example` nor this checklist contains a real key, a real project ref, or a database password.

## Smoke checks before feature work

- [ ] Restart `npm run dev` after creating or editing `.env.local`.
- [ ] The app still starts and `/` and `/dashboard` still load (nothing reads the variables yet, so this only proves the env file did not break startup).
- [ ] `git grep` for the first characters of your service-role key finds nothing in tracked files.
- [ ] `git ls-files | grep -E '^\.env'` lists only `.env.example`.
- [ ] If a real key was ever committed or pasted somewhere shared, rotate it in the dashboard before continuing.

## Troubleshooting

- A `VITE_` value reads as `undefined`: check the spelling and the `VITE_` prefix, confirm the file is at the repo root, and restart the dev server.
- `git status` lists `.env.local`: stop, `git rm --cached .env.local` if it was staged, and fix `.gitignore` before committing.
- A service-role value appears under a `VITE_` name: rename it, remove it from any commit, rotate the key, and do not continue to feature work until this is fixed.

## Handoff notes

- Hosting needs the same split: `VITE_` values go in the client build settings; `SUPABASE_SERVICE_ROLE_KEY` goes only in server runtime secret storage. Document names only.
- Later steps in this sprint: data model and RLS, then the Supabase clients and auth routes that read these names. They should reuse these exact variable names.
