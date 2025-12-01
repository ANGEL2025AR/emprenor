"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Search,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import type { Payment } from "@/lib/db/models"

const statusConfig = {
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  parcial: { label: "Parcial", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
  pagado: { label: "Pagado", color: "bg-green-100 text-green-800", icon: CheckCircle },
  atrasado: { label: "Atrasado", color: "bg-red-100 text-red-800", icon: AlertCircle },
  cancelado: { label: "Cancelado", color: "bg-gray-100 text-gray-800", icon: XCircle },
}

type SerializablePayment = Omit<
  Payment,
  | "_id"
  | "createdAt"
  | "updatedAt"
  | "dueDate"
  | "paidDate"
  | "createdBy"
  | "approvedBy"
  | "approvedAt"
  | "contractId"
  | "projectId"
  | "invoiceId"
> & {
  _id: string
  createdAt: string
  updatedAt: string
  dueDate: string
  paidDate?: string
  createdBy: string
  approvedBy?: string
  approvedAt?: string
  contractId?: string
  projectId?: string
  invoiceId?: string
}

export function PaymentsClient() {
  const [payments, setPayments] = useState<SerializablePayment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/payments")
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments || [])
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.paymentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.recipient?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || payment.type === typeFilter
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
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

  const totalIngresos = filteredPayments
    .filter((p) => p.type === "ingreso" && p.status === "pagado")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalEgresos = filteredPayments
    .filter((p) => p.type === "egreso" && p.status === "pagado")
    .reduce((sum, p) => sum + p.amount, 0)

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/payments/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Pago eliminado",
          description: "El pago ha sido eliminado exitosamente",
        })
        fetchPayments()
      } else {
        throw new Error("Error al eliminar")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el pago",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
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
      {/* Resumen */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Ingresos</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIngresos)}</p>
            </div>
            <ArrowUpCircle className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Egresos</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalEgresos)}</p>
            </div>
            <ArrowDownCircle className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Balance</p>
              <p
                className={`text-2xl font-bold ${totalIngresos - totalEgresos >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(totalIngresos - totalEgresos)}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-slate-600" />
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número, descripción..."
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
          <option value="ingreso">Ingresos</option>
          <option value="egreso">Egresos</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-background"
        >
          <option value="all">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="pagado">Pagados</option>
          <option value="atrasado">Atrasados</option>
        </select>
        <Link href="/dashboard/pagos/nuevo">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Registrar Pago
          </Button>
        </Link>
      </div>

      {/* Lista de pagos */}
      {filteredPayments.length === 0 ? (
        <Card className="p-12 text-center">
          <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No hay pagos registrados</p>
          <p className="text-muted-foreground mt-2">Registra tu primer pago para comenzar</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPayments.map((payment) => {
            const StatusIcon = statusConfig[payment.status].icon
            const TypeIcon = payment.type === "ingreso" ? ArrowUpCircle : ArrowDownCircle
            const typeColor = payment.type === "ingreso" ? "text-green-600" : "text-red-600"

            return (
              <Card key={payment._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <Link href={`/dashboard/pagos/${payment._id}`} className="flex-1">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <TypeIcon className={`w-5 h-5 ${typeColor}`} />
                        <h3 className="text-lg font-semibold">{payment.description}</h3>
                        <Badge className={statusConfig[payment.status].color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig[payment.status].label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="font-mono">{payment.paymentNumber}</span>
                        {payment.payer && <span>De: {payment.payer.name}</span>}
                        {payment.recipient && <span>Para: {payment.recipient.name}</span>}
                        <span>Vence: {formatDate(payment.dueDate)}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${typeColor}`}>{formatCurrency(payment.amount)}</p>
                      {payment.paymentMethod && (
                        <p className="text-sm text-muted-foreground mt-1 capitalize">{payment.paymentMethod}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault()
                        setDeleteId(payment._id)
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* AlertDialog para confirmar eliminación */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El pago será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
