import assert from 'node:assert/strict'
import { once } from 'node:events'
import test from 'node:test'

test('static server serves export pages and missing-page responses', async (context) => {
  const { server } = await import('./serve.mjs')
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => server.close())

  const address = server.address()
  assert.ok(address && typeof address === 'object')
  const baseUrl = `http://127.0.0.1:${address.port}`

  const page = await fetch(`${baseUrl}/`)
  assert.equal(page.status, 200)
  assert.match(page.headers.get('content-type') || '', /^text\/html/)

  const project = await fetch(`${baseUrl}/projects/raspy-monitor/`)
  assert.equal(project.status, 200)

  const missing = await fetch(`${baseUrl}/not-a-real-page`)
  assert.equal(missing.status, 404)
})
