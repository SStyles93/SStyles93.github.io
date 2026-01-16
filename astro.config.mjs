import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import partytown from '@astrojs/partytown';
//G-Analytics

// https://astro.build/config
export default defineConfig({
  site: 'https://sstyles93.github.io/',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => page !== undefined
    }),
    tailwind(),
    partytown()
  ]
});