import { Suspense } from "react"
import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { QuotationsClient } from "@/components/quotations/quotations-client"

export const metadata = {
  title: "Cotizaciones | EMPRENOR",
  description: "Gestión de cotizaciones y presupuestos",
}

export default async function QuotationsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex-1 space-y-6 p-6 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cotizaciones</h2>
          <p className="text-muted-foreground mt-1">Gestiona presupuestos y cotizaciones de proyectos</p>
        </div>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <QuotationsClient />
      </Suspense>
    </div>
  )
}
