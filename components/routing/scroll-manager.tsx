"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/** Altura aproximada del navbar fijo */
const NAV_OFFSET = 88

function scrollToId(id: string, behavior: ScrollBehavior = "smooth"): boolean {
  const el = document.getElementById(id)
  if (!el) return false
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
  window.scrollTo({ top: Math.max(0, top), behavior })
  return true
}

function retryScrollToId(
  id: string,
  { attempts = 15, interval = 80, behavior = "smooth" }: { attempts?: number; interval?: number; behavior?: ScrollBehavior } = {},
) {
  let tries = 0
  const tick = () => {
    if (scrollToId(id, behavior) || tries >= attempts) return
    tries += 1
    window.setTimeout(tick, interval)
  }
  window.setTimeout(tick, 50)
}

/**
 * Restaura scroll en cada navegación:
 * - Sin hash → inicio de página
 * - Con hash → sección anclada (#formulario, #mapa-obras, etc.)
 */
export function ScrollManager() {
  const pathname = usePathname()

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "")

    if (hash) {
      retryScrollToId(hash)
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [pathname])

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, "")
      if (hash) retryScrollToId(hash)
    }
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  return null
}
