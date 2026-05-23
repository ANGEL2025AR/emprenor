import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"
import {
  parsePublicImageFolder,
  storePublicImage,
  validatePublicImageFile,
} from "@/lib/uploads/public-image"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role as UserRole, "website.edit")) {
      return NextResponse.json({ error: "Sin permisos para editar el sitio web" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 })
    }

    const validationError = validatePublicImageFile(file)
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const folder = parsePublicImageFolder(formData.get("folder"))
    const url = await storePublicImage(file, folder)

    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error("[site/upload-image]", error)
    return NextResponse.json({ error: "Error al subir imagen" }, { status: 500 })
  }
}
