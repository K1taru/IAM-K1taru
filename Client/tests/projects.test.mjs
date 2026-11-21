import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, rmdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { getProjects, validateRetiredProjects } from '../src/features/projects/project-content.ts'

function projectFixture(context) {
  const root = mkdtempSync(path.join(tmpdir(), 'portfolio-content-'))
  context.after(() => rmSync(root, { recursive: true, force: true }))
  const projects = path.join(root, 'content/projects')
  mkdirSync(projects, { recursive: true })
  return { root, projects }
}

function writeMarkdown(filename, frontmatter, body = '') {
  mkdirSync(path.dirname(filename), { recursive: true })
  writeFileSync(filename, `---\n${JSON.stringify(frontmatter, null, 2)}\n---\n${body}`)
}

const minimal = {
  title: 'Test project',
  summary: 'Test summary',
  role: 'Developer',
  year: 2026,
  repository: 'https://example.com/repository',
}

test('published media must exist and be a file', (context) => {
  const { root, projects } = projectFixture(context)
  const slug = 'test-project'
  const mediaUrl = `/media/projects/${slug}`
  const mediaDirectory = path.join(root, 'public', mediaUrl)
  mkdirSync(mediaDirectory, { recursive: true })

  const filename = path.join(projects, slug, 'index.md')
  const frontmatter = {
    ...minimal,
    gallery: [{ src: `${mediaUrl}/screenshot.webp`, alt: 'Test screenshot', width: 640, height: 480 }],
    video: {
      src: `${mediaUrl}/demo.mp4`,
      poster: `${mediaUrl}/screenshot.webp`,
      captionTrack: `${mediaUrl}/captions.vtt`,
      title: 'Test demo',
      width: 640,
      height: 480,
    },
  }
  writeMarkdown(filename, frontmatter)

  assert.throws(() => getProjects(root), /test-project.*screenshot\.webp/)
  writeFileSync(path.join(mediaDirectory, 'screenshot.webp'), '')
  writeFileSync(path.join(mediaDirectory, 'demo.mp4'), '')
  const captions = path.join(mediaDirectory, 'captions.vtt')
  mkdirSync(captions)
  assert.throws(() => getProjects(root), /test-project.*captions\.vtt/)

  rmdirSync(captions)
  writeFileSync(captions, 'WEBVTT\n')
  assert.equal(getProjects(root)[0].video.captionTrack, `${mediaUrl}/captions.vtt`)

  rmSync(captions)
  writeMarkdown(filename, { ...frontmatter, draft: true })
  assert.deepEqual(getProjects(root), [])
})

test('published entries use folder and file slugs, accept short content, and sort by year and title', (context) => {
  const { root, projects } = projectFixture(context)
  writeMarkdown(path.join(projects, 'pi-monitor/index.md'), { ...minimal, title: 'Pi Monitor' })
  writeMarkdown(path.join(projects, 'short-entry/index.md'), { ...minimal, title: 'A new title' })
  writeMarkdown(path.join(projects, 'newest/index.md'), { ...minimal, year: 2027 })
  writeMarkdown(path.join(projects, 'short-entry/docs/setup.md'), { title: 'Get started' }, 'Instructions.')
  writeMarkdown(path.join(projects, 'short-entry/docs/hidden.md'), { draft: true })
  writeMarkdown(path.join(projects, 'draft/index.md'), { draft: true })

  const list = getProjects(root)
  assert.deepEqual(list.map(({ slug }) => slug), ['newest', 'short-entry', 'pi-monitor'])
  const entry = list[1]
  assert.equal(entry.title, 'A new title')
  assert.equal(entry.team, undefined)
  assert.deepEqual(entry.skills, [])
  assert.equal(entry.domain, 'other')
  assert.deepEqual(entry.notes.map(({ slug, title, body }) => ({ slug, title, body })), [
    { slug: 'setup', title: 'Get started', body: 'Instructions.' },
  ])
  assert.deepEqual(list[0].notes, [])
})

test('invalid published slugs identify the source file', (context) => {
  const { root, projects } = projectFixture(context)
  const invalidProject = path.join(projects, 'Invalid Folder')
  writeMarkdown(path.join(invalidProject, 'index.md'), minimal)
  assert.throws(() => getProjects(root), /Invalid slug "Invalid Folder".*index\.md/)
  rmSync(invalidProject, { recursive: true })
  writeMarkdown(path.join(projects, 'valid/index.md'), minimal)
  writeMarkdown(path.join(projects, 'valid/docs/Invalid Note.md'), { title: 'Note' })
  assert.throws(() => getProjects(root), /Invalid slug "Invalid Note".*Invalid Note\.md/)
})

test('retirement entries retain old note slugs and require published replacements', (context) => {
  const { root, projects } = projectFixture(context)
  writeMarkdown(path.join(projects, 'live/index.md'), minimal)
  writeMarkdown(path.join(projects, 'old/index.md'), { draft: true })
  const published = getProjects(root)
  const entry = { slug: 'old', title: 'Old project', noteSlugs: ['setup'], replacementSlug: 'live' }

  assert.deepEqual(validateRetiredProjects([entry], published), [entry])
  assert.throws(() => validateRetiredProjects([{ ...entry, slug: 'live' }], published), /also published/)
  assert.throws(() => validateRetiredProjects([entry, entry], published), /Duplicate retired project/)
  assert.throws(() => validateRetiredProjects([{ ...entry, noteSlugs: ['setup', 'setup'] }], published), /Duplicate retired note/)
  assert.throws(() => validateRetiredProjects([{ ...entry, replacementSlug: 'old' }], published), /must be a published project/)
})
