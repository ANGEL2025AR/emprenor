import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "La nueva contraseña debe tener al menos 8 caracteres" }, { status: 400 })
    }

    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json({ error: "La contraseña debe contener al menos una mayúscula" }, { status: 400 })
    }

    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json({ error: "La contraseña debe contener al menos un número" }, { status: 400 })
    }

    const db = await getDb()
    const dbUser = await db.collection("users").findOne({ _id: new ObjectId(user._id) })

    if (!dbUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Verificar contraseña actual
    const isValid = await verifyPassword(currentPassword, dbUser.password)
    if (!isValid) {
      return NextResponse.json({ error: "La contraseña actual es incorrecta" }, { status: 400 })
    }

    // Hashear nueva contraseña
    const hashedPassword = await hashPassword(newPassword)

    // Actualizar contraseña
    await db.collection("users").updateOne(
      { _id: new ObjectId(user._id) },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true, message: "Contraseña actualizada correctamente" })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
