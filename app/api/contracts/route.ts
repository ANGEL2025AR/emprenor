import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import type { Contract } from "@/lib/db/models"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()
    const contracts = await db.collection<Contract>("contracts").find({}).sort({ createdAt: -1 }).toArray()

    const serializedContracts = contracts.map((contract) => ({
      ...contract,
      _id: contract._id?.toString(),
      createdAt: contract.createdAt.toISOString(),
      updatedAt: contract.updatedAt.toISOString(),
      startDate: contract.startDate.toISOString(),
      estimatedEndDate: contract.estimatedEndDate.toISOString(),
      actualEndDate: contract.actualEndDate?.toISOString(),
      createdBy: contract.createdBy.toString(),
      quotationId: contract.quotationId?.toString(),
      clientId: contract.clientId?.toString(),
      deliverables: contract.deliverables.map((d) => ({
        ...d,
        deadline: d.deadline.toISOString(),
        deliveredAt: d.deliveredAt?.toISOString(),
      })),
      paymentTerms: contract.paymentTerms.map((pt) => ({
        ...pt,
        dueDate: pt.dueDate?.toISOString(),
      })),
    }))

    return NextResponse.json({ contracts: serializedContracts })
  } catch (error) {
    console.error("Error fetching contracts:", error)
    return NextResponse.json({ error: "Error al obtener contratos" }, { status: 500 })
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

    const count = await db.collection("contracts").countDocuments()
    const code = `CONT-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`

    const contract: Contract = {
      code,
      quotationId: data.quotationId ? new ObjectId(data.quotationId) : undefined,
      clientId: data.clientId ? new ObjectId(data.clientId) : undefined,
      clientInfo: data.clientInfo,
      projectName: data.projectName,
      type: data.type,
      description: data.description,
      scope: data.scope,
      startDate: new Date(data.startDate),
      estimatedEndDate: new Date(data.estimatedEndDate),
      duration: data.duration,
      amount: data.amount,
      currency: data.currency || "ARS",
      paymentTerms: data.paymentTerms || [],
      penaltyClause: data.penaltyClause,
      warranties: data.warranties || [],
      deliverables: data.deliverables || [],
      status: "borrador",
      signatures: {}, // Inicializado vacío, se llenará cuando se firme el contrato
      attachments: data.attachments || [],
      notes: data.notes,
      createdBy: new ObjectId(user._id),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("contracts").insertOne(contract)

    return NextResponse.json({
      success: true,
      contractId: result.insertedId.toString(),
      code,
    })
  } catch (error) {
    console.error("Error creating contract:", error)
    return NextResponse.json({ error: "Error al crear contrato" }, { status: 500 })
  }
}
