"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Receipt, CheckCircle, Clock, XCircle, AlertCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Invoice } from "@/lib/db/models"

const statusConfig = {
  borrador: { label: "Borrador", color: "bg-gray-100 text-gray-800", icon: FileText },
  emitida: { label: "Emitida", color: "bg-blue-100 text-blue-800", icon: Receipt },
  enviada: { label: "Enviada", color: "bg-purple-100 text-purple-800", icon: Receipt },
  pagada: { label: "Pagada", color: "bg-green-100 text-green-800", icon: CheckCircle },
  parcial: { label: "Pago Parcial", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
  vencida: { label: "Vencida", color: "bg-red-100 text-red-800", icon: AlertCircle },
  anulada: { label: "Anulada", color: "bg-gray-100 text-gray-800", icon: XCircle },
}

type SerializableInvoice = Omit<
  Invoice,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "issueDate"
  | "dueDate"
  | "paidDate"
  | "caeExpiration"
  | "createdBy"
  | "contractId"
  | "projectId"
  | "certificateId"
> & {
  _id: string
  createdAt: string
  updatedAt: string
  issueDate: string
  dueDate: string
  paidDate?: string
  caeExpiration?: string
  createdBy: string
  contractId?: string
  projectId?: string
  certificateId?: string
  payments: {
    paymentId: string
    amount: number
    date: string
  }[]
}

export function InvoicesClient() {
  const [invoices, setInvoices] = useState<SerializableInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices")
      if (response.ok) {
        const data = await response.json()
        setInvoices(data.invoices || [])
      }
    } catch (error) {
      console.error("Error fetching invoices:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    const matchesType = typeFilter === "all" || invoice.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
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

  const totalFacturado = filteredInvoices.filter((i) => i.status !== "anulada").reduce((sum, i) => sum + i.total, 0)

  const totalCobrado = filteredInvoices.filter((i) => i.status === "pagada").reduce((sum, i) => sum + i.paidAmount, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Facturado</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalFacturado)}</p>
            </div>
            <Receipt className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Cobrado</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCobrado)}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Por Cobrar</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalFacturado - totalCobrado)}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-background"
        >
          <option value="all">Todos los tipos</option>
          <option value="A">Factura A</option>
          <option value="B">Factura B</option>
          <option value="C">Factura C</option>
          <option value="E">Factura E</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-background"
        >
          <option value="all">Todos los estados</option>
          <option value="borrador">Borradores</option>
          <option value="emitida">Emitidas</option>
          <option value="pagada">Pagadas</option>
          <option value="vencida">Vencidas</option>
        </select>
        <Link href="/dashboard/facturas/nueva">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Factura
          </Button>
        </Link>
      </div>

      {/* Lista de facturas */}
      {filteredInvoices.length === 0 ? (
        <Card className="p-12 text-center">
          <Receipt className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No hay facturas</p>
          <p className="text-muted-foreground mt-2">Emite tu primera factura para comenzar</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredInvoices.map((invoice) => {
            const StatusIcon = statusConfig[invoice.status].icon
            return (
              <Link key={invoice._id} href={`/dashboard/facturas/${invoice._id}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">
                          {invoice.type}
                        </Badge>
                        <h3 className="text-lg font-semibold">{invoice.client?.name}</h3>
                        <Badge className={statusConfig[invoice.status].color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[invoice.status].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="font-mono">{invoice.invoiceNumber}</span>
                        <span>Emitida: {formatDate(invoice.issueDate)}</span>
                        <span>Vence: {formatDate(invoice.dueDate)}</span>
                        {invoice.cae && <span>CAE: {invoice.cae}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(invoice.total)}</p>
                      {invoice.status === "parcial" && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Cobrado: {formatCurrency(invoice.paidAmount)}
                        </p>
                      )}
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
