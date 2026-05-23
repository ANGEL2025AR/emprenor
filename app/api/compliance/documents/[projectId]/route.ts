import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import { assertProjectComplianceAccess, canManageCompliance } from "@/lib/compliance/access"
import type { ComplianceDocument, ComplianceDocumentCategory } from "@/lib/db/models"

const CATEGORIES: ComplianceDocumentCategory[] = [
  "art_policy",
  "employee_insurance",
  "code_of_conduct",
  "patrimony_training",
  "indigenous_guidelines",
  "gender_commitment",
  "other",
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const user = await verifyAuth(request)
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { projectId } = await params
    const access = await assertProjectComplianceAccess(user, projectId)
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

    const db = await getDb()
    const docs = await db.collection<ComplianceDocument>("compliance_documents")
      .find({ projectId: new ObjectId(projectId) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      documents: docs.map((d) => ({
        ...d,
        _id: d._id?.toString(),
        projectId: d.projectId.toString(),
      })),
      canManage: canManageCompliance(user.role),
    })
  } catch {
    return NextResponse.json({ error: "Error al cargar documentos" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const user = await verifyAuth(request)
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { projectId } = await params
    const access = await assertProjectComplianceAccess(user, projectId, true)
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

    const body = await request.json()
    const category = body.category as ComplianceDocumentCategory
    if (!CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Categoría inválida" }, { status: 400 })
    }
    if (!body.title || !body.fileUrl || !body.fileName) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    const now = new Date()
    const doc: Omit<ComplianceDocument, "_id"> = {
      projectId: new ObjectId(projectId),
      category,
      title: String(body.title),
      fileUrl: String(body.fileUrl),
      fileName: String(body.fileName),
      mimeType: body.mimeType ? String(body.mimeType) : undefined,
      fileSize: typeof body.fileSize === "number" ? body.fileSize : undefined,
      validFrom: body.validFrom ? new Date(body.validFrom) : undefined,
      validUntil: body.validUntil ? new Date(body.validUntil) : undefined,
      notes: body.notes ? String(body.notes) : undefined,
      uploadedBy: new ObjectId(user.userId),
      createdAt: now,
      updatedAt: now,
    }

    const db = await getDb()
    const result = await db.collection<ComplianceDocument>("compliance_documents").insertOne(doc)

    return NextResponse.json({
      success: true,
      document: { ...doc, _id: result.insertedId.toString(), projectId },
    })
  } catch {
    return NextResponse.json({ error: "Error al guardar documento" }, { status: 500 })
  }
}
