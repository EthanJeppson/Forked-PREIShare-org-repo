# PREIshare Investor Dashboard Shell

This is the starter project for the PREIshare investor dashboard (Sprint 3). It is a TanStack Start app written in TypeScript with React and Tailwind CSS. Right now it only has the starter pages, `/` and `/about`. The dashboard pages are added in a later step.

## What you need first

- **Node.js (LTS version).** Check it by opening a terminal and typing `node -v`. If you see "command not found", install Node.js LTS from https://nodejs.org and open a new terminal.
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

3. Open http://localhost:3000 in your browser. You should see the starter home page.
4. Press `Ctrl+C` in the terminal to stop the server.

## Other commands

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the app for production. Use it to check that nothing is broken. |
| `npm run typecheck` | Checks the TypeScript types without running the app. |
| `npm run preview` | Serves the production build locally. Run `npm run build` first. |

## What the main files are for

| File | Job |
| --- | --- |
| `package.json` | Lists the app's scripts (such as `dev`) and the libraries it depends on. |
| `tsconfig.json` | Turns on strict TypeScript checking. |
| `app.config.ts` | App-level settings (app name and dev port). `vite.config.ts` reads it. |
| `vite.config.ts` | Configures the build tool (Vite) and the TanStack Start, React and Tailwind plugins. |
| `src/routes/__root.tsx` | The root layout. It wraps every page. |
| `src/routes/index.tsx` | The home page at `/`. |
| `src/routeTree.gen.ts` | Generated list of routes. Never edit it by hand. |

## How pages work

Pages come from files in `src/routes/`. This is called file-based routing. A file named `src/routes/about.tsx` becomes the page at `/about`. When you add or rename a route file, the dev server regenerates `src/routeTree.gen.ts` for you.

## Planning docs

The plan for the dashboard lives in `docs/`:

- `docs/investor-dashboard-brief.md`: what the dashboard must do and what is out of scope.
- `docs/dashboard-ia.md`: the pages, URLs and navigation labels.
- `docs/component-plan.md`: the components and what each one is responsible for.

## What comes next

The dashboard routes (`/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, `/dashboard/profile`) and the layout components (`AppShell`, `Sidebar`, `Header` and the page widgets) are added in later steps. The shell uses mock data only: no sign-in, no database and no payments.
