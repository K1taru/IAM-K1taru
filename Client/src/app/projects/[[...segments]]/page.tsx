import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { retiredProjects } from '@content/retired-projects'
import { PageMotion } from '@/components/page-motion'
import { ProjectIndex } from '@/features/projects/catalog/project-index'
import { getProjects, validateRetiredProjects } from '@/features/projects/project-content'
import { projectNotePath, projectPath, projectsPath } from '@/features/projects/project-paths'
import { CaseStudy } from '@/features/projects/reading/case-study'
import { RetiredProjectPage } from '@/features/projects/reading/retired-project-page'
import { TechnicalNote } from '@/features/projects/reading/technical-note'
import { pageMetadata } from '@/lib/site'

type PageProps = { params: Promise<{ segments?: string[] }> }
export const dynamicParams = false

export function generateStaticParams() {
  const projects = getProjects()
  const retired = validateRetiredProjects(retiredProjects, projects)
  return [
    { segments: [] },
    ...projects.flatMap((project) => [
      { segments: [project.slug] },
      ...project.notes.map((note) => ({ segments: [project.slug, 'docs', note.slug] })),
    ]),
    ...retired.flatMap(({ slug, noteSlugs = [] }) => [
      { segments: [slug] },
      ...noteSlugs.map((noteSlug) => ({ segments: [slug, 'docs', noteSlug] })),
    ]),
  ]
}

function findPage(segments: string[] = []) {
  const projects = getProjects()
  if (!segments.length) return { type: 'index' as const, projects }

  const [slug, section, noteSlug] = segments
  const isNote = segments.length === 3 && section === 'docs'
  const project = projects.find((entry) => entry.slug === slug)
  if (project) {
    if (segments.length === 1) return { type: 'case-study' as const, project }
    const note = isNote && project.notes.find((entry) => entry.slug === noteSlug)
    if (note) return { type: 'note' as const, project, note }
  } else {
    const retired = validateRetiredProjects(retiredProjects, projects).find((entry) => entry.slug === slug)
    if (retired && segments.length === 1) return { type: 'retired' as const, retired }
    if (retired && isNote && retired.noteSlugs?.includes(noteSlug)) {
      return { type: 'retired' as const, retired, noteSlug }
    }
  }
  notFound()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { segments } = await params
  const page = findPage(segments)
  if (page.type === 'index') {
    return pageMetadata(projectsPath, 'Projects', 'Projects in web and mobile development, computer vision, and self-hosted services.')
  }

  if (page.type === 'retired') {
    const path = page.noteSlug ? projectNotePath(page.retired.slug, page.noteSlug) : projectPath(page.retired.slug)
    const title = page.noteSlug ? `${page.retired.title} technical note retired` : `${page.retired.title} retired`
    return {
      ...pageMetadata(path, title, 'This portfolio entry has been retired.'),
      robots: { index: false, follow: true },
    }
  }
  if (page.type === 'note') {
    return pageMetadata(projectNotePath(page.project.slug, page.note.slug), page.note.title, page.project.summary)
  }
  return pageMetadata(projectPath(page.project.slug), page.project.title, page.project.summary)
}

export default async function ProjectsPage({ params }: PageProps) {
  const { segments = [] } = await params
  const page = findPage(segments)
  return (
    <PageMotion key={segments.join('/')}>
      {page.type === 'index' && <ProjectIndex projects={page.projects} />}
      {page.type === 'note' && <TechnicalNote project={page.project} entry={page.note} />}
      {page.type === 'case-study' && <CaseStudy project={page.project} />}
      {page.type === 'retired' && <RetiredProjectPage project={page.retired} isNote={Boolean(page.noteSlug)} />}
    </PageMotion>
  )
}
