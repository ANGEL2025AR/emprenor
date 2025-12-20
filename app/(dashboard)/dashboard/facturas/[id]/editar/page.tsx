import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import { getCurrentUser } from "@/lib/auth/session"
import EditInvoiceForm from "@/components/invoices/edit-invoice-form"

export default async function EditarFacturaPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const invoice = await db.collection("invoices").findOne({ _id: new ObjectId(id) })

  if (!invoice) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Factura</h1>
        <p className="text-slate-600">Modifica los detalles de la factura</p>
      </div>

      <Suspense fallback={<div>Cargando...</div>}>
        <EditInvoiceForm invoice={JSON.parse(JSON.stringify(invoice))} />
      </Suspense>
    </div>
  )
}
