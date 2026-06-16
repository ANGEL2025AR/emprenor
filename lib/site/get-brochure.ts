import { getDb } from "@/lib/db/connection"
import type { BrochureContentDocument, BrochureDirectoryMember } from "@/lib/db/models"
import { buildDefaultBrochureContent, DEFAULT_BROCHURE_DIRECTORY } from "@/lib/site/brochure-defaults"
import type { ResolvedBrochureContent, ResolvedBrochureDirectoryMember } from "@/lib/site/brochure-types"

export type { ResolvedBrochureContent, ResolvedBrochureDirectoryMember } from "@/lib/site/brochure-types"
export { groupDirectoryByDepartment } from "@/lib/site/brochure-types"

export async function getBrochureContent(): Promise<{ content: ResolvedBrochureContent; fromDatabase: boolean }> {
  const defaults = buildDefaultBrochureContent()

  if (!process.env.MONGODB_URI?.trim()) {
    return { content: defaults, fromDatabase: false }
  }

  try {
    const db = await getDb()
    const doc = await db.collection<BrochureContentDocument>("brochure_content").findOne({ key: "main" })
    if (!doc) return { content: defaults, fromDatabase: false }

    const { _id, createdAt, updatedAt, updatedBy, ...content } = doc
    return {
      content: {
        ...defaults,
        ...content,
        legalEntity: { ...defaults.legalEntity, ...content.legalEntity },
        cover: { ...defaults.cover, ...content.cover },
        manifesto: {
          ...defaults.manifesto,
          ...content.manifesto,
          items: content.manifesto?.items?.length ? content.manifesto.items : defaults.manifesto.items,
        },
        presentation: { ...defaults.presentation, ...content.presentation },
        history: { ...defaults.history, ...content.history },
        mission: { ...defaults.mission, ...content.mission },
        values: content.values?.length ? content.values : defaults.values,
        stats: content.stats?.length ? content.stats : defaults.stats,
        certifications: content.certifications?.length ? content.certifications : defaults.certifications,
        closing: { ...defaults.closing, ...content.closing },
      },
      fromDatabase: true,
    }
  } catch (error) {
    console.error("[getBrochureContent]", error)
    return { content: defaults, fromDatabase: false }
  }
}

export async function getBrochureDirectory(options?: {
  publishedOnly?: boolean
}): Promise<{ members: ResolvedBrochureDirectoryMember[]; fromDatabase: boolean }> {
  const publishedOnly = options?.publishedOnly ?? true

  if (!process.env.MONGODB_URI?.trim()) {
    const fallback = DEFAULT_BROCHURE_DIRECTORY.filter((m) => !publishedOnly || m.published)
    return { members: fallback as ResolvedBrochureDirectoryMember[], fromDatabase: false }
  }

  try {
    const db = await getDb()
    const filter = publishedOnly ? { published: true } : {}
    const members = await db
      .collection<BrochureDirectoryMember>("brochure_directory")
      .find(filter)
      .sort({ department: 1, order: 1, name: 1 })
      .toArray()

    if (!members.length) {
      const fallback = DEFAULT_BROCHURE_DIRECTORY.filter((m) => !publishedOnly || m.published)
      return { members: fallback as ResolvedBrochureDirectoryMember[], fromDatabase: false }
    }

    return {
      members: members.map((m) => ({ ...m, _id: m._id?.toString() })),
      fromDatabase: true,
    }
  } catch (error) {
    console.error("[getBrochureDirectory]", error)
    const fallback = DEFAULT_BROCHURE_DIRECTORY.filter((m) => !publishedOnly || m.published)
    return { members: fallback as ResolvedBrochureDirectoryMember[], fromDatabase: false }
  }
}
