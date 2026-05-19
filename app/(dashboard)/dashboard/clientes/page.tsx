import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import ClientsClient from "@/components/clients/clients-client"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui"

export default async function ClientesPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <>
      <DashboardPageHeader
        badge="Comercial"
        title="Clientes"
        description="Gestiona tu cartera de clientes y sus proyectos vinculados."
      />
      <ClientsClient />
    </>
  )
}
