import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // Set frontend as root for Vite
  root: path.resolve(__dirname, 'frontend'),
  build: {
    // Output build files inside frontend/dist
    outDir: path.resolve(__dirname, 'frontend/dist'),
  },
});
