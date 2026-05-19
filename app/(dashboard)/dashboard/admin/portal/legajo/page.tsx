import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FolderOpen, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = { title: "Legajo digital (admin) | EMPRENOR" }

export default function AdminPortalLegajoPage() {
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/admin/portal">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al portal empleados
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Legajo digital</h1>
        <p className="text-slate-600">Documentación y cumplimiento del personal</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" /> Gestión de legajos
          </CardTitle>
          <CardDescription>
            Administre documentos de empleados desde Empleados → seleccionar persona → pestaña Legajo / documentos.
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
