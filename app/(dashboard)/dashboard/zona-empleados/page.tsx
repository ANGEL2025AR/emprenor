import { Construction } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui"

export default function ZonaEmpleadosPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <DashboardPageHeader
        badge="En desarrollo"
        title="Zona empleados"
        description="El portal de personal (recibos, legajo, solicitudes, ART) se publicará en un espacio aparte, sin mezclarlo con la administración de obras y el sitio web."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-6 w-6 text-amber-600" />
            Próximamente
          </CardTitle>
          <CardDescription>
            Mientras tanto, la gestión operativa (proyectos, clientes, consultas web y CMS) está disponible solo para
            administradores. Si necesitás acceso urgente, contactá al equipo de EMPRENOR.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Esta separación evita un menú sobrecargado y permite desarrollar la experiencia de empleados con foco en RRHH y
          obra en campo.
        </CardContent>
      </Card>
    </div>
  )
}
