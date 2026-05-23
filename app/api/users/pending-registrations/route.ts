import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { listPendingRegistrations } from "@/lib/users/activate-portal-user"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    if (!hasPermission(user.role, "users.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const pending = await listPendingRegistrations()
    return NextResponse.json({ pending, total: pending.length })
  } catch {
    return NextResponse.json({ error: "Error al listar solicitudes" }, { status: 500 })
  }
}
