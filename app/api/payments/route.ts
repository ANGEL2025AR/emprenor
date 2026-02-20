import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import type { Payment } from "@/lib/db/models"
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
    const payments = await db.collection<Payment>("payments").find(filter).sort({ dueDate: -1 }).toArray()

    const serializedPayments = payments.map((payment) => ({
      ...payment,
      _id: payment._id?.toString(),
      createdAt: payment.createdAt ? new Date(payment.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: payment.updatedAt ? new Date(payment.updatedAt).toISOString() : new Date().toISOString(),
      dueDate: payment.dueDate ? new Date(payment.dueDate).toISOString() : null,
      paidDate: payment.paidDate ? new Date(payment.paidDate).toISOString() : null,
      createdBy: payment.createdBy?.toString(),
      approvedBy: payment.approvedBy?.toString(),
      approvedAt: payment.approvedAt ? new Date(payment.approvedAt).toISOString() : null,
      contractId: payment.contractId?.toString(),
      projectId: payment.projectId?.toString(),
      invoiceId: payment.invoiceId?.toString(),
    }))

    return NextResponse.json({ payments: serializedPayments })
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Error al obtener pagos" }, { status: 500 })
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

    const count = await db.collection("payments").countDocuments()
    const paymentNumber = `PAG-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`

    // Map form fields to DB model
    const paymentDate = data.paymentDate ? new Date(data.paymentDate) : new Date()
    const dueDate = data.dueDate ? new Date(data.dueDate) : paymentDate

    const payment: Payment = {
      type: data.type || "ingreso",
      paymentNumber,
      amount: Number(data.amount) || 0,
      currency: data.currency || "ARS",
      dueDate,
      status: data.status || "completed",
      description: data.notes || data.description || "",
      payer: data.payer || {},
      recipient: data.recipient || {},
      paymentMethod: data.paymentMethod || "efectivo",
      reference: data.transactionId || data.reference || "",
      bankDetails: data.bankDetails,
      notes: data.notes || "",
      paidDate: paymentDate,
      projectId: data.projectId ? new ObjectId(data.projectId) : undefined,
      invoiceId: data.invoiceId && ObjectId.isValid(data.invoiceId) ? new ObjectId(data.invoiceId) : undefined,
      createdBy: new ObjectId(user._id),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("payments").insertOne(payment)

    return NextResponse.json({
      success: true,
      paymentId: result.insertedId.toString(),
      paymentNumber,
    })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json({ error: "Error al crear pago" }, { status: 500 })
  }
}
