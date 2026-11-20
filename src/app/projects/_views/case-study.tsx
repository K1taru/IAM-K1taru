import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArchitectureFlow } from '@/components/architecture-flow'
import { DemoStatus } from '@/components/demo-status'
import { ProjectMarkdown } from '@/components/project-markdown'
import type { Project } from '@/lib/projects'

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="min-w-0 scroll-mt-6 border-t border-divider pt-7">
      <h2 className="mb-4 font-display text-4xl tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 leading-relaxed text-muted marker:text-accent">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
}

export function CaseStudy({ project }: { project: Project }) {
  const statusBase = process.env.NEXT_PUBLIC_DEMO_STATUS_BASE_URL
  const sections = [
    ['problem', 'Problem'], ['contributions', 'Contributions'], ['architecture', 'Architecture'],
    ['outcomes', 'Outcomes'], ['lessons', 'Lessons'],
  ]
  if (project.notes.length) sections.push(['technical-notes', 'Technical notes'])

  return (
    <article className="pt-7 pb-16 sm:pt-12 sm:pb-24">
      <Link href="/projects/" className="inline-flex min-h-11 items-center text-sm font-medium text-accent underline underline-offset-4">
        All projects
      </Link>
      <header className="mt-5 border-b border-divider pb-8 sm:mt-8 sm:pb-10">
        <h1 className="page-title wrap-break-word">{project.title}</h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted sm:text-xl">{project.summary}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
          <a href={project.repository} className="action-press inline-flex min-h-11 items-center rounded-md bg-accent px-4 text-sm font-semibold text-on-accent hover:underline">
            Source repository
          </a>
          {project.demo && <a href={project.demo} className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">Open demo</a>}
        </div>
        {project.demoStatus && statusBase && <DemoStatus key={project.slug} slug={project.slug} baseUrl={statusBase} />}
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
        <aside className="min-w-0 lg:order-last lg:self-start lg:sticky lg:top-6">
          <dl className="space-y-4 rounded-lg border border-divider bg-surface p-5 leading-relaxed">
            <div><dt className="text-sm text-muted">Role</dt><dd className="font-medium">{project.role}</dd></div>
            <div><dt className="text-sm text-muted">Team</dt><dd className="font-medium">{project.team}</dd></div>
            <div><dt className="text-sm text-muted">Year</dt><dd className="font-medium">{project.year}</dd></div>
            <div><dt className="text-sm text-muted">Tools and skills</dt><dd className="font-medium">{project.skills.join(', ')}</dd></div>
          </dl>
          <nav aria-label="In this case study" className="mt-4">
            <ul className="flex flex-wrap gap-x-5 lg:block">
              {sections.map(([id, label]) => (
                <li key={id}><a href={`#${id}`} className="inline-flex min-h-11 items-center text-sm text-accent underline underline-offset-4">{label}</a></li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 max-w-[72ch] space-y-9">
          <Section title="Problem" id="problem">
            <p className="leading-relaxed text-muted">{project.problem}</p>
          </Section>
          <Section title="Contributions" id="contributions"><Points items={project.contributions} /></Section>
          <Section title="Architecture" id="architecture">
            <ArchitectureFlow label={`${project.title} workflow`} stages={project.architecture} />
            {project.security.length > 0 && <div className="mt-5"><Points items={project.security} /></div>}
          </Section>
          <Section title="Outcomes" id="outcomes">
            <Points items={project.outcomes} />
            {(project.metrics.length > 0 || project.evidence.length > 0) && (
              <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {[...project.metrics, ...project.evidence].map((item) => (
                  <div key={item.label} className="border-t border-divider pt-3">
                    <dt className="text-sm text-muted">{item.label}</dt>
                    <dd className="mt-1 font-medium">{item.value}</dd>
                    {'qualifier' in item && typeof item.qualifier === 'string' && <dd className="mt-1 text-sm text-muted">{item.qualifier}</dd>}
                  </div>
                ))}
              </dl>
            )}
          </Section>
          {project.gallery.length > 0 && (
            <div className="grid gap-5">
              {project.gallery.map(({ src, alt, width, height }) => (
                <Image key={src} src={src} alt={alt} width={width} height={height} unoptimized className="h-auto w-full rounded-xl border border-divider" />
              ))}
            </div>
          )}
          {project.video && (
            <video controls preload="none" src={project.video.src} poster={project.video.poster} width={project.video.width} height={project.video.height} aria-label={project.video.title} className="h-auto w-full rounded-xl">
              <track kind="captions" src={project.video.captionTrack} srcLang="en" label="English" default />
            </video>
          )}
          <Section title="Lessons" id="lessons"><Points items={project.lessons} /></Section>
          {project.body && <ProjectMarkdown body={project.body} />}
          {project.notes.length > 0 && (
            <Section title="Technical notes" id="technical-notes">
              <ul className="space-y-1">
                {project.notes.map((note) => <li key={note.slug}><Link href={`/projects/${project.slug}/docs/${note.slug}/`} className="inline-flex min-h-11 items-center text-accent underline underline-offset-4">{note.title}</Link></li>)}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </article>
  )
}
