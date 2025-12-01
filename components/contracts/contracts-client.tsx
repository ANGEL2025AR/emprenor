"use client"

import { useState, useEffect } from "react"
import { Plus, Search, FileSignature, CheckCircle, XCircle, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Contract } from "@/lib/db/models"

const statusConfig = {
  borrador: { label: "Borrador", color: "bg-gray-100 text-gray-800", icon: FileText },
  pendiente_firma: { label: "Pendiente Firma", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  activo: { label: "Activo", color: "bg-green-100 text-green-800", icon: CheckCircle },
  finalizado: { label: "Finalizado", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
}

type SerializableContract = Omit<
  Contract,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "startDate"
  | "estimatedEndDate"
  | "actualEndDate"
  | "createdBy"
  | "quotationId"
  | "clientId"
> & {
  _id: string
  createdAt: string
  updatedAt: string
  startDate: string
  estimatedEndDate: string
  actualEndDate?: string
  createdBy: string
  quotationId?: string
  clientId?: string
}

export function ContractsClient() {
  const [contracts, setContracts] = useState<SerializableContract[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    try {
      const response = await fetch("/api/contracts")
      if (response.ok) {
        const data = await response.json()
        setContracts(data.contracts || [])
      }
    } catch (error) {
      console.error("Error fetching contracts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.clientInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || contract.status === statusFilter

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
          <option value="pendiente_firma">Pendiente Firma</option>
          <option value="activo">Activos</option>
          <option value="finalizado">Finalizados</option>
          <option value="cancelado">Cancelados</option>
        </select>
        <Link href="/dashboard/contratos/nuevo">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Contrato
          </Button>
        </Link>
      </div>

      {/* Lista de contratos */}
      {filteredContracts.length === 0 ? (
        <Card className="p-12 text-center">
          <FileSignature className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No hay contratos</p>
          <p className="text-muted-foreground mt-2">Crea tu primer contrato para comenzar</p>
          <Link href="/dashboard/contratos/nuevo">
            <Button className="mt-4 bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Contrato
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredContracts.map((contract) => {
            const StatusIcon = statusConfig[contract.status].icon
            return (
              <Link key={contract._id} href={`/dashboard/contratos/${contract._id}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{contract.projectName}</h3>
                        <Badge className={statusConfig[contract.status].color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[contract.status].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="font-mono">{contract.code}</span>
                        <span>{contract.clientInfo.name}</span>
                        <span>
                          {formatDate(contract.startDate)} - {formatDate(contract.estimatedEndDate)}
                        </span>
                        <span>{contract.duration} días</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{contract.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(contract.amount)}</p>
                      <p className="text-sm text-muted-foreground mt-1">{contract.paymentTerms.length} cuotas</p>
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
