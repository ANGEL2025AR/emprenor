import type { ObjectId } from "mongodb"

export type SerializedRFI = {
  _id: string
  projectId: string
  rfiNumber: string
  subject: string
  description: string
  discipline: string
  requestedBy: string
  requestedDate: string
  requiredResponseDate: string
  priority: string
  location: string
  status: string
  cost: { hasImpact: boolean; estimatedCost?: number; justification?: string }
  schedule: { hasImpact: boolean; impact?: string; daysImpacted?: number; justification?: string }
  drawingReferences: unknown[]
  specificationReferences: unknown[]
  response?: {
    respondedBy: string
    respondedDate: string
    responseText: string
    recommendation: string
    drawingsRequired: boolean
  } | null
  comments: { userId: string; comment: string; date: string }[]
  attachments: unknown[]
  createdAt: string
  updatedAt: string
}

function oid(value: unknown): string {
  if (!value) return ""
  if (typeof value === "string") return value
  return (value as ObjectId).toString()
}

function date(value: unknown): string {
  if (!value) return ""
  return new Date(value as string | Date).toISOString()
}

export function serializeRFI(doc: Record<string, unknown>): SerializedRFI {
  const response = doc.response as Record<string, unknown> | undefined

  return {
    _id: oid(doc._id),
    projectId: oid(doc.projectId),
    rfiNumber: String(doc.rfiNumber || ""),
    subject: String(doc.subject || ""),
    description: String(doc.description || doc.question || ""),
    discipline: String(doc.discipline || "otro"),
    requestedBy: oid(doc.requestedBy),
    requestedDate: date(doc.requestedDate),
    requiredResponseDate: date(doc.requiredResponseDate || doc.requiredBy),
    priority: String(doc.priority || "normal"),
    location: String(doc.location || ""),
    status: String(doc.status || "abierto"),
    cost: (doc.cost as SerializedRFI["cost"]) || { hasImpact: false },
    schedule: (doc.schedule as SerializedRFI["schedule"]) || { hasImpact: false },
    drawingReferences: (doc.drawingReferences as unknown[]) || [],
    specificationReferences: (doc.specificationReferences as unknown[]) || [],
    response: response
      ? {
          respondedBy: oid(response.respondedBy),
          respondedDate: date(response.respondedDate),
          responseText: String(response.responseText || response.text || ""),
          recommendation: String(response.recommendation || ""),
          drawingsRequired: Boolean(response.drawingsRequired),
        }
      : null,
    comments: Array.isArray(doc.comments)
      ? (doc.comments as Record<string, unknown>[]).map((c) => ({
          userId: oid(c.userId),
          comment: String(c.comment || ""),
          date: date(c.date),
        }))
      : [],
    attachments: (doc.attachments as unknown[]) || [],
    createdAt: date(doc.createdAt),
    updatedAt: date(doc.updatedAt),
  }
}
