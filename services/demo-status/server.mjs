import { createServer } from 'node:http'
import { pathToFileURL } from 'node:url'

const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const route = /^\/api\/live\/v1\/demos\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/

export function parseTargets(input) {
  const targets = JSON.parse(input)
  if (!targets || typeof targets !== 'object' || Array.isArray(targets)) {
    throw new Error('DEMO_HEALTH_ENDPOINTS must be an object of slugs and HTTPS URLs.')
  }

  return new Map(Object.entries(targets).map(([slug, endpoint]) => {
    if (!validSlug.test(slug) || typeof endpoint !== 'string') throw new Error('Invalid demo target.')
    const url = new URL(endpoint)
    if (url.protocol !== 'https:' || url.username || url.password || url.hash) {
      throw new Error(`Use an approved public HTTPS health endpoint for ${slug}.`)
    }
    return [slug, url]
  }))
}

export function createDemoStatusServer({ targets, allowedOrigins = [], probe = fetch }) {
  const checks = new Map()

  async function check(slug, endpoint) {
    const existing = checks.get(slug)
    if (existing && Date.now() < existing.expires) return existing.result

    const entry = { expires: Infinity, result: null }
    entry.result = (async () => {
      let status = 'unreachable'
      try {
        const response = await probe(endpoint, { signal: AbortSignal.timeout(2000), redirect: 'manual' })
        if (response.ok) status = 'reachable'
        await response.body?.cancel()
      } catch {
        // A failed probe is a valid observation and is cached like a successful one.
      }

      entry.expires = Date.now() + 60_000
      return { slug, status, checkedAt: new Date().toISOString() }
    })()
    checks.set(slug, entry)
    return entry.result
  }

  return createServer(async (request, response) => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('Vary', 'Origin')
    const origin = request.headers.origin
    if (allowedOrigins.includes(origin)) response.setHeader('Access-Control-Allow-Origin', origin)

    const slug = route.exec(request.url?.split('?')[0] ?? '')?.[1]
    const endpoint = targets.get(slug)
    if (!endpoint) {
      response.writeHead(404).end(JSON.stringify({ error: 'Unknown demo' }))
      return
    }
    if (request.method !== 'GET') {
      response.writeHead(405, { Allow: 'GET' }).end(JSON.stringify({ error: 'Method not allowed' }))
      return
    }

    response.end(JSON.stringify(await check(slug, endpoint)))
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const targets = parseTargets(process.env.DEMO_HEALTH_ENDPOINTS ?? '{}')
  const allowedOrigins = (process.env.DEMO_ALLOWED_ORIGINS ?? '').split(',').map((origin) => origin.trim()).filter(Boolean)
  const port = Number(process.env.DEMO_STATUS_PORT ?? 4100)
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid DEMO_STATUS_PORT.')

  createDemoStatusServer({ targets, allowedOrigins }).listen(port, '127.0.0.1', () => {
    console.log(`Demo status listening on 127.0.0.1:${port}`)
  })
}
