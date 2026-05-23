"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { SiteService } from "@/lib/db/models"
import { Loader2, Pencil, Database } from "lucide-react"

export default function SitioWebServiciosPage() {
  const { toast } = useToast()
  const [services, setServices] = useState<SiteService[]>([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/site-services/admin", { credentials: "include" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al cargar")
      setServices(data.services || [])
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "No se pudieron cargar los servicios", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const seedAll = async () => {
    setSeeding(true)
    try {
      const res = await fetch("/api/site-services/seed?force=true", { method: "POST", credentials: "include" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al sincronizar")
      toast({
        title: "Sincronizado",
        description: `Servicios actualizados desde código (${data.inserted} de ${data.total})`,
      })
      await load()
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "No se pudo inicializar", variant: "destructive" })
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Servicios del sitio</h1>
          <p className="text-muted-foreground mt-1">
            Editá textos, imágenes, procesos y tipos de trabajo sin tocar código. Subí fotos reales de cada obra.
          </p>
        </div>
        <Button variant="outline" onClick={seedAll} disabled={seeding}>
          {seeding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
          Sincronizar desde código
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((s) => (
            <Card key={s.slug}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{s.title}</CardTitle>
                  <Badge variant={s.published ? "default" : "secondary"}>{s.published ? "Publicado" : "Borrador"}</Badge>
                </div>
                <CardDescription className="line-clamp-2">{s.shortDescription}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button asChild size="sm">
                  <Link href={`/dashboard/sitio-web/servicios/${s.slug}`}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/servicios/${s.slug}`} target="_blank">
                    Ver público
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
