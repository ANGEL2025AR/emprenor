import { createHash, randomBytes } from "crypto"
import { getDb } from "@/lib/db/connection"
import { hashPassword } from "@/lib/auth/password"
import { SITE_URL } from "@/lib/site-url"
import { EMPRENOR_LEGAL } from "@/lib/company/constants"

const TOKEN_TTL_MS = 60 * 60 * 1000

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export async function createPasswordReset(email: string): Promise<void> {
  const db = await getDb()
  const normalized = email.toLowerCase().trim()
  const user = await db.collection("users").findOne({ email: normalized, isActive: { $ne: false } })
  if (!user) return

  const token = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + TOKEN_TTL_MS)
  await db.collection("users").updateOne(
    { _id: user._id },
    { $set: { resetPasswordToken: hashToken(token), resetPasswordExpires: expires, updatedAt: new Date() } },
  )

  const link = `${SITE_URL}/restablecer?token=${token}`
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) return

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL?.trim() || "EMPRENOR <onboarding@resend.dev>",
      to: [normalized],
      subject: "Restablecer contraseña — EMPRENOR",
      text: `Recibimos un pedido para restablecer la contraseña de ${normalized}.\n\nEl enlace vence en una hora:\n${link}\n\nSi no lo pediste, ignorá este mensaje.\n\n${EMPRENOR_LEGAL.emailGeneral}`,
    }),
  })
}

export async function resetPasswordWithToken(token: string, password: string): Promise<boolean> {
  if (!token || token.length < 32) return false
  const db = await getDb()
  const user = await db.collection("users").findOne({
    resetPasswordToken: hashToken(token),
    resetPasswordExpires: { $gt: new Date() },
  })
  if (!user) return false

  await db.collection("users").updateOne(
    { _id: user._id },
    {
      $set: { password: hashPassword(password), updatedAt: new Date() },
      $unset: { resetPasswordToken: "", resetPasswordExpires: "" },
    },
  )
  return true
}
