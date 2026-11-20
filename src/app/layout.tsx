import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteNav } from '@/components/site-nav'
import { siteIndexable, siteOrigin } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'John Michael Garcia',
    template: '%s | John Michael Garcia',
  },
  description: 'Applied machine learning and systems portfolio',
  metadataBase: siteOrigin,
  robots: { index: siteIndexable, follow: true },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-10 focus:bg-surface focus:p-3"
        >
          Skip to content
        </a>
        <SiteNav />
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl px-4 sm:px-8"
        >
          {children}
        </main>
      </body>
    </html>
  )
}
