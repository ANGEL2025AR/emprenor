import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"

// GET - Obtener configuración
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()
    const settings = await db.collection("settings").findOne({ type: "company" })

    return NextResponse.json({
      settings: settings || {
        companyName: "EMPRENOR Construcciones",
        cuit: "",
        email: "info@emprenor.com",
        phone: "+54 9 11 2758-6521",
        address: "Salta Capital, Argentina",
        notifications: {
          email: true,
          push: false,
          taskAssigned: true,
          projectUpdates: true,
          paymentAlerts: true,
        },
      },
    })
  } catch (error) {
    console.error("Error al obtener configuración:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// PUT - Actualizar configuración
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo admin puede modificar configuración
    if (user.role !== "admin" && user.role !== "super_admin") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const data = await request.json()
    const db = await getDb()

    await db.collection("settings").updateOne(
      { type: "company" },
      {
        $set: {
          ...data,
          type: "company",
          updatedAt: new Date(),
          updatedBy: user._id,
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ success: true, message: "Configuración guardada" })
  } catch (error) {
    console.error("Error al guardar configuración:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
