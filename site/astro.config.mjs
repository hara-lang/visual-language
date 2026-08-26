import { defineConfig } from "astro/config";
import react from "@astrojs/react";
export default defineConfig({
  site: "https://ui.hara-lang.org",
  base: "/",
  output: "static",
  outDir: "../dist",
  publicDir: "../assets",
  integrations: [react()],
  vite: {
    resolve: {
      preserveSymlinks: true
    }
  }
});
