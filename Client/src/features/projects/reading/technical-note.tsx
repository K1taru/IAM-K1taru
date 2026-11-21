import Link from 'next/link'
import { DirectionIcon } from '@/components/direction-icon'
import type { Project } from '../project-content'
import { projectPath } from '../project-paths'
import { ProjectMarkdown } from './project-markdown'
import './reading.css'

export function TechnicalNote({ project, entry }: { project: Project; entry: Project['notes'][number] }) {
  return (
    <article className="reader-page">
      <Link href={`${projectPath(project.slug)}#technical-notes`} className="text-link">
        <DirectionIcon direction="left" /> Back to {project.title}
      </Link>
      <header className="reader-header">
        <h1 className="page-title">{entry.title}</h1>
      </header>
      <div className="reader-body panel-frame panel-pad">
        <ProjectMarkdown body={entry.body} />
      </div>
    </article>
  )
}
