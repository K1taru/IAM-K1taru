const configuredUrl = process.env.SITE_URL?.trim()

export const siteOrigin = configuredUrl ? new URL(configuredUrl) : undefined
export const siteIndexable = Boolean(siteOrigin && process.env.SITE_INDEXABLE === 'true')

if (siteOrigin && (siteOrigin.protocol !== 'https:' || siteOrigin.pathname !== '/' ||
  siteOrigin.search || siteOrigin.hash || siteOrigin.username || siteOrigin.password)) {
  throw new Error('SITE_URL must be the HTTPS origin of the primary portfolio.')
}

export function canonical(path: string) {
  return siteOrigin ? { canonical: new URL(path, siteOrigin).href } : undefined
}
