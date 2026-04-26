# Audit page inventory — Angular (reference) vs React (migration)

**Apps:** Angular dev server on port `4200`, Vite React on port `5173`. **API:** `json-server` on port `8000` serving `db.json`. **No authentication** — all listed routes are public.

Routes are defined in `src/app/app-routing/routes.ts` (Angular) and `web-react/src/App.tsx` (React). Navigation is reachable from the main header, footer quick links, and in-content CTAs (e.g. home hero → menu, menu CTA → contact).

| # | Path | Purpose | Auth | How to reach |
|---|------|---------|------|--------------|
| 1 | `/` | Redirects to home | None | Open root URL. |
| 2 | `/home` | Landing: hero, featured dish/promotion/leader, philosophy copy | None | Nav **Home**, brand link, footer **Home** |
| 3 | `/menu` | Full menu of dishes from API; optional search query | None | Nav **Menu**, “Explore Our Menu” on home, footer **Our Menu** |
| 4 | `/dishdetail/:id` | Single dish, reviews list, add-review form (both stacks) | None | From menu/home cards, prev/next on detail, direct URL (e.g. `/dishdetail/0`) |
| 5 | `/about` | Story, history timeline, quote, team/leaders from API | None | Nav **About**, footer **About Us** |
| 6 | `/contactus` | Contact info + feedback form (POST `/feedback`) | None | Nav **Contact**, footer **Contact**, menu CTA **Contact Us** |
| 7 | **Header overlays** (not separate URLs) | Search bar (toggles; navigates to `/menu?search=…`), reservation/phone icon alerts | N/A | Toolbar icons on every page |
| 8 | **Header mobile menu** (Angular only; not a separate URL) | Slide-out nav + Make Reservation / Call Us | N/A | Hamburger at narrow widths |

## Coverage notes

- All six primary routes were compared in both runtimes (with API running).
- The Angular **menu** page loads `/dishes` but its template depends on **undefined** template symbols (`filteredDishes`, `clearFilters`, etc.); the reference app therefore **does not list dishes** in the main grid. The React app **does** list dishes. This is called out in tests and CSV.
- React omits large blocks present on Angular **home** (testimonials, “Excellence in Numbers” stats grid, CTA block with “Open 7 Days”, etc.) and large blocks on **about** (e.g. “Excellence in Numbers” card, different philosophy copy and tags, scroll affordance, timeline chrome).
- React **header** has no hamburger / mobile menu panel; Angular does at small viewports.
