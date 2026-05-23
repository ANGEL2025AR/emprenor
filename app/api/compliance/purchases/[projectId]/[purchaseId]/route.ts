import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import { assertProjectComplianceAccess } from "@/lib/compliance/access"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; purchaseId: string }> },
) {
  try {
    const user = await verifyAuth(request)
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { projectId, purchaseId } = await params
    const access = await assertProjectComplianceAccess(user, projectId, true)
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

    const db = await getDb()
    await db.collection("local_purchases").deleteOne({
      _id: new ObjectId(purchaseId),
      projectId: new ObjectId(projectId),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}
