import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Wallet,
  FileText,
  FolderOpen,
  CalendarDays,
  ShieldAlert,
  Headphones,
  Megaphone,
  Settings,
  ArrowRight,
  Users,
} from "lucide-react"

const ADMIN_MODULES = [
  {
    title: "Billetera y adelantos",
    description: "Aprobar adelantos de sueldo y revisar movimientos",
    href: "/dashboard/admin/portal/billetera",
    icon: Wallet,
    color: "from-emerald-500 to-teal-600",
  },
  {
    title: "Recibos de sueldo",
    description: "Gestionar recibos publicados para empleados",
    href: "/dashboard/admin/portal/recibos",
    icon: FileText,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Legajo digital",
    description: "Documentación de personal y cumplimiento",
    href: "/dashboard/admin/portal/legajo",
    icon: FolderOpen,
    color: "from-amber-500 to-orange-600",
  },
  {
    title: "Solicitudes de licencia",
    description: "Aprobar vacaciones, permisos y licencias",
    href: "/dashboard/admin/portal/solicitudes",
    icon: CalendarDays,
    color: "from-violet-500 to-purple-600",
  },
  {
    title: "ART / Seguridad",
    description: "Reportes e incidentes de seguridad laboral",
    href: "/dashboard/admin/portal/art",
    icon: ShieldAlert,
    color: "from-rose-500 to-red-600",
  },
  {
    title: "Mesa de ayuda",
    description: "Tickets y consultas del personal",
    href: "/dashboard/admin/portal/mesa-ayuda",
    icon: Headphones,
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "Comunicaciones",
    description: "Anuncios y circulares internas",
    href: "/dashboard/admin/portal/comunicaciones",
    icon: Megaphone,
    color: "from-orange-500 to-amber-600",
  },
]

export const metadata = {
  title: "Administración Portal Empleados | EMPRENOR",
  description: "Gestión del portal de autogestión para empleados",
}

export default function AdminPortalHubPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-indigo-600 mb-1">Administración</p>
          <h1 className="text-3xl font-bold text-slate-900">Portal de Empleados</h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Desde aquí configura qué ven los trabajadores y gestiona solicitudes, adelantos, comunicados y
            más. No es la vista del empleado: es el panel de control para RR.HH. y administración.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/empleados">
              <Users className="w-4 h-4 mr-2" />
              Alta de empleados
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/admin/portal/configuracion">
              <Settings className="w-4 h-4 mr-2" />
              Configurar módulos
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {ADMIN_MODULES.map((mod) => (
          <Link key={mod.href} href={mod.href}>
            <Card className="h-full hover:shadow-lg transition-shadow border-slate-200/80">
              <CardHeader>
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center mb-2`}
                >
                  <mod.icon className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-lg">{mod.title}</CardTitle>
                <CardDescription>{mod.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-indigo-600 inline-flex items-center gap-1">
                  Administrar <ArrowRight className="w-4 h-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
