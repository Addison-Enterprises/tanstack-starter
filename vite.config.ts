import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [
    tanstackStart({
      srcDirectory: "app",
      router: {
        routeFileIgnorePrefix: "-",
        generatedRouteTree: "routeTree.gen.ts",
        routesDirectory: "routes",
      },
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "~": path.resolve(import.meta.dirname, "app"),
    },
  },
});