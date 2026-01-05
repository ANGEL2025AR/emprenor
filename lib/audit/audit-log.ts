import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"

export type AuditAction =
  | "CREATE"
  | "READ"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "LOGIN_FAILED"
  | "PASSWORD_CHANGE"
  | "PERMISSION_CHANGE"
  | "EXPORT"
  | "IMPORT"
  | "APPROVE"
  | "REJECT"
  | "ARCHIVE"

export type AuditEntityType =
  | "user"
  | "project"
  | "task"
  | "client"
  | "contract"
  | "invoice"
  | "payment"
  | "employee"
  | "document"
  | "certificate"
  | "inspection"
  | "quotation"
  | "incident"
  | "material"
  | "report"
  | "settings"
  | "session"

export interface AuditLogEntry {
  _id?: ObjectId
  timestamp: Date
  userId: ObjectId | null
  userEmail: string
  userName: string
  action: AuditAction
  entityType: AuditEntityType
  entityId: string | null
  entityName?: string
  previousData?: Record<string, unknown>
  newData?: Record<string, unknown>
  changes?: Array<{
    field: string
    oldValue: unknown
    newValue: unknown
  }>
  metadata: {
    ip: string
    userAgent: string
    sessionId?: string
    requestId?: string
    duration?: number
  }
  status: "success" | "failure"
  errorMessage?: string
  severity: "low" | "medium" | "high" | "critical"
}

export async function createAuditLog(entry: Omit<AuditLogEntry, "_id" | "timestamp">): Promise<void> {
  try {
    const db = await getDb()
    await db.collection("audit_logs").insertOne({
      ...entry,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error("Error creating audit log:", error)
  }
}

export async function logUserAction(
  userId: string | null,
  userEmail: string,
  userName: string,
  action: AuditAction,
  entityType: AuditEntityType,
  entityId: string | null,
  options: {
    entityName?: string
    previousData?: Record<string, unknown>
    newData?: Record<string, unknown>
    ip?: string
    userAgent?: string
    status?: "success" | "failure"
    errorMessage?: string
  } = {},
): Promise<void> {
  const changes = calculateChanges(options.previousData, options.newData)
  const severity = determineSeverity(action, entityType)

  await createAuditLog({
    userId: userId ? new ObjectId(userId) : null,
    userEmail,
    userName,
    action,
    entityType,
    entityId,
    entityName: options.entityName,
    previousData: options.previousData,
    newData: options.newData,
    changes,
    metadata: {
      ip: options.ip || "unknown",
      userAgent: options.userAgent || "unknown",
    },
    status: options.status || "success",
    errorMessage: options.errorMessage,
    severity,
  })
}

function calculateChanges(
  previousData?: Record<string, unknown>,
  newData?: Record<string, unknown>,
): Array<{ field: string; oldValue: unknown; newValue: unknown }> | undefined {
  if (!previousData || !newData) return undefined

  const changes: Array<{ field: string; oldValue: unknown; newValue: unknown }> = []
  const allKeys = new Set([...Object.keys(previousData), ...Object.keys(newData)])

  for (const key of allKeys) {
    if (key === "password" || key === "updatedAt" || key === "_id") continue

    const oldVal = previousData[key]
    const newVal = newData[key]

    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes.push({
        field: key,
        oldValue: key.includes("password") ? "[REDACTED]" : oldVal,
        newValue: key.includes("password") ? "[REDACTED]" : newVal,
      })
    }
  }

  return changes.length > 0 ? changes : undefined
}

function determineSeverity(action: AuditAction, entityType: AuditEntityType): AuditLogEntry["severity"] {
  if (action === "LOGIN_FAILED" || action === "PERMISSION_CHANGE") return "high"
  if (action === "DELETE" && ["user", "project", "contract"].includes(entityType)) return "high"
  if (action === "PASSWORD_CHANGE") return "medium"
  if (action === "DELETE") return "medium"
  if (action === "UPDATE" && entityType === "settings") return "medium"
  return "low"
}

export async function getAuditLogs(filters: {
  userId?: string
  action?: AuditAction
  entityType?: AuditEntityType
  entityId?: string
  startDate?: Date
  endDate?: Date
  severity?: AuditLogEntry["severity"]
  limit?: number
  skip?: number
}): Promise<{ logs: AuditLogEntry[]; total: number }> {
  const db = await getDb()

  const query: Record<string, unknown> = {}

  if (filters.userId) query.userId = new ObjectId(filters.userId)
  if (filters.action) query.action = filters.action
  if (filters.entityType) query.entityType = filters.entityType
  if (filters.entityId) query.entityId = filters.entityId
  if (filters.severity) query.severity = filters.severity

  if (filters.startDate || filters.endDate) {
    query.timestamp = {}
    if (filters.startDate) (query.timestamp as Record<string, Date>).$gte = filters.startDate
    if (filters.endDate) (query.timestamp as Record<string, Date>).$lte = filters.endDate
  }

  const [logs, total] = await Promise.all([
    db
      .collection<AuditLogEntry>("audit_logs")
      .find(query)
      .sort({ timestamp: -1 })
      .skip(filters.skip || 0)
      .limit(filters.limit || 50)
      .toArray(),
    db.collection("audit_logs").countDocuments(query),
  ])

  return { logs, total }
}
