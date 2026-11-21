'use client'

import Link from 'next/link'
import { useEffect, useSyncExternalStore } from 'react'
import { DirectionIcon } from '@/components/direction-icon'
import type { CatalogProject } from '../project-content'
import { projectDomainIds, projectDomains } from '../project-domains'
import { projectPath } from '../project-paths'
import { ProjectConstellation } from './project-constellation'

const filterChange = 'project-domain-change'

function subscribeToLocation(callback: () => void) {
  const events = ['hashchange', 'popstate', filterChange]
  for (const event of events) window.addEventListener(event, callback)
  return () => {
    for (const event of events) window.removeEventListener(event, callback)
  }
}

function CatalogRows({ projects, target }: { projects: CatalogProject[]; target?: string }) {
  return (
    <ul className="catalog-rows">
      {projects.map(({ slug, title, year, role, summary, repository, domain }, index) => (
        <li key={slug} id={slug} className="catalog-row panel-frame panel-pad" data-catalog-target={slug === target ? '' : undefined} data-reveal={index % 3}>
          <div className="catalog-meta">
            <time dateTime={String(year)}>{year}</time>
            <span className="panel-label">{projectDomains[domain]}</span>
          </div>
          <div>
            <h2 className="catalog-title font-display">{title}</h2>
            <p className="catalog-role">{role}</p>
          </div>
          <p className="catalog-summary">{summary}</p>
          <footer className="panel-actions catalog-actions">
            <Link href={projectPath(slug)} className="text-link">
              Explore project<span className="sr-only"> {title}</span> <DirectionIcon />
            </Link>
            <a href={repository} className="text-link catalog-source">
              Source<span className="sr-only"> for {title}</span> <DirectionIcon direction="external" />
            </a>
          </footer>
        </li>
      ))}
    </ul>
  )
}

export function ProjectMap({ projects }: { projects: CatalogProject[] }) {
  const location = useSyncExternalStore(subscribeToLocation, () => window.location.search + window.location.hash, () => '')
  const [search, fragment] = location.split('#')
  const requested = new URLSearchParams(search).get('domain')
  const hash = fragment ? `#${fragment}` : ''
  const target = projects.find(({ slug }) => hash === `#${slug}`)?.slug
  const available = projectDomainIds.filter((id) => projects.some(({ domain }) => domain === id))
  const selected = target ? null : available.find((id) => id === requested) ?? null
  const visible = selected === null ? projects : projects.filter(({ domain }) => domain === selected)

  useEffect(() => {
    if (!target) return
    const row = document.getElementById(target)
    // A domain filter may have hidden the row while the location was changing.
    if (row && !row.matches(':target')) row.scrollIntoView()
  }, [target])

  function filterBy(domain: string | null) {
    const url = new URL(window.location.href)
    if (domain) url.searchParams.set('domain', domain)
    else url.searchParams.delete('domain')
    if (target) url.hash = ''
    window.history.replaceState(null, '', url)
    window.dispatchEvent(new Event(filterChange))
  }

  return (
    <>
      <div className="catalog-toolbar">
        <div className="catalog-filters" role="group" aria-label="Filter by project domain">
          <button className="button" type="button" aria-pressed={selected === null} onClick={() => filterBy(null)}>All</button>
          {available.map((id) => (
            <button className="button" key={id} type="button" aria-pressed={selected === id} onClick={() => filterBy(id)}>{projectDomains[id]}</button>
          ))}
        </div>
        <p className="catalog-count" role="status" aria-atomic="true">{visible.length} {visible.length === 1 ? 'project' : 'projects'}</p>
      </div>
      <ProjectConstellation projects={projects} visible={visible} target={target} />
      <CatalogRows projects={visible} target={target} />
    </>
  )
}
