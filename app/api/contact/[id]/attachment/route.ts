import { readFile, access } from "fs/promises"
import path from "path"
import { NextResponse, type NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user.role as UserRole, "contacts.view")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const { id } = await params
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Contacto inválido" }, { status: 400 })

  const db = await getDb()
  const contact = await db.collection("contactos").findOne({ _id: new ObjectId(id) })
  const storedName = contact?.attachment?.storedName
  if (typeof storedName !== "string" || !/^[\w.-]+$/.test(storedName)) {
    return NextResponse.json({ error: "Sin archivo" }, { status: 404 })
  }

  const filePath = path.join(process.cwd(), "storage", "leads", storedName)
  try {
    await access(filePath)
  } catch {
    return NextResponse.json({ error: "Archivo no disponible" }, { status: 404 })
  }

  const bytes = await readFile(filePath)
  const mime = typeof contact?.attachment?.mime === "string" ? contact.attachment.mime : "application/octet-stream"
  const original = typeof contact?.attachment?.originalName === "string" ? contact.attachment.originalName : storedName

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `attachment; filename="${original.replace(/"/g, "")}"`,
    },
  })
}
