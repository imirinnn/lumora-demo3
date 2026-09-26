import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Sub-folder the site is served from. "/" locally; "/lumora-demo3/" on GitHub Pages
  // (set by the deploy workflow through VITE_BASE).
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Keep the animation library in its own long-cached chunk.
        manualChunks: { motion: ['framer-motion'], react: ['react', 'react-dom', 'react-router-dom'] },
      },
    },
  },
});
