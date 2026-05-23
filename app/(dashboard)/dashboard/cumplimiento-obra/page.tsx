import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { getDb } from "@/lib/db/connection"
import type { Project, UserRole } from "@/lib/db/models"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, FolderKanban, AlertTriangle, Shield } from "lucide-react"
import { formatClientComplianceBadge } from "@/lib/compliance/client-types"
import { getComplianceOverviewForProjects } from "@/lib/compliance/overview"

export default async function AdminCumplimientoObraPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  if (!hasPermission(user.role as UserRole, "compliance.manage")) {
    redirect("/dashboard")
  }

  const db = await getDb()
  const projects = await db
    .collection<Project>("projects")
    .find({})
    .project({ name: 1, code: 1, status: 1, client: 1, institutionalCompliance: 1, clientId: 1 })
    .sort({ updatedAt: -1 })
    .limit(100)
    .toArray()

  const withPortal = projects.filter((p) => p.institutionalCompliance?.enabled)
  const pending = projects.filter((p) => p.clientId && !p.institutionalCompliance?.enabled)
  const overview = await getComplianceOverviewForProjects(withPortal as Project[])

  const avgScore =
    overview.length > 0
      ? Math.round(overview.reduce((s, o) => s + (o.score ?? 0), 0) / overview.length)
      : 0
  const critical = overview.filter((o) => (o.score ?? 100) < 70).length
  const openIssues = overview.reduce((s, o) => s + o.openIncidents + o.openComplaints, 0)

  const overviewById = new Map(overview.map((o) => [o.projectId, o]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Centro de cumplimiento — EMPRENOR</h1>
        <p className="text-muted-foreground">
          Vista ejecutiva para auditorías FAO, Estado, empresas y consorcios. Semáforo por obra y exportación de packs.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Portales activos</p>
            <p className="text-3xl font-bold">{withPortal.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pendientes activar</p>
            <p className="text-3xl font-bold text-amber-600">{pending.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Shield className="h-4 w-4" /> Cumplimiento promedio
            </p>
            <p className="text-3xl font-bold text-emerald-700">{avgScore}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Obras bajo 70%</p>
            <p className="text-3xl font-bold text-red-600">{critical}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" /> Incidentes / quejas abiertos
            </p>
            <p className="text-3xl font-bold">{openIssues}</p>
          </CardContent>
        </Card>
      </div>

      {overview.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Semáforo por obra (período actual)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {overview.map((o) => (
              <div key={o.projectId} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
                <div>
                  <p className="font-medium">{o.name}</p>
                  <p className="text-xs text-muted-foreground">{o.code}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={(o.score ?? 0) >= 85 ? "default" : (o.score ?? 0) >= 70 ? "secondary" : "destructive"}
                  >
                    {o.score ?? 0}%
                  </Badge>
                  {(o.openIncidents > 0 || o.openComplaints > 0) && (
                    <span className="text-xs text-amber-700">
                      {o.openIncidents} inc. · {o.openComplaints} quejas
                    </span>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/proyectos/${o.projectId}/cumplimiento-cliente`}>Gestionar</Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            Todas las obras
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {projects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay proyectos.</p>
          ) : (
            projects.map((p) => {
              const pid = p._id?.toString() ?? ""
              const ov = overviewById.get(pid)
              return (
                <div
                  key={pid}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.code} · {p.client?.name ?? "Sin cliente"}
                    </p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {formatClientComplianceBadge(
                        p.institutionalCompliance?.clientType,
                        p.institutionalCompliance?.clientOrganization ?? p.client?.name,
                      )}
                    </Badge>
                  </div>
                  <div className="flex gap-2 items-center flex-wrap">
                    {ov ? (
                      <Badge variant={(ov.score ?? 0) >= 70 ? "default" : "destructive"}>{ov.score}%</Badge>
                    ) : null}
                    <Badge variant={p.institutionalCompliance?.enabled ? "default" : "secondary"}>
                      {p.institutionalCompliance?.enabled ? "Portal ON" : "Portal OFF"}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/proyectos/${pid}/cumplimiento-cliente`}>
                        <ClipboardList className="h-3 w-3 mr-1" />
                        Gestionar
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
