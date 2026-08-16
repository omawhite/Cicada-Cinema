import { defineConfig, fontProviders } from "astro/config";
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
