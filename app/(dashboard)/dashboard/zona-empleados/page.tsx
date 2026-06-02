import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardPageHeader, DashboardPrimaryButton } from "@/components/dashboard/dashboard-ui"
import { FolderKanban, Wallet, HardHat, ArrowRight } from "lucide-react"

export default function ZonaEmpleadosPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <DashboardPageHeader
        badge="Personal de obra"
        title="Zona empleados"
        description="Acceso rápido a tus proyectos asignados, portal de nómina y herramientas de campo."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="dashboard-panel border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HardHat className="h-5 w-5 text-emerald-600" />
              Proyectos asignados
            </CardTitle>
            <CardDescription>Obras donde participás: avance, documentos y cumplimiento.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/proyectos">
                Ver mis proyectos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="dashboard-panel border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="h-5 w-5 text-emerald-600" />
              Mi Portal
            </CardTitle>
            <CardDescription>Recibos, legajo, ART, solicitudes y comunicaciones internas.</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardPrimaryButton asChild className="w-full">
              <Link href="/dashboard/portal">
                Abrir Mi Portal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </DashboardPrimaryButton>
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-panel border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FolderKanban className="h-5 w-5 text-slate-600" />
            Próximas funciones
          </CardTitle>
          <CardDescription>Módulos de campo en evolución, integrados al mismo panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Parte diario de obra desde mobile</li>
            <li>Consulta de documentos de obra en sitio</li>
            <li>Indicadores de ART y seguridad en tiempo real</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
