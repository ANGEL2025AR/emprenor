import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()
    const items = await db.collection("inventory").find({}).toArray()

    return NextResponse.json({ items })
  } catch (error) {
    console.error("[v0] Inventory error:", error)
    return NextResponse.json({ error: "Error al cargar inventario", items: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { name, category, quantity, unit, minStock, cost, supplier, location } = body

    if (!name || !category || quantity === undefined) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("inventory").insertOne({
      name,
      category,
      quantity: Number(quantity),
      unit: unit || "unidad",
      minStock: Number(minStock) || 10,
      cost: Number(cost) || 0,
      supplier,
      location,
      createdAt: new Date(),
      createdBy: new ObjectId(user._id),
    })

    return NextResponse.json({
      success: true,
      itemId: result.insertedId,
    })
  } catch (error) {
    console.error("[v0] Inventory create error:", error)
    return NextResponse.json({ error: "Error al crear item" }, { status: 500 })
  }
}
