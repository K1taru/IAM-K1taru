import { capabilities, person } from '@/lib/portfolio'
import { getProjects } from '@/lib/projects'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

export function GET() {
  const projects = getProjects().map(({
    title, slug, summary, year, role, team, contributions, skills, repository, demo, evidence, metrics,
  }) => {
    const path = `/projects/${slug}/`
    return {
      title, slug, summary, year, role, team, contributions, skills, repository, demo,
      caseStudy: siteUrl(path) ?? path,
      evidence, metrics,
    }
  })

  return Response.json({
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    person,
    capabilities,
    projects,
  })
}
