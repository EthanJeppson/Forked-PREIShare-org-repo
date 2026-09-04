# Hockey Ops Player Directory — Requirements Brief (Sprint 1)

## Overview
Hockey operations needs a **player directory** staff can open on arena wifi and use immediately. Real directory content should appear on **first paint** (the first HTML the browser shows), not only after a long client-side spinner. Every player must have a **linkable, bookmarkable** page URL.

This sprint delivers a TanStack Start skeleton: routes, validated params, and server-rendered page shells with seed/directory content. Full database auth and live feeds are later sprints.

## Actors and goals
| Actor | Goal | Success looks like |
| --- | --- | --- |
| Hockey ops staff | Open the directory on weak wifi and see players/games right away | First response HTML already lists directory content |
| Hockey ops staff | Share or bookmark one player | URL like `/players/42` opens that player’s page |
| Coach / scout (same app) | Browse games list and jump back to players | `/games` works and nav links are consistent |
| Future developer (you) | Implement without re-guessing scope | This brief + acceptance list stay the checklist |

## Route map (minimum for this sprint)
| Route name | URL pattern | Kind | Purpose |
| --- | --- | --- | --- |
| Home | `/` | Static | Landing + short directory summary |
| Players index | `/players` | Static | List players; optional search/filter query later |
| Player detail | `/players/$playerId` | Dynamic (path param) | One player; bookmarkable |
| Games index | `/games` | Static | List games; optional view/filter query later |

Notes for implementers:
- `$playerId` is a **path param** (value is part of the URL path).
- Filters (e.g. position, team) belong in **search params** (the `?key=value` part), validated so bad values do not crash the page.
- Nav must reach Home, Players, and Games from every shell page.

## Data shown on first paint (server-rendered)
For Sprint 1, content may come from a **seed/demo data** module loaded on the server—not necessarily live Supabase yet—as long as staff see real-looking directory rows in the first HTML.

| Page | Must appear in first HTML (not only after spinner) |
| --- | --- |
| Home | App title + short intro + links into Players and Games |
| Players index | At least a small list of player names (seed data OK) |
| Player detail | Player id (and name if known); clear empty/not-found state if missing |
| Games index | At least a small list of games (seed data OK) |

## Type-safe links and params
- Internal links use the router’s type-safe link helper (no hand-typed dead paths).
- `playerId` is validated (e.g. non-empty string or numeric id rules decided in a later step).
- Search params for filters/views have defaults and reject/coerc invalid values safely.

## Out of scope (this sprint)
- Real Supabase Auth login/roles
- Live NHL feeds or unpaid external APIs
- Editing/creating players in the UI
- Payments, messaging, or mobile native apps
- Perfect visual design system (basic Tailwind layout is enough)

## Acceptance criteria (browser-checkable)
1. Visiting `/` shows the home shell with visible directory-oriented content or navigation—not a blank page.
2. Visiting `/players` shows a players list region with seed (or loaded) content in the initial document when SSR is wired.
3. Visiting `/players/<id>` for a known seed id shows that player’s detail shell; URL can be copied, pasted, and reopened.
4. Visiting `/games` shows a games list region.
5. Primary nav can reach Home, Players, and Games without broken links.
6. Invalid player id shows a safe not-found/empty state rather than a raw crash page (polished in a later step is OK if noted).
7. Requirements in this file mention **server-rendered first paint** and **bookmarkable player URLs** as non-negotiable goals for agent prompts.

## Sprint boundary
Done for Sprint 1 means: scaffolded TanStack Start app, route tree matching this map, validated path/search params, SSR shells with seed directory content, short verification notes, and stakeholder handoff. Not done: production data pipeline or auth.
