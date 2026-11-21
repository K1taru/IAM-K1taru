import { person } from '@content/profile'
import { getProjects } from '@/features/projects/project-content'
import { projectPath } from '@/features/projects/project-paths'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

export function GET() {
  const projects = getProjects().map(({ slug, title, summary }) => {
    const path = projectPath(slug)
    return `- [${title}](${siteUrl(path) ?? path}): ${summary}`
  })

  return new Response(`# ${person.name}

> ${person.positioning}

## Portfolio

- [Home](${siteUrl('/') ?? '/'})
- [About](${siteUrl('/about/') ?? '/about/'})
- [Structured portfolio data](${siteUrl('/portfolio.json') ?? '/portfolio.json'})

## Projects

${projects.join('\n')}
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
