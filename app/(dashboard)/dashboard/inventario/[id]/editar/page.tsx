import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { getCurrentUser } from "@/lib/auth/session"
import EditInventoryForm from "@/components/inventory/edit-inventory-form"

export default async function EditarInventarioPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const item = await db.collection("inventory").findOne({ _id: new ObjectId(id) })

  if (!item) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Item de Inventario</h1>
        <p className="text-slate-600">Modifica los datos del item</p>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <EditInventoryForm item={JSON.parse(JSON.stringify(item))} />
      </Suspense>
    </div>
  )
}
