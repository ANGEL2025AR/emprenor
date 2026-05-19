import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { ObjectId } from "mongodb"
import { canAccessCertificateId, isClientRole } from "@/lib/auth/project-access"

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!hasPermission(user.role, "certificates.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    if (!(await canAccessCertificateId(user, id))) {
      return NextResponse.json({ error: "Sin acceso a este certificado" }, { status: 403 })
    }

    const db = await getDb()
    const certificate = await db.collection("certificates").findOne({ _id: new ObjectId(id) })

    if (!certificate) {
      return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error("[API] Error getting certificate:", error)
    return NextResponse.json({ error: "Error al obtener certificado" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (isClientRole(user.role) || !hasPermission(user.role, "certificates.edit")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    if (!(await canAccessCertificateId(user, id))) {
      return NextResponse.json({ error: "Sin acceso a este certificado" }, { status: 403 })
    }

    const data = await request.json()
    const db = await getDb()

    const allowedFields = ["projectName", "certificateNumber", "type", "status", "amount", "notes", "date"]
    const sanitized: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (data[key] !== undefined) sanitized[key] = data[key]
    }
    sanitized.updatedAt = new Date()

    const result = await db.collection("certificates").updateOne(
      { _id: new ObjectId(id) },
      { $set: sanitized },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error updating certificate:", error)
    return NextResponse.json({ error: "Error al actualizar certificado" }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (isClientRole(user.role) || !hasPermission(user.role, "certificates.edit")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    if (!(await canAccessCertificateId(user, id))) {
      return NextResponse.json({ error: "Sin acceso a este certificado" }, { status: 403 })
    }

    const db = await getDb()
    const result = await db.collection("certificates").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Certificado no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error deleting certificate:", error)
    return NextResponse.json({ error: "Error al eliminar certificado" }, { status: 500 })
  }
}
