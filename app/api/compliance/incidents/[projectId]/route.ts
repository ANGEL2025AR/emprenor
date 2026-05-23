import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import { assertProjectComplianceAccess, canManageCompliance } from "@/lib/compliance/access"
import type { WorkIncident } from "@/lib/db/models"

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
    const incidents = await db.collection<WorkIncident>("work_incidents")
      .find({ projectId: new ObjectId(projectId) })
      .sort({ occurredAt: -1 })
      .toArray()

    return NextResponse.json({
      incidents: incidents.map((i) => ({
        ...i,
        _id: i._id?.toString(),
        projectId: i.projectId.toString(),
      })),
      canManage: canManageCompliance(user.role),
    })
  } catch {
    return NextResponse.json({ error: "Error al cargar incidentes" }, { status: 500 })
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
    if (!body.cuilOrDni || !body.workerName || !body.description) {
      return NextResponse.json({ error: "Campos obligatorios incompletos" }, { status: 400 })
    }

    const now = new Date()
    const incident: Omit<WorkIncident, "_id"> = {
      projectId: new ObjectId(projectId),
      cuilOrDni: String(body.cuilOrDni),
      workerName: String(body.workerName),
      description: String(body.description),
      careProvided: String(body.careProvided ?? ""),
      artManagementDetail: String(body.artManagementDetail ?? ""),
      attachments: Array.isArray(body.attachments) ? body.attachments : [],
      occurredAt: body.occurredAt ? new Date(body.occurredAt) : now,
      reportedBy: new ObjectId(user.userId),
      status: "abierto",
      createdAt: now,
      updatedAt: now,
    }

    const db = await getDb()
    const result = await db.collection<WorkIncident>("work_incidents").insertOne(incident)

    return NextResponse.json({ success: true, incident: { ...incident, _id: result.insertedId.toString() } })
  } catch {
    return NextResponse.json({ error: "Error al registrar incidente" }, { status: 500 })
  }
}
