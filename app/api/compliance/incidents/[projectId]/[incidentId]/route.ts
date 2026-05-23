import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import { assertProjectComplianceAccess } from "@/lib/compliance/access"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; incidentId: string }> },
) {
  try {
    const user = await verifyAuth(request)
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { projectId, incidentId } = await params
    const access = await assertProjectComplianceAccess(user, projectId, true)
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

    if (!ObjectId.isValid(incidentId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const update: Record<string, unknown> = { updatedAt: new Date() }
    if (body.status === "cerrado") {
      update.status = "cerrado"
      update.closedAt = new Date()
    }
    if (typeof body.artManagementDetail === "string") update.artManagementDetail = body.artManagementDetail
    if (typeof body.careProvided === "string") update.careProvided = body.careProvided

    const db = await getDb()
    await db.collection("work_incidents").updateOne(
      { _id: new ObjectId(incidentId), projectId: new ObjectId(projectId) },
      { $set: update },
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; incidentId: string }> },
) {
  try {
    const user = await verifyAuth(request)
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { projectId, incidentId } = await params
    const access = await assertProjectComplianceAccess(user, projectId, true)
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

    const db = await getDb()
    await db.collection("work_incidents").deleteOne({
      _id: new ObjectId(incidentId),
      projectId: new ObjectId(projectId),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}
