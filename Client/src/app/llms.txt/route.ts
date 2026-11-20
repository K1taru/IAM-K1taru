import { person } from '@/lib/portfolio'
import { getProjects } from '@/lib/projects'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

export function GET() {
  const projects = getProjects().map(({ slug, title, summary }) => {
    const path = `/projects/${slug}/`
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
