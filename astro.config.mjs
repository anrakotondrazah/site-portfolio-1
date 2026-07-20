import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/static";

import { SITE } from "./src/config";

export default defineConfig({
  site: SITE.website,
  base: SITE.base,
  output: "static",
  adapter: vercel(),
  integrations: [
    tailwind({
      configFile: "./tailwind.config.mjs",
      applyBaseStyles: false,
    }),
    react(),
  ],
  image: {
    layout: "constrained",
    responsiveStyles: true,
    domains: [],
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks: {
            three: ["three"],
            gsap: ["gsap", "gsap/ScrollTrigger"],
          },
        },
      },
    },
    ssr: {
      noExternal: ["three"],
    },
  },
});
