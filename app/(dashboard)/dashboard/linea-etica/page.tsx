import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { getDb } from "@/lib/db/connection"
import type { UserRole } from "@/lib/db/models"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, ExternalLink } from "lucide-react"

const CATEGORY_LABELS: Record<string, string> = {
  conducta: "Conducta ética",
  corrupcion: "Corrupción",
  seguridad: "SST",
  medioambiente: "Medio ambiente",
  otro: "Otro",
}

export default async function LineaEticaAdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  if (!hasPermission(user.role as UserRole, "admin.access")) {
    redirect("/dashboard")
  }

  const db = await getDb()
  const reports = await db
    .collection("ethics_reports")
    .find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray()

  const open = reports.filter((r) => r.status === "abierto").length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-7 w-7 text-emerald-600" />
            Línea de ética — gestión
          </h1>
          <p className="text-muted-foreground">
            Reportes confidenciales recibidos desde la web pública. {open} abiertos.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/linea-etica" target="_blank">
            Ver canal público <ExternalLink className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reportes recientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {reports.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay reportes registrados.</p>
          ) : (
            reports.map((r) => (
              <div key={String(r._id)} className="rounded-lg border p-4 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{r.ticket}</Badge>
                  <Badge>{CATEGORY_LABELS[r.category] || r.category}</Badge>
                  <Badge variant={r.status === "abierto" ? "destructive" : "secondary"}>{r.status}</Badge>
                  {r.anonymous ? <Badge variant="secondary">Anónimo</Badge> : null}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(r.createdAt).toLocaleString("es-AR")}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{r.message}</p>
                {!r.anonymous && r.reporter ? (
                  <p className="text-xs text-muted-foreground">
                    Contacto: {r.reporter.name || "—"} · {r.reporter.email || "—"}
                  </p>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
