import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ObjectId } from "mongodb"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft } from "lucide-react"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { canAccessProjectId } from "@/lib/auth/project-access"
import { hasPermission } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { serializePunchList } from "@/lib/punch-lists/serialize-punch-list"

export default async function PunchListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  if (!hasPermission(user.role as UserRole, "quality.view")) {
    redirect("/dashboard/punch-lists")
  }

  const { id } = await params
  if (!ObjectId.isValid(id)) notFound()

  const db = await getDb()
  const doc = await db.collection("punch_lists").findOne({ _id: new ObjectId(id) })
  if (!doc) notFound()

  const list = serializePunchList(doc as Record<string, unknown>)
  if (list.projectId && !(await canAccessProjectId(user, list.projectId))) {
    notFound()
  }

  let projectName = list.projectId
  if (ObjectId.isValid(list.projectId)) {
    const project = await db.collection("projects").findOne({ _id: new ObjectId(list.projectId) })
    if (project) projectName = `${project.code || ""} — ${project.name || ""}`.trim()
  }

  const items = list.items as Array<{
    description?: string
    location?: string
    priority?: string
    status?: string
  }>

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/punch-lists">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline" className="font-mono">
              {list.listNumber}
            </Badge>
            <Badge>{list.status}</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{list.listName}</h1>
          <p className="text-slate-600 mt-1">Proyecto: {projectName}</p>
          <p className="text-sm text-slate-500 mt-1">
            Creado el {format(new Date(list.createdAt), "dd MMMM yyyy", { locale: es })}
          </p>
        </div>
      </div>

      {list.description && (
        <Card>
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 whitespace-pre-wrap">{list.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ítems ({items.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 ? (
            <p className="text-slate-500 text-sm">Sin ítems registrados.</p>
          ) : (
            items.map((item, i) => (
              <div key={i} className="rounded-lg border p-4">
                <p className="font-medium text-slate-900">{item.description}</p>
                <div className="flex flex-wrap gap-2 mt-2 text-sm text-slate-600">
                  {item.location && <span>Ubicación: {item.location}</span>}
                  {item.priority && <Badge variant="outline">{item.priority}</Badge>}
                  {item.status && <Badge variant="secondary">{item.status}</Badge>}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
