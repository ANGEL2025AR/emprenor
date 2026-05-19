import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import type { UserRole } from "@/lib/db/models"
import {
  canUploadDocumentType,
  canUploadOwnDocuments,
  canManageEmployeeDocuments,
} from "@/lib/employee-documents/access"
import { resolveEmployeeDocumentTarget } from "@/lib/employee-documents/resolve-target"
import {
  EMPLOYEE_DOCUMENT_LABELS,
  computeDocumentStatus,
  getDocumentCategory,
  type EmployeeDocumentType,
} from "@/lib/employee-documents/types"

const MAX_SIZE = 15 * 1024 * 1024
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const role = user.role as UserRole
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const type = (formData.get("type") as EmployeeDocumentType) || "otro_personal"
    const name = (formData.get("name") as string) || ""
    const description = (formData.get("description") as string) || ""
    const userId = formData.get("userId") as string | null
    const employeeId = formData.get("employeeId") as string | null
    const issuedAt = formData.get("issuedAt") as string | null
    const expiresAt = formData.get("expiresAt") as string | null

    if (!file) return NextResponse.json({ error: "Archivo requerido" }, { status: 400 })
    if (!EMPLOYEE_DOCUMENT_LABELS[type]) {
      return NextResponse.json({ error: "Tipo de documento inválido" }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "El archivo supera 15 MB" }, { status: 400 })
    }
    if (file.type && !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato no permitido. Use PDF, JPG, PNG, WebP o Word." },
        { status: 400 },
      )
    }

    const isOwn = !userId && !employeeId
    const targetUserId = userId || (isOwn ? user._id : null)

    if (isOwn && !canUploadOwnDocuments(role) && !canManageEmployeeDocuments(role)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    if (!isOwn && !canManageEmployeeDocuments(role) && !canUploadOwnDocuments(role)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    if (
      !canUploadDocumentType(role, type, {
        isOwnProfile: isOwn || targetUserId === user._id,
      })
    ) {
      return NextResponse.json({ error: "No puede subir este tipo de documento" }, { status: 403 })
    }

    const target = await resolveEmployeeDocumentTarget({
      userId: targetUserId,
      employeeId,
    })

    if (!target && !isOwn) {
      return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 })
    }

    const ownerKey = target?.userId?.toString() || target?.employeeId?.toString() || user._id
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const blob = await put(`employee-documents/${ownerKey}/${Date.now()}-${safeName}`, file, {
      access: "public",
    })

    const category = getDocumentCategory(type)
    const now = new Date()
    const doc = {
      userId: target?.userId,
      employeeId: target?.employeeId,
      type,
      category,
      name: name.trim() || EMPLOYEE_DOCUMENT_LABELS[type],
      description: description.trim(),
      fileUrl: blob.url,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      issuedAt: issuedAt ? new Date(issuedAt) : undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      status: computeDocumentStatus(expiresAt),
      uploadedBy: new ObjectId(user._id),
      source: canManageEmployeeDocuments(role) && !isOwn ? "admin" : "employee",
      createdAt: now,
      updatedAt: now,
    }

    if (!doc.userId && !doc.employeeId) {
      doc.userId = new ObjectId(user._id)
    }

    const db = await getDb()
    const result = await db.collection("employee_documents").insertOne(doc)

    return NextResponse.json(
      {
        success: true,
        document: {
          ...doc,
          _id: result.insertedId.toString(),
          userId: doc.userId?.toString(),
          employeeId: doc.employeeId?.toString(),
          uploadedBy: user._id,
          issuedAt: doc.issuedAt?.toISOString(),
          expiresAt: doc.expiresAt?.toISOString(),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[employee-documents/upload]", error)
    return NextResponse.json({ error: "Error al subir documento" }, { status: 500 })
  }
}
