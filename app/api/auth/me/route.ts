import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { getUserPermissions } from "@/lib/auth/permissions"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const permissions = getUserPermissions(user.role)

    return NextResponse.json({
      user,
      permissions,
    })
  } catch {
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}
