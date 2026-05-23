import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { z } from "zod"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import { findProjectForUser } from "@/lib/auth/project-access"
import { applyProjectManagerSync, newInstallmentId } from "@/lib/projects/project-manager"
import type { ProjectInstallment } from "@/lib/projects/project-manager-types"

const installmentSchema = z.object({
  number: z.number().int().positive().optional(),
  description: z.string().optional(),
  percentage: z.number().min(0).max(100).optional(),
  amount: z.number().positive(),
  dueDate: z.coerce.date().optional(),
})

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user.role, "projects.view")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await params
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  const project = await findProjectForUser(user, id)
  if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })

  const sync = applyProjectManagerSync(project)
  return NextResponse.json({
    installments: sync.installments,
    budgetCurrent: sync.budgetCurrent,
    totalCollected: sync.totalCollected,
    totalPending: sync.totalPending,
  })
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user.role, "projects.edit")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const { id } = await params
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  const project = await findProjectForUser(user, id)
  if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })

  const parsed = installmentSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 })
  }

  const existing = project.installments ?? []
  const installment: ProjectInstallment = {
    id: newInstallmentId(),
    number: parsed.data.number ?? existing.length + 1,
    description: parsed.data.description,
    percentage: parsed.data.percentage,
    amount: parsed.data.amount,
    dueDate: parsed.data.dueDate,
    status: "pendiente",
  }

  const installments = [...existing, installment]
  const sync = applyProjectManagerSync({ ...project, installments })

  const db = await getDb()
  await db.collection("projects").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        installments: sync.installments,
        budgetCurrent: sync.budgetCurrent,
        totalCollected: sync.totalCollected,
        totalPending: sync.totalPending,
        updatedAt: new Date(),
      },
    },
  )

  return NextResponse.json({ installment, ...sync })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user || !hasPermission(user.role, "projects.edit")) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
  }

  const { id } = await params
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  const project = await findProjectForUser(user, id)
  if (!project) return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })

  const body = await request.json()
  const installments: ProjectInstallment[] = Array.isArray(body.installments) ? body.installments : []
  const budgetCurrent =
    typeof body.budgetCurrent === "number" ? body.budgetCurrent : project.budgetCurrent
  const sync = applyProjectManagerSync({ ...project, installments, budgetCurrent })

  const db = await getDb()
  await db.collection("projects").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        installments: sync.installments,
        budgetCurrent: sync.budgetCurrent,
        totalCollected: sync.totalCollected,
        totalPending: sync.totalPending,
        updatedAt: new Date(),
      },
    },
  )

  return NextResponse.json(sync)
}
