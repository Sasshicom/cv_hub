import { defineConfig } from 'astro/config';
import { cpSync } from 'fs';

import sitemap from '@astrojs/sitemap';

const repo = process.env.GITHUB_REPOSITORY;
const [owner, name] = repo ? repo.split('/') : [null, null];

// Own domain (not *.github.io/{repo}): set SITE_URL (e.g. https://cv.example.com)
// and BASE_PATH (usually "/", since a custom domain is normally served from
// the root, unlike a GitHub Pages project page) as repo/CI secrets or vars —
// they override the GITHUB_REPOSITORY-derived defaults below. Still need a
// public/CNAME file with just the domain in it for GitHub Pages itself to
// route the custom domain — see docs/INFO_en.md §15.
const site = process.env.SITE_URL || (owner ? `https://${owner}.github.io` : 'http://localhost:4321');
const base = process.env.BASE_PATH !== undefined ? process.env.BASE_PATH : (name ? `/${name}` : undefined);

export default defineConfig({
  site,
  base,

  vite: {
    plugins: [{
      name: 'copy-themes',
      configResolved() {
        cpSync('src/styles/themes', 'public/themes', { recursive: true });
      }
    }]
  },

  integrations: [
    sitemap({
      // The OG-image pipeline removes its preview routes from dist/.
      filter: (page) => !page.includes('/og-preview'),
    }),
  ]
});
