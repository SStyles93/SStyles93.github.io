import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import partytown from '@astrojs/partytown';
import remarkGfm from 'remark-gfm';
import { readdirSync, readFileSync } from 'node:fs';

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

// Teaser posts (isProject: true) only redirect to their project page, so keep them out of the sitemap.
// Content collections aren't available here, hence the plain frontmatter scan.
const blogsDir = new URL('./src/content/blogs/', import.meta.url);
const teaserPaths = new Set(
  readdirSync(blogsDir)
    .filter((file) => /\.mdx?$/.test(file))
    .filter((file) => /^isProject:\s*true\s*$/m.test(readFileSync(new URL(file, blogsDir), 'utf-8')))
    .map((file) => `/blogs/${file.replace(/\.mdx?$/, '').toLowerCase()}/`),
);

// https://astro.build/config
export default defineConfig({
  site: 'https://sstyles93.github.io/',
  markdown: {
    remarkPlugins: [remarkGfm],
  },
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !teaserPaths.has(new URL(page).pathname) }),
    tailwind(),
    partytown()
  ],
  vite: {
    plugins: [excludeDrafts],
  },
});