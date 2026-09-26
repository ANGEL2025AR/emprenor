import { NextResponse, type NextRequest } from "next/server"
import { resetPasswordSchema } from "@/lib/validations/schemas"
import { rateLimit } from "@/lib/rate-limiter"
import { resetPasswordWithToken } from "@/lib/auth/password-reset"

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 8 })

export async function POST(request: NextRequest) {
  const limit = await limiter(request)
  if (!limit.success) {
    return NextResponse.json({ error: "Demasiados intentos. Esperá unos minutos." }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  const parsed = resetPasswordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || "Datos inválidos" },
      { status: 400 },
    )
  }

  const ok = await resetPasswordWithToken(parsed.data.token, parsed.data.password)
  if (!ok) {
    return NextResponse.json({ error: "El enlace venció o no es válido. Pedí uno nuevo." }, { status: 400 })
  }

  return NextResponse.json({ success: true, message: "Contraseña actualizada. Ya podés ingresar." })
}
