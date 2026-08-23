import { defineConfig } from "astro/config";
export default defineConfig({
  site: "https://ui.hara-lang.org",
  base: "/",
  output: "static",
  outDir: "../dist",
  publicDir: "../assets",
  vite: {
    resolve: {
      preserveSymlinks: true
    }
  }
});
