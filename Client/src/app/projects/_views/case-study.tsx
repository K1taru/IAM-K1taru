import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArchitectureFlow } from '@/components/architecture-flow'
import { DemoStatus } from '@/components/demo-status'
import { DirectionIcon } from '@/components/direction-icon'
import { ProjectMarkdown } from '@/components/project-markdown'
import { SectionLayout } from '@/components/section-layout'
import type { Project } from '@/lib/projects'
import './reading.css'

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="reader-section" data-reveal="">
      <h2 className="section-title">{title}</h2>
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
    ['problem', 'The problem'], ['contributions', 'My contributions'], ['outcomes', 'Results'],
    ['architecture', 'How it works'], ['lessons', 'What I learned'],
  ]
  if (project.notes.length) sections.push(['technical-notes', 'Technical notes'])

  return (
    <article className="reader-page">
      <Link href="/projects/" className="text-link"><DirectionIcon direction="left" /> All projects</Link>
      <header className="reader-header">
        <h1 className="page-title">{project.title}</h1>
        <p className="page-lede">{project.summary}</p>
        <div className="reader-actions">
          <a href={project.repository} className="button button-primary">View source <DirectionIcon direction="external" /></a>
          {project.demo && <a href={project.demo} className="button">Open demo <DirectionIcon direction="external" /></a>}
        </div>
        {project.demoStatus && statusBase && <DemoStatus key={project.slug} slug={project.slug} baseUrl={statusBase} />}
      </header>

      <dl className="project-details">
        <div><dt>My role</dt><dd>{project.role}</dd></div>
        <div><dt>Team</dt><dd>{project.team}</dd></div>
        <div><dt>Year</dt><dd><time dateTime={String(project.year)}>{project.year}</time></dd></div>
        <div><dt>Tools</dt><dd>{project.skills.join(', ')}</dd></div>
      </dl>

      <SectionLayout label="In this case study" sections={sections.map(([id, label]) => ({ id, label }))}>
        <div className="reader-body">
          <Section title="The problem" id="problem">
            <p className="leading-relaxed text-muted">{project.problem}</p>
          </Section>
          <Section title="My contributions" id="contributions"><Points items={project.contributions} /></Section>
          <Section title="Results" id="outcomes">
            <Points items={project.outcomes} />
            {(project.metrics.length > 0 || project.evidence.length > 0) && (
              <dl className="evidence-grid">
                {project.metrics.map(({ label, value, qualifier }) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd className="evidence-value is-metric">{value}</dd>
                    {qualifier && <dd className="evidence-qualifier">{qualifier}</dd>}
                  </div>
                ))}
                {project.evidence.map(({ label, value }) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd className="evidence-value">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Section>
          <Section title="How it works" id="architecture">
            <ArchitectureFlow label={`${project.title} workflow`} stages={project.architecture} />
            {project.security.length > 0 && <div className="mt-5"><Points items={project.security} /></div>}
          </Section>
          {project.gallery.length > 0 && (
            <div className="grid gap-5">
              {project.gallery.map(({ src, alt, width, height }) => (
                <Image key={src} src={src} alt={alt} width={width} height={height} unoptimized className="h-auto w-full rounded-2xl border border-divider" />
              ))}
            </div>
          )}
          {project.video && (
            <video controls preload="none" src={project.video.src} poster={project.video.poster} width={project.video.width} height={project.video.height} aria-label={project.video.title} className="h-auto w-full rounded-2xl">
              <track kind="captions" src={project.video.captionTrack} srcLang="en" label="English" default />
            </video>
          )}
          <Section title="What I learned" id="lessons"><Points items={project.lessons} /></Section>
          {project.body && <ProjectMarkdown body={project.body} />}
          {project.notes.length > 0 && (
            <Section title="Technical notes" id="technical-notes">
              <ul className="space-y-2">
                {project.notes.map((note) => (
                  <li key={note.slug}>
                    <Link href={`/projects/${project.slug}/docs/${note.slug}/`} className="text-link">{note.title} <DirectionIcon /></Link>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </SectionLayout>
    </article>
  )
}
