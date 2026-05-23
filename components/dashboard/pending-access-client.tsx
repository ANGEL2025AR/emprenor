"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, UserCheck, Mail, Phone, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DashboardPageHeader } from "@/components/dashboard/dashboard-ui"
import {
  getPublicClientTypeLabel,
  getRegistrationIntentLabel,
  type PublicClientType,
  type RegistrationIntent,
} from "@/lib/clients/public-registration-types"

type PendingRow = {
  _id: string
  email: string
  name: string
  lastName: string
  phone?: string
  publicClientType?: string
  registrationIntent?: string
  linkedClientId?: string
  createdAt: string
}

export function PendingAccessClient() {
  const { toast } = useToast()
  const [rows, setRows] = useState<PendingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [activatingId, setActivatingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/users/pending-registrations")
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al cargar")
      setRows(data.pending || [])
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "No se pudieron cargar las solicitudes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const activate = async (id: string) => {
    setActivatingId(id)
    try {
      const res = await fetch(`/api/users/${id}/activate`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error al activar")
      toast({
        title: "Cuenta activada",
        description: "El cliente ya puede ingresar con su email y contraseña.",
      })
      load()
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "No se pudo activar",
        variant: "destructive",
      })
    } finally {
      setActivatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        badge="Atención al cliente"
        title="Solicitudes de acceso"
        description="Registros públicos pendientes de aprobación. Un clic activa la cuenta y vincula al cliente con sus obras."
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay solicitudes pendientes. Las nuevas llegan desde{" "}
            <Link href="/registro" className="text-emerald-600 hover:underline">
              /registro
            </Link>
            .
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rows.map((row) => (
            <Card key={row._id}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">
                      {row.name} {row.lastName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{row.email}</p>
                  </div>
                  <Badge variant="destructive">Pendiente activación</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {row.publicClientType ? (
                    <Badge variant="secondary">
                      {getPublicClientTypeLabel(row.publicClientType as PublicClientType)}
                    </Badge>
                  ) : null}
                  {row.registrationIntent ? (
                    <Badge variant="outline">
                      {getRegistrationIntentLabel(row.registrationIntent as RegistrationIntent)}
                    </Badge>
                  ) : null}
                </div>
                {row.phone ? (
                  <p className="text-sm flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" /> {row.phone}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => activate(row._id)}
                    disabled={activatingId === row._id}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {activatingId === row._id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <UserCheck className="w-4 h-4 mr-2" />
                    )}
                    Activar acceso ahora
                  </Button>
                  {row.linkedClientId ? (
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/clientes/${row.linkedClientId}`}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver ficha cliente
                      </Link>
                    </Button>
                  ) : null}
                  <Button variant="ghost" asChild>
                    <a href={`mailto:${row.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
