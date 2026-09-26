import { NextResponse, type NextRequest } from "next/server"
import { forgotPasswordSchema } from "@/lib/validations/schemas"
import { rateLimit } from "@/lib/rate-limiter"
import { createPasswordReset } from "@/lib/auth/password-reset"

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 })

export async function POST(request: NextRequest) {
  const limit = await limiter(request)
  if (!limit.success) {
    return NextResponse.json({ error: "Demasiados intentos. Esperá unos minutos." }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  const parsed = forgotPasswordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Ingresá un email válido." }, { status: 400 })
  }

  try {
    await createPasswordReset(parsed.data.email)
  } catch (error) {
    console.error("[forgot-password]", error)
  }

  return NextResponse.json({
    success: true,
    message: "Si el correo está registrado, vas a recibir un enlace para restablecer la contraseña.",
  })
}
