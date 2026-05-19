import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"
import { ObjectId } from "mongodb"

export type ClientDetail = {
  _id: string
  name: string
  email: string
  phone: string
  address?: string
  company?: string
  cuit?: string
  taxCondition?: string
  notes?: string
  createdAt: string | Date
  stats: {
    projects: number
    totalInvoiced: number
  }
}

export async function getClientById(id: string): Promise<ClientDetail | null> {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user.role as UserRole, "clients.view")) {
    return null
  }

  if (!ObjectId.isValid(id)) {
    return null
  }

  const db = await getDb()
  const client = await db.collection("clients").findOne({ _id: new ObjectId(id) })
  if (!client) {
    return null
  }

  const projects = await db.collection("projects").countDocuments({
    $or: [{ "clientInfo.email": client.email }, { "client.email": client.email }],
  })

  const invoices = await db
    .collection("invoices")
    .find({
      $or: [{ clientEmail: client.email }, { clientId: client._id }],
    })
    .toArray()

  const totalInvoiced = invoices.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0)

  const fiscal = client.fiscalCondition ?? client.taxCondition

  return {
    _id: client._id.toString(),
    name: String(client.name ?? ""),
    email: String(client.email ?? ""),
    phone: String(client.phone ?? ""),
    address: client.address ? String(client.address) : undefined,
    company: client.company ? String(client.company) : undefined,
    cuit: client.cuit ? String(client.cuit) : undefined,
    taxCondition: fiscal ? String(fiscal) : undefined,
    notes: client.notes ? String(client.notes) : undefined,
    createdAt: client.createdAt ?? new Date(),
    stats: {
      projects,
      totalInvoiced,
    },
  }
}
