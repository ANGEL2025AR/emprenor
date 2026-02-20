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
    const suppliers = await db.collection("suppliers").find({}).toArray()

    return NextResponse.json({ suppliers })
  } catch (error) {
    console.error("[v0] Suppliers error:", error)
    return NextResponse.json({ error: "Error al cargar proveedores", suppliers: [] }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()

    if (!body.name) {
      return NextResponse.json({ error: "Nombre del proveedor es requerido" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("suppliers").insertOne({
      name: body.name,
      category: body.category || body.type || "general",
      contact: body.contact || {
        name: body.contactName || "",
        email: body.email || "",
        phone: body.phone || "",
      },
      cuit: body.cuit || "",
      email: body.email || "",
      phone: body.phone || "",
      address: body.address || "",
      city: body.city || "",
      province: body.province || "",
      specialties: body.specialties || [],
      rating: Number(body.rating) || 0,
      notes: body.notes || "",
      status: "activo",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: new ObjectId(user._id),
    })

    return NextResponse.json({
      success: true,
      supplierId: result.insertedId,
    })
  } catch (error) {
    console.error("[v0] Supplier create error:", error)
    return NextResponse.json({ error: "Error al crear proveedor" }, { status: 500 })
  }
}
