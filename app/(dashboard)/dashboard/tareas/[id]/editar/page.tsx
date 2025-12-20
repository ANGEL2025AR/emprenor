import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { getCurrentUser } from "@/lib/auth/session"
import EditTaskForm from "@/components/tasks/edit-task-form"

export default async function EditarTareaPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const task = await db.collection("tasks").findOne({ _id: new ObjectId(id) })

  if (!task) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Tarea</h1>
        <p className="text-slate-600">Modifica los detalles de la tarea</p>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <EditTaskForm task={JSON.parse(JSON.stringify(task))} />
      </Suspense>
    </div>
  )
}
