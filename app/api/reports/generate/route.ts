import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { getDb } from "@/lib/db/connection"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || !user._id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { type, period } = body

    const db = await getDb()

    let reportData: any = {}
    const now = new Date()
    const startDate = new Date()

    // Calcular rango de fechas según período
    switch (period) {
      case "semana":
        startDate.setDate(now.getDate() - 7)
        break
      case "mes":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "trimestre":
        startDate.setMonth(now.getMonth() - 3)
        break
      case "año":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 1)
    }

    // Generar datos según tipo de reporte
    switch (type) {
      case "proyectos":
        const projects = await db
          .collection("projects")
          .find({
            createdAt: { $gte: startDate },
          })
          .toArray()

        reportData = {
          totalProjects: projects.length,
          activeProjects: projects.filter((p: any) => p.status === "en_progreso").length,
          completedProjects: projects.filter((p: any) => p.status === "completado").length,
          projects: projects.map((p: any) => ({
            name: p.name,
            code: p.code,
            status: p.status,
            progress: p.progress || 0,
            budget: p.budget,
            client: p.client,
          })),
        }
        break

      case "finanzas":
        const [transactions, invoices, payments] = await Promise.all([
          db
            .collection("transactions")
            .find({
              date: { $gte: startDate },
            })
            .toArray(),
          db
            .collection("invoices")
            .find({
              createdAt: { $gte: startDate },
            })
            .toArray(),
          db
            .collection("payments")
            .find({
              createdAt: { $gte: startDate },
            })
            .toArray(),
        ])

        const totalIncome = transactions
          .filter((t: any) => t.type === "ingreso")
          .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)

        const totalExpense = transactions
          .filter((t: any) => t.type === "egreso")
          .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)

        reportData = {
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
          totalInvoices: invoices.length,
          totalPayments: payments.length,
          transactions: transactions.map((t: any) => ({
            type: t.type,
            amount: t.amount,
            description: t.description,
            date: t.date,
          })),
        }
        break

      case "rendimiento":
        const [allProjects, tasks] = await Promise.all([
          db.collection("projects").find({}).toArray(),
          db
            .collection("tasks")
            .find({
              createdAt: { $gte: startDate },
            })
            .toArray(),
        ])

        const avgProgress =
          allProjects.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / (allProjects.length || 1)

        const completedTasks = tasks.filter((t: any) => t.status === "completada").length

        reportData = {
          averageProgress: avgProgress.toFixed(2),
          totalTasks: tasks.length,
          completedTasks,
          completionRate: ((completedTasks / (tasks.length || 1)) * 100).toFixed(2),
          onTimeProjects: allProjects.filter((p: any) => !p.endDate || new Date(p.endDate) >= now).length,
        }
        break

      case "recursos":
        const [inventory, suppliers] = await Promise.all([
          db.collection("inventory").find({}).toArray(),
          db.collection("suppliers").find({}).toArray(),
        ])

        const lowStock = inventory.filter((i: any) => i.quantity <= (i.minimumStock || 10)).length

        reportData = {
          totalItems: inventory.length,
          lowStockItems: lowStock,
          totalSuppliers: suppliers.length,
          inventory: inventory.map((i: any) => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit,
            category: i.category,
          })),
        }
        break

      case "personal":
        const [employees, allTasks] = await Promise.all([
          db.collection("employees").find({}).toArray(),
          db
            .collection("tasks")
            .find({
              assignedTo: { $exists: true },
              createdAt: { $gte: startDate },
            })
            .toArray(),
        ])

        reportData = {
          totalEmployees: employees.length,
          activeEmployees: employees.filter((e: any) => e.status === "activo").length,
          totalTasksAssigned: allTasks.length,
          employees: employees.map((e: any) => ({
            name: `${e.name} ${e.lastName}`,
            position: e.position,
            status: e.status,
            phone: e.phone,
          })),
        }
        break

      default:
        reportData = { message: "Tipo de reporte no soportado" }
    }

    return NextResponse.json({
      success: true,
      type,
      period,
      startDate,
      endDate: now,
      data: reportData,
      generatedBy: user.email,
      generatedAt: new Date(),
    })
  } catch (error) {
    console.error("[v0] Report generation error:", error)
    return NextResponse.json({ error: "Error al generar reporte" }, { status: 500 })
  }
}
