import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import { assertProjectComplianceAccess } from "@/lib/compliance/access"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; docId: string }> },
) {
  try {
    const user = await verifyAuth(request)
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { projectId, docId } = await params
    const access = await assertProjectComplianceAccess(user, projectId, true)
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

    if (!ObjectId.isValid(docId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    await db.collection("compliance_documents").deleteOne({
      _id: new ObjectId(docId),
      projectId: new ObjectId(projectId),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}
