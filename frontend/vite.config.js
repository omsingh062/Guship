import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",      // React build output folder
    assetsDir: "assets", // folder for static assets
    sourcemap: false,    // optional, reduce bundle size
  },
  server: {
    port: 5173,
    cors: true,          // allows dev server requests from backend
  },
  base: "./",           // important! ensures React works when served from Express
});
