'use client'

import Link from 'next/link'
import { useState } from 'react'
import { DirectionIcon } from './direction-icon'
import type { CatalogProject } from './project-map'
import './project-constellation.css'

const archivedPositions: Partial<Record<string, [number, number]>> = {
  mdsystem: [438, 238],
  moskita: [205, 125],
  gymms: [678, 145],
  'traffic-sign-classifier': [128, 330],
  ayudirect: [480, 410],
  'pi-monitor': [742, 350],
  cookeat: [620, 455],
  growquest: [300, 450],
}

const connections = [
  ['mdsystem', 'moskita'], ['mdsystem', 'gymms'], ['mdsystem', 'ayudirect'],
  ['moskita', 'traffic-sign-classifier'], ['moskita', 'pi-monitor'],
  ['gymms', 'pi-monitor'], ['ayudirect', 'cookeat'], ['ayudirect', 'growquest'],
  ['pi-monitor', 'cookeat'],
]

type Props = {
  projects: CatalogProject[]
  visible: CatalogProject[]
  target?: string
  getDomain: (slug: string) => { id: string, label: string }
}

export function ProjectConstellation({ projects, visible, target, getDomain }: Props) {
  const [inspected, setInspected] = useState<string>()
  const selected = visible.find(({ slug }) => slug === (inspected ?? target)) ?? visible[0]
  const available = new Set(visible.map(({ slug }) => slug))
  let extra = 0
  const nodes = projects.map((project) => {
    let position = archivedPositions[project.slug]
    if (!position) {
      position = [128 + (extra % 4) * 205, 580 + Math.floor(extra / 4) * 105]
      extra++
    }
    return { project, x: position[0], y: position[1] }
  })
  const height = 540 + Math.ceil(extra / 4) * 105
  const bySlug = new Map(nodes.map((node) => [node.project.slug, node]))

  return (
    <section id="project-map" className="project-constellation panel-frame" aria-labelledby="project-map-title">
      <header className="constellation-header">
        <h2 id="project-map-title">Project map</h2>
        <p>Choose a project to see my role and what I built.</p>
      </header>
      <div className="constellation-stage">
        <div className="constellation-field">
          <svg viewBox={`0 0 880 ${height}`} aria-hidden="true">
            <defs>
              <pattern id="project-map-grid" width="44" height="45" patternUnits="userSpaceOnUse">
                <path d="M44 0H0V45" fill="none" stroke="currentColor" opacity=".13" />
              </pattern>
            </defs>
            <rect width="880" height={height} fill="url(#project-map-grid)" />
            <g className="map-reticle">
              <circle cx="438" cy="238" r="76" />
              <circle cx="438" cy="238" r="142" />
              <circle cx="438" cy="238" r="210" />
              <path d="M438 18V458M218 238H658" />
            </g>
            <path className="map-sweep" d="M44 496L836 44" pathLength="1" />
            {connections.map(([from, to]) => {
              const a = bySlug.get(from)
              const b = bySlug.get(to)
              if (!a || !b) return null
              return <line key={`${from}-${to}`} className="map-connection" data-muted={!available.has(from) || !available.has(to)}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            })}
          </svg>
          {nodes.map(({ project, x, y }) => (
            <button
              key={project.slug}
              type="button"
              className="map-node"
              data-domain={getDomain(project.slug).id}
              style={{ left: `${x / 8.8}%`, top: `${y * 100 / height}%` }}
              disabled={!available.has(project.slug)}
              aria-label={project.title}
              aria-pressed={selected?.slug === project.slug}
              onFocus={() => setInspected(project.slug)}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse' && available.has(project.slug)) setInspected(project.slug)
              }}
              onClick={() => setInspected(project.slug)}
            >
              <span className="map-node-point" aria-hidden="true" />
              <span className="map-node-title">{project.title}</span>
            </button>
          ))}
        </div>
        {selected && (
          <div className="map-inspector">
            <label className="map-mobile-picker">
              Choose a project
              <select value={selected.slug} onChange={(event) => setInspected(event.target.value)}>
                {visible.map(({ slug, title }) => <option key={slug} value={slug}>{title}</option>)}
              </select>
            </label>
            <p className="panel-label">{getDomain(selected.slug).label}</p>
            <h3 aria-live="polite">{selected.title}</h3>
            <p className="map-inspector-role">{selected.role} · {selected.year}</p>
            <p className="map-inspector-summary">{selected.summary}</p>
            <footer className="panel-actions">
              <Link href={`/projects/${selected.slug}/`} className="text-link">Explore project <DirectionIcon /></Link>
            </footer>
          </div>
        )}
      </div>
    </section>
  )
}
