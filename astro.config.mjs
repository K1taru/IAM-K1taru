import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const env = loadEnv(mode, process.cwd(), '');
const productionUrl = new URL(process.env.SITE_URL || env.SITE_URL || 'https://k1taru.github.io/IAM-K1taru');
const productionBase = productionUrl.pathname === '/' ? undefined : productionUrl.pathname.replace(/\/$/, '');

export default defineConfig({
  site: productionUrl.origin,
  base: productionBase,
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
