# PREIshare Investor Dashboard Shell

This is the PREIshare investor dashboard shell (Sprint 3): a TanStack Start app written in TypeScript with React and Tailwind CSS. It has four dashboard pages at `/dashboard`, `/dashboard/portfolio`, `/dashboard/deals` and `/dashboard/profile`, plus the starter pages `/` and `/about`. **Everything on the dashboard is mock data.** There is no sign-in, no database and no payments yet.

New here? Read [`docs/sprint3-handoff.md`](docs/sprint3-handoff.md) first (what shipped, a demo script, known limits), then [`docs/architecture-decisions.md`](docs/architecture-decisions.md) (why it is built this way).

## What you need first

- **Node.js 22.12 or newer.** The app's TanStack Start package requires it. Check it by opening a terminal and typing `node -v`. If you see "command not found" or an older version, install the current Node.js LTS from https://nodejs.org and open a new terminal.
- **npm.** It comes with Node.js. Check it with `npm -v`.

## Install and run

Run these commands in a terminal, from the project folder (the one that contains `package.json`).

1. Install the libraries the app needs. This can take a minute and creates a `node_modules` folder:

   ```bash
   npm install
   ```

2. Start the development server. It shows the app in your browser and reloads when you save a file:

   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser. You should see the starter home page with an "Open investor dashboard" button. Click it, or go straight to http://localhost:3000/dashboard.
4. Press `Ctrl+C` in the terminal to stop the server.

If `npm install` or `npm run dev` fails, check `node -v` first (see above), then delete the `node_modules` folder and run `npm install` again.

## Other commands

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the app for production. Use it to check that nothing is broken. |
| `npm run typecheck` | Checks the TypeScript types without running the app. |
| `npm run typecheck:errors` | Type-checks `src/fixtures/*.errors.ts`. Those files contain intentional type errors, so this command is supposed to report errors (see `docs/type-safety/expected-type-errors.md`). |
| `npm run preview` | Serves the production build locally, also at http://localhost:3000. Run `npm run build` first, and stop the dev server first so the port is free. |
| `npm run generate-routes` | Regenerates `src/routeTree.gen.ts` by hand. The dev server and build already do this. |

There is no test runner and no lint script in this project yet.

## What the main files are for

| File | Job |
| --- | --- |
| `package.json` | Lists the app's scripts (such as `dev`) and the libraries it depends on. |
| `tsconfig.json` | Turns on strict TypeScript checking. |
| `app.config.ts` | App-level settings (app name and dev port). `vite.config.ts` reads it. |
| `vite.config.ts` | Configures the build tool (Vite) and the TanStack Start, React and Tailwind plugins. |
| `src/routes/__root.tsx` | The root layout. It wraps every page. |
| `src/routes/index.tsx` | The home page at `/`. |
| `src/routes/dashboard.tsx` | The dashboard layout. It wraps every `/dashboard/*` page in `AppShell`. |
| `src/routes/dashboard/` | The four dashboard pages: `index.tsx` (Overview), `portfolio.tsx`, `deals.tsx`, `profile.tsx`. |
| `src/components/dashboard/` | The dashboard shell and widgets (`AppShell`, `Sidebar`, `MobileNav`, `Header`, `nav-config.ts`, and the page widgets). |
| `src/mock/dashboard-data.ts` | All dashboard mock data. Exports are named `MOCK_*`, `Mock*` or `getMock*`. |
| `src/styles/dashboard.css` | Shared dashboard responsive and accessibility rules, imported by `src/styles.css`. |
| `src/routeTree.gen.ts` | Generated list of routes. Never edit it by hand. |

## How pages work

Pages come from files in `src/routes/`. This is called file-based routing. A file named `src/routes/about.tsx` becomes the page at `/about`. When you add or rename a route file, the dev server regenerates `src/routeTree.gen.ts` for you.

## Planning docs

The plan for the dashboard lives in `docs/`:

- `docs/investor-dashboard-brief.md`: what the dashboard must do and what is out of scope.
- `docs/dashboard-ia.md`: the pages, URLs and navigation labels.
- `docs/component-plan.md`: the components and what each one is responsible for.
- `docs/verification-checklist.md`: what was tested against the brief, with evidence.
- `docs/sprint3-handoff.md`: the Sprint 3 handoff (what shipped, how to demo it, known limits, next steps).
- `docs/architecture-decisions.md`: why the shell is shaped the way it is, and what to build on next.

## What is not built yet

Sign-in and access control, live Supabase/PostgreSQL data, pgvector search, and GitHub Actions CI are all **not built**. The dashboard shows mock data only. See the handoff for the next-sprint plan.
