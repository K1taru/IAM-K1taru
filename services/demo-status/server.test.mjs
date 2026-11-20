import assert from 'node:assert/strict'
import { once } from 'node:events'
import test from 'node:test'
import { createDemoStatusServer, parseTargets } from './server.mjs'

test('checks allowlisted demos, shares concurrent probes, and caches results', async (context) => {
  const allowedOrigin = 'https://portfolio.example.com'
  let probes = 0
  const server = createDemoStatusServer({
    targets: parseTargets('{"healthy":"https://example.com/health","redirect":"https://example.com/redirect"}'),
    allowedOrigins: [allowedOrigin],
    async probe(endpoint, options) {
      probes += 1
      assert.equal(options.redirect, 'manual')
      assert.ok(options.signal instanceof AbortSignal)
      await new Promise((resolve) => setTimeout(resolve, 20))
      return new Response(null, { status: endpoint.pathname === '/health' ? 204 : 302 })
    },
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  context.after(() => server.close())
  const base = `http://127.0.0.1:${server.address().port}/api/live/v1/demos/`

  const firstPair = await Promise.all([
    fetch(`${base}healthy`, { headers: { Origin: allowedOrigin } }),
    fetch(`${base}healthy`, { headers: { Origin: 'https://other.example.com' } }),
  ])
  assert.equal(firstPair[0].headers.get('Access-Control-Allow-Origin'), allowedOrigin)
  assert.equal(firstPair[1].headers.get('Access-Control-Allow-Origin'), null)
  const [first, second] = await Promise.all(firstPair.map((response) => response.json()))
  assert.equal(first.slug, 'healthy')
  assert.equal(first.status, 'reachable')
  assert.equal(new Date(first.checkedAt).toISOString(), first.checkedAt)
  assert.deepEqual(first, second)
  assert.deepEqual(await (await fetch(`${base}healthy`)).json(), first)
  assert.equal(probes, 1)

  assert.equal((await (await fetch(`${base}redirect`)).json()).status, 'unreachable')
  assert.equal((await fetch(`${base}unknown`)).status, 404)
  assert.equal((await fetch(`${base}healthy`, { method: 'POST' })).status, 405)
  assert.equal(probes, 2)
})

test('rejects unsafe target entries at startup', () => {
  assert.throws(() => parseTargets('{"project":"http://example.com/health"}'))
  assert.throws(() => parseTargets('{"project":"https://user:pass@example.com/health"}'))
  assert.throws(() => parseTargets('{"bad/slug":"https://example.com/health"}'))
})
