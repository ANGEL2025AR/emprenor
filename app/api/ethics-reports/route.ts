import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getDb } from "@/lib/db/connection"
import { rateLimit } from "@/lib/rate-limiter"
import { sanitizeHtml } from "@/lib/validations/schemas"

const limiter = rateLimit({ windowMs: 60000 * 15, maxRequests: 5 })

const schema = z.object({
  category: z.enum(["conducta", "corrupcion", "seguridad", "medioambiente", "otro"]),
  message: z.string().min(20).max(8000),
  anonymous: z.boolean(),
  name: z.string().max(120).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(40).optional(),
})

export async function POST(request: NextRequest) {
  const rate = await limiter(request)
  if (!rate.success) {
    return NextResponse.json({ error: "Demasiados intentos. Espere unos minutos." }, { status: 429 })
  }

  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    const { category, message, anonymous, name, email, phone } = parsed.data
    if (!anonymous && !email) {
      return NextResponse.json({ error: "Indique email o marque reporte anónimo" }, { status: 400 })
    }

    const db = await getDb()
    const ticket = `ETH-${Date.now().toString(36).toUpperCase()}`

    await db.collection("ethics_reports").insertOne({
      ticket,
      category,
      message: sanitizeHtml(message),
      anonymous,
      reporter: anonymous
        ? null
        : {
            name: name ? sanitizeHtml(name) : "",
            email: email || "",
            phone: phone ? sanitizeHtml(phone) : "",
          },
      status: "abierto",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true, ticket })
  } catch {
    return NextResponse.json({ error: "Error al registrar el reporte" }, { status: 500 })
  }
}
