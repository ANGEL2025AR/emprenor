import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "projects.edit")) {
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
      return NextResponse.json({ error: "Tipo de archivo no permitido. Solo se aceptan JPEG, PNG, WebP y AVIF." }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "El archivo excede el tamaño máximo de 10MB." }, { status: 400 })
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")

    const blob = await put(`projects/${projectId}/${safeName}`, file, {
      access: "public",
    })

    return NextResponse.json({
      url: blob.url,
      filename: safeName,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: "Error al subir imagen" }, { status: 500 })
  }
}
