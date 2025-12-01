import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import AutomationsClient from "@/components/automations/automations-client"

export default async function AutomacionesPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Automatizaciones</h1>
        <p className="text-muted-foreground mt-1">
          Configura flujos automáticos para presupuestos, recordatorios y notificaciones
        </p>
      </div>

      <AutomationsClient />
    </div>
  )
}
