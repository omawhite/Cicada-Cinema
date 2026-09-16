import { defineConfig, envField, fontProviders } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    imageService: "passthrough",
    prerenderEnvironment: "node",
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["astro/assets/services/noop"],
    },
  },
  env: {
    schema: {
      // Page-release flags: flip to `true` once a page is ready to go live.
      // The gated page itself (e.g. src/pages/showtimes.astro) is rendered
      // on demand and reads this live, but anything resolved at build time
      // (e.g. the header nav link) needs a rebuild to pick up the change.
      PAGE_SHOWTIMES_ENABLED: envField.boolean({
        context: "server",
        access: "public",
        default: false,
      }),
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
