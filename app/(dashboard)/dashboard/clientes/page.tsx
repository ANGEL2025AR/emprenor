import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import ClientsClient from "@/components/clients/clients-client"

export default async function ClientesPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
        <p className="text-muted-foreground mt-1">Gestiona tu cartera de clientes y sus proyectos</p>
      </div>

      <ClientsClient />
    </div>
  )
}
