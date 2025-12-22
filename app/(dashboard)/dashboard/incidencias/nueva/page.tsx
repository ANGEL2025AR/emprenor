import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import NewIncidentForm from "@/components/incidents/new-incident-form"

export const metadata = {
  title: "Nueva Incidencia | EMPRENOR",
  description: "Reportar nueva incidencia o problema en el proyecto",
}

export default async function NuevaIncidenciaPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reportar Nueva Incidencia</h1>
        <p className="text-slate-600">Documenta problemas, accidentes o situaciones que requieran atención</p>
      </div>

      <Suspense fallback={<div>Cargando formulario...</div>}>
        <NewIncidentForm />
      </Suspense>
    </div>
  )
}
