import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import type { Quotation } from "@/lib/db/models"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()
    const quotations = await db.collection<Quotation>("quotations").find({}).sort({ createdAt: -1 }).toArray()

    const serializedQuotations = quotations.map((quotation) => ({
      ...quotation,
      _id: quotation._id?.toString(),
      createdAt: quotation.createdAt.toISOString(),
      updatedAt: quotation.updatedAt.toISOString(),
      validUntil: quotation.validUntil.toISOString(),
      approvedAt: quotation.approvedAt?.toISOString(),
      createdBy: quotation.createdBy.toString(),
      clientId: quotation.clientId?.toString(),
      approvedBy: quotation.approvedBy?.toString(),
      convertedToContractId: quotation.convertedToContractId?.toString(),
    }))

    return NextResponse.json({ quotations: serializedQuotations })
  } catch (error) {
    console.error("Error fetching quotations:", error)
    return NextResponse.json({ error: "Error al obtener cotizaciones" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()
    const db = await getDb()

    // Generar código único
    const count = await db.collection("quotations").countDocuments()
    const code = `COT-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`

    const quotation: Quotation = {
      code,
      clientInfo: data.clientInfo,
      projectName: data.projectName,
      projectDescription: data.projectDescription,
      validUntil: new Date(data.validUntil),
      items: data.items,
      subtotal: data.subtotal,
      discount: data.discount || 0,
      tax: data.tax || 0,
      total: data.total,
      currency: data.currency || "ARS",
      notes: data.notes,
      terms: data.terms,
      status: "borrador",
      createdBy: new ObjectId(user._id),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("quotations").insertOne(quotation)

    return NextResponse.json({
      success: true,
      quotationId: result.insertedId.toString(),
      code,
    })
  } catch (error) {
    console.error("Error creating quotation:", error)
    return NextResponse.json({ error: "Error al crear cotización" }, { status: 500 })
  }
}
