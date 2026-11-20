import Link from 'next/link'
import { ProjectMarkdown } from '@/components/project-markdown'
import type { Project } from '@/lib/projects'

export function TechnicalNote({ project, entry }: { project: Project; entry: Project['notes'][number] }) {
  return (
    <article className="max-w-[72ch] pt-7 pb-16 sm:pt-12">
      <Link href={`/projects/${project.slug}/`} className="inline-flex min-h-11 items-center text-sm text-accent underline underline-offset-4">{project.title} case study</Link>
      <h1 className="mt-5 mb-8 font-display text-5xl tracking-tight sm:text-6xl">{entry.title}</h1>
      <ProjectMarkdown body={entry.body} />
    </article>
  )
}
