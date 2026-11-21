import type { Project } from '../project-content'
import { ProjectMap } from './project-map'
import './project-index.css'

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const catalog = projects.map(({ slug, title, year, role, summary, repository, domain, map }) => ({
    slug, title, year, role, summary, repository, domain, map,
  }))

  return (
    <>
      <header className="page-intro">
        <h1 className="page-title">Projects</h1>
        <p className="page-lede">Web and mobile apps, computer vision, and tools I use to run my own services.</p>
      </header>
      <section className="project-catalog" aria-label="Project catalog">
        {catalog.length === 0 ? (
          <p className="text-muted">No projects have been published yet.</p>
        ) : (
          <ProjectMap projects={catalog} />
        )}
      </section>
    </>
  )
}
