'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useSyncExternalStore } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/about/#tools', label: 'Skills' },
  { href: '/projects/', label: 'Projects' },
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
  const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash, () => '')
  const onAbout = path === '/about/'
  const onSkills = onAbout && hash === '#tools'

  useEffect(() => {
    const bar = header.current
    if (!bar) return
    const measure = () => {
      document.documentElement.style.setProperty('--header-height', `calc(${bar.offsetHeight}px + var(--header-offset))`)
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(bar)
    return () => {
      resize.disconnect()
      document.documentElement.style.removeProperty('--header-height')
    }
  }, [])

  return (
    <header className="site-header" ref={header}>
      <nav className="site-header-inner" aria-label="Main navigation">
        <Link href="/" className="site-brand site-wordmark" aria-label="JM Garcia Portfolio home">
          <span>JM Garcia</span>{' '}<span className="site-wordmark-accent">Portfolio</span>
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
