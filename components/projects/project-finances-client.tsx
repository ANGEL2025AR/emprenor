"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Receipt, CreditCard, FileText } from "lucide-react"
import Link from "next/link"

interface Payment {
  _id: string
  paymentNumber: string
  amount: number
  type: "ingreso" | "egreso"
  status: string
  dueDate: string
  paidDate?: string
  description: string
}

interface Invoice {
  _id: string
  invoiceNumber: string
  type: string
  total: number
  status: string
  issueDate: string
  dueDate: string
  client: {
    name: string
  }
}

export function ProjectFinancesClient({ projectId }: { projectId: string }) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentsRes, invoicesRes] = await Promise.all([
          fetch(`/api/payments?projectId=${projectId}`),
          fetch(`/api/invoices?projectId=${projectId}`),
        ])

        if (paymentsRes.ok) {
          const data = await paymentsRes.json()
          setPayments(data.payments || [])
        }

        if (invoicesRes.ok) {
          const data = await invoicesRes.json()
          setInvoices(data.invoices || [])
        }
      } catch (error) {
        console.error("Error loading finances:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [projectId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  const totalIngresos = payments
    .filter((p) => p.type === "ingreso" && p.status === "pagado")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalEgresos = payments
    .filter((p) => p.type === "egreso" && p.status === "pagado")
    .reduce((sum, p) => sum + p.amount, 0)

  const pagosPendientes = payments.filter((p) => p.status === "pendiente").length

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Ingresos</p>
                <p className="text-xl font-bold text-green-600">${totalIngresos.toLocaleString("es-AR")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Egresos</p>
                <p className="text-xl font-bold text-red-600">${totalEgresos.toLocaleString("es-AR")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Pendientes</p>
                <p className="text-xl font-bold text-amber-600">{pagosPendientes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pagos */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pagos Recientes</h3>
            <Button size="sm" asChild>
              <Link href={`/dashboard/pagos/nuevo?projectId=${projectId}`}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Pago
              </Link>
            </Button>
          </div>

          {payments.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No hay pagos registrados para este proyecto</p>
          ) : (
            <div className="space-y-3">
              {payments.slice(0, 5).map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium">{payment.paymentNumber}</p>
                    <p className="text-sm text-slate-600">{payment.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${payment.type === "ingreso" ? "text-green-600" : "text-red-600"}`}>
                      {payment.type === "ingreso" ? "+" : "-"}${payment.amount.toLocaleString("es-AR")}
                    </p>
                    <Badge className="mt-1" variant="outline">
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Facturas */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Facturas</h3>
            <Button size="sm" asChild>
              <Link href={`/dashboard/facturas/nueva?projectId=${projectId}`}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Factura
              </Link>
            </Button>
          </div>

          {invoices.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No hay facturas registradas para este proyecto</p>
          ) : (
            <div className="space-y-3">
              {invoices.slice(0, 5).map((invoice) => (
                <div
                  key={invoice._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-slate-600">{invoice.client?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">${invoice.total.toLocaleString("es-AR")}</p>
                    <Badge className="mt-1" variant="outline">
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
