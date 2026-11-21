import type { ReactNode } from 'react'

type SectionLayoutProps = {
  label: string
  sections: { id: string; label: string }[]
  children: ReactNode
}

export function SectionLayout({ label, sections, children }: SectionLayoutProps) {
  return (
    <div className="section-layout">
      <nav aria-label={label} className="section-menu">
        <p aria-hidden="true" className="section-menu-label">{label}</p>
        <ul>
          {sections.map((section) => (
            <li key={section.id}><a href={`#${section.id}`} className="text-link">{section.label}</a></li>
          ))}
        </ul>
      </nav>
      {children}
    </div>
  )
}
