import type { MetadataRoute } from 'next'
import { siteIndexable, siteOrigin } from '@/lib/site'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: siteOrigin && siteIndexable ? new URL('/sitemap.xml', siteOrigin).href : undefined,
  }
}
