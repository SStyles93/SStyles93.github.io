import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
//G-Analytics
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: 'https://SStyles93.github.io',
  integrations: [mdx(), sitemap(), tailwind(), 
    partytown({
      // optional: forward calls from your GA script to the worker
      config: {
        forward: ["dataLayer.push"],
      },
    })]
});