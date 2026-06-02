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
import { FolderKanban, Plus, ArrowRight, AlertTriangle, Calendar } from "lucide-react"
import type { Project } from "@/lib/db/models"
import { SCHEDULE_STATUS_LABELS } from "@/lib/projects/project-manager"

async function getProjectManagerOverview() {
  try {
    const db = await getDb()
    const projects = await db
      .collection<Project>("projects")
      .find({})
      .sort({ updatedAt: -1 })
      .limit(8)
      .toArray()

    const [total, active, critical, overdueInstallments] = await Promise.all([
      db.collection("projects").countDocuments(),
      db.collection("projects").countDocuments({ status: "en_progreso" }),
      db.collection("projects").countDocuments({ scheduleStatus: "critico" }),
      db.collection("projects").countDocuments({
        "installments.status": "vencida",
      }),
    ])

    return { projects, total, active, critical, overdueInstallments }
  } catch {
    return { projects: [], total: 0, active: 0, critical: 0, overdueInstallments: 0 }
  }
}

const STATUS_LABELS: Record<string, string> = {
  borrador: "Borrador",
  aprobado: "Aprobado",
  en_progreso: "En progreso",
  pausado: "Pausado",
  completado: "Completado",
  cancelado: "Cancelado",
}

export async function AdminDashboard({
  userName,
  userRole = "admin",
}: {
  userName: string
  userRole?: string
}) {
  const stats = await getProjectManagerOverview()
  const isGerente = userRole === "gerente"

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        badge={isGerente ? "Gerencia de obra" : "Administración EMPRENOR C&S"}
        title={isGerente ? "Panel de gestión" : "Panel de administración"}
        description={`Hola ${userName}. Resumen de obras, alertas de cronograma y acceso rápido a proyectos, clientes y sitio web.`}
        actions={
          <DashboardPrimaryButton asChild>
            <Link href="/dashboard/proyectos/nuevo">
              <Plus className="w-4 h-4 mr-2" />
              Nueva obra
            </Link>
          </DashboardPrimaryButton>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardStatCard
          title="Obras"
          value={stats.total}
          subtitle={`${stats.active} en progreso`}
          icon={FolderKanban}
          accent="blue"
          href="/dashboard/proyectos"
        />
        <DashboardStatCard
          title="Cronograma crítico"
          value={stats.critical}
          subtitle="Obras con retraso severo"
          icon={AlertTriangle}
          accent={stats.critical > 0 ? "amber" : "emerald"}
          href="/dashboard/proyectos?status=en_progreso"
        />
        <DashboardStatCard
          title="Cuotas vencidas"
          value={stats.overdueInstallments}
          subtitle="En alguna obra activa"
          icon={Calendar}
          accent={stats.overdueInstallments > 0 ? "rose" : "violet"}
          href="/dashboard/proyectos"
        />
        <DashboardStatCard
          title="Ver todas"
          value="→"
          subtitle="Listado completo de proyectos"
          icon={FolderKanban}
          accent="cyan"
          href="/dashboard/proyectos"
        />
      </div>

      <DashboardPanel>
        <CardHeader>
          <DashboardSectionTitle title="Obras recientes" icon={FolderKanban} />
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.projects.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Creá tu primera obra para comenzar.</p>
          ) : (
            stats.projects.map((p) => (
              <Link
                key={p._id?.toString()}
                href={`/dashboard/proyectos/${p._id}`}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {p.code} · {STATUS_LABELS[p.status] || p.status} · {p.progress ?? 0}%
                    {p.scheduleStatus
                      ? ` · ${SCHEDULE_STATUS_LABELS[p.scheduleStatus] ?? p.scheduleStatus}`
                      : ""}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </Link>
            ))
          )}
          <Link
            href="/dashboard/proyectos"
            className="flex items-center justify-center rounded-lg border border-dashed p-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          >
            Ir al listado de proyectos
          </Link>
        </CardContent>
      </DashboardPanel>
    </div>
  )
}
