'use client'

import { useEffect, useRef } from 'react'

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverInit = {},
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
        ...options,
      },
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [options])

  return ref
}
