import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import NewClientForm from "@/components/clients/new-client-form"

export default async function NewClientPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Nuevo Cliente</h1>
        <p className="text-muted-foreground mt-1">
          Alta con tipo de cliente, datos de contacto y acceso al portal (usuario y contraseña) en un solo paso.
        </p>
      </div>

      <NewClientForm />
    </div>
  )
}
