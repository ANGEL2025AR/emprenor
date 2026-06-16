import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"

/** Vercel limita el body a ~4.5 MB en serverless */
const MAX_BYTES = 4 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const canUpload =
      hasPermission(user.role, "projects.create") || hasPermission(user.role, "projects.edit")
    if (!canUpload) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const projectId = formData.get("projectId") as string

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 })
    }

    if (!projectId) {
      return NextResponse.json({ error: "No se proporcionó ID de proyecto" }, { status: 400 })
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo se aceptan JPEG, PNG, WebP y AVIF." },
        { status: 400 },
      )
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "La imagen supera 4 MB. Comprimila o elegí un archivo más liviano." },
        { status: 400 },
      )
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const folder = projectId.startsWith("temp-") ? "projects/drafts" : `projects/${projectId}`

    const blob = await put(`${folder}/${Date.now()}-${safeName}`, file, {
      access: "public",
    })

    return NextResponse.json({
      url: blob.url,
      filename: safeName,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[projects/images]", error)
    return NextResponse.json(
      { error: "Error al subir imagen. Si el archivo es grande, probá con menos de 4 MB." },
      { status: 500 },
    )
  }
}
