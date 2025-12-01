import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import EmployeesClient from "@/components/employees/employees-client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function EmpleadosPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Empleados</h1>
          <p className="text-slate-600">Gestiona el personal de tu empresa constructora</p>
        </div>
        <Link href="/dashboard/empleados/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Empleado
          </Button>
        </Link>
      </div>

      <EmployeesClient />
    </div>
  )
}
