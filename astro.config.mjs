// @ts-check

import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeFootnotes from "./src/plugins/rehype-footnotes.ts";
import shikiDark from "./src/styles/shiki-dark.json" with { type: "json" };
import shikiLight from "./src/styles/shiki-light.json" with { type: "json" };

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://johnschmidt.de",

  image: {
    // Auto-generate `srcset`/`sizes` for all optimized images — including the
    // Markdown body images, which can't take per-image props. The hero opts out
    // (layout="none" in blog-post.astro) to keep its fixed 2:1 crop.
    layout: "constrained",
  },

  markdown: {
    // Dual light/dark themes — the light colors render inline and the
    // `html.dark` rules in global.css swap to the `--shiki-dark` variables.
    shikiConfig: {
      // JSON imports widen to `string`, so cast to satisfy shiki's theme type.
      themes:
        /** @type {import("@astrojs/markdown-remark").ShikiConfig["themes"]} */ ({
          light: shikiLight,
          dark: shikiDark,
        }),
    },
    processor: unified({ rehypePlugins: [rehypeFootnotes] }),
  },

  // MDX inherits the Markdown config (shiki themes + rehype plugins) above.
  integrations: [mdx(), sitemap()],

  vite: { plugins: [tailwindcss()] },

  adapter: node({
    mode: "standalone",
  }),
});
