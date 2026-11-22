'use client'

import { useEffect, useState } from 'react'

type Section = { id: string; label: string }

export function SectionMenu({ label, sections }: { label: string; sections: Section[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const marker = Math.min(220, window.innerHeight * 0.3)
      const visible = sections.filter(({ id }) => {
        const element = document.getElementById(id)
        return element && element.getBoundingClientRect().top <= marker
      })
      setActiveId(visible.at(-1)?.id ?? sections[0]?.id)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [sections])

  return (
    <nav aria-label={label} className="section-menu">
      <p aria-hidden="true" className="section-menu-label">{label}</p>
      <ul>
        {sections.map(({ id, label: sectionLabel }) => (
          <li key={id}>
            <a href={`#${id}`} className="section-menu-link" aria-current={activeId === id ? 'location' : undefined}
              onClick={() => setActiveId(id)}>{sectionLabel}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
