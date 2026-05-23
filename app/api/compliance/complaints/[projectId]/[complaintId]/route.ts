import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import { assertProjectComplianceAccess } from "@/lib/compliance/access"
import type { SiteComplaintStatus } from "@/lib/db/models"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; complaintId: string }> },
) {
  try {
    const user = await verifyAuth(request)
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { projectId, complaintId } = await params
    const access = await assertProjectComplianceAccess(user, projectId, true)
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

    const body = await request.json()
    const update: Record<string, unknown> = { updatedAt: new Date() }
    if (body.status) update.status = body.status as SiteComplaintStatus
    if (typeof body.response === "string") update.response = body.response
    if (body.status === "resuelta") update.resolvedAt = new Date()

    const db = await getDb()
    await db.collection("site_complaints").updateOne(
      { _id: new ObjectId(complaintId), projectId: new ObjectId(projectId) },
      { $set: update },
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}
