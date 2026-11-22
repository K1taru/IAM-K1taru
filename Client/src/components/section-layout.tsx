import type { ReactNode } from 'react'
import { SectionMenu } from './section-menu'

type SectionLayoutProps = {
  label: string
  sections: { id: string; label: string }[]
  children: ReactNode
}

export function SectionLayout({ label, sections, children }: SectionLayoutProps) {
  return (
    <div className="section-layout">
      <SectionMenu label={label} sections={sections} />
      {children}
    </div>
  )
}
