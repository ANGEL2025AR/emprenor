import { NextResponse } from "next/server"
import { destroySession } from "@/lib/auth/session"

export async function POST() {
  try {
    await destroySession()

    return NextResponse.json({
      success: true,
      message: "Sesión cerrada exitosamente",
    })
  } catch {
    return NextResponse.json({ error: "Error al cerrar sesión" }, { status: 500 })
  }
}
