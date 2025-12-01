import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { transactionSchema } from "@/lib/validations/schemas"
import { generateCode } from "@/lib/auth/password"
import { ObjectId } from "mongodb"
import type { Transaction } from "@/lib/db/models"

// GET - Listar transacciones
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "finance.view")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    const db = await getDb()

    const filter: Record<string, unknown> = {}
    if (projectId) filter.projectId = new ObjectId(projectId)
    if (type) filter.type = type
    if (status) filter.status = status

    const [transactions, total, stats] = await Promise.all([
      db.collection<Transaction>("transactions").find(filter).sort({ date: -1 }).skip(skip).limit(limit).toArray(),
      db.collection("transactions").countDocuments(filter),
      db
        .collection("transactions")
        .aggregate([
          { $match: filter },
          {
            $group: {
              _id: "$type",
              total: { $sum: "$amount" },
            },
          },
        ])
        .toArray(),
    ])

    const totalIngresos = stats.find((s) => s._id === "ingreso")?.total || 0
    const totalEgresos = stats.find((s) => s._id === "egreso")?.total || 0

    return NextResponse.json({
      transactions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      summary: {
        totalIngresos,
        totalEgresos,
        balance: totalIngresos - totalEgresos,
      },
    })
  } catch {
    return NextResponse.json({ error: "Error al obtener transacciones" }, { status: 500 })
  }
}

// POST - Crear transacción
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "finance.create")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const validationResult = transactionSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Datos inválidos", details: validationResult.error.flatten() }, { status: 400 })
    }

    const db = await getDb()
    const code = generateCode("TRX")

    const userObjectId = new ObjectId(user._id)

    const newTransaction: Omit<Transaction, "_id"> = {
      ...validationResult.data,
      projectId: new ObjectId(validationResult.data.projectId),
      reference: validationResult.data.reference || code,
      status: "pendiente",
      notes: validationResult.data.notes || "",
      createdBy: userObjectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await db.collection("transactions").insertOne(newTransaction)

    // Actualizar gastos del proyecto si es egreso
    if (validationResult.data.type === "egreso") {
      await db
        .collection("projects")
        .updateOne(
          { _id: new ObjectId(validationResult.data.projectId) },
          { $inc: { "budget.spent": validationResult.data.amount } },
        )
    }

    return NextResponse.json(
      {
        success: true,
        transaction: { ...newTransaction, _id: insertResult.insertedId },
      },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: "Error al crear transacción" }, { status: 500 })
  }
}
