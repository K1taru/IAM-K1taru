'use client'

import { useEffect, useState } from 'react'

type Result = { status: 'reachable' | 'unreachable'; checkedAt: string }

export function DemoStatus({ slug, baseUrl }: { slug: string; baseUrl: string }) {
  const [result, setResult] = useState<Result | 'unavailable' | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let disposed = false
    const timeout = window.setTimeout(() => controller.abort(), 3000)

    async function checkStatus() {
      try {
        const url = new URL(`${baseUrl.replace(/\/+$/, '')}/demos/${slug}`, window.location.origin)
        const response = await fetch(url, { credentials: 'omit', signal: controller.signal })
        if (!response.ok) throw new Error('Status request failed')

        const data = await response.json()
        if (!data || data.slug !== slug || !['reachable', 'unreachable'].includes(data.status) ||
          typeof data.checkedAt !== 'string' || !Number.isFinite(Date.parse(data.checkedAt))) {
          throw new Error('Invalid status response')
        }

        if (!disposed) setResult({ status: data.status, checkedAt: data.checkedAt })
      } catch {
        if (!disposed) setResult('unavailable')
      } finally {
        window.clearTimeout(timeout)
      }
    }

    void checkStatus()
    return () => {
      disposed = true
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [slug, baseUrl])

  return (
    <p role="status" className="mt-2 text-base text-muted">
      {result === 'unavailable' ? 'Live status unavailable' : result ? (
        <>
          {result.status === 'reachable' ? 'Demo reachable' : 'Demo not reachable'} · checked{' '}
          <time dateTime={result.checkedAt}>{new Date(result.checkedAt).toLocaleString()}</time>
        </>
      ) : 'Checking demo status…'}
    </p>
  )
}
