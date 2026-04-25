import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The Angular app talks to an external REST API at http://localhost:8000/
// (see proxy.conf.json + src/app/shared/baseurl.ts in the repo root).
// Mirror that here so the React scaffold can hit the same backend during
// development without CORS pain.
const backend = 'http://localhost:8000';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/dishes': { target: backend, changeOrigin: true, secure: false },
      '/leaders': { target: backend, changeOrigin: true, secure: false },
      '/promotions': { target: backend, changeOrigin: true, secure: false },
      '/feedback': { target: backend, changeOrigin: true, secure: false },
      '/imageupload': { target: backend, changeOrigin: true, secure: false },
      '/users': { target: backend, changeOrigin: true, secure: false },
      '/api': { target: backend, changeOrigin: true, secure: false },
    },
  },
});
