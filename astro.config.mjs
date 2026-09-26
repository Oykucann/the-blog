// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// GitHub Pages serves this repo at https://oykucann.github.io/the-blog/.
// If you connect a custom domain later, set `site` to it and remove `base`.
export default defineConfig({
  site: 'https://oykucann.github.io',
  base: '/the-blog',
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/drafts/') })],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      wrap: false,
    },
  },
});
