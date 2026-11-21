'use client'

import { ViewTransition, useEffect, useRef, type ReactNode } from 'react'
import { animate } from 'framer-motion/dom/mini'

export function PageMotion({ children }: { children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const page = content.current
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!page || preference.matches || !('IntersectionObserver' in window) || !('animate' in Element.prototype)) return

    const animations = new Map<Element, ReturnType<typeof animate>>()
    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue
        observer.unobserve(target)
        if (target.matches(':focus-within, :target') || target.querySelector(':target')) continue

        const order = Number((target as HTMLElement).dataset.reveal)
        const animation = animate(target, {
          opacity: [0.55, 1],
          transform: ['translateY(14px)', 'none'],
        }, {
          duration: 0.4,
          delay: Math.min(order * 0.045, 0.135),
          ease: [0.22, 1, 0.36, 1],
          onComplete: () => animations.delete(target),
        })
        animations.set(target, animation)
      }
    })

    // Content already on screen should stay readable during hydration or scroll restoration.
    for (const target of page.querySelectorAll('[data-reveal]')) {
      if (target.getBoundingClientRect().top >= window.innerHeight) observer.observe(target)
    }

    function show(target: Element | null) {
      const section = target?.closest('[data-reveal]')
      if (!section) return
      observer.unobserve(section)
      animations.get(section)?.cancel()
      animations.delete(section)
    }

    function showFocused(event: FocusEvent) {
      if (event.target instanceof Element) show(event.target)
    }

    function showAnchor() {
      show(page?.querySelector(':target') ?? null)
    }

    function stop() {
      observer.disconnect()
      for (const animation of animations.values()) animation.cancel()
      animations.clear()
    }

    page.addEventListener('focusin', showFocused)
    window.addEventListener('hashchange', showAnchor)
    preference.addEventListener('change', stop)

    return () => {
      stop()
      page.removeEventListener('focusin', showFocused)
      window.removeEventListener('hashchange', showAnchor)
      preference.removeEventListener('change', stop)
    }
  }, [])

  return (
    <ViewTransition default="none" enter="portfolio-page" exit="portfolio-page">
      <div ref={content}>{children}</div>
    </ViewTransition>
  )
}
