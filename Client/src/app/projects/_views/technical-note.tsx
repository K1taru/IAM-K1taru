import Link from 'next/link'
import { DirectionIcon } from '@/components/direction-icon'
import { ProjectMarkdown } from '@/components/project-markdown'
import type { Project } from '@/lib/projects'
import './reading.css'

export function TechnicalNote({ project, entry }: { project: Project; entry: Project['notes'][number] }) {
  return (
    <article className="reader-page">
      <Link href={`/projects/${project.slug}/#technical-notes`} className="text-link">
        <DirectionIcon direction="left" /> Back to {project.title}
      </Link>
      <header className="reader-header">
        <h1 className="page-title">{entry.title}</h1>
      </header>
      <div className="reader-body border-t border-divider pt-6">
        <ProjectMarkdown body={entry.body} />
      </div>
    </article>
  )
}
