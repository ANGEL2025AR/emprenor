import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { revalidatePath } from "next/cache"
import { getDb } from "@/lib/db/connection"
import { verifyAuth } from "@/lib/auth/session"
import type { BrochureDirectoryMember } from "@/lib/db/models"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(request)
    if (!user || !["super_admin", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const update: Partial<BrochureDirectoryMember> = { updatedAt: new Date(), updatedBy: new ObjectId(user.userId) }

    if (body.name !== undefined) update.name = String(body.name).trim()
    if (body.role !== undefined) update.role = String(body.role).trim()
    if (body.department !== undefined) update.department = String(body.department).trim().toUpperCase()
    if (body.bio !== undefined) update.bio = String(body.bio).trim()
    if (body.photo !== undefined) update.photo = String(body.photo).trim()
    if (body.email !== undefined) update.email = String(body.email).trim()
    if (body.phone !== undefined) update.phone = String(body.phone).trim()
    if (body.order !== undefined) update.order = Number(body.order) || 0
    if (body.published !== undefined) update.published = Boolean(body.published)
    if (body.featured !== undefined) update.featured = Boolean(body.featured)

    const db = await getDb()
    const result = await db
      .collection<BrochureDirectoryMember>("brochure_directory")
      .updateOne({ _id: new ObjectId(id) }, { $set: update })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Miembro no encontrado" }, { status: 404 })
    }

    revalidatePath("/brochure")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[brochure/directory PUT]", error)
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(request)
    if (!user || !["super_admin", "admin"].includes(user.role)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    const result = await db.collection("brochure_directory").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Miembro no encontrado" }, { status: 404 })
    }

    revalidatePath("/brochure")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[brochure/directory DELETE]", error)
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 })
  }
}
