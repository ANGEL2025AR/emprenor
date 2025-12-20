import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { getCurrentUser } from "@/lib/auth/session"
import EditEmployeeForm from "@/components/employees/edit-employee-form"

export default async function EditarEmpleadoPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const employee = await db.collection("employees").findOne({ _id: new ObjectId(id) })

  if (!employee) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Empleado</h1>
        <p className="text-slate-600">Modifica los datos del empleado</p>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <EditEmployeeForm employee={JSON.parse(JSON.stringify(employee))} />
      </Suspense>
    </div>
  )
}
