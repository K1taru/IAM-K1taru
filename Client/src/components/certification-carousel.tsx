'use client'

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { CertificateCard } from './certificate-card'
import { DirectionIcon } from './direction-icon'

type CarouselCredential = {
  file?: string
  slug: string
  title: string
  issuer: string
  date: string
}

export function CertificationCarousel({ credentials }: { credentials: CarouselCredential[] }) {
  const track = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updatePosition = useCallback(() => {
    const rail = track.current
    if (!rail) return
    setAtStart(rail.scrollLeft <= 1)
    setAtEnd(rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1)
  }, [])

  const handleWheel = useCallback((event: globalThis.WheelEvent) => {
    const rail = track.current
    if (!rail || (event.target as Element).closest('dialog[open]')) return
    // Let trackpads handle their native horizontal gesture. A vertical mouse
    // wheel gently advances the rail while the page keeps scrolling normally.
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return
    const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 24 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? rail.clientWidth : 1
    rail.scrollLeft += event.deltaY * unit * 0.55
  }, [])

  useEffect(() => {
    const rail = track.current
    if (!rail) return
    updatePosition()
    const resize = new ResizeObserver(updatePosition)
    resize.observe(rail)
    rail.addEventListener('scroll', updatePosition, { passive: true })
    rail.addEventListener('wheel', handleWheel, { passive: true })
    return () => {
      resize.disconnect()
      rail.removeEventListener('scroll', updatePosition)
      rail.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel, updatePosition])

  function move(direction: -1 | 1) {
    const rail = track.current
    const item = rail?.querySelector<HTMLElement>('.certification-carousel-item')
    if (!rail || !item) return
    const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 0
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    rail.scrollBy({ left: direction * (item.offsetWidth + gap), behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.target !== event.currentTarget || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return
    event.preventDefault()
    move(event.key === 'ArrowLeft' ? -1 : 1)
  }

  return (
    <div className="certification-carousel">
      <div className="certification-carousel-toolbar">
        <p id="certification-carousel-help">Scroll past, swipe, or use the arrows to browse all {credentials.length} certifications.</p>
        <div className="certification-carousel-controls" aria-label="Certification carousel controls">
          <button type="button" onClick={() => move(-1)} disabled={atStart} aria-label="Show previous certification">
            <DirectionIcon direction="left" />
          </button>
          <button type="button" onClick={() => move(1)} disabled={atEnd} aria-label="Show next certification">
            <DirectionIcon />
          </button>
        </div>
      </div>
      <ul
        ref={track}
        className="certification-carousel-track"
        aria-label="Certifications carousel"
        aria-describedby="certification-carousel-help"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {credentials.map((credential) => (
          <li key={credential.slug} className="certification-carousel-item">
            <CertificateCard {...credential} compact />
          </li>
        ))}
      </ul>
    </div>
  )
}
