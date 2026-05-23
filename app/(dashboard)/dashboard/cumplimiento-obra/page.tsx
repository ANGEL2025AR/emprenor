import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { getDb } from "@/lib/db/connection"
import type { Project, UserRole } from "@/lib/db/models"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, FolderKanban } from "lucide-react"
import { formatClientComplianceBadge } from "@/lib/compliance/client-types"

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cumplimiento de obra — todas las obras</h1>
        <p className="text-muted-foreground">
          Vista EMPRENOR: municipios, FAO, empresas, consorcios y particulares. Activá el portal y cargá nómina/ART desde cada obra.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Portales activos</p>
            <p className="text-3xl font-bold">{withPortal.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pendientes de activar</p>
            <p className="text-3xl font-bold text-amber-600">{pending.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total obras</p>
            <p className="text-3xl font-bold">{projects.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            Obras
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {projects.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay proyectos.</p>
          ) : (
            projects.map((p) => (
              <div
                key={p._id?.toString()}
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
                <div className="flex gap-2 items-center">
                  <Badge variant={p.institutionalCompliance?.enabled ? "default" : "secondary"}>
                    {p.institutionalCompliance?.enabled ? "Portal ON" : "Portal OFF"}
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/proyectos/${p._id?.toString()}/cumplimiento-cliente`}>
                      <ClipboardList className="h-3 w-3 mr-1" />
                      Gestionar
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
