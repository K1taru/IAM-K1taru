import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjects } from '@/lib/projects'
import { canonical } from '@/lib/site'
import { CaseStudy } from '../_views/case-study'
import { ProjectIndex } from '../_views/project-index'
import { TechnicalNote } from '../_views/technical-note'

type PageProps = { params: Promise<{ segments?: string[] }> }
export const dynamicParams = false

export function generateStaticParams() {
  return [
    { segments: [] },
    ...getProjects().flatMap((project) => [
      { segments: [project.slug] },
      ...project.notes.map((note) => ({ segments: [project.slug, 'docs', note.slug] })),
    ]),
  ]
}

function findPage(segments: string[] = []) {
  const projects = getProjects()
  if (!segments.length) return { type: 'index' as const, projects }

  const [slug, section, noteSlug] = segments
  const project = projects.find((entry) => entry.slug === slug)
  if (!project) notFound()
  if (segments.length === 1) return { type: 'case-study' as const, project }

  const note = project.notes.find((entry) => entry.slug === noteSlug)
  if (segments.length === 3 && section === 'docs' && note) {
    return { type: 'note' as const, project, note }
  }
  notFound()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { segments } = await params
  const page = findPage(segments)
  if (page.type === 'index') return { title: 'Projects', alternates: canonical('/projects/') }

  const projectPath = `/projects/${page.project.slug}/`
  return {
    title: page.type === 'note' ? page.note.title : page.project.title,
    description: page.project.summary,
    alternates: canonical(page.type === 'note' ? `${projectPath}docs/${page.note.slug}/` : projectPath),
  }
}

export default async function ProjectsPage({ params }: PageProps) {
  const page = findPage((await params).segments)
  if (page.type === 'index') return <ProjectIndex projects={page.projects} />
  if (page.type === 'note') return <TechnicalNote project={page.project} entry={page.note} />
  return <CaseStudy project={page.project} />
}
