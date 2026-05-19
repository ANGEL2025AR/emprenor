import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import NewRfiForm from "@/components/rfis/new-rfi-form"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui"

export const metadata = {
  title: "Nuevo RFI | EMPRENOR",
  description: "Crear solicitud de información de proyecto",
}

export default async function NuevoRfiPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <>
      <DashboardPageHeader
        badge="RFI"
        title="Nueva solicitud de información"
        description="Documenta consultas técnicas que requieren respuesta formal del proyecto."
      />
      <Suspense fallback={<div className="text-slate-600">Cargando formulario...</div>}>
        <NewRfiForm />
      </Suspense>
    </>
  )
}
