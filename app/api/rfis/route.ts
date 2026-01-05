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

    const rfis = await db.collection("rfis").find(query).sort({ requestedDate: -1 }).limit(100).toArray()

    return NextResponse.json(rfis)
  } catch (error) {
    console.error("Error fetching RFIs:", error)
    return NextResponse.json({ error: "Error al obtener RFIs" }, { status: 500 })
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

    // Generar número de RFI
    const count = await db.collection("rfis").countDocuments()
    const rfiNumber = `RFI-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`

    const rfi = {
      ...body,
      rfiNumber,
      projectId: new ObjectId(body.projectId),
      requestedBy: new ObjectId(user._id),
      requestedDate: new Date(),
      status: "abierto",
      comments: [],
      attachments: body.attachments || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("rfis").insertOne(rfi)

    await logActivity(
      user._id,
      "create",
      "rfi",
      result.insertedId,
      null,
      rfi,
      request.headers.get("x-forwarded-for") || "unknown",
      request.headers.get("user-agent") || "unknown",
    )

    return NextResponse.json({ _id: result.insertedId, ...rfi })
  } catch (error) {
    console.error("Error creating RFI:", error)
    return NextResponse.json({ error: "Error al crear RFI" }, { status: 500 })
  }
}
