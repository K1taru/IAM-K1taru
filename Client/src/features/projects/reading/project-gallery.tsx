'use client'

import Image from 'next/image'
import { type PointerEvent, useRef, useState } from 'react'
import { DirectionIcon } from '@/components/direction-icon'

type GalleryImage = {
  src: string
  alt: string
  width: number
  height: number
}

export function ProjectGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const pointerStart = useRef<number | null>(null)
  const activeImage = images[activeIndex]
  const isCarousel = images.length > 1

  function move(offset: number) {
    setActiveIndex((index) => (index + offset + images.length) % images.length)
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (pointerStart.current === null) return
    const distance = event.clientX - pointerStart.current
    pointerStart.current = null
    setDragOffset(0)
    setIsDragging(false)
    if (isCarousel && Math.abs(distance) >= 48) move(distance < 0 ? 1 : -1)
  }

  return (
    <figure className="project-gallery" aria-roledescription={isCarousel ? 'carousel' : undefined} aria-label={`${title} screenshots`}>
      <div className="project-gallery-stage" tabIndex={isCarousel ? 0 : undefined} data-dragging={isDragging || undefined}
        onKeyDown={(event) => {
          if (!isCarousel) return
          if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1) }
          if (event.key === 'ArrowRight') { event.preventDefault(); move(1) }
        }}
        onPointerDown={(event) => {
          if (!isCarousel) return
          if ((event.target as Element).closest('button')) return
          pointerStart.current = event.clientX
          setIsDragging(true)
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (pointerStart.current !== null) setDragOffset(event.clientX - pointerStart.current)
        }}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStart.current = null
          setDragOffset(0)
          setIsDragging(false)
        }}>
        <div className="project-gallery-slide" style={{ transform: `translateX(${dragOffset}px)` }}>
          <Image src={activeImage.src} alt={activeImage.alt} fill unoptimized draggable={false} sizes="(min-width: 64rem) 92rem, 100vw" />
        </div>
        {isCarousel && <>
          <button className="project-gallery-control project-gallery-control-previous" type="button" aria-label="Show previous screenshot" onClick={() => move(-1)}>
            <DirectionIcon direction="left" />
          </button>
          <button className="project-gallery-control project-gallery-control-next" type="button" aria-label="Show next screenshot" onClick={() => move(1)}>
            <DirectionIcon />
          </button>
        </>}
      </div>
      {isCarousel && <div className="project-gallery-footer">
        <div className="project-gallery-thumbnails" aria-label="Choose a screenshot">
          {images.map((image, index) => (
            <button key={image.src} type="button" aria-label={`Show screenshot ${index + 1}: ${image.alt}`}
              aria-pressed={index === activeIndex} onClick={() => setActiveIndex(index)}>
              <Image src={image.src} alt="" fill unoptimized draggable={false} sizes="128px" />
            </button>
          ))}
        </div>
      </div>}
    </figure>
  )
}
