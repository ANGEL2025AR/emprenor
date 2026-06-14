/** Contacto con scroll directo al formulario de cotización */
export function contactFormUrl(): string {
  return "/contacto#formulario"
}

/** Mapa de obras en la página de proyectos */
export function projectsMapUrl(): string {
  return "/proyectos#mapa-obras"
}

/** Convierte rutas de contacto del CMS compartido al formulario en este sitio */
export function normalizeContactHref(href: string | null | undefined): string {
  if (!href) return contactFormUrl()
  const normalized = href.replace(/^\/Contacto/i, "/contacto")
  const path = normalized.split("#")[0]
  if (path === "/contacto") return contactFormUrl()
  return normalized
}
