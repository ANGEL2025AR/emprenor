import Link from "next/link"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import type { SerializableUser } from "@/lib/auth/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Wallet,
  FileText,
  FolderOpen,
  CalendarDays,
  ShieldCheck,
  Headphones,
  Megaphone,
  CreditCard,
  ListTodo,
  FolderKanban,
  ArrowRight,
} from "lucide-react"

const PORTAL_LINKS = [
  { label: "Billetera virtual", href: "/dashboard/portal/billetera", icon: Wallet, color: "bg-emerald-500" },
  { label: "Recibos de sueldo", href: "/dashboard/portal/recibos", icon: FileText, color: "bg-blue-500" },
  { label: "Mi legajo y documentación", href: "/dashboard/portal/legajo", icon: FolderOpen, color: "bg-amber-500" },
  { label: "Solicitudes (licencias)", href: "/dashboard/portal/solicitudes", icon: CalendarDays, color: "bg-violet-500" },
  { label: "ART / Seguridad", href: "/dashboard/portal/art", icon: ShieldCheck, color: "bg-rose-500" },
  { label: "Mesa de ayuda", href: "/dashboard/portal/mesa-ayuda", icon: Headphones, color: "bg-cyan-500" },
  { label: "Comunicaciones", href: "/dashboard/portal/comunicaciones", icon: Megaphone, color: "bg-orange-500" },
  { label: "Adelantos", href: "/dashboard/portal/billetera", icon: CreditCard, color: "bg-teal-500" },
]

interface EmployeeDashboardProps {
  user: SerializableUser
}

export async function EmployeeDashboard({ user }: EmployeeDashboardProps) {
  const db = await getDb()
  const userObjectId = new ObjectId(user._id)

  const [docCount, assignedTasks, assignedProjects] = await Promise.all([
    db.collection("employee_documents").countDocuments({ userId: userObjectId }),
    db.collection("tasks").countDocuments({
      assignedTo: userObjectId,
      status: { $in: ["pendiente", "en_progreso"] },
    }),
    db.collection("projects").countDocuments({
      $or: [
        { "team.managerId": userObjectId },
        { "team.supervisorId": userObjectId },
        { "team.workers": userObjectId },
      ],
    }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mi espacio de trabajo</h1>
        <p className="text-slate-600 mt-1">
          Hola {user.name}, gestioná tu legajo, recibos, tareas y documentación desde un solo lugar.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <FolderOpen className="w-4 h-4" /> Legajo digital
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{docCount}</p>
            <p className="text-xs text-slate-500 mb-3">Documentos cargados</p>
            <Button size="sm" asChild>
              <Link href="/dashboard/portal/legajo">Gestionar legajo</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <ListTodo className="w-4 h-4" /> Tareas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{assignedTasks}</p>
            <p className="text-xs text-slate-500 mb-3">Pendientes o en curso</p>
            <Button size="sm" variant="outline" asChild>
              <Link href="/dashboard/tareas">Ver tareas</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <FolderKanban className="w-4 h-4" /> Obras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{assignedProjects}</p>
            <p className="text-xs text-slate-500 mb-3">Proyectos asignados</p>
            <Button size="sm" variant="outline" asChild>
              <Link href="/dashboard/proyectos">Ver proyectos</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Wallet className="w-4 h-4" /> Portal RRHH
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-3">Recibos, ART, solicitudes y más</p>
            <Button size="sm" asChild>
              <Link href="/dashboard/portal">
                Abrir portal
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accesos rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PORTAL_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 p-4 rounded-xl border hover:bg-slate-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-sm text-slate-800">{item.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
