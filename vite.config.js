
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "assets",
  base: "/",
  build: {
    outDir: "../assets/components",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        app: "./main.jsx",
      },
    },
  },
  server: {
    strictPort: true,
    port: 5173,
    origin: "http://localhost:5173",
  },
});
