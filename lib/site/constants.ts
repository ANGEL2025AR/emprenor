export const SITE_PAGE_SLUGS = ["home", "nosotros", "contacto"] as const

export type SitePageSlug = (typeof SITE_PAGE_SLUGS)[number]

export function isSitePageSlug(slug: string): slug is SitePageSlug {
  return (SITE_PAGE_SLUGS as readonly string[]).includes(slug)
}
