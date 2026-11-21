import type { Metadata } from 'next'
import { person } from './portfolio'

const configuredUrl = process.env.SITE_URL?.trim()

export const siteDescription = 'John Michael Garcia studies computer engineering and builds web apps, AI assistants, and computer vision projects.'
export const siteOrigin = configuredUrl ? new URL(configuredUrl) : undefined
export const siteIndexable = Boolean(siteOrigin && process.env.SITE_INDEXABLE === 'true')

if (siteOrigin && (siteOrigin.protocol !== 'https:' || siteOrigin.pathname !== '/' ||
  siteOrigin.search || siteOrigin.hash || siteOrigin.username || siteOrigin.password)) {
  throw new Error('SITE_URL must be the HTTPS origin of the primary portfolio.')
}

export function siteUrl(path: string) {
  return siteOrigin ? new URL(path, siteOrigin).href : undefined
}

export function pageMetadata(path: string, title?: string, description = siteDescription): Metadata {
  const url = siteUrl(path)
  const image = siteUrl('/og-card.png')
  const alt = `${person.name}, computer engineering student`
  const socialTitle = title ? `${title} | ${person.name}` : person.name

  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      type: 'website',
      siteName: person.name,
      url,
      title: socialTitle,
      description,
      images: image ? [{ url: image, width: 1200, height: 630, alt }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: socialTitle,
      description,
      images: image ? [{ url: image, alt }] : undefined,
    },
  }
}
