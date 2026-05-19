import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import type { UserRole } from "@/lib/db/models"
import { canDeleteDocument } from "@/lib/employee-documents/access"

type RouteParams = { params: Promise<{ id: string }> }

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    const doc = await db.collection("employee_documents").findOne({ _id: new ObjectId(id) })
    if (!doc) return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 })

    const role = user.role as UserRole
    const docUserId = doc.userId?.toString()
    const isOwn = docUserId === user._id

    if (
      !canDeleteDocument(role, {
        isOwnProfile: isOwn,
        uploadedByUserId: doc.uploadedBy?.toString() || "",
        currentUserId: user._id,
        category: doc.category,
      })
    ) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    if (doc.fileUrl && typeof doc.fileUrl === "string" && doc.fileUrl.includes("blob.vercel-storage.com")) {
      try {
        await del(doc.fileUrl)
      } catch {
        // ignorar si el blob ya no existe
      }
    }

    await db.collection("employee_documents").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar documento" }, { status: 500 })
  }
}
