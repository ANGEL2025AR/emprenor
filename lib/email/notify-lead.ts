import { EMPRENOR_LEGAL } from "@/lib/company/constants"

export type LeadPayload = {
  name: string
  email: string
  phone?: string
  clientType?: string
  service?: string
  message: string
  source?: string
}

/** Notifica por email (Resend) y/o webhook si están configurados. */
export async function notifyLeadReceived(data: LeadPayload): Promise<void> {
  const tasks: Promise<void>[] = []
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const to = process.env.CONTACT_NOTIFY_EMAIL?.trim() || EMPRENOR_LEGAL.emailGeneral

  if (apiKey && to) {
    const text = [
      "Nuevo contacto — EMPRENOR",
      `Nombre: ${data.name}`,
      `Email: ${data.email}`,
      data.phone ? `Tel: ${data.phone}` : "",
      data.service ? `Servicio: ${data.service}` : "",
      "",
      data.message,
    ]
      .filter(Boolean)
      .join("\n")

    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL?.trim() || "EMPRENOR <onboarding@resend.dev>",
          to: [to],
          subject: `[EMPRENOR] Contacto: ${data.name}`,
          text,
          reply_to: data.email,
        }),
      }).then(async (res) => {
        if (!res.ok) {
          const body = await res.text().catch(() => "")
          console.error("[notifyLeadReceived] Resend error:", res.status, body)
        }
      }),
    )
  }

  const webhook = process.env.CONTACT_NOTIFY_WEBHOOK_URL?.trim()
  if (webhook) {
    tasks.push(
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "lead.created", ...data, at: new Date().toISOString() }),
      }).then(() => undefined),
    )
  }

  await Promise.allSettled(tasks)
}
