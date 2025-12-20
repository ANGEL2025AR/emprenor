import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { getCurrentUser } from "@/lib/auth/session"
import EditSupplierForm from "@/components/suppliers/edit-supplier-form"

export default async function EditarProveedorPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const supplier = await db.collection("suppliers").findOne({ _id: new ObjectId(id) })

  if (!supplier) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Proveedor</h1>
        <p className="text-slate-600">Modifica los datos del proveedor</p>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <EditSupplierForm supplier={JSON.parse(JSON.stringify(supplier))} />
      </Suspense>
    </div>
  )
}
