import Link from 'next/link'
import type { ReactNode } from 'react'
import { DirectionIcon } from '@/components/direction-icon'
import { SectionLayout } from '@/components/section-layout'
import type { Project } from '../project-content'
import { projectNotePath, projectsPath } from '../project-paths'
import { ArchitectureFlow } from './architecture-flow'
import { ProjectMarkdown } from './project-markdown'
import { ProjectGallery } from './project-gallery'
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
  const hasEvidence = project.metrics.length > 0 || project.evidence.length > 0
  const hasResults = project.outcomes.length > 0 || hasEvidence
  const hasArchitecture = project.architecture.length > 0 || project.security.length > 0
  const sections = [
    { id: 'problem', label: 'The problem', visible: Boolean(project.problem) },
    { id: 'contributions', label: 'My contributions', visible: project.contributions.length > 0 },
    { id: 'outcomes', label: 'Results', visible: hasResults },
    { id: 'architecture', label: 'How it works', visible: hasArchitecture },
    { id: 'gallery', label: 'Project gallery', visible: project.gallery.length > 0 },
    { id: 'lessons', label: 'What I learned', visible: project.lessons.length > 0 },
    { id: 'technical-notes', label: 'Technical notes', visible: project.notes.length > 0 },
  ].filter(({ visible }) => visible)

  const reading = (
    <div className="reader-body">
      {project.problem && (
        <Section title="The problem" id="problem">
          <p className="leading-relaxed text-muted">{project.problem}</p>
        </Section>
      )}
      {project.contributions.length > 0 && (
        <Section title="My contributions" id="contributions"><Points items={project.contributions} /></Section>
      )}
      {hasResults && (
        <Section title="Results" id="outcomes">
          {project.outcomes.length > 0 && <Points items={project.outcomes} />}
          {hasEvidence && (
            <dl className="evidence-grid">
              {project.metrics.map(({ label, value, qualifier }) => (
                <div className="panel-frame" key={label}>
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
      )}
      {hasArchitecture && (
        <Section title="How it works" id="architecture">
          {project.architecture.length > 0 && <ArchitectureFlow label={`${project.title} workflow`} stages={project.architecture} />}
          {project.security.length > 0 && <div className={project.architecture.length > 0 ? 'mt-5' : undefined}><Points items={project.security} /></div>}
        </Section>
      )}
      {project.gallery.length > 0 && (
        <Section title="Project gallery" id="gallery">
          <ProjectGallery images={project.gallery} title={project.title} />
        </Section>
      )}
      {project.video && (
        <video controls preload="none" src={project.video.src} poster={project.video.poster} width={project.video.width} height={project.video.height} aria-label={project.video.title} className="h-auto w-full rounded-2xl" data-reveal="">
          <track kind="captions" src={project.video.captionTrack} srcLang="en" label="English" default />
        </video>
      )}
      {project.lessons.length > 0 && <Section title="What I learned" id="lessons"><Points items={project.lessons} /></Section>}
      {project.body && <ProjectMarkdown body={project.body} />}
      {project.notes.length > 0 && (
        <Section title="Technical notes" id="technical-notes">
          <ul className="space-y-2">
            {project.notes.map((note) => (
              <li key={note.slug}>
                <Link href={projectNotePath(project.slug, note.slug)} className="text-link">{note.title} <DirectionIcon /></Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )

  return (
    <article className="reader-page">
      <Link href={projectsPath} className="text-link"><DirectionIcon direction="left" /> All projects</Link>
      <header className="reader-header">
        <h1 className="page-title">{project.title}</h1>
        <p className="page-lede">{project.summary}</p>
        <div className="reader-actions">
          <a href={project.repository} className="button button-primary">View source <DirectionIcon direction="external" /></a>
          {project.demo && <a href={project.demo} className="button">Open demo <DirectionIcon direction="external" /></a>}
        </div>
      </header>

      <dl className="project-details panel-frame">
        <div><dt>My role</dt><dd>{project.role}</dd></div>
        {project.team && <div><dt>Team</dt><dd>{project.team}</dd></div>}
        <div><dt>Year</dt><dd><time dateTime={String(project.year)}>{project.year}</time></dd></div>
        {project.skills.length > 0 && <div><dt>Tools</dt><dd>{project.skills.join(', ')}</dd></div>}
      </dl>

      {sections.length > 0 ? (
        <SectionLayout label="On this page" sections={sections}>{reading}</SectionLayout>
      ) : reading}
    </article>
  )
}
