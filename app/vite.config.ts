import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: {
    host: true, // 0.0.0.0 so the container port is reachable
    port: 5173,
    strictPort: true,
    watch: { usePolling: true, interval: 100 }, // required for HMR in Docker
  },
  preview: { host: true, port: 4173, strictPort: true },
  css: { preprocessorOptions: { scss: { api: "modern-compiler" } } },
  test: { environment: "jsdom", globals: true },
});
