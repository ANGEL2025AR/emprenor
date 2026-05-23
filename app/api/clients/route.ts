import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { projectsFilterForClient } from "@/lib/clients/project-queries"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "clients.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const db = await getDb()
    const clients = await db.collection("clients").find({}).sort({ createdAt: -1 }).toArray()

    const clientsWithStats = await Promise.all(
      clients.map(async (client) => {
        const filter = projectsFilterForClient(client._id as ObjectId, String(client.email ?? ""))
        const projects = await db.collection("projects").countDocuments(filter)
        const invoices = await db
          .collection("invoices")
          .find({ $or: [{ clientId: client._id }, { clientEmail: client.email }] })
          .toArray()
        const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0)

        return {
          ...client,
          _id: client._id.toString(),
          projects,
          totalInvoiced,
        }
      }),
    )

    return NextResponse.json({ clients: clientsWithStats })
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ error: "Error al obtener clientes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "clients.create")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const data = await request.json()
    const db = await getDb()

    const client = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user._id,
    }

    const result = await db.collection("clients").insertOne(client)

    return NextResponse.json({
      client: { ...client, _id: result.insertedId.toString() },
    })
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json({ error: "Error al crear cliente" }, { status: 500 })
  }
}
