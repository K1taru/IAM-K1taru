import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const env = loadEnv(mode, process.cwd(), '');
const productionUrl = new URL(process.env.SITE_URL || env.SITE_URL || 'https://example.com');
const productionBase = productionUrl.pathname === '/' ? undefined : productionUrl.pathname.replace(/\/$/, '');
const host = process.env.HOST || env.HOST || '127.0.0.1';
const port = Number.parseInt(process.env.PORT || env.PORT || '4321', 10);

export default defineConfig({
  site: productionUrl.origin,
  base: productionBase,
  output: 'static',
  integrations: [sitemap()],
  server: {
    host,
    port
  },
  build: {
    assets: '_astro',
    format: 'directory'
  },
  vite: {
    plugins: [tailwindcss()],
    preview: {
      host,
      port
    },
    build: {
      sourcemap: false
    }
  }
});
