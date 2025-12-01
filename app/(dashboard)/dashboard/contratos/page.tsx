import { Suspense } from "react"
import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { ContractsClient } from "@/components/contracts/contracts-client"

export const metadata = {
  title: "Contratos | EMPRENOR",
  description: "Gestión de contratos de obra",
}

export default async function ContractsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex-1 space-y-6 p-6 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contratos</h2>
          <p className="text-muted-foreground mt-1">Gestiona contratos y acuerdos con clientes</p>
        </div>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <ContractsClient />
      </Suspense>
    </div>
  )
}
