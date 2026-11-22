'use client'

import Image from 'next/image'
import { type PointerEvent, useRef, useState } from 'react'
import { DirectionIcon } from '@/components/direction-icon'
import { projectImageLoader } from '../project-image-loader'

type GalleryImage = {
  src: string
  alt: string
  width: number
  height: number
}

export function ProjectGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const pointerStart = useRef<{ x: number; scrollLeft: number } | null>(null)
  const isCarousel = images.length > 1

  function showImage(index: number) {
    const nextIndex = (index + images.length) % images.length
    setActiveIndex(nextIndex)
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    stage.current?.scrollTo({ left: stage.current.clientWidth * nextIndex, behavior })
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    if (pointerStart.current === null) return
    pointerStart.current = null
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <figure className="project-gallery" aria-roledescription={isCarousel ? 'carousel' : undefined} aria-label={`${title} screenshots`}>
      <div className="project-gallery-stage">
        <div ref={stage} className="project-gallery-track" tabIndex={isCarousel ? 0 : undefined} data-dragging={isDragging || undefined}
        onKeyDown={(event) => {
          if (!isCarousel) return
          if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(activeIndex - 1) }
          if (event.key === 'ArrowRight') { event.preventDefault(); showImage(activeIndex + 1) }
        }}
        onPointerDown={(event) => {
          if (!isCarousel) return
          if ((event.target as Element).closest('button')) return
          if (event.button !== 0) return
          pointerStart.current = { x: event.clientX, scrollLeft: event.currentTarget.scrollLeft }
          setIsDragging(true)
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (pointerStart.current === null) return
          event.currentTarget.scrollLeft = pointerStart.current.scrollLeft - (event.clientX - pointerStart.current.x)
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onScroll={(event) => {
          const width = event.currentTarget.clientWidth
          if (width) setActiveIndex(Math.round(event.currentTarget.scrollLeft / width))
        }}>
        {images.map((image) => (
          <div className="project-gallery-slide" key={image.src}>
            <Image src={image.src} alt={image.alt} fill loader={projectImageLoader(image.width)} draggable={false} sizes="(min-width: 64rem) 92rem, 100vw" />
          </div>
        ))}
        </div>
        {isCarousel && <>
          <button className="project-gallery-control project-gallery-control-previous" type="button" aria-label="Show previous screenshot" onClick={() => showImage(activeIndex - 1)}>
            <DirectionIcon direction="left" />
          </button>
          <button className="project-gallery-control project-gallery-control-next" type="button" aria-label="Show next screenshot" onClick={() => showImage(activeIndex + 1)}>
            <DirectionIcon />
          </button>
        </>}
      </div>
      {isCarousel && <div className="project-gallery-footer">
        <div className="project-gallery-thumbnails" aria-label="Choose a screenshot">
          {images.map((image, index) => (
            <button key={image.src} type="button" aria-label={`Show screenshot ${index + 1}: ${image.alt}`}
              aria-pressed={index === activeIndex} onClick={() => showImage(index)}>
              <Image src={image.src} alt="" fill loader={projectImageLoader(image.width)} draggable={false} sizes="128px" />
            </button>
          ))}
        </div>
      </div>}
    </figure>
  )
}
