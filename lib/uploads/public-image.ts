import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { put } from "@vercel/blob"

export const PUBLIC_IMAGE_MAX_BYTES = 10 * 1024 * 1024

export const PUBLIC_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const

export type PublicImageFolder = "site" | "hero" | "public-projects" | "compliance" | "services" | "brochure"

const ALLOWED_FOLDERS: PublicImageFolder[] = ["site", "hero", "public-projects", "compliance", "services", "brochure"]

export function sanitizeUploadFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export function parsePublicImageFolder(raw: FormDataEntryValue | null): PublicImageFolder {
  const folder = typeof raw === "string" ? raw.trim() : ""
  if (ALLOWED_FOLDERS.includes(folder as PublicImageFolder)) {
    return folder as PublicImageFolder
  }
  return "site"
}

export function validatePublicImageFile(file: File): string | null {
  if (!PUBLIC_IMAGE_MIME_TYPES.includes(file.type as (typeof PUBLIC_IMAGE_MIME_TYPES)[number])) {
    return "Tipo no permitido. Usá JPG, PNG, WebP o AVIF."
  }
  if (file.size > PUBLIC_IMAGE_MAX_BYTES) {
    return "El archivo supera 10 MB."
  }
  return null
}

/** Guarda imagen pública en Vercel Blob o, en local sin token, en /public/uploads. */
export async function storePublicImage(file: File, folder: PublicImageFolder): Promise<string> {
  const safeName = sanitizeUploadFileName(file.name)
  const key = `${folder}/${Date.now()}-${safeName}`

  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    const blob = await put(key, file, { access: "public" })
    return blob.url
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder)
  await mkdir(uploadDir, { recursive: true })
  const filename = `${Date.now()}-${safeName}`
  await writeFile(path.join(uploadDir, filename), bytes)
  return `/uploads/${folder}/${filename}`
}
