import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import IncidentsClient from "@/components/incidents/incidents-client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function IncidenciasPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Incidencias y No Conformidades</h1>
          <p className="text-slate-600">Registra y gestiona problemas en obra</p>
        </div>
        <Link href="/dashboard/incidencias/nueva">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Incidencia
          </Button>
        </Link>
      </div>

      <IncidentsClient />
    </div>
  )
}
