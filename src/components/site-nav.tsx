import Link from 'next/link'

const links = [
  { href: '/', label: 'Home' },
  { href: '/projects/', label: 'Projects' },
  { href: '/about/', label: 'About' },
]

export function SiteNav() {
  return (
    <header className="border-b border-divider">
      <div className="mx-auto max-w-6xl px-4 py-2.5 sm:px-8 sm:py-3">
        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap gap-x-0.5 sm:gap-x-4">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-muted hover:text-accent hover:underline hover:underline-offset-4"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
