import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { getCurrentUser } from "@/lib/auth/session"
import EditContractForm from "@/components/contracts/edit-contract-form"

export default async function EditarContratoPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const contract = await db.collection("contracts").findOne({ _id: new ObjectId(id) })

  if (!contract) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Contrato</h1>
        <p className="text-slate-600">Modifica los detalles del contrato</p>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <EditContractForm contract={JSON.parse(JSON.stringify(contract))} />
      </Suspense>
    </div>
  )
}
