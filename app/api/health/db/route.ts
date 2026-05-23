import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { testDatabaseConnection } from "@/lib/db/maintenance"

/**
 * GET /api/health/db — prueba de conexión MongoDB.
 * En producción, definir HEALTH_CHECK_SECRET y enviar header x-health-secret.
 */
export async function GET(request: Request) {
  const secret = process.env.HEALTH_CHECK_SECRET
  if (secret) {
    const provided = request.headers.get("x-health-secret")
    if (provided !== secret) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
  }

  if (!process.env.MONGODB_URI?.trim()) {
    return NextResponse.json(
      { ok: false, error: "MONGODB_URI no configurada" },
      { status: 503 },
    )
  }

  try {
    const db = await getDb()
    const health = await testDatabaseConnection(db)
    return NextResponse.json(health, { status: health.ok ? 200 : 503 })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      },
      { status: 503 },
    )
  }
}
