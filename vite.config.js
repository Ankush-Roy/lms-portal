// vite.config.ts (or .js)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use / in dev, /lms/ in production builds
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/lms/' : '/',   // 👈 important!
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 5173,
    host: true,
  },
}));
