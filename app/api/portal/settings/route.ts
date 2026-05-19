import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { getPortalSettings } from "@/lib/portal/settings"
import { isPortalEmployeeRole } from "@/lib/auth/portal-roles"

/** Configuración pública del portal para empleados (módulos habilitados). */
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    if (!isPortalEmployeeRole(user.role)) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }
    const settings = await getPortalSettings()
    return NextResponse.json({ settings })
  } catch {
    return NextResponse.json({ error: "Error al cargar configuración" }, { status: 500 })
  }
}
