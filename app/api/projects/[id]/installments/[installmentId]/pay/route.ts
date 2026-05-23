import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { z } from "zod"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { findProjectForUser } from "@/lib/auth/project-access"
import { applyProjectManagerSync } from "@/lib/projects/project-manager"

const paySchema = z.object({
  paidAt: z.coerce.date().optional(),
  receiptUrl: z.string().url().optional().or(z.literal("")),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; installmentId: string }> },
) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user.role, "projects.edit")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const { id, installmentId } = await params
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  const project = await findProjectForUser(user, id)
  if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })

  const parsed = paySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
  }

  const installments = (project.installments ?? []).map((c) => {
    if (c.id !== installmentId) return c
    return {
      ...c,
      status: "pagada" as const,
      paidAt: parsed.data.paidAt ?? new Date(),
      receiptUrl: parsed.data.receiptUrl || c.receiptUrl,
    }
  })

  if (!installments.some((c) => c.id === installmentId)) {
    return NextResponse.json({ error: "Cuota no encontrada" }, { status: 404 })
  }

  const sync = applyProjectManagerSync({ ...project, installments })
  const db = await getDb()
  await db.collection("projects").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        installments: sync.installments,
        totalCollected: sync.totalCollected,
        totalPending: sync.totalPending,
        updatedAt: new Date(),
      },
    },
  )

  return NextResponse.json(sync)
}
