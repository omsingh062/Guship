import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.',        // current folder (frontend/) is root
  build: {
    outDir: 'dist', // output inside frontend/dist
    emptyOutDir: true
  }
});
