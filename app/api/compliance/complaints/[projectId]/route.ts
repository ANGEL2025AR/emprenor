import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import { assertProjectComplianceAccess, canManageCompliance } from "@/lib/compliance/access"
import type { SiteComplaint, SiteComplaintStatus } from "@/lib/db/models"

const STATUSES: SiteComplaintStatus[] = ["abierta", "en_gestion", "resuelta"]

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
    const complaints = await db.collection<SiteComplaint>("site_complaints")
      .find({ projectId: new ObjectId(projectId) })
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json({
      complaints: complaints.map((c) => ({
        ...c,
        _id: c._id?.toString(),
        projectId: c.projectId.toString(),
      })),
      canManage: canManageCompliance(user.role),
    })
  } catch {
    return NextResponse.json({ error: "Error al cargar quejas" }, { status: 500 })
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
    if (!body.description) {
      return NextResponse.json({ error: "Descripción requerida" }, { status: 400 })
    }

    const now = new Date()
    const complaint: Omit<SiteComplaint, "_id"> = {
      projectId: new ObjectId(projectId),
      date: body.date ? new Date(body.date) : now,
      source: String(body.source ?? "Comunidad / obra"),
      description: String(body.description),
      status: "abierta",
      createdBy: new ObjectId(user.userId),
      createdAt: now,
      updatedAt: now,
    }

    const db = await getDb()
    const result = await db.collection<SiteComplaint>("site_complaints").insertOne(complaint)

    return NextResponse.json({ success: true, complaint: { ...complaint, _id: result.insertedId.toString() } })
  } catch {
    return NextResponse.json({ error: "Error al registrar queja" }, { status: 500 })
  }
}
