import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative base so the site works on GitHub Pages (https://<user>.github.io/<repo>/) and locally
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: { gsap: ['gsap'], react: ['react', 'react-dom'] },
      },
    },
  },
});
