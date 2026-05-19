import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import type { UserRole } from "@/lib/db/models"
import {
  canManageEmployeeDocuments,
  canUploadOwnDocuments,
  canViewEmployeeDocuments,
} from "@/lib/employee-documents/access"
import { resolveEmployeeDocumentTarget } from "@/lib/employee-documents/resolve-target"
import { computeDocumentStatus, type EmployeeDocumentType } from "@/lib/employee-documents/types"

function serializeDoc(doc: Record<string, unknown>) {
  return {
    ...doc,
    _id: doc._id instanceof ObjectId ? doc._id.toString() : doc._id,
    userId: doc.userId instanceof ObjectId ? doc.userId.toString() : doc.userId,
    employeeId: doc.employeeId instanceof ObjectId ? doc.employeeId.toString() : doc.employeeId,
    uploadedBy: doc.uploadedBy instanceof ObjectId ? doc.uploadedBy.toString() : doc.uploadedBy,
    issuedAt: doc.issuedAt ? new Date(doc.issuedAt as string).toISOString() : undefined,
    expiresAt: doc.expiresAt ? new Date(doc.expiresAt as string).toISOString() : undefined,
    createdAt: new Date(doc.createdAt as string).toISOString(),
    updatedAt: new Date(doc.updatedAt as string).toISOString(),
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const role = user.role as UserRole
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const employeeId = searchParams.get("employeeId")

    const isOwn = !userId && !employeeId
    const targetUserId = userId || (isOwn ? user._id : null)

    if (isOwn) {
      if (!canUploadOwnDocuments(role) && !canManageEmployeeDocuments(role)) {
        return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
      }
    } else if (!canViewEmployeeDocuments(role)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const target = await resolveEmployeeDocumentTarget({
      userId: targetUserId,
      employeeId,
    })

    if (!target && !isOwn) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 })
    }

    const filter: Record<string, unknown> = {}
    if (target?.userId && target?.employeeId) {
      filter.$or = [{ userId: target.userId }, { employeeId: target.employeeId }]
    } else if (target?.userId) {
      filter.userId = target.userId
    } else if (target?.employeeId) {
      filter.employeeId = target.employeeId
    } else {
      filter.userId = new ObjectId(user._id)
    }

    const db = await getDb()
    const docs = await db
      .collection("employee_documents")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      documents: docs.map((d) =>
        serializeDoc({
          ...d,
          status: computeDocumentStatus(d.expiresAt as Date | undefined),
        }),
      ),
    })
  } catch {
    return NextResponse.json({ error: "Error al listar documentos" }, { status: 500 })
  }
}
