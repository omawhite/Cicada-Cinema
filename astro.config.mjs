import { fileURLToPath } from "node:url";
import { defineConfig, fontProviders } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";
import studiocms from "studiocms";
import { studiocmsDevLogger } from "./scripts/vite-studiocms-dev-logger.mjs";

const srcModule = (path) => fileURLToPath(new URL(path, import.meta.url));

// https://astro.build/config
export default defineConfig({
  // StudioCMS refuses to start without `site`, and its dashboard and API
  // routes are server-rendered. Existing pages opt back into prerendering
  // individually so their behavior is unchanged.
  site: process.env.SITE_URL ?? "http://localhost:4321",
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough",
    prerenderEnvironment: "node",
  }),
  integrations: [react(), studiocms()],
  vite: {
    plugins: [tailwindcss(), studiocmsDevLogger()],
    // The Cloudflare adapter folds `vite.optimizeDeps.include` into its server
    // environments. StudioCMS pulls in CommonJS packages that workerd cannot
    // evaluate ("require is not defined") unless Vite pre-bundles them to ESM.
    resolve: {
      alias: {
        pg: srcModule("./src/studiocms/unused-db-drivers.ts"),
        mysql2: srcModule("./src/studiocms/unused-db-drivers.ts"),
        "@effect/platform-node": srcModule(
          "./src/studiocms/cli-only-modules.ts",
        ),
        "@effect/cli": srcModule("./src/studiocms/cli-only-modules.ts"),
        micromatch: srcModule("./src/studiocms/micromatch-shim.ts"),
        diff2html: srcModule("./src/studiocms/diff2html-shim.ts"),
      },
    },
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Reuben",
      cssVariable: "--font-reuben",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/reuben/Reuben.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Florensans",
      cssVariable: "--font-florensans",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/florensans/Florensans-Regular.woff2"],
          },
        ],
      },
    },
  ],
});
