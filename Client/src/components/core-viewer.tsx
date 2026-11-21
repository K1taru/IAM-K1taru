'use client'

import { useEffect, useRef, useState } from 'react'
import type { mountCore } from './core-scene'

function CorePoster() {
  return (
    <svg className="core-poster" viewBox="-150 -150 300 300" aria-hidden="true">
      <defs>
        <radialGradient id="core-glow">
          <stop stopColor="#edfffb" /><stop offset=".12" stopColor="#81efd8" />
          <stop offset=".45" stopColor="#289784" stopOpacity=".5" /><stop offset="1" stopColor="#289784" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g fill="none" strokeWidth=".8">
        {Array.from({ length: 29 }, (_, i) => (
          <ellipse key={i} rx={36 + (i * 11) % 78} ry={24 + (i * 13) % 65}
            transform={`rotate(${i * 37})`} stroke={i % 7 ? '#72dbc9' : '#ddbe82'}
            strokeOpacity={0.4 + (i % 4) / 7} strokeDasharray={`${3 + i} 3 2 4`} />
        ))}
      </g>
      <circle r="47" fill="url(#core-glow)" />
    </svg>
  )
}

const directions: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
}

export function CoreViewer({ model }: { model?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const scene = useRef<ReturnType<typeof mountCore> | null>(null)
  const [active, setActive] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'core' | 'model' | 'failed'>('idle')
  const ready = status === 'core' || status === 'model'
  const showModel = status === 'model'

  useEffect(() => {
    if (!canvas.current) return
    const surface = canvas.current
    let cancelled = false
    let attempt = 0
    function stop() {
      attempt++
      scene.current?.dispose()
      scene.current = null
    }
    function lost(event: Event) {
      event.preventDefault()
      stop()
      setStatus('failed')
    }

    const touch = window.matchMedia('(pointer: coarse), (max-width: 63.99rem)')
    async function load() {
      const currentAttempt = ++attempt
      setStatus('loading')
      try {
        const { mountCore } = await import('./core-scene')
        if (cancelled || currentAttempt !== attempt) return
        scene.current = mountCore(surface, model, setStatus)
      } catch {
        if (!cancelled && currentAttempt === attempt) setStatus('failed')
      }
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting) || touch.matches) return
      observer.disconnect()
      void load()
    }, { rootMargin: '120px' })
    function observe() {
      stop()
      setStatus('idle')
      observer.disconnect()
      if (active) void load()
      else observer.observe(surface)
    }
    if (active) void load()
    else observer.observe(surface)
    touch.addEventListener('change', observe)
    surface.addEventListener('webglcontextlost', lost)
    return () => {
      cancelled = true
      observer.disconnect()
      touch.removeEventListener('change', observe)
      surface.removeEventListener('webglcontextlost', lost)
      stop()
    }
  }, [active, model])

  function exit() {
    setActive(false)
    setStatus('idle')
  }

  return (
    <section className="core-viewer panel-frame monitor-grid" aria-label={showModel ? '3D project model' : 'Interactive circuit sculpture'}>
      <div className="core-stage" data-ready={ready}>
        <noscript><CorePoster /></noscript>
        {status === 'failed' && <CorePoster />}
        {status === 'loading' && (
          <div className="core-loading" role="status">
            <span className="core-spinner" aria-hidden="true" />
            Loading 3D preview
          </div>
        )}
        <canvas ref={canvas} tabIndex={ready ? 0 : -1} aria-label="3D viewer" aria-describedby={ready ? 'core-instructions' : undefined}
          onKeyDown={(event) => {
            const direction = Object.hasOwn(directions, event.key) ? directions[event.key] : undefined
            if (!direction || !ready) return
            event.preventDefault()
            scene.current?.rotate(...direction)
          }} />
      </div>
      <div className="core-caption">
        <h3>{model && status !== 'core' ? 'Project model' : 'Circuit core'}</h3>
        {ready && <p id="core-instructions">Drag or use the arrow keys to rotate.</p>}
        {status === 'failed' && <p>Static view</p>}
        {status === 'idle' && <button type="button" className="core-activate text-link" onClick={() => {
          setStatus('loading')
          setActive(true)
        }}>Explore in 3D</button>}
        {ready && active && <button type="button" className="text-link" onClick={exit}>Done</button>}
      </div>
    </section>
  )
}
