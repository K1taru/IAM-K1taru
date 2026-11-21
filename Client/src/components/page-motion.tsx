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
    const pending = new Set<HTMLElement>()
    const seen = new WeakSet<HTMLElement>()
    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting || !(target instanceof HTMLElement) || !pending.has(target)) continue
        observer.unobserve(target)
        pending.delete(target)
        delete target.dataset.revealPending
        if (target.matches(':focus-within') || target.closest(':target') || target.querySelector(':target')) continue

        const order = Number(target.dataset.reveal)
        const animation = animate(target, {
          opacity: [0, 1],
          translate: ['0 24px', 'none'],
        }, {
          duration: 0.7,
          delay: Math.min(order * 0.07, 0.21),
          ease: [0.2, 0.75, 0.25, 1],
          onComplete: () => animations.delete(target),
        })
        animations.set(target, animation)
      }
    }, { rootMargin: '0px 0px -8% 0px' })

    function observe(target: HTMLElement) {
      if (seen.has(target)) return
      seen.add(target)
      // Keep already visible content readable during hydration and scroll restoration.
      if (target.getBoundingClientRect().top < window.innerHeight) return
      target.dataset.revealPending = ''
      pending.add(target)
      observer.observe(target)
    }

    page.querySelectorAll<HTMLElement>('[data-reveal]').forEach(observe)
    const changes = new MutationObserver((records) => {
      for (const [target, animation] of animations) {
        if (page.contains(target)) continue
        animation.cancel()
        animations.delete(target)
      }
      for (const target of pending) {
        if (page.contains(target)) continue
        observer.unobserve(target)
        pending.delete(target)
        delete target.dataset.revealPending
        seen.delete(target)
      }
      for (const { addedNodes } of records) {
        for (const node of addedNodes) {
          if (!(node instanceof HTMLElement) || !page.contains(node)) continue
          if (node.matches('[data-reveal]')) observe(node)
          node.querySelectorAll<HTMLElement>('[data-reveal]').forEach(observe)
        }
      }
    })
    changes.observe(page, { childList: true, subtree: true })

    function show(target: Element | null) {
      const section = target?.closest<HTMLElement>('[data-reveal]')
      if (!section) return
      observer.unobserve(section)
      pending.delete(section)
      delete section.dataset.revealPending
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
      changes.disconnect()
      observer.disconnect()
      for (const target of pending) delete target.dataset.revealPending
      pending.clear()
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

  useEffect(() => {
    const stage = content.current?.querySelector<HTMLElement>('.home-portrait')
    const card = stage?.querySelector<HTMLElement>('.portrait-board')
    if (!stage || !card) return
    const canTilt = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    function tilt(event: PointerEvent) {
      if (!canTilt.matches || event.pointerType === 'touch') return
      const { left, top, width, height } = stage!.getBoundingClientRect()
      card!.style.setProperty('--portrait-rx', `${(0.5 - (event.clientY - top) / height) * 3.5}deg`)
      card!.style.setProperty('--portrait-ry', `${((event.clientX - left) / width - 0.5) * 4.5}deg`)
    }
    function resetTilt() {
      card!.style.removeProperty('--portrait-rx')
      card!.style.removeProperty('--portrait-ry')
    }
    stage.addEventListener('pointermove', tilt, { passive: true })
    stage.addEventListener('pointerleave', resetTilt)
    canTilt.addEventListener('change', resetTilt)
    return () => {
      stage.removeEventListener('pointermove', tilt)
      stage.removeEventListener('pointerleave', resetTilt)
      canTilt.removeEventListener('change', resetTilt)
      resetTilt()
    }
  }, [])

  return (
    <ViewTransition default="none" enter="portfolio-page" exit="portfolio-page">
      <div ref={content}>{children}</div>
    </ViewTransition>
  )
}
