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
      createdAt: invoice.createdAt ? new Date(invoice.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: invoice.updatedAt ? new Date(invoice.updatedAt).toISOString() : new Date().toISOString(),
      issueDate: invoice.issueDate ? new Date(invoice.issueDate).toISOString() : new Date().toISOString(),
      dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString() : null,
      paidDate: invoice.paidDate ? new Date(invoice.paidDate).toISOString() : null,
      caeExpiration: invoice.caeExpiration ? new Date(invoice.caeExpiration).toISOString() : null,
      createdBy: invoice.createdBy?.toString(),
      contractId: invoice.contractId?.toString(),
      projectId: invoice.projectId?.toString(),
      certificateId: invoice.certificateId?.toString(),
      payments: (invoice.payments || []).map((p) => ({
        paymentId: p.paymentId?.toString(),
        amount: p.amount,
        date: p.date ? new Date(p.date).toISOString() : null,
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

    // Support both form field names and direct API field names
    const invoiceType = data.invoiceType || data.type || "B"
    const count = await db.collection("invoices").countDocuments({ type: invoiceType })
    const invoiceNumber = data.invoiceNumber || `FC-${invoiceType}-${String(count + 1).padStart(8, "0")}`

    // Map clientInfo from form to client field in DB
    const clientData = data.clientInfo || data.client || {}

    const invoice: Invoice = {
      invoiceNumber,
      type: invoiceType,
      issueDate: new Date(data.issueDate || new Date()),
      dueDate: new Date(data.dueDate),
      client: {
        name: clientData.name || "",
        cuit: clientData.cuitCuil || clientData.cuit || "",
        taxCondition: clientData.fiscalCondition || clientData.taxCondition || "consumidor_final",
        email: clientData.email || "",
        address: clientData.address || "",
      },
      projectId: data.projectId ? new ObjectId(data.projectId) : undefined,
      contractId: data.contractId ? new ObjectId(data.contractId) : undefined,
      items: data.items || [],
      subtotal: Number(data.subtotal) || 0,
      discount: Number(data.discount) || 0,
      taxBase: Number(data.taxBase) || Number(data.subtotal) || 0,
      tax: Number(data.taxes) || Number(data.tax) || 0,
      total: Number(data.total) || 0,
      currency: data.currency || "ARS",
      paymentTerms: data.paymentTerms || "",
      observations: data.notes || data.observations || "",
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
