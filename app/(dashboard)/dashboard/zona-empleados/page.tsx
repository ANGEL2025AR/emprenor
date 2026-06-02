import { Construction } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui"
import { STAFF_ZONE_FUTURE_MODULES } from "@/lib/platform/active-routes"

const MODULE_LABELS: Record<(typeof STAFF_ZONE_FUTURE_MODULES)[number], string> = {
  obra_asignada: "Obras asignadas en campo",
  parte_diario_campo: "Parte diario de obra",
  art_basico: "ART y seguridad básica",
  documentos_obra_lectura: "Documentos de obra (solo lectura)",
}

export default function ZonaEmpleadosPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <DashboardPageHeader
        badge="Próximamente"
        title="Zona empleados"
        description="Espacio separado del panel de administración. Misma base de datos, carpeta dedicada en el proyecto, sin mezclar con la web pública ni la gestión de clientes."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-6 w-6 text-amber-600" />
            En desarrollo
          </CardTitle>
          <CardDescription>
            Mientras tanto, la operación diaria (proyectos, clientes, consultas y sitio web) está en el panel de
            administración. Los clientes acceden por su portal de obras.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>Módulos planificados para empleados (sin sobrecargar el menú admin):</p>
          <ul className="list-disc pl-5 space-y-1">
            {STAFF_ZONE_FUTURE_MODULES.map((key) => (
              <li key={key}>{MODULE_LABELS[key]}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
