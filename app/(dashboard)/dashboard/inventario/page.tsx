import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import InventoryClient from "@/components/inventory/inventory-client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function InventarioPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventario de Materiales</h1>
          <p className="text-slate-600">Gestiona el stock de materiales y equipos</p>
        </div>
        <Link href="/dashboard/inventario/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Artículo
          </Button>
        </Link>
      </div>

      <InventoryClient />
    </div>
  )
}
