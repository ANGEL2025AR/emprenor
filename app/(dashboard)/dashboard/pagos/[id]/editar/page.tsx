import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { getCurrentUser } from "@/lib/auth/session"
import EditPaymentForm from "@/components/payments/edit-payment-form"

export default async function EditarPagoPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const payment = await db.collection("payments").findOne({ _id: new ObjectId(id) })

  if (!payment) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Pago</h1>
        <p className="text-slate-600">Modifica los detalles del pago</p>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <EditPaymentForm payment={JSON.parse(JSON.stringify(payment))} />
      </Suspense>
    </div>
  )
}
