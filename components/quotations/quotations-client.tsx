"use client"

import { useState, useEffect } from "react"
import { Plus, Search, FileText, CheckCircle, XCircle, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Quotation } from "@/lib/db/models"

const statusConfig = {
  borrador: { label: "Borrador", color: "bg-gray-100 text-gray-800", icon: FileText },
  enviada: { label: "Enviada", color: "bg-blue-100 text-blue-800", icon: Send },
  aprobada: { label: "Aprobada", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rechazada: { label: "Rechazada", color: "bg-red-100 text-red-800", icon: XCircle },
  expirada: { label: "Expirada", color: "bg-orange-100 text-orange-800", icon: Clock },
}

type SerializableQuotation = Omit<
  Quotation,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "validUntil"
  | "approvedAt"
  | "createdBy"
  | "clientId"
  | "approvedBy"
  | "convertedToContractId"
> & {
  _id: string
  createdAt: string
  updatedAt: string
  validUntil: string
  approvedAt?: string
  createdBy: string
  clientId?: string
  approvedBy?: string
  convertedToContractId?: string
}

export function QuotationsClient() {
  const [quotations, setQuotations] = useState<SerializableQuotation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchQuotations()
  }, [])

  const fetchQuotations = async () => {
    try {
      const response = await fetch("/api/quotations")
      if (response.ok) {
        const data = await response.json()
        setQuotations(data.quotations || [])
      }
    } catch (error) {
      console.error("Error fetching quotations:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredQuotations = quotations.filter((quotation) => {
    const matchesSearch =
      quotation.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.clientInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || quotation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Acciones y filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código, proyecto o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-background"
        >
          <option value="all">Todos los estados</option>
          <option value="borrador">Borradores</option>
          <option value="enviada">Enviadas</option>
          <option value="aprobada">Aprobadas</option>
          <option value="rechazada">Rechazadas</option>
          <option value="expirada">Expiradas</option>
        </select>
        <Link href="/dashboard/cotizaciones/nueva">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cotización
          </Button>
        </Link>
      </div>

      {/* Lista de cotizaciones */}
      {filteredQuotations.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No hay cotizaciones</p>
          <p className="text-muted-foreground mt-2">Crea tu primera cotización para comenzar</p>
          <Link href="/dashboard/cotizaciones/nueva">
            <Button className="mt-4 bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cotización
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredQuotations.map((quotation) => {
            const StatusIcon = statusConfig[quotation.status].icon
            return (
              <Link key={quotation._id} href={`/dashboard/cotizaciones/${quotation._id}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{quotation.projectName}</h3>
                        <Badge className={statusConfig[quotation.status].color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[quotation.status].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="font-mono">{quotation.code}</span>
                        <span>{quotation.clientInfo?.name}</span>
                        <span>Válida hasta: {formatDate(quotation.validUntil)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{quotation.projectDescription}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(quotation.total)}</p>
                      <p className="text-sm text-muted-foreground mt-1">{quotation.items.length} ítems</p>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
