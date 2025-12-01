import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import CalendarClient from "@/components/calendar/calendar-client"

export default async function CalendarioPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Calendario de Proyectos</h1>
        <p className="text-slate-600">Visualiza fechas importantes, hitos y eventos del proyecto</p>
      </div>

      <CalendarClient />
    </div>
  )
}
