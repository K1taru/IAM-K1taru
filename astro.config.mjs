import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const env = loadEnv(mode, process.cwd(), '');

export default defineConfig({
  site: env.SITE_URL || 'https://portfolio.k1taru.space',
  output: 'static',
  integrations: [sitemap()],
  build: {
    assets: '_astro',
    format: 'directory'
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      sourcemap: false
    }
  }
});
