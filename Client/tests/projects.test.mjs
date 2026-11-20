import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, rmdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'

test('published media must exist and be a file', async (context) => {
  const previousDirectory = process.cwd()
  const fixture = mkdtempSync(path.join(tmpdir(), 'portfolio-content-'))
  context.after(() => {
    process.chdir(previousDirectory)
    rmSync(fixture, { recursive: true, force: true })
  })

  const slug = 'test-project'
  const mediaUrl = `/media/projects/${slug}`
  const projectDirectory = path.join(fixture, 'content/projects', slug)
  const mediaDirectory = path.join(fixture, 'public', mediaUrl)
  mkdirSync(projectDirectory, { recursive: true })
  mkdirSync(mediaDirectory, { recursive: true })
  process.chdir(fixture)
  const { getProjects } = await import('../src/lib/projects.ts')

  const filename = path.join(projectDirectory, 'index.md')
  const frontmatter = {
    slug,
    title: 'Test project',
    summary: 'Test summary',
    problem: 'Test problem',
    role: 'Developer',
    team: 'Independent',
    year: 2026,
    repository: 'https://example.com/repository',
    contributions: ['Built the test project'],
    skills: ['Testing'],
    architecture: ['Input', 'Output'],
    outcomes: ['Completed the test project'],
    lessons: ['Validate the files'],
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
  writeFileSync(filename, `---\n${JSON.stringify(frontmatter, null, 2)}\n---\n`)

  assert.throws(getProjects, /test-project.*screenshot\.webp/)
  writeFileSync(path.join(mediaDirectory, 'screenshot.webp'), '')
  writeFileSync(path.join(mediaDirectory, 'demo.mp4'), '')
  const captions = path.join(mediaDirectory, 'captions.vtt')
  mkdirSync(captions)
  assert.throws(getProjects, /test-project.*captions\.vtt/)

  rmdirSync(captions)
  writeFileSync(captions, 'WEBVTT\n')
  assert.equal(getProjects()[0].video.captionTrack, `${mediaUrl}/captions.vtt`)

  rmSync(captions)
  writeFileSync(filename, `---\n${JSON.stringify({ ...frontmatter, draft: true }, null, 2)}\n---\n`)
  assert.deepEqual(getProjects(), [])
})
