import { Suspense } from "react"
import { requirePermission } from "@/lib/auth/require-permission"
import { InvoicesClient } from "@/components/invoices/invoices-client"

export const metadata = {
  title: "Facturas | EMPRENOR",
  description: "Gestión de facturas y comprobantes",
}

export default async function InvoicesPage() {
  await requirePermission("finance.view")

  return (
    <div className="flex-1 space-y-6 p-6 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Facturas</h2>
          <p className="text-muted-foreground mt-1">Gestiona facturas y comprobantes fiscales</p>
        </div>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <InvoicesClient />
      </Suspense>
    </div>
  )
}
