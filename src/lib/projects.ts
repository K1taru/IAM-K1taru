import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'

const contentRoot = path.join(process.cwd(), 'content/projects')
const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const text = z.string().trim().min(1)
const httpsUrl = z.url({ protocol: /^https$/ })
const size = z.number().int().positive()

const projectSchema = z.object({
  slug: slugSchema,
  title: text,
  summary: text,
  problem: text,
  role: text,
  team: text,
  year: z.number().int().min(2000).max(2100),
  repository: httpsUrl,
  demo: httpsUrl.optional(),
  demoStatus: z.boolean().default(false),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  contributions: z.array(text).min(1),
  skills: z.array(text).min(1),
  architecture: z.array(text).min(2),
  outcomes: z.array(text).min(1),
  lessons: z.array(text).min(1),
  security: z.array(text).default([]),
  evidence: z.array(z.object({ label: text, value: text })).default([]),
  metrics: z.array(z.object({ label: text, value: text, qualifier: text.optional() })).default([]),
  gallery: z.array(z.object({ src: mediaPath(), alt: text, width: size, height: size })).default([]),
  video: z.object({
    src: mediaPath(), poster: mediaPath(), captionTrack: mediaPath(),
    title: text, width: size, height: size,
  }).optional(),
}).refine((project) => !project.demoStatus || Boolean(project.demo), {
  path: ['demoStatus'], message: 'Live status requires a public demo URL.',
})

const noteSchema = z.object({ title: text, draft: z.boolean().default(false) })

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

function getNotes(directory: string) {
  const notesDir = path.join(directory, 'docs')
  if (!existsSync(notesDir)) return []

  return readdirSync(notesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .flatMap((entry) => {
      const note = readPublishedMarkdown(path.join(notesDir, entry.name), noteSchema)
      if (!note) return []
      return [{ slug: slugSchema.parse(path.basename(entry.name, '.md')), ...note }]
    })
    .sort((first, second) => first.title.localeCompare(second.title, 'en'))
}

export function getProjects() {
  const projects = readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .flatMap((entry) => {
      const directory = path.join(contentRoot, entry.name)
      const project = readPublishedMarkdown(path.join(directory, 'index.md'), projectSchema)
      if (!project) return []
      if (project.slug !== entry.name) {
        throw new Error(`Project slug ${project.slug} must match its directory ${entry.name}`)
      }
      return [{ ...project, notes: getNotes(directory) }]
    })

  return projects.sort((first, second) => {
    return Number(second.slug === 'pi-monitor') - Number(first.slug === 'pi-monitor') ||
      second.year - first.year || first.title.localeCompare(second.title, 'en')
  })
}

export type Project = ReturnType<typeof getProjects>[number]
