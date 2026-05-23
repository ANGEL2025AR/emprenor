import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { activatePortalUser } from "@/lib/users/activate-portal-user"

type RouteParams = { params: Promise<{ id: string }> }

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    if (!hasPermission(user.role, "users.edit")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { id } = await params
    const result = await activatePortalUser(id)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Cuenta activada. El cliente ya puede ingresar con su email y contraseña.",
    })
  } catch {
    return NextResponse.json({ error: "Error al activar cuenta" }, { status: 500 })
  }
}
