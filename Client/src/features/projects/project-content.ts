import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'
import { projectDomainIds } from './project-domains.ts'

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const text = z.string().trim().min(1)
const httpsUrl = z.url({ protocol: /^https$/ })
const size = z.number().int().positive()

const projectSchema = z.object({
  title: text,
  summary: text,
  problem: text.optional(),
  role: text,
  team: text.optional(),
  year: z.number().int().min(2000).max(2100),
  repository: httpsUrl,
  demo: httpsUrl.optional(),
  draft: z.boolean().default(false),
  domain: z.enum(projectDomainIds).default('other'),
  map: z.object({
    position: z.tuple([z.number().min(0).max(880), z.number().min(0).max(540)]).optional(),
    connections: z.array(slugSchema).optional(),
  }).optional(),
  contributions: z.array(text).default([]),
  skills: z.array(text).default([]),
  architecture: z.array(text).refine((stages) => stages.length !== 1, 'Use at least two architecture stages.').default([]),
  outcomes: z.array(text).default([]),
  lessons: z.array(text).default([]),
  security: z.array(text).default([]),
  evidence: z.array(z.object({ label: text, value: text })).default([]),
  metrics: z.array(z.object({ label: text, value: text, qualifier: text.optional() })).default([]),
  gallery: z.array(z.object({ src: mediaPath().regex(/\.webp$/, 'Project screenshots must use WebP files.'), alt: text, width: size, height: size })).default([]),
  preview: z.object({
    src: mediaPath().regex(/\.webp$/, 'Homepage project previews must use WebP files.'),
    alt: text,
    caption: text,
  }).optional(),
  model: mediaPath().regex(/\.glb$/).optional(),
  video: z.object({
    src: mediaPath(), poster: mediaPath(), captionTrack: mediaPath(),
    title: text, width: size, height: size,
  }).optional(),
})

const noteSchema = z.object({ title: text, draft: z.boolean().default(false) })

const retiredProjectSchema = z.object({
  slug: slugSchema,
  title: text,
  noteSlugs: z.array(slugSchema).optional(),
  replacementSlug: slugSchema.optional(),
})

export type RetiredProject = z.infer<typeof retiredProjectSchema>

function mediaPath() {
  return z.string().regex(/^\/media\/projects\/[a-z0-9][a-z0-9/._-]*$/).refine(
    (src) => src.split('/').slice(1).every((segment) => segment && segment !== '.' && segment !== '..'),
    'Use a file under /media/projects/.',
  )
}

function readPublishedMarkdown<T>(filename: string, schema: z.ZodType<T>) {
  try {
    const { data, content } = matter(readFileSync(filename, 'utf8'))
    if (data.draft === true) return undefined
    return { ...schema.parse(data), body: content.trim() }
  } catch (cause) {
    throw new Error(`Invalid project content in ${path.relative(process.cwd(), filename)}`, { cause })
  }
}

function contentSlug(name: string, filename: string) {
  if (!slugSchema.safeParse(name).success) {
    throw new Error(`Invalid slug "${name}" in ${filename}. Use lowercase letters, numbers, and hyphens.`)
  }
  return name
}

function getNotes(directory: string) {
  const notesDir = path.join(directory, 'docs')
  if (!existsSync(notesDir)) return []

  return readdirSync(notesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .flatMap((entry) => {
      const filename = path.join(notesDir, entry.name)
      const note = readPublishedMarkdown(filename, noteSchema)
      if (!note) return []
      return [{ slug: contentSlug(path.basename(entry.name, '.md'), filename), ...note }]
    })
    .sort((first, second) => first.title.localeCompare(second.title, 'en'))
}

export function getProjects(clientRoot = process.cwd()) {
  const contentRoot = path.join(clientRoot, 'content/projects')
  const projects = readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .flatMap((entry) => {
      const directory = path.join(contentRoot, entry.name)
      const filename = path.join(directory, 'index.md')
      const project = readPublishedMarkdown(filename, projectSchema)
      if (!project) return []
      const slug = contentSlug(entry.name, filename)
      const media = project.gallery.map(({ src }) => src)
      if (project.preview) media.push(project.preview.src)
      if (project.model) media.push(project.model)
      if (project.video) media.push(project.video.src, project.video.poster, project.video.captionTrack)
      for (const src of media) {
        const file = path.join(clientRoot, 'public', src)
        if (!statSync(file, { throwIfNoEntry: false })?.isFile()) {
          throw new Error(`Project "${slug}" references a missing media file: ${file}`)
        }
      }
      const preview = project.preview && {
        ...project.preview,
        width: project.gallery.find(({ src }) => src === project.preview?.src)?.width,
      }
      return [{ ...project, preview, slug, notes: getNotes(directory) }]
    })

  return projects.sort((first, second) =>
    second.year - first.year || first.title.localeCompare(second.title, 'en') || first.slug.localeCompare(second.slug, 'en'),
  )
}

export type Project = ReturnType<typeof getProjects>[number]
export type CatalogProject = Pick<Project, 'slug' | 'title' | 'year' | 'role' | 'summary' | 'repository' | 'domain' | 'map'>

export function validateRetiredProjects(entries: RetiredProject[], projects: Project[]) {
  const published = new Set(projects.map(({ slug }) => slug))
  const retired = new Set<string>()
  return entries.map((entry) => {
    const result = retiredProjectSchema.safeParse(entry)
    if (!result.success) {
      throw new Error(`Invalid retirement entry for "${entry.slug}" in content/retired-projects.ts`, { cause: result.error })
    }
    const { slug, noteSlugs, replacementSlug } = result.data
    if (published.has(slug)) throw new Error(`Retired project "${slug}" is also published.`)
    if (retired.has(slug)) throw new Error(`Duplicate retired project "${slug}".`)
    if (noteSlugs && new Set(noteSlugs).size !== noteSlugs.length) {
      throw new Error(`Duplicate retired note slug for "${slug}".`)
    }
    if (replacementSlug && !published.has(replacementSlug)) {
      throw new Error(`Replacement "${replacementSlug}" for retired project "${slug}" must be a published project.`)
    }
    retired.add(slug)
    return result.data
  })
}
