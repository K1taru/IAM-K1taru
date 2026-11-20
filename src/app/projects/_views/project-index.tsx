import Link from 'next/link'
import type { Project } from '@/lib/projects'

export function ProjectIndex({ projects }: { projects: Project[] }) {
  return (
    <>
      <header className="pt-10 pb-8 sm:pt-16 sm:pb-10">
        <h1 className="page-title">Projects</h1>
        <p className="mt-5 max-w-[68ch] leading-relaxed text-muted sm:text-lg">
          Machine learning, self-hosted infrastructure, and the applications I helped build.
        </p>
      </header>

      {projects.length === 0 && <p className="pb-12 text-muted">No case studies published yet.</p>}
      <ul className="mb-12 divide-y divide-divider overflow-hidden rounded-lg border border-divider bg-surface sm:mb-20">
        {projects.map((project) => (
          <li
            key={project.slug}
            id={project.slug}
            className="project-index-row grid scroll-mt-4 gap-2 p-4 target:bg-canvas target:shadow-[inset_3px_0_var(--palette-accent)] sm:p-6 md:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1.4fr)_auto] md:items-baseline md:gap-x-6"
          >
            <p className="font-mono text-sm text-muted">{project.year}</p>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                <Link href={`/projects/${project.slug}/`} className="text-accent hover:underline hover:underline-offset-4">
                  {project.title}
                </Link>
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted">{project.role}</p>
            </div>
            <p className="max-w-[68ch] leading-relaxed text-muted">{project.summary}</p>
            <a
              href={project.repository}
              className="inline-flex min-h-11 items-center gap-2 self-start justify-self-start text-sm font-semibold text-accent underline underline-offset-4"
            >
              Source<span className="sr-only"> for {project.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
