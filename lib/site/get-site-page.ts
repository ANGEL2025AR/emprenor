import type { SitePageDocument, SitePageHeroSlide } from "@/lib/db/models"
import { getDb } from "@/lib/db/connection"
import { SITE_DEFAULT_HERO } from "./defaults"
import { isSitePageSlug, type SitePageSlug } from "./constants"

function isMissingMongoUriError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("MONGODB_URI")
}

export async function getSitePageHeroSlides(slug: string): Promise<SitePageHeroSlide[]> {
  const safeSlug: SitePageSlug = isSitePageSlug(slug) ? slug : "home"
  const defaults = SITE_DEFAULT_HERO[safeSlug]

  if (!process.env.MONGODB_URI?.trim()) {
    return defaults
  }

  try {
    const db = await getDb()
    const doc = await db.collection<SitePageDocument>("site_pages").findOne({ slug: safeSlug })
    if (!doc?.heroSlides?.length) {
      return defaults
    }
    return doc.heroSlides
  } catch (error) {
    if (!isMissingMongoUriError(error)) {
      console.error("[site_pages] Error al leer portada:", error)
    }
    return defaults
  }
}
