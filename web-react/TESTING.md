# PR #1 — Manual smoke test (post-merge)

This file captures the manual smoke-test of [PR #1](https://github.com/taylor-curran/Angular-Restaurant-App/pull/1) ("Scaffold bare React sibling and wire Cursor cloud env"), recorded after the PR was merged.

## Setup

In the Cursor cloud-agent VM provisioned by `.cursor/environment.json`:

- `npm install --ignore-scripts && npm --prefix web-react install` ran on cold start.
- The `web` and `react` terminals from `environment.json` auto-launched both dev servers:
  - `npm run web`  → Angular app on `http://localhost:4200`
  - `npm run react` → Vite/React scaffold on `http://localhost:5173`

## What was recorded

A headless Playwright run in this VM loaded each dev server and captured a short video plus a still:

| App                     | URL                       | Screenshot                                             | Recording                                              |
| ----------------------- | ------------------------- | ------------------------------------------------------ | ------------------------------------------------------ |
| Angular (existing app)  | `http://localhost:4200/`  | `/opt/cursor/artifacts/screenshots/angular-app.png`    | `/opt/cursor/artifacts/recordings/angular-app.mp4`     |
| React sibling scaffold  | `http://localhost:5173/`  | `/opt/cursor/artifacts/screenshots/react-scaffold.png` | `/opt/cursor/artifacts/recordings/react-scaffold.mp4`  |

These artifacts are embedded inline in the PR description for this branch.

## Observations

- Angular app booted, served the Ristorante Con Fusion homepage at `:4200`, and the navbar / hero / featured-dishes carousel rendered as expected.
- The React scaffold at `:5173` rendered the bare placeholder heading from `web-react/src/App.tsx`, confirming Vite + React + TS comes up cleanly with no migration code.
- Both `npm run web` and `npm run react` started without manual intervention, so the `terminals` block in `.cursor/environment.json` is doing what PR #1 advertised.
