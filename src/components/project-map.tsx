'use client'

import Link from 'next/link'
import { useState } from 'react'

const domains = [
  { label: 'Machine learning', projects: ['moskita', 'traffic-sign-classifier'] },
  { label: 'Product systems', projects: ['mdsystem', 'gymms', 'cookeat'] },
  { label: 'Data systems', projects: ['ayudirect', 'growquest'] },
  { label: 'Infrastructure', projects: ['pi-monitor'] },
]

type MapProject = { slug: string; title: string; year: number }

export function ProjectMap({ projects }: { projects: MapProject[] }) {
  const [filter, setFilter] = useState<string | null>(null)
  const groups = domains.map((domain) => ({
    label: domain.label,
    projects: projects.filter((project) => domain.projects.includes(project.slug)),
  }))
  groups.push({
    label: 'Other projects',
    projects: projects.filter((project) => !domains.some((domain) => domain.projects.includes(project.slug))),
  })
  const available = groups.filter((group) => group.projects.length > 0)
  const visible = available.filter((group) => filter === null || group.label === filter)
  const count = visible.reduce((total, group) => total + group.projects.length, 0)

  return (
    <div className="home-map rounded-xl border border-divider bg-canvas p-4 text-ink sm:p-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by domain">
        <button type="button" className="home-map-filter action-press" aria-pressed={filter === null} onClick={() => setFilter(null)}>
          All projects
        </button>
        {available.map((group) => (
          <button
            key={group.label}
            type="button"
            className="home-map-filter action-press"
            aria-pressed={filter === group.label}
            onClick={() => setFilter(group.label)}
          >
            {group.label}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">Showing {count} {count === 1 ? 'project' : 'projects'}</p>
      <div className="home-map-groups" key={filter}>
        {visible.map((group) => (
          <section key={group.label} className="home-map-group">
            <h3 className="home-map-domain">{group.label}</h3>
            <ul className="space-y-2">
              {group.projects.map((project) => (
                <li key={project.slug}>
                  <Link href={`/projects/${project.slug}/`} className="home-map-project">
                    <span>{project.title}</span>
                    <span className="text-xs font-normal text-muted">{project.year}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
