'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { person } from '@/lib/portfolio'

const links = [
  { href: '/projects/', label: 'Projects' },
  { href: '/about/', label: 'About' },
]

export function SiteNav() {
  const pathname = usePathname().replace(/\/$/, '') || '/'

  return (
    <header className="site-header">
      <nav className="site-shell site-header-inner" aria-label="Main navigation">
        <Link href="/" className="site-brand" aria-current={pathname === '/' ? 'page' : undefined}>
          <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" className="site-mark">
            <rect x="0.5" y="0.5" width="31" height="31" rx="8" />
            <path d="M10 8v16m10-14-8 6 8 6m3-2h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {person.handle}
        </Link>
        <ul className="site-nav-links">
          {links.map(({ href, label }) => {
            const route = href.slice(0, -1)
            const current = pathname === route ? 'page' : pathname.startsWith(href) ? 'location' : undefined
            return <li key={href}><Link href={href} aria-current={current}>{label}</Link></li>
          })}
        </ul>
      </nav>
    </header>
  )
}
