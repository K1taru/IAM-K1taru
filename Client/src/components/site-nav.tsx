'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const links = [
  { id: 'home', href: '/', label: 'Home' },
  { id: 'about', href: '/about/', label: 'About' },
  { id: 'skills', href: '/about/#tools', label: 'Skills' },
  { id: 'projects', href: '/projects/', label: 'Projects' },
  { id: 'certifications', href: '/certifications/', label: 'Certifications' },
  { id: 'contact', href: '/about/#contact', label: 'Contact' },
]

export function SiteNav() {
  const path = usePathname().replace(/\/?$/, '/')
  return <Navigation key={path} path={path} />
}

function Navigation({ path }: { path: string }) {
  const header = useRef<HTMLElement>(null)
  const onHome = path === '/'
  const [current, setCurrent] = useState(onHome ? 'home' : path.split('/')[1])

  useEffect(() => {
    const bar = header.current
    if (!bar) return
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main [data-nav-section]'))
    let height = bar.offsetHeight
    let frame = 0

    function readSection() {
      frame = 0
      if (!sections.length) return
      const line = height + Math.min(112, (window.innerHeight - height) * 0.25)
      let section = sections[0]
      for (const candidate of sections) {
        if (candidate.getBoundingClientRect().top > line) break
        section = candidate
      }
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        section = sections[sections.length - 1]
      }
      setCurrent(section.dataset.navSection!)
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(readSection)
    }

    function measure() {
      height = bar!.offsetHeight
      document.documentElement.style.setProperty('--header-height', height + 'px')
      schedule()
    }

    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(bar)
    if (sections.length) {
      resize.observe(document.querySelector('main')!)
      window.addEventListener('scroll', schedule, { passive: true })
    }
    window.addEventListener('resize', measure)
    return () => {
      resize.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return (
    <header className="site-header" ref={header}>
      <nav className="site-shell site-header-inner" aria-label="Main navigation">
        <Link href="/" className="site-brand site-wordmark">K1taru Portfolio</Link>
        <ul className="site-nav-links">
          {links.map(({ id, href, label }) => {
            const active = id === current ? (href === path ? 'page' : 'location') : undefined
            const local = onHome ? '#' + id : path === '/about/' && href.startsWith(path) ? href.slice(path.length) || '#main-content' : null
            return (
              <li key={href}>
                <Link href={local ?? href} aria-current={active}>{label}</Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
