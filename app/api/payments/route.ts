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
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
      dueDate: payment.dueDate.toISOString(),
      paidDate: payment.paidDate?.toISOString(),
      createdBy: payment.createdBy.toString(),
      approvedBy: payment.approvedBy?.toString(),
      approvedAt: payment.approvedAt?.toISOString(),
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

    const payment: Payment = {
      type: data.type,
      paymentNumber,
      amount: data.amount,
      currency: data.currency || "ARS",
      dueDate: new Date(data.dueDate),
      status: "pendiente",
      description: data.description,
      payer: data.payer,
      recipient: data.recipient,
      paymentMethod: data.paymentMethod,
      reference: data.reference,
      bankDetails: data.bankDetails,
      notes: data.notes,
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
