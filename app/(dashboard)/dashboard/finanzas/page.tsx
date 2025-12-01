"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, Loader2, ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { Transaction } from "@/lib/db/models"

const STATUS_COLORS: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  pagado: "bg-green-100 text-green-700",
  parcial: "bg-blue-100 text-blue-700",
  vencido: "bg-red-100 text-red-700",
  cancelado: "bg-slate-100 text-slate-700",
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState({ totalIngresos: 0, totalEgresos: 0, balance: 0 })
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("")

  useEffect(() => {
    fetchTransactions()
  }, [typeFilter])

  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams()
      if (typeFilter && typeFilter !== "all") params.append("type", typeFilter)

      const response = await fetch(`/api/transactions?${params}`)
      const data = await response.json()
      setTransactions(data.transactions || [])
      setSummary(data.summary || { totalIngresos: 0, totalEgresos: 0, balance: 0 })
    } catch {
      // Error silencioso en producción
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finanzas</h1>
          <p className="text-slate-600">Control de ingresos, egresos y balance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/finanzas/nuevo?type=ingreso">
              <ArrowUpRight className="w-4 h-4 mr-2 text-green-600" />
              Nuevo Ingreso
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/finanzas/nuevo?type=egreso">
              <ArrowDownRight className="w-4 h-4 mr-2" />
              Nuevo Egreso
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(summary.totalIngresos)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Egresos Totales</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(summary.totalEgresos)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Balance</p>
                <p className={`text-2xl font-bold mt-1 ${summary.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(summary.balance)}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  summary.balance >= 0 ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <DollarSign className={`w-6 h-6 ${summary.balance >= 0 ? "text-green-600" : "text-red-600"}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo de movimiento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ingreso">Ingresos</SelectItem>
              <SelectItem value="egreso">Egresos</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Transactions list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : transactions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay movimientos</h3>
            <p className="text-slate-600 mb-4">Comienza registrando tu primer ingreso o egreso</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Movimientos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction._id?.toString()}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "ingreso" ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "ingreso" ? (
                        <ArrowUpRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{transaction.description}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(transaction.date).toLocaleDateString("es-AR")} • {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={STATUS_COLORS[transaction.status]}>{transaction.status}</Badge>
                    <p
                      className={`font-semibold ${transaction.type === "ingreso" ? "text-green-600" : "text-red-600"}`}
                    >
                      {transaction.type === "ingreso" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
