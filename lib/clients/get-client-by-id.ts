import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import type { Project, UserRole } from "@/lib/db/models"
import { ObjectId } from "mongodb"
import { projectsFilterForClient } from "@/lib/clients/project-queries"
import { resolveClientRecordComplianceType, type ClientRecord } from "@/lib/clients/compliance-sync"
import { getClientComplianceLabel } from "@/lib/compliance/client-types"
import type { ClientComplianceType } from "@/lib/db/models"

export type ClientLinkedProject = {
  _id: string
  name: string
  code: string
  status: string
  complianceEnabled: boolean
  clientType?: ClientComplianceType
}

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
  complianceType: ClientComplianceType
  complianceLabel: string
  createdAt: string | Date
  linkedProjects: ClientLinkedProject[]
  portalUsers: { _id: string; name: string; email: string; isActive: boolean }[]
  stats: {
    projects: number
    totalInvoiced: number
    complianceActive: number
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
  const oid = new ObjectId(id)
  const client = await db.collection("clients").findOne({ _id: oid })
  if (!client) {
    return null
  }

  const email = String(client.email ?? "")
  const filter = projectsFilterForClient(oid, email)

  const [projectRows, invoices, portalUsers] = await Promise.all([
    db
      .collection<Project>("projects")
      .find(filter)
      .project({ name: 1, code: 1, status: 1, institutionalCompliance: 1 })
      .sort({ updatedAt: -1 })
      .limit(24)
      .toArray(),
    db
      .collection("invoices")
      .find({ $or: [{ clientEmail: email }, { clientId: oid }] })
      .toArray(),
    db
      .collection("users")
      .find({
        role: "cliente",
        $or: [
          { linkedClientId: oid },
          { email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
        ],
      })
      .project({ name: 1, lastName: 1, email: 1, isActive: 1 })
      .toArray(),
  ])

  const linkedProjects: ClientLinkedProject[] = projectRows.map((p) => ({
    _id: p._id!.toString(),
    name: p.name,
    code: p.code,
    status: p.status,
    complianceEnabled: !!p.institutionalCompliance?.enabled,
    clientType: p.institutionalCompliance?.clientType,
  }))

  const totalInvoiced = invoices.reduce((sum, inv) => sum + (Number(inv.total) || 0), 0)
  const fiscal = client.fiscalCondition ?? client.taxCondition
  const complianceType = resolveClientRecordComplianceType(client as ClientRecord)

  return {
    _id: client._id.toString(),
    name: String(client.name ?? ""),
    email,
    phone: String(client.phone ?? ""),
    address: client.address ? String(client.address) : undefined,
    company: client.company ? String(client.company) : undefined,
    cuit: client.cuit ? String(client.cuit) : undefined,
    taxCondition: fiscal ? String(fiscal) : undefined,
    notes: client.notes ? String(client.notes) : undefined,
    complianceType,
    complianceLabel: getClientComplianceLabel(complianceType),
    createdAt: client.createdAt ?? new Date(),
    linkedProjects,
    portalUsers: portalUsers.map((u) => ({
      _id: u._id.toString(),
      name: [u.name, u.lastName].filter(Boolean).join(" ").trim() || u.email,
      email: u.email,
      isActive: u.isActive !== false,
    })),
    stats: {
      projects: linkedProjects.length,
      totalInvoiced,
      complianceActive: linkedProjects.filter((p) => p.complianceEnabled).length,
    },
  }
}
