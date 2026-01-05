import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, MessageSquare, Clock, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

async function getRFIs() {
  try {
    const db = await getDb()
    const rfis = await db.collection("rfis").find().sort({ requestedDate: -1 }).limit(50).toArray()

    return rfis.map((rfi) => ({
      _id: rfi._id.toString(),
      projectId: rfi.projectId?.toString() || "",
      rfiNumber: rfi.rfiNumber || "",
      subject: rfi.subject || "",
      question: rfi.question || "",
      requestedBy: rfi.requestedBy?.toString() || "",
      requestedDate: rfi.requestedDate instanceof Date ? rfi.requestedDate.toISOString() : "",
      requiredBy: rfi.requiredBy instanceof Date ? rfi.requiredBy.toISOString() : null,
      respondedBy: rfi.respondedBy?.toString() || null,
      respondedDate: rfi.respondedDate instanceof Date ? rfi.respondedDate.toISOString() : null,
      response: rfi.response || null,
      attachments: rfi.attachments || [],
      status: rfi.status || "abierto",
      priority: rfi.priority || "normal",
      impact: rfi.impact || { cost: 0, schedule: 0 },
      createdAt: rfi.createdAt instanceof Date ? rfi.createdAt.toISOString() : "",
      updatedAt: rfi.updatedAt instanceof Date ? rfi.updatedAt.toISOString() : "",
    }))
  } catch {
    return []
  }
}

export const metadata = {
  title: "RFIs - EMPRENOR",
  description: "Solicitudes de Información del Proyecto",
}

export default async function RFIsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const rfis = await getRFIs()

  const openRFIs = rfis.filter((r) => r.status === "abierto").length
  const respondedRFIs = rfis.filter((r) => r.status === "respondido").length
  const urgentRFIs = rfis.filter((r) => r.priority === "urgente").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">RFIs - Solicitudes de Información</h1>
          <p className="text-slate-600 mt-1">Gestión de consultas técnicas y aclaraciones de proyecto</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/rfis/nuevo">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo RFI
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{rfis.length}</p>
                <p className="text-xs text-slate-600">RFIs totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{openRFIs}</p>
                <p className="text-xs text-slate-600">Abiertos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{respondedRFIs}</p>
                <p className="text-xs text-slate-600">Respondidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{urgentRFIs}</p>
                <p className="text-xs text-slate-600">Urgentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <MessageSquare className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Sistema RFI completamente funcional</h3>
          <p className="text-slate-600 text-center mb-6">
            Crea solicitudes de información para aclarar dudas técnicas y obtener respuestas documentadas
          </p>
          <Button asChild>
            <Link href="/dashboard/rfis/nuevo">Crear primer RFI</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
