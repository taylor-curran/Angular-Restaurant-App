# Angular-to-React migration — page inventory (reference: Angular 6 app)

This list is derived from `src/app/app-routing/routes.ts`, global layout (`app.component`, `header`, `footer`), and deep links from in-app navigation.

## Auth and roles

- **No authentication.** All listed routes are public. No role gating.

## Reachable pages / views

| # | Path | Purpose | How to reach | React reachability (this audit) |
|---|------|---------|--------------|----------------------------------|
| 1 | `/` | Redirects to home | Open site root | Vite app serves the same single-page shell for all paths; no port of home content. |
| 2 | `/home` | Hero, featured dish/promotion/leader, philosophy, testimonials, stats, CTA | Header/footer “Home”, brand click, footer quick links | Same React scaffold; no L’Artisan / ConFusion home UI. |
| 3 | `/menu` | Menu grid, category filters, stats, contact CTA | Nav “Menu”, home CTAs, footer | Angular: note `menu.component.html` binds `filteredDishes` but `menu.component.ts` does not define it, so the dish grid never renders (empty content between filter and CTA). React: no menu UI. |
| 4 | `/dishdetail/:id` | Dish detail, reviews, review form, prev/next dish | From menu/cards, URL `/dishdetail/0` etc. | No dish detail; scaffold only. |
| 5 | `/about` | Story, timeline, stats, quote, philosophy, team, CTA | Nav “About”, footer | No about page content. |
| 6 | `/contactus` | Contact hero, address/hours, feedback form with validation | Nav “Contact”, CTAs, footer | No contact UI. |
| 7 | **Header (all pages)** | Brand, primary nav, search overlay, mobile menu, actions | Always visible (except loading-only states) | No toolbar / nav / search. |
| 8 | **Footer (all pages)** | Brand, quick links, contact/hours, back-to-top | Scroll on any page | No footer. |
| 9 | **Search overlay** (state) | “Search our menu…” field (header) | Click search icon | Not present in React. |
| 10 | **Reservations** (modal/behavior) | Header “Reservations” / mobile “Make Reservation” (opens `window.open` per component) | Header buttons | Not present in React. |

## Parity visit notes (manual)

- **Angular** (`ng serve` on 4200): all routes above visited with a running API on port 8000; pages render full L’Artisan Culinaire + ConFusion content and data.
- **React** (`web-react` Vite on 5173): only the scaffold in `web-react/src/App.tsx` and `conFusion (React scaffold)` document title; no routes, no shared shell with Angular.

## Coverage checklist

- [x] `/home` — both (Angular full UI; React scaffold)
- [x] `/menu` — both
- [x] `/dishdetail/0` — both
- [x] `/about` — both
- [x] `/contactus` — both
- [x] Global chrome (header/footer) — both
