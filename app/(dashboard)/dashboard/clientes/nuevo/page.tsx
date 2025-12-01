import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import NewClientForm from "@/components/clients/new-client-form"

export default async function NewClientPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Nuevo Cliente</h1>
        <p className="text-muted-foreground mt-1">Registra un nuevo cliente en el sistema</p>
      </div>

      <NewClientForm />
    </div>
  )
}
