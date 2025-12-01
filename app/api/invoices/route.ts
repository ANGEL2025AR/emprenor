import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import type { Invoice } from "@/lib/db/models"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    const filter: Record<string, unknown> = {}
    if (projectId) {
      filter.projectId = new ObjectId(projectId)
    }

    const db = await getDb()
    const invoices = await db.collection<Invoice>("invoices").find(filter).sort({ issueDate: -1 }).toArray()

    const serializedInvoices = invoices.map((invoice) => ({
      ...invoice,
      _id: invoice._id?.toString(),
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
      issueDate: invoice.issueDate.toISOString(),
      dueDate: invoice.dueDate.toISOString(),
      paidDate: invoice.paidDate?.toISOString(),
      caeExpiration: invoice.caeExpiration?.toISOString(),
      createdBy: invoice.createdBy.toString(),
      contractId: invoice.contractId?.toString(),
      projectId: invoice.projectId?.toString(),
      certificateId: invoice.certificateId?.toString(),
      payments: invoice.payments.map((p) => ({
        paymentId: p.paymentId.toString(),
        amount: p.amount,
        date: p.date.toISOString(),
      })),
    }))

    return NextResponse.json({ invoices: serializedInvoices })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Error al obtener facturas" }, { status: 500 })
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

    const count = await db.collection("invoices").countDocuments({ type: data.type })
    const invoiceNumber = `FC-${data.type}-${String(count + 1).padStart(8, "0")}`

    const invoice: Invoice = {
      invoiceNumber,
      type: data.type,
      issueDate: new Date(data.issueDate),
      dueDate: new Date(data.dueDate),
      client: data.client,
      items: data.items,
      subtotal: data.subtotal,
      discount: data.discount || 0,
      taxBase: data.taxBase,
      tax: data.tax,
      total: data.total,
      currency: data.currency || "ARS",
      paymentTerms: data.paymentTerms,
      observations: data.observations,
      status: "borrador",
      paidAmount: 0,
      payments: [],
      createdBy: new ObjectId(user._id),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("invoices").insertOne(invoice)

    return NextResponse.json({
      success: true,
      invoiceId: result.insertedId.toString(),
      invoiceNumber,
    })
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Error al crear factura" }, { status: 500 })
  }
}
