import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import Link from "next/link"
import { Plus, MessageSquare, Clock, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardPageHeader, DashboardPrimaryButton } from "@/components/dashboard/dashboard-ui"
import { serializeRFI } from "@/lib/rfis/serialize-rfi"
import { RfisListClient } from "./rfis-list-client"

async function getRFIs() {
  try {
    const db = await getDb()
    const rfis = await db.collection("rfis").find().sort({ requestedDate: -1 }).limit(100).toArray()
    return rfis.map((r) => serializeRFI(r as Record<string, unknown>))
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
  const respondedRFIs = rfis.filter((r) => r.status === "respondido" || r.status === "cerrado").length
  const urgentRFIs = rfis.filter((r) => r.priority === "urgente").length

  return (
    <>
      <DashboardPageHeader
        badge="Calidad y obra"
        title="RFIs — Solicitudes de información"
        description="Gestión de consultas técnicas y aclaraciones formales de proyecto."
        actions={
          <DashboardPrimaryButton asChild>
            <Link href="/dashboard/rfis/nuevo">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo RFI
            </Link>
          </DashboardPrimaryButton>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-xs text-slate-600">Respondidos / cerrados</p>
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

      <RfisListClient rfis={rfis} />
    </>
  )
}

