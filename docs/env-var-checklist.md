# PREIshare Environment Variable Checklist

A one-page reference for which Supabase variables may appear in browser code and which must stay on the server. It names variables and never shows values.

- Rules come from `docs/sponsor-auth-requirements.md` (section 7) and `docs/requirements/sponsor-auth-and-listings-brief.md` ("Server-only boundary").
- The template is `.env.example` at the repo root. Real values live only in a private `.env.local` on each machine and in the host's secret store (Vercel) in production.
- For the longer setup walkthrough, see `docs/setup/supabase-env-checklist.md`.

## Variables

In Vite, only names that start with `VITE_` are copied into the browser bundle. That is why the service-role key must never carry that prefix.

| Name | Client-safe or server-only | Used for | Why |
| --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | **Client-safe** (browser and server) | Auth session: the browser client (`src/lib/supabase/client.ts`) uses it to sign users in. | The project URL is public by design. |
| `VITE_SUPABASE_ANON_KEY` | **Client-safe** (browser and server) | Auth session: sign-in in the browser, and server queries made as the signed-in user (`src/lib/supabase/server.ts`). | The anon (publishable) key is public by design. It is not a bypass: Row Level Security (RLS) decides what each user can read or write. |
| `SUPABASE_URL` | **Server-only** | Auth session: server code that reads the URL without the `VITE_` prefix (`src/lib/supabase/server.ts`). | Not a secret, but there is no reason to ship a second copy to the browser. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only. Secret.** | Admin bypass of RLS. **No code reads it today.** | It bypasses RLS, so anyone who holds it can read and change every row. |

### Never do this: `SUPABASE_SERVICE_ROLE_KEY`

- Never give it a `VITE_` prefix (for example `VITE_SUPABASE_SERVICE_ROLE_KEY`). Vite would put it in the browser bundle.
- Never import or read it in browser code, shared React components, or any file the browser loads.
- Never read it at module scope. If a future server task truly needs it, read it with `process.env` inside server-only code (for example a `createServerFn` handler), with a written reason.
- Never commit it, paste it into chat, a doc or a screenshot, or log it. If it was ever shared, rotate it in the Supabase dashboard.
- Never use it to serve a sponsor's own data. Sponsor reads and writes use the signed-in user's session so RLS applies.

## Git ignore rules

`.gitignore` ignores real env files and keeps the template tracked:

| Pattern | Effect |
| --- | --- |
| `.env` | Ignores the plain env file. |
| `.env.*` | Ignores `.env.local`, `.env.production`, `.env.development.local` and similar. |
| `*.local` | Ignores any other `.local` file. |
| `!.env.example` | Keeps `.env.example` tracked so teammates can see which names exist. |

## Checks to run before every commit (PowerShell)

First, `cd` into the repo folder (for example `cd C:\Users\ethan\Documents\GitHub\Forked-PREIShare-org-repo`). Then:

```powershell
git check-ignore -v .env .env.local
git ls-files | Select-String '^\.env'
git status
git grep -nE "eyJ[A-Za-z0-9_-]{10,}"
git grep -n "VITE_SUPABASE_SERVICE"
```

- [ ] `git check-ignore -v` prints a rule for both `.env` and `.env.local`.
- [ ] `git ls-files` lists only `.env.example`.
- [ ] `git status` does not list `.env` or `.env.local`.
- [ ] The two `git grep` commands print nothing. (No output is normal; PowerShell may show no message at all.)
- [ ] `.env.example` holds placeholders only (`your-project-ref`, `your-anon-or-publishable-key`, `your-service-role-key`).
- [ ] No `.ts` or `.tsx` file contains a hard-coded Supabase URL or key.

## Hosting (Vercel) reminder

Set the same names in the Vercel project's Production environment variables. Add the three non-secret names as normal variables. Add `SUPABASE_SERVICE_ROLE_KEY` only if a future task needs it, and never under a `VITE_` name. Vite reads `VITE_` values when the app is built, so after changing them, redeploy. Whether the Production variables are set has not been confirmed in this repo.

## Used by later steps

The Supabase client step and the security verification step both read this file. If a variable is added, renamed or changes where it may run, update `.env.example` and this table in the same change.
