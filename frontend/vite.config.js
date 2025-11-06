import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',              // frontend folder is the root
  base: './',             // ensures relative paths for assets
  build: {
    outDir: 'dist',       // output goes to frontend/dist
    emptyOutDir: true
  }
});
