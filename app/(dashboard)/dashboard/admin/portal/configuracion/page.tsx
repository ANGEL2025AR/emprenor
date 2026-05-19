import { PortalSettingsForm } from "@/components/portal/admin/portal-settings-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = { title: "Configuración portal empleados | EMPRENOR" }

export default function AdminPortalConfigPage() {
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/admin/portal">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al portal empleados
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración del portal</h1>
        <p className="text-slate-600">Habilite módulos y reglas de adelantos para el personal</p>
      </div>
      <PortalSettingsForm />
    </div>
  )
}
