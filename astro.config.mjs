// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The domain lives here and nowhere else (CODE-14): canonical, Open Graph,
// JSON-LD, sitemap and robots.txt all derive from it.
// The SITE_URL variable builds for another address without touching the file
// (previews).
const SITE_URL = process.env.SITE_URL || 'https://lanternata.it';

export default defineConfig({
  site: SITE_URL,
  build: {
    // Stylesheets go inside the HTML instead of separate files: on the sister
    // site they were render-blocking requests worth ~130 ms on PageSpeed, for
    // ~20 KB of CSS that can travel with the HTML.
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      // Legal pages declare noindex: listing them would be a contradictory
      // instruction. They stay reachable from the footer.
      filter: (page) => !/\/(privacy|cookie)\/?$/.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
