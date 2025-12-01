import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { ObjectId } from "mongodb"
import { del } from "@vercel/blob"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const db = await getDb()
    const document = await db.collection("documents").findOne({ _id: new ObjectId(id) })

    if (!document) {
      return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 })
    }

    // Eliminar de Vercel Blob
    try {
      await del(document.file.url)
    } catch (error) {
      console.error("Error deleting from blob:", error)
    }

    // Eliminar de MongoDB
    await db.collection("documents").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json({ error: "Error al eliminar documento" }, { status: 500 })
  }
}
