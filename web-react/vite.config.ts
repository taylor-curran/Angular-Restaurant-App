/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Backend (json-server) lives at port 8000. The Angular app talks to the same
// backend through proxy.conf.json; mirror that here so /dishes, /leaders,
// /promotions, /feedback, /imageupload, /assets and /users requests are forwarded
// to the API during dev and tests.
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
      '/assets': { target: backend, changeOrigin: true, secure: false },
      '/paymentOrders': { target: backend, changeOrigin: true, secure: false },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
