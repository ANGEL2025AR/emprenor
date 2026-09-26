import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { randomBytes } from "crypto"

export const LEAD_ATTACHMENT_MAX_BYTES = 8 * 1024 * 1024

const ALLOWED = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
])

export type StoredLeadAttachment = {
  originalName: string
  storedName: string
  mime: string
  size: number
}

export function validateLeadAttachment(file: File): string | null {
  if (!ALLOWED.has(file.type)) return "Adjuntá un PDF, JPG, PNG o WebP."
  if (file.size > LEAD_ATTACHMENT_MAX_BYTES) return "El archivo supera 8 MB."
  if (file.size === 0) return "El archivo está vacío."
  return null
}

export async function storeLeadAttachment(file: File): Promise<StoredLeadAttachment> {
  const error = validateLeadAttachment(file)
  if (error) throw new Error(error)

  const ext = path.extname(file.name).toLowerCase().replace(/[^.a-z0-9]/g, "") || ".bin"
  const storedName = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`
  const dir = path.join(process.cwd(), "storage", "leads")
  await mkdir(dir, { recursive: true })
  const bytes = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(dir, storedName), bytes)

  return {
    originalName: file.name.replace(/[^\w.\- ()áéíóúñÁÉÍÓÚÑ]/g, "_").slice(0, 120),
    storedName,
    mime: file.type,
    size: file.size,
  }
}
