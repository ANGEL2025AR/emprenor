"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Building2,
  CreditCard,
} from "lucide-react"
import type { Transaction } from "@/lib/db/models"

const STATUS_COLORS: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  pagado: "bg-green-100 text-green-700",
  parcial: "bg-blue-100 text-blue-700",
  vencido: "bg-red-100 text-red-700",
  cancelado: "bg-slate-100 text-slate-700",
}

const CATEGORY_LABELS: Record<string, string> = {
  pago_cliente: "Pago de Cliente",
  pago_proveedor: "Pago a Proveedor",
  pago_empleado: "Pago a Empleado",
  material: "Materiales",
  equipo: "Equipos",
  servicio: "Servicios",
  otro: "Otro",
}

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(`/api/transactions/${id}`)
        if (response.ok) {
          const data = await response.json()
          setTransaction(data.transaction)
        } else {
          router.push("/dashboard/finanzas")
        }
      } catch {
        router.push("/dashboard/finanzas")
      } finally {
        setLoading(false)
      }
    }

    fetchTransaction()
  }, [id, router])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Transacción no encontrada</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/finanzas">Volver a finanzas</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/finanzas">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{transaction.description}</h1>
            <Badge className={STATUS_COLORS[transaction.status]}>{transaction.status}</Badge>
          </div>
          <p className="text-slate-600">Referencia: {transaction.reference}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {transaction.type === "ingreso" ? (
                  <ArrowUpRight className="w-5 h-5 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-red-500" />
                )}
                Detalles del Movimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="text-slate-600">Monto</span>
                <span
                  className={`text-2xl font-bold ${transaction.type === "ingreso" ? "text-green-600" : "text-red-600"}`}
                >
                  {transaction.type === "ingreso" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Categoría</p>
                  <p className="font-medium">{CATEGORY_LABELS[transaction.category] || transaction.category}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Método de pago</p>
                  <p className="font-medium capitalize">{transaction.paymentMethod || "No especificado"}</p>
                </div>
              </div>

              {transaction.notes && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Notas</h4>
                  <p className="text-slate-600">{transaction.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {(transaction.invoice || transaction.receipt) && (
            <Card>
              <CardHeader>
                <CardTitle>Comprobantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transaction.invoice && (
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <div className="flex-1">
                          <p className="font-medium">Factura N° {transaction.invoice.number}</p>
                          <p className="text-sm text-slate-500">
                            Fecha: {new Date(transaction.invoice.date).toLocaleDateString("es-AR")}
                          </p>
                        </div>
                        {transaction.invoice.file && (
                          <a
                            href={transaction.invoice.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                          >
                            Ver archivo
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  {transaction.receipt && (
                    <a
                      href={transaction.receipt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium">Ver recibo</span>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Fecha</p>
                  <p className="font-medium">{new Date(transaction.date).toLocaleDateString("es-AR")}</p>
                </div>
              </div>
              {transaction.dueDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Vencimiento</p>
                    <p className="font-medium">{new Date(transaction.dueDate).toLocaleDateString("es-AR")}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Tipo</p>
                  <p className="font-medium capitalize">{transaction.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-500">Moneda</p>
                  <p className="font-medium">{transaction.currency}</p>
                </div>
              </div>
              {transaction.supplier && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Proveedor</p>
                    <p className="font-medium">{transaction.supplier.name}</p>
                    {transaction.supplier.cuit && (
                      <p className="text-xs text-slate-400">CUIT: {transaction.supplier.cuit}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
