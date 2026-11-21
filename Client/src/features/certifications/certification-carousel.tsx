'use client'

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { DirectionIcon } from '@/components/direction-icon'
import { CertificateCard, type CertificateCardProps } from './certificate-card'

export function CertificationCarousel({ credentials }: { credentials: Omit<CertificateCardProps, 'compact'>[] }) {
  const track = useRef<HTMLUListElement>(null)
  const drag = useRef<{ id: number; x: number; scrollLeft: number } | null>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updatePosition = useCallback(() => {
    const rail = track.current
    if (!rail) return
    setAtStart(rail.scrollLeft <= 1)
    setAtEnd(rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1)
  }, [])

  useEffect(() => {
    const rail = track.current
    if (!rail) return
    updatePosition()
    const resize = new ResizeObserver(updatePosition)
    resize.observe(rail)
    rail.addEventListener('scroll', updatePosition, { passive: true })
    return () => {
      resize.disconnect()
      rail.removeEventListener('scroll', updatePosition)
    }
  }, [updatePosition])

  function startDrag(event: PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== 'mouse' || event.button !== 0 || (atStart && atEnd) ||
      (event.target as Element).closest('dialog')) return
    drag.current = { id: event.pointerId, x: event.clientX, scrollLeft: event.currentTarget.scrollLeft }
  }

  function dragTrack(event: PointerEvent<HTMLUListElement>) {
    const start = drag.current
    if (start?.id !== event.pointerId) return
    const rail = event.currentTarget
    const distance = start.x - event.clientX
    if (!rail.hasPointerCapture(event.pointerId)) {
      if (Math.abs(distance) < 6) return
      rail.setPointerCapture(event.pointerId)
      rail.dataset.dragging = ''
    }
    rail.scrollLeft = start.scrollLeft + distance
  }

  function endDrag(event: PointerEvent<HTMLUListElement>) {
    if (drag.current?.id !== event.pointerId) return
    drag.current = null
    delete event.currentTarget.dataset.dragging
  }

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
      <p id="certification-carousel-help">Drag, swipe, or use the arrows to browse all {credentials.length} certifications.</p>
      <div className="certification-carousel-rail">
        <button className="certification-carousel-arrow" type="button" onClick={() => move(-1)} disabled={atStart} aria-label="Show previous certification">
          <DirectionIcon direction="left" />
        </button>
        <ul
          ref={track}
          className="certification-carousel-track"
          aria-label="Certifications carousel"
          aria-describedby="certification-carousel-help"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={startDrag}
          onPointerMove={dragTrack}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          onPointerLeave={endDrag}
          onDragStart={(event) => {
            if (!(event.target as Element).closest('dialog')) event.preventDefault()
          }}
        >
          {credentials.map((credential) => (
            <li key={credential.slug} className="certification-carousel-item">
              <CertificateCard {...credential} compact />
            </li>
          ))}
        </ul>
        <button className="certification-carousel-arrow" type="button" onClick={() => move(1)} disabled={atEnd} aria-label="Show next certification">
          <DirectionIcon />
        </button>
      </div>
    </div>
  )
}
