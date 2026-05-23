import { getDb } from "@/lib/db/connection"

/** Índices recomendados para colecciones de cumplimiento institucional. */
export async function ensureComplianceIndexes(): Promise<void> {
  const db = await getDb()
  await Promise.all([
    db.collection("workforce_rosters").createIndex({ projectId: 1, period: 1 }, { unique: true }),
    db.collection("compliance_documents").createIndex({ projectId: 1, category: 1 }),
    db.collection("work_incidents").createIndex({ projectId: 1, occurredAt: -1 }),
    db.collection("local_purchases").createIndex({ projectId: 1, date: -1 }),
    db.collection("site_complaints").createIndex({ projectId: 1, date: -1 }),
  ])
}
