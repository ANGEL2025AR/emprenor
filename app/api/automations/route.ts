import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const db = await getDb()

    // Retornar automatizaciones predefinidas por ahora
    const automations = [
      {
        _id: "1",
        name: "Envío Automático de Presupuestos",
        description: "Envía automáticamente el presupuesto por email cuando se crea una cotización",
        type: "quotation",
        trigger: "Al crear nueva cotización",
        actions: ["Generar PDF", "Enviar email al cliente", "Crear tarea de seguimiento"],
        enabled: true,
        executionCount: 45,
      },
      {
        _id: "2",
        name: "Recordatorio de Pagos Pendientes",
        description: "Envía recordatorios automáticos 3 días antes del vencimiento de facturas",
        type: "payment",
        trigger: "3 días antes del vencimiento",
        actions: ["Enviar email de recordatorio", "Notificar al cliente", "Crear nota en CRM"],
        enabled: true,
        executionCount: 128,
      },
      {
        _id: "3",
        name: "Seguimiento Post-Presupuesto",
        description: "Programa seguimiento automático con clientes que recibieron presupuesto",
        type: "client",
        trigger: "7 días después de enviar presupuesto",
        actions: ["Enviar email de seguimiento", "Crear tarea de llamada", "Actualizar estado"],
        enabled: false,
        executionCount: 0,
      },
      {
        _id: "4",
        name: "Actualización Semanal de Proyectos",
        description: "Envía reporte semanal del avance de proyectos activos a los clientes",
        type: "reminder",
        trigger: "Todos los viernes a las 17:00",
        actions: ["Generar reporte de avance", "Enviar email con fotos", "Actualizar cronograma"],
        enabled: true,
        executionCount: 23,
      },
    ]

    return NextResponse.json({ automations })
  } catch (error) {
    console.error("Error fetching automations:", error)
    return NextResponse.json({ error: "Error al obtener automatizaciones" }, { status: 500 })
  }
}
