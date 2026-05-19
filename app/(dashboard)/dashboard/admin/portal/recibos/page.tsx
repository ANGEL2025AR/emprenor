import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = { title: "Recibos de sueldo (admin) | EMPRENOR" }

export default function AdminPortalRecibosPage() {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/admin/portal">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al portal empleados
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Recibos de sueldo</h1>
        <p className="text-slate-600">Gestione recibos desde el legajo de cada empleado</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" /> Publicación de recibos
          </CardTitle>
          <CardDescription>
            Los recibos se cargan por empleado en la ficha de personal. Asegúrese de que el módulo esté habilitado en
            configuración.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/empleados">
              <Users className="w-4 h-4 mr-2" /> Ir a empleados
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
