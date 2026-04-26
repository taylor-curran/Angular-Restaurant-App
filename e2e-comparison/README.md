# E2E comparison (Angular vs React)

**Prereqs:** `npm install` in repo root (Angular) and `cd e2e-comparison && npm install`. `npx ng build` outputs `../dist/conFusion` for the static Angular server. Playwright starts `http-server` on port 4200 and the Vite harness on 5173.

**Run:** `cd e2e-comparison && npx playwright test`

Network calls to `http://localhost:8000` are mocked in `routes.ts` so the suite does not need json-server. React runs through `harness/main.tsx` (adds `BrowserRouter` and `QueryClientProvider` for the same `web-react` `App` the PR delivers).
