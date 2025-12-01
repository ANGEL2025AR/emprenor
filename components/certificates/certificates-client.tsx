"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Award, Search, Plus, CheckCircle2, Clock, XCircle } from "lucide-react"

interface Certificate {
  _id: string
  projectName: string
  certificateNumber: string
  type: string
  status: "aprobado" | "pendiente" | "rechazado"
  date: string
  amount?: number
}

export default function CertificatesClient() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadCertificates()
  }, [])

  const loadCertificates = async () => {
    try {
      const response = await fetch("/api/certificates")
      if (response.ok) {
        const data = await response.json()
        setCertificates(data.certificates || [])
      }
    } catch (error) {
      console.error("[v0] Error loading certificates:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.projectName?.toLowerCase().includes(search.toLowerCase()) ||
      cert.certificateNumber?.toLowerCase().includes(search.toLowerCase()),
  )

  const statusConfig = {
    aprobado: { icon: CheckCircle2, color: "bg-green-500", label: "Aprobado" },
    pendiente: { icon: Clock, color: "bg-amber-500", label: "Pendiente" },
    rechazado: { icon: XCircle, color: "bg-red-500", label: "Rechazado" },
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Certificados de Obra
          </CardTitle>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Certificado
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Buscar certificados..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-slate-600 text-center py-8">Cargando certificados...</p>
        ) : filteredCertificates.length === 0 ? (
          <p className="text-slate-600 text-center py-8">No se encontraron certificados</p>
        ) : (
          <div className="space-y-3">
            {filteredCertificates.map((cert) => {
              const StatusIcon = statusConfig[cert.status].icon
              return (
                <Card key={cert._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 ${statusConfig[cert.status].color} rounded-xl flex items-center justify-center`}
                        >
                          <StatusIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{cert.projectName}</h3>
                          <p className="text-sm text-slate-600">Certificado N° {cert.certificateNumber}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{cert.type}</Badge>
                            <Badge className={statusConfig[cert.status].color}>{statusConfig[cert.status].label}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {cert.amount && (
                          <p className="text-lg font-semibold text-slate-900">${cert.amount.toLocaleString("es-AR")}</p>
                        )}
                        <p className="text-sm text-slate-600">{new Date(cert.date).toLocaleDateString("es-AR")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
