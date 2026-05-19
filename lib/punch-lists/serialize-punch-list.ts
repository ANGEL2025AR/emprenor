import { safeDate } from "@/lib/utils"

export function serializePunchList(doc: Record<string, unknown>) {
  return {
    _id: String(doc._id),
    projectId: doc.projectId ? String(doc.projectId) : "",
    listNumber: String(doc.listNumber || ""),
    listName: String(doc.listName || ""),
    description: String(doc.description || ""),
    phase: String(doc.phase || ""),
    location: String(doc.location || ""),
    status: String(doc.status || "abierta"),
    items: Array.isArray(doc.items) ? doc.items : [],
    summary: (doc.summary as Record<string, number>) || {
      totalItems: 0,
      openItems: 0,
      inProgressItems: 0,
      resolvedItems: 0,
      closedItems: 0,
      criticalItems: 0,
    },
    createdAt: safeDate(doc.createdAt as Date) || "",
    updatedAt: safeDate(doc.updatedAt as Date) || "",
  }
}
