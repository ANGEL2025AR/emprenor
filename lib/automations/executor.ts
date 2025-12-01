import { getDb } from "@/lib/db/connection"
import type { ObjectId } from "mongodb"

interface AutomationExecution {
  automationId: ObjectId
  trigger: string
  data: Record<string, unknown>
}

export async function executeAutomation({ automationId, trigger, data }: AutomationExecution) {
  try {
    const db = await getDb()
    const automation = await db.collection("automations").findOne({
      _id: automationId,
      isActive: true,
    })

    if (!automation) {
      console.log(`[Automation] Automation ${automationId} not found or inactive`)
      return false
    }

    console.log(`[Automation] Executing automation: ${automation.name}`)

    switch (automation.action) {
      case "send_email":
        await sendEmailAction(automation, data)
        break
      case "send_sms":
        await sendSMSAction(automation, data)
        break
      case "create_task":
        await createTaskAction(automation, data)
        break
      case "update_status":
        await updateStatusAction(automation, data)
        break
      case "generate_report":
        await generateReportAction(automation, data)
        break
      default:
        console.log(`[Automation] Unknown action: ${automation.action}`)
    }

    await db.collection("automations").updateOne(
      { _id: automationId },
      {
        $set: { lastExecuted: new Date() },
        $inc: { executionCount: 1 },
      },
    )

    await db.collection("automation_logs").insertOne({
      automationId,
      executedAt: new Date(),
      trigger,
      data,
      status: "success",
    })

    return true
  } catch (error) {
    console.error(`[Automation] Error executing automation:`, error)

    const db = await getDb()
    await db.collection("automation_logs").insertOne({
      automationId,
      executedAt: new Date(),
      trigger,
      data,
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return false
  }
}

async function sendEmailAction(automation: unknown, data: Record<string, unknown>) {
  console.log("[Automation] Sending email:", { automation, data })
  // Implementar integración con servicio de email
}

async function sendSMSAction(automation: unknown, data: Record<string, unknown>) {
  console.log("[Automation] Sending SMS:", { automation, data })
  // Implementar integración con servicio de SMS
}

async function createTaskAction(automation: unknown, data: Record<string, unknown>) {
  console.log("[Automation] Creating task:", { automation, data })
  const db = await getDb()
  await db.collection("tasks").insertOne({
    title: `Tarea automática: ${data.title || "Nueva tarea"}`,
    description: `Generada por automatización`,
    status: "pendiente",
    priority: "media",
    createdAt: new Date(),
  })
}

async function updateStatusAction(automation: unknown, data: Record<string, unknown>) {
  console.log("[Automation] Updating status:", { automation, data })
  // Implementar lógica de actualización de estado
}

async function generateReportAction(automation: unknown, data: Record<string, unknown>) {
  console.log("[Automation] Generating report:", { automation, data })
  // Implementar generación de reportes
}

export async function triggerAutomations(trigger: string, data: Record<string, unknown>) {
  const db = await getDb()
  const automations = await db
    .collection("automations")
    .find({
      trigger,
      isActive: true,
    })
    .toArray()

  for (const automation of automations) {
    await executeAutomation({
      automationId: automation._id,
      trigger,
      data,
    })
  }
}
