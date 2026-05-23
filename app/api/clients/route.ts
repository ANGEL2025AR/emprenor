import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { projectsFilterForClient } from "@/lib/clients/project-queries"
import { adminCreateClientSchema } from "@/lib/validations/schemas"
import {
  ClientCreateError,
  createClientWithOptionalPortal,
} from "@/lib/clients/create-client-with-portal"

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

    const body = await request.json()
    const parsed = adminCreateClientSchema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Datos inválidos"
      return NextResponse.json({ error: firstError, details: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data
    const db = await getDb()

    const result = await createClientWithOptionalPortal(
      db,
      {
        contactName: data.contactName,
        contactLastName: data.contactLastName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        address: data.address,
        city: data.city,
        province: data.province,
        cuit: data.cuit,
        taxCondition: data.taxCondition,
        publicClientType: data.publicClientType,
        status: data.status,
        notes: data.notes,
      },
      {
        enabled: data.portalAccess.enabled,
        password: data.portalAccess.password,
        isActive: data.portalAccess.isActive,
      },
      ObjectId.isValid(user._id) ? new ObjectId(user._id) : undefined,
    )

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof ClientCreateError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("Error creating client:", error)
    return NextResponse.json({ error: "Error al crear cliente" }, { status: 500 })
  }
}
