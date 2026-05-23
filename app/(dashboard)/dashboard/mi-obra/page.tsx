import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import { getDb } from "@/lib/db/connection"
import { getClientProjectsFilter } from "@/lib/auth/project-access"
import type { Project } from "@/lib/db/models"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ClipboardList } from "lucide-react"

export default async function MiObraListPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const db = await getDb()
  const filter = await getClientProjectsFilter(user)
  const projects = await db
    .collection<Project>("projects")
    .find(filter)
    .sort({ updatedAt: -1 })
    .toArray()

  const withCompliance = projects.filter((p) => p.institutionalCompliance?.enabled)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Cumplimiento institucional</h1>
        <p className="text-muted-foreground">
          Nómina, ART, documentación social y ambiental exigida por clientes como FAO.
        </p>
      </div>

      {withCompliance.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay obras con portal de cumplimiento habilitado. EMPRENOR activará esta sección cuando corresponda.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {withCompliance.map((p) => (
            <Card key={p._id?.toString()}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  {p.name}
                </CardTitle>
                <Badge variant="secondary">{p.institutionalCompliance?.clientOrganization ?? "Cliente institucional"}</Badge>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href={`/dashboard/mi-obra/${p._id?.toString()}`}>
                    Ver cumplimiento
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
