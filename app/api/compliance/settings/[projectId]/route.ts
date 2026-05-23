import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import { findProjectForUser } from "@/lib/auth/project-access"
import { assertProjectComplianceAccess, canManageCompliance } from "@/lib/compliance/access"
import type { ProjectInstitutionalCompliance } from "@/lib/db/models"

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

    const project = await findProjectForUser(access.user, projectId)
    if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })

    return NextResponse.json({
      settings: project.institutionalCompliance ?? { enabled: false },
      canManage: canManageCompliance(user.role),
    })
  } catch {
    return NextResponse.json({ error: "Error al leer configuración" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const user = await verifyAuth(request)
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { projectId } = await params
    const access = await assertProjectComplianceAccess(user, projectId, true)
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

    const body = (await request.json()) as ProjectInstitutionalCompliance
    if (typeof body.enabled !== "boolean") {
      return NextResponse.json({ error: "Campo enabled requerido" }, { status: 400 })
    }

    const db = await getDb()
    await db.collection("projects").updateOne(
      { _id: new ObjectId(projectId) },
      {
        $set: {
          institutionalCompliance: body,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true, settings: body })
  } catch {
    return NextResponse.json({ error: "Error al guardar configuración" }, { status: 500 })
  }
}
