# web-react

Bare Vite + React + TypeScript scaffold living next to the existing Angular
app at the repo root. **Nothing has been ported yet.** Pick your own router,
UI kit, forms library, state manager, and test runner.

## Dev

```sh
# from repo root
npm --prefix web-react install
npm run react           # vite on :5173, host 0.0.0.0

# or directly
cd web-react
npm run dev
```

The Vite dev server proxies the same REST endpoints the Angular app calls
(`/dishes`, `/leaders`, `/promotions`, `/feedback`, `/imageupload`, `/users`,
`/api`) to `http://localhost:8000`. Update `vite.config.ts` if the backend
moves.

## Build

```sh
npm --prefix web-react run build
```
