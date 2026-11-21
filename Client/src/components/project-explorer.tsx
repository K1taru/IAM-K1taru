'use client'

import Image from 'next/image'
import Link from 'next/link'
import { startTransition, useState, ViewTransition } from 'react'
import type { Project } from '@/lib/projects'
import { CoreViewer } from './core-viewer'
import { DirectionIcon } from './direction-icon'
import './project-explorer.css'

type Preview = Pick<Project, 'slug' | 'title' | 'year' | 'summary' | 'role' | 'preview' | 'model'>

export function ProjectExplorer({ projects }: { projects: Preview[] }) {
  const [slug, setSlug] = useState(projects[0]?.slug)
  const selected = projects.find((project) => project.slug === slug) ?? projects[0]
  if (!selected) return null

  function select(value: string) {
    startTransition(() => setSlug(value))
  }

  return (
    <div className="project-explorer">
      <div className="project-picker panel-frame" role="group" aria-label="Project previews">
        {projects.map((project) => (
          <button key={project.slug} type="button"
            aria-pressed={selected.slug === project.slug}
            onClick={() => select(project.slug)}>
            <span>{project.title}</span><time>{project.year}</time>
          </button>
        ))}
      </div>
      <label className="mobile-project-picker">
        Choose a project
        <select value={selected.slug} onChange={(event) => select(event.target.value)}>
          {projects.map((project) => <option key={project.slug} value={project.slug}>{project.title}</option>)}
        </select>
      </label>
      <ViewTransition update="project-preview">
        <article className="project-detail panel-frame" aria-labelledby="preview-title" key={selected.slug}>
          <header>
            <h3 id="preview-title">{selected.title}</h3>
            <dl className="project-facts">
              <div><dt>Role</dt><dd>{selected.role}</dd></div>
              <div><dt>Year</dt><dd><time>{selected.year}</time></dd></div>
            </dl>
          </header>
          <p className="project-summary">{selected.summary}</p>
          <footer className="panel-actions"><Link className="text-link" href={`/projects/${selected.slug}/`}>Explore project <DirectionIcon /></Link></footer>
        </article>
      </ViewTransition>
      <ViewTransition update="project-preview">
        {!selected.model && selected.preview ? (
          <figure className="project-visual panel-frame monitor-grid" key={selected.preview.src}>
            <div className="preview-media">
              <Image src={selected.preview.src} alt={selected.preview.alt} fill unoptimized />
            </div>
            <figcaption>{selected.preview.caption}</figcaption>
          </figure>
        ) : <CoreViewer key={selected.model ?? 'core'} model={selected.model} />}
      </ViewTransition>
      <span className="sr-only" role="status">{selected.title} selected</span>
    </div>
  )
}
