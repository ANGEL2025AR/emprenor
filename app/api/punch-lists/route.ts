import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"
import { logActivity } from "@/lib/audit/audit-log"
import { hasPermission } from "@/lib/auth/permissions"
import { canAccessProjectId, withProjectScope } from "@/lib/auth/project-access"
import { serializePunchList } from "@/lib/punch-lists/serialize-punch-list"
import type { UserRole } from "@/lib/db/models"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role as UserRole, "quality.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const status = searchParams.get("status")

    const db = await getDb()
    const query: Record<string, unknown> = {}

    if (projectId) {
      if (!ObjectId.isValid(projectId)) {
        return NextResponse.json({ error: "Proyecto inválido" }, { status: 400 })
      }
      if (!(await canAccessProjectId(user, projectId))) {
        return NextResponse.json({ error: "Sin acceso al proyecto" }, { status: 403 })
      }
      query.projectId = new ObjectId(projectId)
    }

    if (status) {
      query.status = status
    }

    const scopedQuery = await withProjectScope(user, query)
    const punchLists = await db
      .collection("punch_lists")
      .find(scopedQuery)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()

    return NextResponse.json(punchLists.map((p) => serializePunchList(p as Record<string, unknown>)))
  } catch (error) {
    console.error("Error fetching punch lists:", error)
    return NextResponse.json({ error: "Error al obtener punch lists" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role as UserRole, "quality.create")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const projectId = String(body.projectId || "")
    const listName = String(body.listName || "").trim()

    if (!ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: "Proyecto inválido" }, { status: 400 })
    }

    if (!listName) {
      return NextResponse.json({ error: "El nombre de la lista es obligatorio" }, { status: 400 })
    }

    if (!(await canAccessProjectId(user, projectId))) {
      return NextResponse.json({ error: "Sin acceso al proyecto" }, { status: 403 })
    }

    const items = Array.isArray(body.items) ? body.items : []
    const db = await getDb()

    const year = new Date().getFullYear()
    const count = await db.collection("punch_lists").countDocuments({
      listNumber: { $regex: new RegExp(`^PL-${year}-`) },
    })
    const listNumber = `PL-${year}-${String(count + 1).padStart(4, "0")}`

    const punchList = {
      listNumber,
      listName,
      description: String(body.description || "").trim(),
      phase: String(body.phase || "").trim(),
      location: String(body.location || "").trim(),
      projectId: new ObjectId(projectId),
      createdBy: new ObjectId(user._id),
      status: "abierta",
      items,
      summary: {
        totalItems: items.length,
        openItems: items.length,
        inProgressItems: 0,
        resolvedItems: 0,
        closedItems: 0,
        criticalItems: items.filter((i: { priority?: string }) => i.priority === "critica").length,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("punch_lists").insertOne(punchList)

    await logActivity(
      user._id,
      "create",
      "punch_list",
      result.insertedId,
      null,
      punchList,
      request.headers.get("x-forwarded-for") || "unknown",
      request.headers.get("user-agent") || "unknown",
    )

    return NextResponse.json(serializePunchList({ ...punchList, _id: result.insertedId }))
  } catch (error) {
    console.error("Error creating punch list:", error)
    return NextResponse.json({ error: "Error al crear punch list" }, { status: 500 })
  }
}
