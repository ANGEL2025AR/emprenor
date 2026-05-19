import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"
import NewPunchListForm from "@/components/punch-lists/new-punch-list-form"

export const metadata = {
  title: "Nueva Punch List | EMPRENOR",
  description: "Crear lista de pendientes y defectos de obra",
}

export default async function NuevaPunchListPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  if (!hasPermission(user.role as UserRole, "quality.create")) {
    redirect("/dashboard/punch-lists")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Nueva Punch List</h1>
        <p className="text-slate-600">Registra pendientes, defectos y correcciones por proyecto</p>
      </div>
      <Suspense fallback={<div>Cargando formulario...</div>}>
        <NewPunchListForm />
      </Suspense>
    </div>
  )
}

