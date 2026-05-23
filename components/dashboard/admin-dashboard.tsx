import Link from "next/link"
import { getDb } from "@/lib/db/connection"
import { CardContent, CardHeader } from "@/components/ui/card"
import {
  DashboardPageHeader,
  DashboardStatCard,
  DashboardPanel,
  DashboardSectionTitle,
  DashboardPrimaryButton,
} from "@/components/dashboard/dashboard-ui"
import { FolderKanban, Users, Inbox, Globe, Plus, ArrowRight } from "lucide-react"

async function getAdminOverview() {
  try {
    const db = await getDb()
    const [projects, activeProjects, clients, pendingContacts] = await Promise.all([
      db.collection("projects").countDocuments(),
      db.collection("projects").countDocuments({ status: "en_progreso" }),
      db.collection("clients").countDocuments(),
      db.collection("contactos").countDocuments({ status: { $in: ["nuevo", "pendiente", "en_proceso"] } }),
    ])
    return { projects, activeProjects, clients, pendingContacts }
  } catch {
    return { projects: 0, activeProjects: 0, clients: 0, pendingContacts: 0 }
  }
}

export async function AdminDashboard({ userName }: { userName: string }) {
  const stats = await getAdminOverview()

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        badge="Administración EMPRENOR"
        title="Panel de gestión"
        description={`Hola ${userName}. Desde aquí administrás obras, clientes, consultas del sitio y el contenido público.`}
        actions={
          <DashboardPrimaryButton asChild>
            <Link href="/dashboard/proyectos/nuevo">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo proyecto
            </Link>
          </DashboardPrimaryButton>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardStatCard
          title="Proyectos"
          value={stats.projects}
          subtitle={`${stats.activeProjects} en progreso`}
          icon={FolderKanban}
          accent="blue"
          href="/dashboard/proyectos"
        />
        <DashboardStatCard
          title="Clientes"
          value={stats.clients}
          subtitle="Fichas y accesos al portal"
          icon={Users}
          accent="emerald"
          href="/dashboard/clientes"
        />
        <DashboardStatCard
          title="Consultas pendientes"
          value={stats.pendingContacts}
          subtitle="Formulario web y contacto"
          icon={Inbox}
          accent={stats.pendingContacts > 0 ? "amber" : "violet"}
          href="/dashboard/contactos"
        />
        <DashboardStatCard
          title="Sitio web"
          value="CMS"
          subtitle="Portadas, servicios y obras públicas"
          icon={Globe}
          accent="cyan"
          href="/dashboard/sitio-web/servicios"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardPanel>
          <CardHeader>
            <DashboardSectionTitle title="Operación" icon={FolderKanban} />
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/dashboard/proyectos"
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium">Gestionar proyectos y obras</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/dashboard/clientes/nuevo"
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium">Alta de cliente con acceso al portal</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </DashboardPanel>

        <DashboardPanel>
          <CardHeader>
            <DashboardSectionTitle title="Web y atención" icon={Inbox} />
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/dashboard/contactos"
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium">Consultas y mensajes del sitio</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/dashboard/sitio-web/paginas"
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium">Editar portadas y servicios públicos</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </DashboardPanel>
      </div>
    </div>
  )
}
