import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { hashPassword } from "@/lib/auth/password"
import { registerSchema } from "@/lib/validations/schemas"
import { rateLimit } from "@/lib/rate-limiter"
import { isPublicRegistrationAllowed } from "@/lib/env"
import type { User } from "@/lib/db/models"
import { buildPublicClientRecord, buildRegistrationContactMessage } from "@/lib/clients/create-public-client"
import { getPublicClientTypeLabel, getRegistrationIntentLabel } from "@/lib/clients/public-registration-types"

const registerRateLimit = rateLimit({ windowMs: 60000 * 60, maxRequests: 5 })

export async function POST(request: NextRequest) {
  try {
    if (!isPublicRegistrationAllowed()) {
      return NextResponse.json(
        {
          error:
            "El registro público no está habilitado. Solicita acceso a un administrador de EMPRENOR.",
        },
        { status: 403 },
      )
    }

    const rateLimitResult = await registerRateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Demasiados intentos de registro. Intenta de nuevo más tarde." },
        { status: 429 },
      )
    }

    const body = await request.json()

    const result = registerSchema.safeParse(body)
    if (!result.success) {
      const firstError = result.error.errors[0]?.message ?? "Datos inválidos"
      return NextResponse.json({ error: firstError, details: result.error.flatten() }, { status: 400 })
    }

    const data = result.data
    const email = data.email.toLowerCase()

    const db = await getDb()

    const [existingUser, existingClient] = await Promise.all([
      db.collection("users").findOne({ email }),
      db.collection("clients").findOne({ email }),
    ])

    if (existingUser) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 })
    }

    if (existingClient) {
      return NextResponse.json(
        { error: "Ya existe una ficha de cliente con este email. Contacte a EMPRENOR para activar su acceso." },
        { status: 409 },
      )
    }

    const hashedPassword = hashPassword(data.password)
    const now = new Date()

    const newUser: Omit<User, "_id"> & { linkedClientId?: ObjectId; publicClientType?: string; registrationIntent?: string } = {
      email,
      password: hashedPassword,
      name: data.name,
      lastName: data.lastName,
      phone: data.phone,
      role: "cliente",
      permissions: [],
      isActive: false,
      emailVerified: false,
      publicClientType: data.publicClientType,
      registrationIntent: data.registrationIntent,
      createdAt: now,
      updatedAt: now,
    }

    const userResult = await db.collection("users").insertOne(newUser)
    const userId = userResult.insertedId

    const clientRecord = buildPublicClientRecord(data, userId)
    const clientResult = await db.collection("clients").insertOne(clientRecord)

    await db.collection("users").updateOne(
      { _id: userId },
      { $set: { linkedClientId: clientResult.insertedId, updatedAt: new Date() } },
    )

    const contactMessage = buildRegistrationContactMessage(data)
    await db.collection("contactos").insertOne({
      name: `${data.name} ${data.lastName}`.trim(),
      email,
      phone: data.phone,
      service: "otro",
      message: contactMessage,
      status: "nuevo",
      source: "registro_publico",
      publicClientType: data.publicClientType,
      clientTypeLabel: getPublicClientTypeLabel(data.publicClientType),
      registrationIntent: data.registrationIntent,
      registrationIntentLabel: getRegistrationIntentLabel(data.registrationIntent),
      clientId: clientResult.insertedId,
      userId,
      createdAt: now,
    })

    return NextResponse.json(
      {
        success: true,
        message:
          "Solicitud registrada. Un administrador revisará su cuenta y le avisará cuando pueda ingresar.",
        pendingApproval: true,
        clientType: data.publicClientType,
        registrationIntent: data.registrationIntent,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error en registro público:", error)
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 })
  }
}
