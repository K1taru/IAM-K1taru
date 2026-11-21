'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useSyncExternalStore } from 'react'
import { profile } from '@content/profile'
import { projectsPath } from '@/features/projects/project-paths'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/about/#tools', label: 'Skills' },
  { href: projectsPath, label: 'Projects' },
  { href: '/certifications/', label: 'Certifications' },
]

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  window.addEventListener('popstate', onChange)
  return () => {
    window.removeEventListener('hashchange', onChange)
    window.removeEventListener('popstate', onChange)
  }
}

export function SiteNav() {
  const header = useRef<HTMLElement>(null)
  const path = usePathname().replace(/\/?$/, '/')
  const onHome = path === '/'
  const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash, () => '')
  const onAbout = path === '/about/'
  const onSkills = onAbout && hash === '#tools'

  useEffect(() => {
    const bar = header.current
    if (!bar) return
    const heroTitle = onHome ? document.getElementById('home-title') : null
    let observer: IntersectionObserver | undefined

    const measure = () => {
      document.documentElement.style.setProperty('--header-height', `calc(${bar.offsetHeight}px + var(--header-offset))`)
      if (!heroTitle) return

      const headerBottom = bar.offsetHeight + Number.parseFloat(getComputedStyle(bar).insetBlockStart)
      const updateWordmark = (titleBottom: number) => {
        bar.toggleAttribute('data-hero-name-passed', titleBottom <= headerBottom)
      }

      updateWordmark(heroTitle.getBoundingClientRect().bottom)
      observer?.disconnect()
      observer = new IntersectionObserver(([entry]) => {
        updateWordmark(entry.boundingClientRect.bottom)
      }, { rootMargin: `-${headerBottom}px 0px 100% 0px` })
      observer.observe(heroTitle)
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(bar)
    return () => {
      observer?.disconnect()
      resize.disconnect()
      bar.removeAttribute('data-hero-name-passed')
      document.documentElement.style.removeProperty('--header-height')
    }
  }, [onHome])

  return (
    <header className="site-header" ref={header} data-home={onHome || undefined}>
      <nav className="site-shell site-header-inner" aria-label="Main navigation">
        <Link href="/" className="site-brand site-wordmark" aria-label={`${profile.wordmark} Portfolio home`}>
          <span className="site-wordmark-full" aria-hidden="true">{profile.wordmark}{' '}<span className="site-wordmark-accent">Portfolio</span></span>
          <span className="site-wordmark-short site-wordmark-accent" aria-hidden="true">Portfolio</span>
        </Link>
        <ul className="site-nav-links">
          {links.map(({ href, label }) => {
            const exact = href === '/'
            const about = href === '/about/'
            const skills = href === '/about/#tools'
            const active = skills ? onSkills : about ? onAbout && !onSkills : exact ? path === '/' : path.startsWith(href)
            const current = active ? (skills ? 'location' : 'page') : undefined
            return (
              <li key={href}>
                {onAbout && (about || skills) ? (
                  <a href={skills ? '#tools' : '#main-content'} aria-current={current}>{label}</a>
                ) : (
                  <Link href={href} aria-current={current}>{label}</Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
