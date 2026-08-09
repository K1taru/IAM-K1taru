import { site } from '@/data/site';
import { absoluteUrl } from '@/utils/urls';

export const prerender = true;

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap-index.xml', site.url)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
