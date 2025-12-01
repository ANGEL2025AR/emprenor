import { notFound } from "next/navigation"
import { getDb } from "@/lib/db/connection"
import { ObjectId } from "mongodb"
import EditQuotationForm from "@/components/quotations/edit-quotation-form"

export default async function EditarCotizacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!ObjectId.isValid(id)) {
    notFound()
  }

  const db = await getDb()
  const quotation = await db.collection("quotations").findOne({ _id: new ObjectId(id) })

  if (!quotation) {
    notFound()
  }

  return <EditQuotationForm quotation={JSON.parse(JSON.stringify(quotation))} />
}
