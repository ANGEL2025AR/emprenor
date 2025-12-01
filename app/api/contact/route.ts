import { NextResponse, type NextRequest } from "next/server"
import { getDb } from "@/lib/db/connection"
import { contactFormSchema, sanitizeHtml, type ContactFormData } from "@/lib/validators"
import { rateLimit } from "@/lib/rate-limiter"

const limiter = rateLimit({ windowMs: 60000, maxRequests: 5 })

export async function POST(request: NextRequest) {
  const rateLimitResult = await limiter(request)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Demasiadas solicitudes. Por favor, espere un momento antes de intentar nuevamente.",
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(rateLimitResult.resetTime),
        },
      },
    )
  }

  try {
    const body = await request.json()

    const validation = contactFormSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: validation.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      )
    }

    const data: ContactFormData = validation.data

    const sanitizedData = {
      ...data,
      name: sanitizeHtml(data.name),
      message: sanitizeHtml(data.message),
    }

    const db = await getDb()
    const collection = db.collection("contactos")

    const contacto = {
      ...sanitizedData,
      createdAt: new Date(),
      status: "nuevo",
      source: "formulario_web",
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      referrer: request.headers.get("referer") || "direct",
    }

    const result = await collection.insertOne(contacto)

    return NextResponse.json(
      {
        success: true,
        message: "Mensaje enviado correctamente. Nos pondremos en contacto pronto.",
        id: result.insertedId,
      },
      {
        headers: {
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(rateLimitResult.resetTime),
        },
      },
    )
  } catch {
    // Error silencioso en producción - los errores se registran en Vercel logs
    return NextResponse.json(
      {
        error:
          "Error al procesar la solicitud. Por favor, intente nuevamente o contáctenos directamente por teléfono o WhatsApp.",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const db = await getDb()
    const collection = db.collection("contactos")

    const contactos = await collection.find({}).sort({ createdAt: -1 }).limit(100).toArray()

    return NextResponse.json({ contactos, total: contactos.length })
  } catch {
    // Error silencioso en producción - los errores se registran en Vercel logs
    return NextResponse.json(
      {
        error: "Error al conectar con la base de datos. Por favor, contacte al administrador del sistema.",
      },
      { status: 500 },
    )
  }
}
