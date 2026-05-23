import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth/session"
import { getAllServicesAdmin } from "@/lib/site/get-services"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || !["super_admin", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    const services = await getAllServicesAdmin()
    return NextResponse.json({ services })
  } catch (error) {
    console.error("[site-services admin GET]", error)
    return NextResponse.json({ error: "Error al leer servicios" }, { status: 500 })
  }
}
