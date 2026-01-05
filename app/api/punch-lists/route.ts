import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"
import { logActivity } from "@/lib/audit/audit-log"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const status = searchParams.get("status")

    const db = await getDb()
    const query: Record<string, unknown> = {}

    if (projectId) {
      query.projectId = new ObjectId(projectId)
    }

    if (status) {
      query.status = status
    }

    const punchLists = await db.collection("punch_lists").find(query).sort({ createdAt: -1 }).limit(100).toArray()

    return NextResponse.json(punchLists)
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

    const body = await request.json()
    const db = await getDb()

    // Generar número de punch list
    const count = await db.collection("punch_lists").countDocuments()
    const listNumber = `PL-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`

    const punchList = {
      ...body,
      listNumber,
      projectId: new ObjectId(body.projectId),
      createdBy: new ObjectId(user._id),
      status: "abierta",
      summary: {
        totalItems: body.items?.length || 0,
        openItems: body.items?.length || 0,
        inProgressItems: 0,
        resolvedItems: 0,
        closedItems: 0,
        criticalItems: body.items?.filter((i: { priority: string }) => i.priority === "critica").length || 0,
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

    return NextResponse.json({ _id: result.insertedId, ...punchList })
  } catch (error) {
    console.error("Error creating punch list:", error)
    return NextResponse.json({ error: "Error al crear punch list" }, { status: 500 })
  }
}
