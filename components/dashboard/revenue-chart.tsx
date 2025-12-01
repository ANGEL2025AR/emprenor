import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

export function RevenueChart() {
  // Datos simplificados para visualización
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]
  const revenue = [450000, 520000, 680000, 720000, 890000, 950000]
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
                    {((revenue[i] / revenue[i - 1] - 1) * 100 || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <span className="font-semibold">Crecimiento promedio:</span> +
            {((revenue[revenue.length - 1] / revenue[0] - 1) * 100).toFixed(1)}% en 6 meses
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
