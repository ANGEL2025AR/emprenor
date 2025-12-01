"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Calendar, MessageSquare, RefreshCw, Database } from 'lucide-react'
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Contacto {
  _id: string
  name: string
  email: string
  phone: string
  service: string
  message: string
  createdAt: string
  status: string
  source: string
}

export default function AdminContactosPage() {
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContactos = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/contact", {
        headers: {
          // Authorization header removido temporalmente
        }
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al cargar contactos")
      }
      const data = await response.json()
      setContactos(data.contactos)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContactos()
  }, [])

  const getServiceLabel = (service: string) => {
    const labels: Record<string, string> = {
      construccion: "Construcción",
      remodelacion: "Remodelación",
      albanileria: "Albañilería",
      electricidad: "Electricidad",
      plomeria: "Plomería",
      pintura: "Pintura",
      gas: "Instalaciones de Gas",
      prefabricadas: "Viviendas Prefabricadas",
      industriales: "Obras Industriales",
      otro: "Otro",
    }
    return labels[service] || service
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      nuevo: "bg-blue-100 text-blue-800",
      en_proceso: "bg-yellow-100 text-yellow-800",
      completado: "bg-green-100 text-green-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      nuevo: "Nuevo",
      en_proceso: "En Proceso",
      completado: "Completado",
    }
    return labels[status] || status
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
              <p className="text-primary-foreground/80">Mensajes de contacto recibidos</p>
            </div>
            <Button onClick={fetchContactos} variant="secondary" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 md:px-6">
          {loading && (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Cargando contactos...</p>
            </div>
          )}

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-900">Error de Conexión</h3>
                    <p className="text-sm text-red-700">{error}</p>
                    <p className="text-xs text-red-600 mt-2">
                      Verifica que la variable de entorno MONGODB_URI esté configurada correctamente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && !error && contactos.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No hay contactos aún</h3>
                <p className="text-muted-foreground">
                  Los mensajes del formulario aparecerán aquí cuando sean recibidos.
                </p>
              </CardContent>
            </Card>
          )}

          {!loading && !error && contactos.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Mostrando {contactos.length} contacto{contactos.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="grid gap-6">
                {contactos.map((contacto) => (
                  <Card key={contacto._id} className="border-border hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{contacto.name}</CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="outline" className={getStatusColor(contacto.status)}>
                              {getStatusLabel(contacto.status)}
                            </Badge>
                            <Badge variant="outline">{getServiceLabel(contacto.service)}</Badge>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(contacto.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                          </div>
                          <div className="text-xs mt-1">
                            {format(new Date(contacto.createdAt), "HH:mm", { locale: es })}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${contacto.email}`} className="text-sm hover:text-primary transition-colors">
                            {contacto.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${contacto.phone}`} className="text-sm hover:text-primary transition-colors">
                            {contacto.phone}
                          </a>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Mensaje:</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{contacto.message}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(`https://wa.me/${contacto.phone.replace(/[^0-9]/g, "")}`, "_blank")
                          }
                        >
                          WhatsApp
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => (window.location.href = `mailto:${contacto.email}`)}
                        >
                          Enviar Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
