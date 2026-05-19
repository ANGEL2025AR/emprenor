import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ObjectId } from "mongodb"
import { ArrowLeft, Zap } from "lucide-react"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { getCatalogAutomation } from "@/lib/automations/catalog"
import { getDb } from "@/lib/db/connection"
import type { UserRole } from "@/lib/db/models"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function AutomationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  if (!hasPermission(user.role as UserRole, "admin.access")) {
    redirect("/dashboard")
  }

  const { id } = await params
  const preset = getCatalogAutomation(id)
  let automation: {
    name: string
    description: string
    type: string
    trigger: string
    actions: string[]
    enabled: boolean
    executionCount: number
  } | null = preset
    ? { ...preset }
    : null

  if (!automation && ObjectId.isValid(id)) {
    const db = await getDb()
    const doc = await db.collection("automations").findOne({ _id: new ObjectId(id) })
    if (doc) {
      automation = {
        name: String(doc.name || ""),
        description: String(doc.description || ""),
        type: String(doc.type || "custom"),
        trigger: String(doc.trigger || ""),
        actions: Array.isArray(doc.actions) ? (doc.actions as string[]) : [],
        enabled: doc.enabled !== false,
        executionCount: Number(doc.executionCount || 0),
      }
    }
  }

  if (!automation) notFound()

  if (preset) {
    const db = await getDb()
    const override = await db.collection("automation_presets").findOne({ presetId: id })
    if (override?.enabled !== undefined) {
      automation.enabled = Boolean(override.enabled)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/automatizaciones">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            <Badge variant="outline">{automation.type}</Badge>
            <Badge variant={automation.enabled ? "default" : "secondary"}>
              {automation.enabled ? "Activa" : "Inactiva"}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{automation.name}</h1>
          <p className="text-slate-600 mt-2">{automation.description}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disparador</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700">{automation.trigger}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-slate-700">
            {automation.actions.map((action, i) => (
              <li key={i}>{action}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 flex justify-between text-sm">
          <span className="text-slate-600">Ejecuciones registradas</span>
          <span className="font-semibold">{automation.executionCount}</span>
        </CardContent>
      </Card>
    </div>
  )
}
