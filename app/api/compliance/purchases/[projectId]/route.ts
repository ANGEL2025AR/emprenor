import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import { assertProjectComplianceAccess, canManageCompliance } from "@/lib/compliance/access"
import type { LocalPurchase } from "@/lib/db/models"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const user = await verifyAuth(request)
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { projectId } = await params
    const access = await assertProjectComplianceAccess(user, projectId)
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

    const db = await getDb()
    const purchases = await db.collection<LocalPurchase>("local_purchases")
      .find({ projectId: new ObjectId(projectId) })
      .sort({ date: -1 })
      .toArray()

    const total = purchases.reduce((s, p) => s + (p.amount || 0), 0)

    return NextResponse.json({
      purchases: purchases.map((p) => ({
        ...p,
        _id: p._id?.toString(),
        projectId: p.projectId.toString(),
      })),
      total,
      canManage: canManageCompliance(user.role),
    })
  } catch {
    return NextResponse.json({ error: "Error al cargar compras" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const user = await verifyAuth(request)
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { projectId } = await params
    const access = await assertProjectComplianceAccess(user, projectId, true)
    if (!access.ok) return NextResponse.json({ error: access.error }, { status: access.status })

    const body = await request.json()
    if (!body.detail || !body.provider || !body.amount) {
      return NextResponse.json({ error: "Campos obligatorios incompletos" }, { status: 400 })
    }

    const now = new Date()
    const purchase: Omit<LocalPurchase, "_id"> = {
      projectId: new ObjectId(projectId),
      date: body.date ? new Date(body.date) : now,
      detail: String(body.detail),
      provider: String(body.provider),
      location: String(body.location ?? ""),
      amount: Number(body.amount),
      currency: String(body.currency ?? "ARS"),
      notes: body.notes ? String(body.notes) : undefined,
      createdBy: new ObjectId(user.userId),
      createdAt: now,
      updatedAt: now,
    }

    const db = await getDb()
    const result = await db.collection<LocalPurchase>("local_purchases").insertOne(purchase)

    return NextResponse.json({ success: true, purchase: { ...purchase, _id: result.insertedId.toString() } })
  } catch {
    return NextResponse.json({ error: "Error al registrar compra" }, { status: 500 })
  }
}
