import type { MetadataRoute } from 'next'
import { getProjects } from '@/lib/projects'
import { siteOrigin } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteOrigin) return []
  const paths = ['/', '/about/', '/projects/', '/certifications/']

  for (const project of getProjects()) {
    const base = `/projects/${project.slug}/`
    paths.push(base, ...project.notes.map((note) => `${base}docs/${note.slug}/`))
  }

  return paths.map((path) => ({ url: new URL(path, siteOrigin).href }))
}
