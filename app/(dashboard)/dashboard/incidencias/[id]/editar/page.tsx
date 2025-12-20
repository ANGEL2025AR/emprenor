import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { getCurrentUser } from "@/lib/auth/session"
import EditIncidentForm from "@/components/incidents/edit-incident-form"

export default async function EditarIncidenciaPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const incident = await db.collection("incidents").findOne({ _id: new ObjectId(id) })

  if (!incident) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Incidencia</h1>
        <p className="text-slate-600">Modifica los detalles de la incidencia</p>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <EditIncidentForm incident={JSON.parse(JSON.stringify(incident))} />
      </Suspense>
    </div>
  )
}
