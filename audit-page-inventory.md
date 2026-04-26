# Audit page inventory — L'Artisan Culinaire (conFusion)

**Angular reference:** `src/app/app-routing/routes.ts` (hash routing uses paths without `#` in modern config; app uses `pathMatch: 'full'` redirect from `''` to `/home`).

**React migration:** `web-react/src/App.tsx` (`react-router-dom` `Routes`).

| Route path | Purpose | Auth | How to reach |
|------------|---------|------|--------------|
| `/` | Redirects to home (both). | None | Open root URL. |
| `/home` | Landing: hero, featured dish/promotion/leader, marketing sections. | None | Nav **Home**, footer **Home**, brand link, post-redirect. |
| `/menu` | Full menu grid, category filter, dish cards, CTA. | None | Nav **Menu**, hero **Explore Our Menu**, footer **Our Menu**. |
| `/dishdetail/:id` | Dish image/description, reviews, review form, prev/next. | None | From home featured card, menu cards, or direct URL. |
| `/about` | Story, heritage, quote, team, CTA. | None | Nav **About**, footer **About Us**. |
| `/contactus` | Contact hero, address/phone/hours cards, long feedback form. | None | Nav **Contact**, footer **Contact**, menu CTA. |

**Global chrome (every route):**

- **Header** (`app-header` / `Header`): brand, main nav, search overlay, action icons (reservations, phone), mobile drawer with extra CTAs in Angular.
- **Footer** (`app-footer` / `Footer`): brand blurb, quick links, contact/hours, badges, back-to-top (React always shows link; Angular toggles on scroll).

**Deep links / query:**

- **Search:** header search submits `?search=` to `/menu` (React `useSearchParams`; Angular does not read query in `MenuComponent` but navigation still happens).

**Modals / overlays:**

- Search bar slides from header (not a separate route).
- Contact map / phone / email in Angular use `window.open` / `tel:` / `mailto` from `ContactComponent` methods.

**Reachability note:** E2E uses Playwright `route` mocks for `http://localhost:8000` JSON API so both UIs load without a live server. The inventory above matches source routing; all listed paths were exercised in the audit harness (static Angular `dist` + Vite React harness in `e2e-comparison/`).
