import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { ObjectId } from "mongodb"
import type { Document } from "@/lib/db/models"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    if (!hasPermission(user.role, "documents.upload")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const projectId = formData.get("projectId") as string
    const type = (formData.get("type") as string) || "otro"
    const name = (formData.get("name") as string) || file.name
    const description = (formData.get("description") as string) || ""

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 })
    }

    if (!projectId) {
      return NextResponse.json({ error: "Se requiere projectId" }, { status: 400 })
    }

    // Subir a Vercel Blob
    const blob = await put(`documents/${projectId}/${Date.now()}-${file.name}`, file, {
      access: "public",
    })

    const db = await getDb()

    const userObjectId = new ObjectId(user._id)

    const newDocument: Omit<Document, "_id"> = {
      projectId: new ObjectId(projectId),
      type: type as Document["type"],
      name,
      description,
      file: {
        url: blob.url,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
      },
      version: 1,
      tags: [],
      metadata: {},
      access: "equipo",
      views: 0,
      downloads: 0,
      uploadedBy: userObjectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const insertResult = await db.collection("documents").insertOne(newDocument)

    return NextResponse.json(
      {
        success: true,
        document: { ...newDocument, _id: insertResult.insertedId },
      },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: "Error al subir documento" }, { status: 500 })
  }
}
