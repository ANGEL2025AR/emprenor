import { NextResponse, type NextRequest } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { contactFormSchema, sanitizeHtml, type ContactFormData } from "@/lib/validations/schemas"
import { rateLimit } from "@/lib/rate-limiter"
import { notifyLeadReceived } from "@/lib/email/notify-lead"
import { storeLeadAttachment, validateLeadAttachment } from "@/lib/uploads/lead-attachment"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"

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
    const contentType = request.headers.get("content-type") || ""
    let raw: Record<string, unknown>
    let attachment: Awaited<ReturnType<typeof storeLeadAttachment>> | null = null

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData()
      const file = form.get("attachment")
      if (file instanceof File && file.size > 0) {
        const invalid = validateLeadAttachment(file)
        if (invalid) return NextResponse.json({ error: invalid }, { status: 400 })
        attachment = await storeLeadAttachment(file)
      }
      raw = {
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || ""),
        service: String(form.get("service") || ""),
        message: String(form.get("message") || ""),
        legalName: String(form.get("legalName") || ""),
        cuit: String(form.get("cuit") || ""),
        province: String(form.get("province") || ""),
        locality: String(form.get("locality") || ""),
        estimatedBudget: String(form.get("estimatedBudget") || ""),
        requiredDate: String(form.get("requiredDate") || ""),
        privacyConsent: form.get("privacyConsent") === "true",
      }
    } else {
      raw = await request.json()
    }

    const validation = contactFormSchema.safeParse(raw)

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
      legalName: data.legalName ? sanitizeHtml(data.legalName) : "",
      locality: data.locality ? sanitizeHtml(data.locality) : "",
    }

    const db = await getDb()
    const collection = db.collection("contactos")

    const contacto = {
      ...sanitizedData,
      attachment,
      createdAt: new Date(),
      status: "nuevo",
      source: "formulario_web",
      crm: { provider: null, externalId: null, syncStatus: "pending" },
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      referrer: request.headers.get("referer") || "direct",
    }

    const result = await collection.insertOne(contacto)

    void notifyLeadReceived({
      name: sanitizedData.name,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      service: sanitizedData.service,
      message: sanitizedData.message,
      source: "formulario_web",
      legalName: sanitizedData.legalName,
      cuit: sanitizedData.cuit,
      province: sanitizedData.province,
      locality: sanitizedData.locality,
      estimatedBudget: sanitizedData.estimatedBudget,
      requiredDate: sanitizedData.requiredDate,
      attachmentName: attachment?.originalName,
    })

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
  } catch (error) {
    console.error("[POST /api/contact]", error)
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
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const adminRoles = ["super_admin", "admin", "comercial"]
    if (!adminRoles.includes(user.role) && !hasPermission(user.role as UserRole, "contacts.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

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
