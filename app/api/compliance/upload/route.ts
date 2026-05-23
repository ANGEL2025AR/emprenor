import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"
import {
  storePublicImage,
} from "@/lib/uploads/public-image"

const COMPLIANCE_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
] as const

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const role = user.role as UserRole
  if (!hasPermission(role, "compliance.manage") && !hasPermission(role, "website.edit")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 })

    if (!COMPLIANCE_MIME.includes(file.type as (typeof COMPLIANCE_MIME)[number])) {
      return NextResponse.json({ error: "Solo JPG, PNG, WebP, AVIF o PDF" }, { status: 400 })
    }

    const maxSize = 15 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Máximo 15 MB" }, { status: 400 })
    }

    const url = await storePublicImage(file, "compliance")

    return NextResponse.json({
      success: true,
      url,
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
    })
  } catch (error) {
    console.error("[compliance/upload]", error)
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 })
  }
}
