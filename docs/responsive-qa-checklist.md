# PREIshare dashboard — responsive QA checklist

**Tester:** Cursor cloud agent (automated run; a human has not yet repeated it, see Sign-off)
**Date:** 2026-10-26
**App URL tested:** http://localhost:3000/dashboard (dev server, `npm run dev`)
**Build / branch:** `cursor/dashboard-responsive-qa-8483`, on top of the Overview composition branch (PR #23, which includes PR #21 nav and PR #22 widgets)

## How this was tested (read this first)

- Chrome 156 in headless mode, driven over the Chrome DevTools Protocol. The viewport was set with device-metrics emulation to 375, 768 and 1280 px wide. This is the same mechanism as the devtools device toolbar, but a script took the measurements, not a person.
- Measurements came from the live page: horizontal scroll (`scrollWidth` vs `clientWidth`), element visibility and sizes, card positions, which control was visible, and clicks and key presses on the mobile menu. Screenshots were looked at for the three widths and the open menu.
- The brief is `docs/investor-dashboard-brief.md`. The file `docs/preishare-dashboard-requirements.md` named by the lesson does not exist.
- Not tested: real phones or tablets, touch input, Safari or Firefox, dark mode, a screen reader, browser zoom.

## Breakpoints used

| Name    | Width  | How to set                          |
|---------|--------|-------------------------------------|
| Mobile  | 375px  | Device-metrics emulation (devtools device toolbar equivalent) |
| Tablet  | 768px  | Device-metrics emulation            |
| Desktop | 1280px | Device-metrics emulation            |

Layout rules under test come from `docs/dashboard-component-architecture.md`: mobile under 768px (menu button plus MobileNav), tablet 768 to 1024px (narrower always-visible sidebar), desktop over 1024px.

## How to use this sheet

1. Load the dashboard route with the dev server running.
2. For each row, set the width, perform the check, mark **Pass** or **Fail**.
3. On Fail, write a short **Symptom** and which **file** you will ask the agent to touch.
4. After a targeted fix, re-test and update **Status** and **Fix notes**.
5. Critical rows must Pass (or be listed under Known limitations with stakeholder-safe wording).

Status shows the result after the fixes. Rows that failed first say so in the notes.

---

## Mobile (~375px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| M1 | No horizontal page scroll | Pass | No horizontal scroll with the menu closed or open, and with a 90-character unbroken string injected into an activity row. No element extends past the viewport. | None needed |
| M2 | Header remains visible and usable | Pass | First run: page title "Overview" was cut to "Overv..." (66px wide) and the "PREIshare" label wrapped onto two lines. After cycle 1 the title is 79px and fits, the label is one line, and the "Mock data" badge and demo user chip stay visible. "Portfolio" also fits. | Cycle 1, `AppShell.tsx` |
| M3 | Desktop sidebar is hidden or off-canvas (not permanently covering content) | Pass | Sidebar is not displayed (0x0). | None needed |
| M4 | MobileNav or menu control is visible | Pass | "Menu" button, 44x44px, in the dashboard header. | None needed |
| M5 | Menu opens and closes navigation links | Pass | Opens a panel (288px wide) with Overview, Portfolio, Deals, Profile and the expected hrefs. Closes with Escape, the Close menu button, tapping outside the panel, and choosing a link. Choosing Deals changed the title to "Deals" and closed the panel. Choosing Overview brought back all three sections. Keyboard: Enter on the Menu button opens it and moves focus to Close menu. First run: after closing, focus fell to the page body. After cycle 3 it returns to the Menu button. | Cycle 3, `MobileNav.tsx` |
| M6 | Main content readable without pinched text | Pass | Body text 16px. First run: cards were 277px wide because the page had a doubled side gutter (shell 311px of a 375px screen). After cycle 1 cards are 309px wide. | Cycle 1, `AppShell.tsx` |
| M7 | Metric cards stack in a single column (or intentional narrow grid) | Pass | Three cards, one column, full width of the main area. | None needed |
| M8 | PortfolioSummary does not overflow or clip | Pass | Headline wraps to two lines, breakdown lines fit. | None needed |
| M9 | RecentActivity list wraps; no cut-off timestamps/labels | Pass | Timestamps, titles and details wrap. The unbroken-string stress test caused no horizontal scroll. | None needed |
| M10 | Empty-state messaging (if shown) is fully visible | Pass (indirect) | The Overview page is populated with mock data, so no empty state shows on it. Empty states for PortfolioSummary and RecentActivity were checked earlier on a throwaway page at 375px and desktop (PR #22). Not re-run on this page. | None needed |

## Tablet (~768px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| T1 | No horizontal page scroll | Pass | None. | None needed |
| T2 | Navigation pattern matches plan (sidebar, rail, or menu—not both fighting) | Pass | Narrower sidebar (192px) always visible, Menu button hidden, active link marked. | None needed |
| T3 | Header + content spacing not cramped | Pass | Header, sidebar and main read comfortably. Main area is 495px wide. | None needed |
| T4 | Metric cards use a sensible 2-column (or planned) layout | Pass | Two columns of 216px. With three cards the third sits alone on the second row, leaving an empty slot. Accepted as the planned two-column grid. | None needed |
| T5 | PortfolioSummary and RecentActivity share space without overlap | Pass | Stacked full width (side by side starts at 1024px). No overlap. | None needed |
| T6 | Touch targets / click targets large enough to use | Pass | First run: sidebar links were 36 to 38px tall. After cycle 2 they are 44px, and the active link no longer changes height. | Cycle 2, `Sidebar.tsx` |

## Desktop (~1280px)

| ID | Check | Status (Pass/Fail) | Symptom / notes | Fix notes (prompt + files) |
|----|--------|--------------------|-----------------|----------------------------|
| D1 | Sidebar visible and usable per architecture | Pass | 240px wide, sticky: with a short window, scrolling 300px moved the nav from 184px to 80px from the top and it stayed there. First run: the divider line beside the sidebar stopped after the four links (190px) instead of running the full height of the shell (627px). After cycle 2 the divider is full height and the links are still sticky. | Cycle 2, `Sidebar.tsx` |
| D2 | MobileNav hidden or not duplicating full sidebar awkwardly | Pass | Menu button not displayed; the panel only exists at under 768px. | None needed |
| D3 | Main region has comfortable padding/margins | Pass | 806px wide main area with padding. | None needed |
| D4 | Metric cards align in a multi-column row as planned | Pass | Three cards of 242px in one row. | None needed |
| D5 | PortfolioSummary + RecentActivity sit in intended regions | Pass | Side by side, two equal columns of 367px under the cards. The Portfolio summary card stretches to match the taller Recent activity card, so it has empty space at the bottom (cosmetic). | None needed |
| D6 | Long labels/numbers do not break the header or sidebar width | Pass | "Total mock value: $6,850,000", the header and the sidebar all fit. | None needed |

## Cross-cutting issues

| ID | Check | Status | Notes |
|----|--------|--------|-------|
| X1 | Focus order / keyboard: menu and links reachable | Pass | On mobile the Menu button is reachable by Tab. Enter opens the panel and focuses Close menu. Tab moves through the four links. Escape closes it and focus returns to the Menu button (fixed in cycle 3; before, it went to the page body). Focus is not trapped inside the open panel (see Known limitations). The site header links come before the dashboard Menu button in tab order. |
| X2 | No layout jump when opening/closing mobile menu | Pass | Main area position and size are identical before and after opening. |
| X3 | Stacking order: important metrics appear before low-priority lists on small screens | Pass | Order on mobile: intro, three metric cards, portfolio summary, recent activity. |

## Targeted fix log (one row per prompt cycle)

Each cycle names one file, one symptom and one breakpoint, and was followed by a re-run of the measurements at all three widths to catch regressions.

| Cycle | Breakpoint | File(s) touched | Prompt summary (one sentence) | Result after re-test |
|-------|------------|-----------------|-------------------------------|----------------------|
| 1 | Below 640px (`sm`) | `src/components/dashboard/AppShell.tsx` | Remove the extra side padding on the shell wrapper below `sm` (the page wrapper already has a side margin), keeping tablet and desktop unchanged. | M2 and M6 pass: cards 277 to 309px, title no longer cut. Tablet and desktop measurements identical. |
| 2 | 768px and up | `src/components/dashboard/Sidebar.tsx` | Make the sidebar's column full height so its divider runs the whole shell, keep the nav sticky inside it, and make links 44px tall with a constant border so the active link does not change height. | D1 and T6 pass: divider 627px (was 190px), links 44px (were 36 to 38px), sticky still works, mobile unchanged. |
| 3 | Below 768px | `src/components/dashboard/MobileNav.tsx` | When the panel closes, return focus to the element that opened it. | X1 and M5 keyboard pass: Escape returns focus to the Menu button (was the page body). |

## Known limitations (optional)

- The site header and footer from `__root.tsx` still show above and below the dashboard, so there are two headers on every dashboard page. This is the open question in `docs/dashboard-routing-plan.md` and was not decided in this step. On mobile it adds about 115px above the dashboard header.
- `/dashboard/portfolio`, `/dashboard/deals` and `/dashboard/profile` are not built yet, so those links show "Not Found" inside the shell. The shell, header title and navigation still work on them.
- The "Open deals: 3" value is a hard-coded mock number and is not derived from the deals fixtures.
- At tablet width the third metric card sits alone on its row, and at desktop the Portfolio summary card has empty space under its content.
- The MobileNav panel does not trap keyboard focus, and if it is open when the window is widened past 768px it stays open in state (it is hidden by CSS) and shows again if the window is narrowed.
- Not tested: real devices, touch, Safari, Firefox, dark mode, screen readers, zoom.

## Sign-off

- [x] Critical mobile checks M1–M7 pass
- [x] Critical tablet checks T1–T5 pass
- [x] Critical desktop checks D1–D5 pass
- [x] Fix log filled for every change made during QA
- [x] Touched components still match the architecture (no accidental full rewrite)

**Ready for stakeholder handoff draft:** Yes, with the known limitations above. The results come from an automated emulated run; a human check in a real browser at the three widths is still recommended before handing it to stakeholders.
