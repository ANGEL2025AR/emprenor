import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import SuppliersClient from "@/components/suppliers/suppliers-client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function ProveedoresPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Proveedores</h1>
          <p className="text-slate-600">Gestiona información de proveedores y contratistas</p>
        </div>
        <Link href="/dashboard/proveedores/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proveedor
          </Button>
        </Link>
      </div>

      <SuppliersClient />
    </div>
  )
}
