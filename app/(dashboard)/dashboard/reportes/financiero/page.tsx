import { getDb } from "@/lib/db/connection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

export const metadata = {
  title: "Reporte Financiero",
  description: "Reporte financiero consolidado",
}

export default async function ReporteFinancieroPage() {
  const db = await getDb()

  const transactions = await db.collection("transactions").find().toArray()
  const projects = await db.collection("projects").find().toArray()

  const ingresos = transactions
    .filter((t) => t.type === "ingreso" && t.status === "pagado")
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  const egresos = transactions
    .filter((t) => t.type === "egreso" && t.status === "pagado")
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  const pendiente = transactions.filter((t) => t.status === "pendiente").reduce((sum, t) => sum + (t.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reporte Financiero Consolidado</h1>
        <p className="text-slate-600">Balance general y flujo de caja</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Ingresos Totales</p>
                <p className="text-3xl font-bold text-green-600">${(ingresos / 1000000).toFixed(2)}M</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Egresos Totales</p>
                <p className="text-3xl font-bold text-red-600">${(egresos / 1000000).toFixed(2)}M</p>
              </div>
              <TrendingDown className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Balance Neto</p>
                <p className={`text-3xl font-bold ${ingresos - egresos >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${((ingresos - egresos) / 1000000).toFixed(2)}M
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalle por Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.map((project) => {
              const projectIngresos = transactions
                .filter(
                  (t) =>
                    t.projectId?.toString() === project._id?.toString() &&
                    t.type === "ingreso" &&
                    t.status === "pagado",
                )
                .reduce((sum, t) => sum + (t.amount || 0), 0)

              const projectEgresos = transactions
                .filter(
                  (t) =>
                    t.projectId?.toString() === project._id?.toString() && t.type === "egreso" && t.status === "pagado",
                )
                .reduce((sum, t) => sum + (t.amount || 0), 0)

              return (
                <div key={project._id?.toString()} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{project.name}</p>
                    <p className="text-sm text-slate-500">{project.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">Ingresos: ${projectIngresos.toLocaleString()}</p>
                    <p className="text-sm text-slate-600">Egresos: ${projectEgresos.toLocaleString()}</p>
                    <p
                      className={`font-bold ${projectIngresos - projectEgresos >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      Balance: ${(projectIngresos - projectEgresos).toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
