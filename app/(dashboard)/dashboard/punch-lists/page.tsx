import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PunchListsClient } from "./punch-lists-client"

async function getPunchLists() {
  try {
    const db = await getDb()
    const lists = await db.collection("punch_lists").find().sort({ createdAt: -1 }).limit(50).toArray()

    return lists.map((list) => ({
      ...list,
      _id: list._id.toString(),
      projectId: list.projectId.toString(),
      createdBy: list.createdBy.toString(),
    }))
  } catch {
    return []
  }
}

export const metadata = {
  title: "Punch Lists - EMPRENOR",
  description: "Gestión de listas de pendientes y defectos de obra",
}

export default async function PunchListsPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const lists = await getPunchLists()

  const totalItems = lists.reduce((sum, list) => sum + (list.summary?.totalItems || 0), 0)
  const openItems = lists.reduce((sum, list) => sum + (list.summary?.openItems || 0), 0)
  const criticalItems = lists.reduce((sum, list) => sum + (list.summary?.criticalItems || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Punch Lists</h1>
          <p className="text-slate-600 mt-1">Gestión de pendientes, defectos y correcciones de obra</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/punch-lists/nueva">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Punch List
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{totalItems}</p>
                <p className="text-xs text-slate-600">Items totales</p>
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
                <p className="text-2xl font-bold text-slate-900">{openItems}</p>
                <p className="text-xs text-slate-600">Items abiertos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{criticalItems}</p>
                <p className="text-xs text-slate-600">Items críticos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{lists.length}</p>
                <p className="text-xs text-slate-600">Listas activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <PunchListsClient initialLists={lists} />
    </div>
  )
}
