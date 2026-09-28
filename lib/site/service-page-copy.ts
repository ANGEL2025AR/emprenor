import { getDb } from "@/lib/db/connection"
import { getServicePageConfig } from "@/lib/site/get-service-config"
import type { ServicePageConfig } from "@/lib/site/service-page-types"

const SKIP_KEYS = new Set([
  "className",
  "icon",
  "iconColor",
  "color",
  "colorGradient",
  "type",
  "pageKey",
  "slug",
  "minHeight",
  "columns",
  "showDesc",
  "badge",
])

const IMAGE_KEYS = new Set(["image", "imageAlt", "planImg", "img", "heroImage", "heroImageAlt"])

export type EditableServiceText = { path: string; value: string }

export function collectEditableTexts(value: unknown, path = "", out: EditableServiceText[] = []): EditableServiceText[] {
  if (typeof value === "string") {
    const text = value.trim()
    const key = path.split(".").pop() || ""
    const isImage = IMAGE_KEYS.has(key) || /\.(avif|gif|jpe?g|png|webp)(\?|$)/i.test(text)
    if (text.startsWith("from-") || text.startsWith("h-[")) return out
    if (!isImage && (text.startsWith("http") || text.startsWith("/") || text.length < 2)) return out
    out.push({ path, value })
    return out
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectEditableTexts(item, path ? `${path}.${index}` : String(index), out))
    return out
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (SKIP_KEYS.has(key)) continue
      collectEditableTexts(child, path ? `${path}.${key}` : key, out)
    }
  }
  return out
}

export function applyTextOverrides<T>(value: T, overrides: Record<string, string> | undefined): T {
  if (!overrides || !Object.keys(overrides).length) return value
  const clone = structuredClone(value) as Record<string, unknown>
  for (const [dotted, text] of Object.entries(overrides)) {
    if (typeof text !== "string") continue
    const parts = dotted.split(".")
    let cursor: unknown = clone
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cursor || typeof cursor !== "object") {
        cursor = null
        break
      }
      const key = /^\d+$/.test(parts[i]) ? Number(parts[i]) : parts[i]
      cursor = (cursor as Record<string | number, unknown>)[key]
    }
    if (!cursor || typeof cursor !== "object") continue
    const last = parts[parts.length - 1]
    const key = /^\d+$/.test(last) ? Number(last) : last
    const target = cursor as Record<string | number, unknown>
    if (typeof target[key] === "string") target[key] = text.slice(0, 4000)
  }
  return clone as T
}

export async function getServicePageConfigResolved(slug: string): Promise<ServicePageConfig | null> {
  const base = getServicePageConfig(slug)
  if (!base) return null
  if (!process.env.MONGODB_URI?.trim()) return base
  try {
    const db = await getDb()
    const doc = await db.collection("site_service_pages").findOne({ slug: base.slug || slug })
    const overrides = doc?.overrides as Record<string, string> | undefined
    return applyTextOverrides(base, overrides)
  } catch {
    return base
  }
}
