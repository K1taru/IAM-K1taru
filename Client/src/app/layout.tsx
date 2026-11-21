import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import localFont from 'next/font/local'
import { ContactLinks } from '@/components/contact-links'
import { SiteNav } from '@/components/site-nav'
import { person } from '@/lib/portfolio'
import { siteDescription, siteIndexable, siteOrigin } from '@/lib/site'
import './globals.css'

const sourceSans = localFont({
  src: '../../node_modules/@fontsource-variable/source-sans-3/files/source-sans-3-latin-wght-normal.woff2',
  weight: '200 900',
  variable: '--source-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: person.name,
    template: `%s | ${person.name}`,
  },
  description: siteDescription,
  metadataBase: siteOrigin,
  robots: { index: siteIndexable, follow: true },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={sourceSans.variable} data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col bg-canvas text-ink antialiased">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <div className="ambient-interface" aria-hidden="true" />
        <SiteNav />
        <main id="main-content" tabIndex={-1} className="site-shell flex-1">
          {children}
        </main>
        <footer className="site-footer">
          <div className="site-shell site-footer-inner">
            <Link className="site-brand" href="/">{person.name}</Link>
            <ContactLinks />
          </div>
        </footer>
      </body>
    </html>
  )
}
