import { Suspense } from "react"
import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { PaymentsClient } from "@/components/payments/payments-client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata = {
  title: "Pagos | EMPRENOR",
  description: "Gestión de pagos y cobros",
}

export default async function PaymentsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex-1 space-y-6 p-6 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pagos</h2>
          <p className="text-muted-foreground mt-1">Gestiona pagos, cobros y transacciones</p>
        </div>
        <Link href="/dashboard/pagos/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Pago
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <PaymentsClient />
      </Suspense>
    </div>
  )
}
