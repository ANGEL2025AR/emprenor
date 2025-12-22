import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"
import { getDb } from "@/lib/db/connection"

async function getRevenueData() {
  try {
    const db = await getDb()

    // Obtener transacciones de los últimos 6 meses
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const transactions = await db
      .collection("transactions")
      .find({
        date: { $gte: sixMonthsAgo },
        status: "pagado",
      })
      .sort({ date: 1 })
      .toArray()

    // Agrupar por mes
    const monthlyData = new Map<string, number>()
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

    transactions.forEach((t) => {
      if (t.type === "ingreso") {
        const date = new Date(t.date)
        const monthKey = `${monthNames[date.getMonth()]}`
        monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + (t.amount || 0))
      }
    })

    // Convertir a array para renderizar
    const months = Array.from(monthlyData.keys()).slice(-6)
    const revenue = months.map((m) => monthlyData.get(m) || 0)

    return { months, revenue }
  } catch {
    return { months: [], revenue: [] }
  }
}

export async function RevenueChart() {
  const { months, revenue } = await getRevenueData()

  if (months.length === 0 || revenue.every((r) => r === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Evolución de Ingresos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <DollarSign className="w-16 h-16 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No hay datos de ingresos registrados</p>
            <p className="text-sm text-slate-400 mt-1">
              Los ingresos aparecerán aquí una vez que registres transacciones
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxRevenue = Math.max(...revenue)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Evolución de Ingresos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {months.map((month, i) => (
            <div key={month} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700">{month}</span>
                <span className="font-bold text-slate-900">${(revenue[i] / 1000).toFixed(0)}K</span>
              </div>
              <div className="h-8 bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 flex items-center justify-end px-3"
                  style={{ width: `${(revenue[i] / maxRevenue) * 100}%` }}
                >
                  <span className="text-xs font-medium text-white">
                    {i > 0 ? ((revenue[i] / revenue[i - 1] - 1) * 100).toFixed(1) : "0.0"}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <span className="font-semibold">Crecimiento promedio:</span> +
            {revenue.length > 1 ? ((revenue[revenue.length - 1] / revenue[0] - 1) * 100).toFixed(1) : "0.0"}% en{" "}
            {months.length} meses
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
