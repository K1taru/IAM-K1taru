import Link from 'next/link'
import { DirectionIcon } from '@/components/direction-icon'
import type { RetiredProject } from '../project-content'
import { projectPath, projectsPath } from '../project-paths'
import './reading.css'

export function RetiredProjectPage({ project, isNote }: { project: RetiredProject; isNote: boolean }) {
  return (
    <article className="reader-page">
      <Link href={projectsPath} className="text-link"><DirectionIcon direction="left" /> All projects</Link>
      <header className="reader-header">
        <h1 className="page-title">{isNote ? 'Technical note retired' : project.title}</h1>
        <p className="page-lede">
          {isNote ? `This technical note for ${project.title} has been retired.` : 'This project has been retired.'}
        </p>
        {project.replacementSlug && (
          <div className="reader-actions">
            <Link className="button button-primary" href={projectPath(project.replacementSlug)}>
              View the replacement project <DirectionIcon />
            </Link>
          </div>
        )}
      </header>
    </article>
  )
}
