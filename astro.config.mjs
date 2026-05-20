import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import partytown from '@astrojs/partytown';

// Vite plugin to prevent _-prefixed content draft files from being compiled by MDX
const excludeDrafts = {
  name: 'exclude-content-drafts',
  enforce: 'pre',
  transform(_code, id) {
    if (/[/\\]content[/\\][^/\\]+[/\\]_[^/\\]+\.mdx?$/.test(id)) {
      return { code: 'export default null;', map: null };
    }
  },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://sstyles93.github.io/',
  integrations: [
    mdx(),
    //sitemap(),
    tailwind(),
    partytown()
  ],
  vite: {
    plugins: [excludeDrafts],
  },
});