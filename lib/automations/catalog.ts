export type AutomationCatalogItem = {
  _id: string
  name: string
  description: string
  type: string
  trigger: string
  actions: string[]
  enabled: boolean
  executionCount: number
}

export const AUTOMATION_CATALOG: AutomationCatalogItem[] = [
  {
    _id: "preset-quotation-email",
    name: "Envío Automático de Presupuestos",
    description: "Envía automáticamente el presupuesto por email cuando se crea una cotización",
    type: "quotation",
    trigger: "Al crear nueva cotización",
    actions: ["Generar PDF", "Enviar email al cliente", "Crear tarea de seguimiento"],
    enabled: true,
    executionCount: 45,
  },
  {
    _id: "preset-payment-reminder",
    name: "Recordatorio de Pagos Pendientes",
    description: "Envía recordatorios automáticos 3 días antes del vencimiento de facturas",
    type: "payment",
    trigger: "3 días antes del vencimiento",
    actions: ["Enviar email de recordatorio", "Notificar al cliente", "Crear nota en CRM"],
    enabled: true,
    executionCount: 128,
  },
  {
    _id: "preset-quote-followup",
    name: "Seguimiento Post-Presupuesto",
    description: "Programa seguimiento automático con clientes que recibieron presupuesto",
    type: "client",
    trigger: "7 días después de enviar presupuesto",
    actions: ["Enviar email de seguimiento", "Crear tarea de llamada", "Actualizar estado"],
    enabled: false,
    executionCount: 0,
  },
  {
    _id: "preset-weekly-projects",
    name: "Actualización Semanal de Proyectos",
    description: "Envía reporte semanal del avance de proyectos activos a los clientes",
    type: "reminder",
    trigger: "Todos los viernes a las 17:00",
    actions: ["Generar reporte de avance", "Enviar email con fotos", "Actualizar cronograma"],
    enabled: true,
    executionCount: 23,
  },
]

export function getCatalogAutomation(id: string): AutomationCatalogItem | undefined {
  return AUTOMATION_CATALOG.find((a) => a._id === id)
}
