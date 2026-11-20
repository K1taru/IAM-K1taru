'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useSyncExternalStore } from 'react'
import { DirectionIcon } from '@/components/direction-icon'
import type { Project } from '@/lib/projects'

const domains = [
  { id: 'applications', label: 'Applications', slugs: ['gymms', 'mdsystem', 'cookeat'] },
  { id: 'machine-learning', label: 'Machine learning', slugs: ['moskita', 'traffic-sign-classifier'] },
  { id: 'infrastructure', label: 'Infrastructure', slugs: ['pi-monitor'] },
  { id: 'data-systems', label: 'Data systems', slugs: ['ayudirect', 'growquest'] },
  { id: 'other', label: 'Other', slugs: [] },
]

export type CatalogProject = Pick<Project, 'slug' | 'title' | 'year' | 'role' | 'summary' | 'repository'>

function getDomain(slug: string) {
  return domains.find(({ slugs }) => slugs.includes(slug)) ?? domains[domains.length - 1]
}

function subscribeToHash(callback: () => void) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

export function CatalogRows({ projects, target }: { projects: CatalogProject[]; target?: string }) {
  return (
    <ul className="catalog-rows">
      {projects.map(({ slug, title, year, role, summary, repository }) => (
        <li key={slug} id={slug} className="catalog-row" data-catalog-target={slug === target ? '' : undefined}>
          <div className="catalog-meta">
            <time dateTime={String(year)}>{year}</time>
            <span>{getDomain(slug).label}</span>
          </div>
          <div>
            <h2 className="catalog-title font-display">
              <Link href={`/projects/${slug}/`}>{title} <DirectionIcon /></Link>
            </h2>
            <p className="catalog-role">{role}</p>
          </div>
          <p className="catalog-summary">{summary}</p>
          <a href={repository} className="text-link catalog-source">
            Source<span className="sr-only"> for {title}</span> <DirectionIcon direction="external" />
          </a>
        </li>
      ))}
    </ul>
  )
}

export function ProjectMap({ projects }: { projects: CatalogProject[] }) {
  const requested = useSearchParams().get('domain')
  const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash, () => '')
  const target = projects.find(({ slug }) => hash === `#${slug}`)?.slug
  const available = domains.filter(({ id }) => projects.some(({ slug }) => getDomain(slug).id === id))
  const selected = !target && available.some(({ id }) => id === requested) ? requested : null
  const visible = selected === null ? projects : projects.filter(({ slug }) => getDomain(slug).id === selected)

  useEffect(() => {
    if (!target) return
    const row = document.getElementById(target)
    // Mounting the filterable list can replace the server-rendered fragment target.
    if (row && !row.matches(':target')) row.scrollIntoView()
  }, [target])

  function filterBy(domain: string | null) {
    const url = new URL(window.location.href)
    if (domain) url.searchParams.set('domain', domain)
    else url.searchParams.delete('domain')
    if (target) url.hash = ''
    window.history.replaceState(null, '', url)
    // History updates do not emit hashchange when clearing a direct project link.
    if (target) window.dispatchEvent(new Event('hashchange'))
  }

  return (
    <>
      <div className="catalog-toolbar">
        <div className="catalog-filters" role="group" aria-label="Filter by project domain">
          <button className="button" type="button" aria-pressed={selected === null} onClick={() => filterBy(null)}>All</button>
          {available.map(({ id, label }) => (
            <button className="button" key={id} type="button" aria-pressed={selected === id} onClick={() => filterBy(id)}>{label}</button>
          ))}
        </div>
        <p className="catalog-count" role="status" aria-atomic="true">{visible.length} {visible.length === 1 ? 'project' : 'projects'}</p>
      </div>
      <CatalogRows projects={visible} target={target} />
    </>
  )
}
