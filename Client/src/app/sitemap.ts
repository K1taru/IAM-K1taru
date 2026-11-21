import type { MetadataRoute } from 'next'
import { getProjects } from '@/features/projects/project-content'
import { projectNotePath, projectPath, projectsPath } from '@/features/projects/project-paths'
import { siteOrigin } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteOrigin) return []
  const paths = ['/', '/about/', projectsPath, '/certifications/']

  for (const project of getProjects()) {
    paths.push(projectPath(project.slug), ...project.notes.map((note) => projectNotePath(project.slug, note.slug)))
  }

  return paths.map((path) => ({ url: new URL(path, siteOrigin).href }))
}
