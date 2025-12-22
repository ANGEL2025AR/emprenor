import type { ObjectId, Db } from "mongodb"
import type { Project, Task, Inspection, Certificate, Payment, Document } from "@/lib/db/models"

export interface ProjectCreationData {
  project: Partial<Project>
  createInitialTasks?: boolean
  createInspectionSchedule?: boolean
  createPaymentPlan?: boolean
  assignTeam?: boolean
}

export interface AutomationResult {
  success: boolean
  projectId?: ObjectId
  tasksCreated?: number
  inspectionsCreated?: number
  paymentsCreated?: number
  certificatesCreated?: number
  message: string
  errors?: string[]
}

export async function automateProjectCreation(
  db: Db,
  data: ProjectCreationData,
  userId: ObjectId,
): Promise<AutomationResult> {
  const errors: string[] = []
  let tasksCreated = 0
  let inspectionsCreated = 0
  let paymentsCreated = 0
  let certificatesCreated = 0

  try {
    const projectData: Partial<Project> = {
      ...data.project,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      progress: 0,
      status: "borrador",
      code: await generateProjectCode(db),
    }

    const projectResult = await db.collection("projects").insertOne(projectData as Project)
    const projectId = projectResult.insertedId

    if (data.createInitialTasks) {
      tasksCreated = await createInitialProjectTasks(db, projectId, userId)
    }

    if (data.createInspectionSchedule) {
      inspectionsCreated = await createInspectionSchedule(db, projectId, userId, data.project.dates)
    }

    if (data.createPaymentPlan) {
      paymentsCreated = await createPaymentPlan(db, projectId, userId, data.project.budget)
    }

    certificatesCreated = await createInitialCertificates(db, projectId, userId)

    await createProjectDocumentStructure(db, projectId, userId)

    return {
      success: true,
      projectId,
      tasksCreated,
      inspectionsCreated,
      paymentsCreated,
      certificatesCreated,
      message: `Proyecto creado exitosamente con ${tasksCreated} tareas, ${inspectionsCreated} inspecciones, ${paymentsCreated} pagos y ${certificatesCreated} certificados programados automáticamente`,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (error) {
    return {
      success: false,
      message: `Error al crear proyecto: ${error instanceof Error ? error.message : "Error desconocido"}`,
      errors: [error instanceof Error ? error.message : "Error desconocido"],
    }
  }
}

async function generateProjectCode(db: Db): Promise<string> {
  const year = new Date().getFullYear()
  const count = await db.collection("projects").countDocuments()
  return `PRY-${year}-${String(count + 1).padStart(4, "0")}`
}

async function createInitialProjectTasks(db: Db, projectId: ObjectId, userId: ObjectId): Promise<number> {
  const standardTasks: Partial<Task>[] = [
    {
      projectId,
      code: `TSK-${Date.now()}-001`,
      title: "Revisión y aprobación de documentación inicial",
      description: "Validar permisos, planos y documentación legal antes de iniciar obra",
      type: "documentacion",
      status: "pendiente",
      priority: "alta",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      estimatedHours: 16,
      progress: 0,
      assignedTo: [],
      dependencies: [],
      checklist: [
        { item: "Permisos municipales aprobados", completed: false },
        { item: "Planos arquitectónicos validados", completed: false },
        { item: "Estudio de suelos completo", completed: false },
        { item: "Póliza de seguro activa", completed: false },
      ],
      notes: "Crítico para iniciar construcción",
      attachments: [],
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      projectId,
      code: `TSK-${Date.now()}-002`,
      title: "Preparación del terreno y replanteo",
      description: "Limpieza, nivelación y marcado del perímetro de construcción",
      type: "construccion",
      status: "pendiente",
      priority: "alta",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      estimatedHours: 40,
      progress: 0,
      assignedTo: [],
      dependencies: [],
      checklist: [
        { item: "Limpieza y desmalezado completo", completed: false },
        { item: "Nivelación topográfica realizada", completed: false },
        { item: "Replanteo y estaqueado verificado", completed: false },
      ],
      notes: "Requiere topógrafo certificado",
      attachments: [],
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      projectId,
      code: `TSK-${Date.now()}-003`,
      title: "Excavación y fundaciones",
      description: "Excavación de zanjas, armado de hierro y colado de fundaciones",
      type: "construccion",
      status: "pendiente",
      priority: "alta",
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      estimatedHours: 120,
      progress: 0,
      assignedTo: [],
      dependencies: [],
      checklist: [
        { item: "Excavación según planos completada", completed: false },
        { item: "Encofrado verificado", completed: false },
        { item: "Hierros armados e inspeccionados", completed: false },
        { item: "Hormigón colado y curado", completed: false },
      ],
      notes: "Crítico - Requiere inspección antes de colar",
      attachments: [],
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      projectId,
      code: `TSK-${Date.now()}-004`,
      title: "Estructura principal - Columnas y vigas",
      description: "Levantamiento de estructura principal según diseño estructural",
      type: "construccion",
      status: "pendiente",
      priority: "alta",
      startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000),
      estimatedHours: 200,
      progress: 0,
      assignedTo: [],
      dependencies: [],
      checklist: [
        { item: "Columnas armadas y coladas", completed: false },
        { item: "Vigas principales instaladas", completed: false },
        { item: "Losa de entrepiso ejecutada", completed: false },
        { item: "Control de verticalidad verificado", completed: false },
      ],
      notes: "Requiere ingeniero estructural en obra",
      attachments: [],
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      projectId,
      code: `TSK-${Date.now()}-005`,
      title: "Mampostería y cerramientos",
      description: "Construcción de paredes, tabiques y cerramientos exteriores",
      type: "construccion",
      status: "pendiente",
      priority: "media",
      startDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000),
      estimatedHours: 160,
      progress: 0,
      assignedTo: [],
      dependencies: [],
      checklist: [
        { item: "Mampostería perimetral completada", completed: false },
        { item: "Tabiques interiores levantados", completed: false },
        { item: "Dinteles instalados", completed: false },
        { item: "Carpintería de obra colocada", completed: false },
      ],
      notes: "",
      attachments: [],
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const result = await db.collection("tasks").insertMany(standardTasks as Task[])
  return result.insertedCount
}

async function createInspectionSchedule(
  db: Db,
  projectId: ObjectId,
  userId: ObjectId,
  dates?: { start: Date; estimatedEnd: Date },
): Promise<number> {
  if (!dates) return 0

  const projectDuration = dates.estimatedEnd.getTime() - dates.start.getTime()
  const inspectionInterval = projectDuration / 4

  const inspections: Partial<Inspection>[] = [
    {
      projectId,
      code: `INS-${Date.now()}-001`,
      type: "inicial",
      title: "Inspección inicial de obra",
      description: "Verificación de condiciones iniciales, permisos y preparación del sitio",
      date: dates.start,
      inspectorId: userId,
      location: "Sitio de obra",
      result: "pendiente",
      items: [],
      requiredActions: [],
      signatures: {},
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      projectId,
      code: `INS-${Date.now()}-002`,
      type: "progreso",
      title: "Inspección de progreso 25%",
      description: "Verificación de avance y calidad en primera etapa",
      date: new Date(dates.start.getTime() + inspectionInterval),
      inspectorId: userId,
      location: "Sitio de obra",
      result: "pendiente",
      items: [],
      requiredActions: [],
      signatures: {},
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      projectId,
      code: `INS-${Date.now()}-003`,
      type: "progreso",
      title: "Inspección de progreso 50%",
      description: "Verificación de avance y calidad a mitad de obra",
      date: new Date(dates.start.getTime() + inspectionInterval * 2),
      inspectorId: userId,
      location: "Sitio de obra",
      result: "pendiente",
      items: [],
      requiredActions: [],
      signatures: {},
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      projectId,
      code: `INS-${Date.now()}-004`,
      type: "progreso",
      title: "Inspección de progreso 75%",
      description: "Verificación de avance y calidad en etapa final",
      date: new Date(dates.start.getTime() + inspectionInterval * 3),
      inspectorId: userId,
      location: "Sitio de obra",
      result: "pendiente",
      items: [],
      requiredActions: [],
      signatures: {},
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      projectId,
      code: `INS-${Date.now()}-005`,
      type: "final",
      title: "Inspección final de obra",
      description: "Verificación final y entrega de obra terminada",
      date: dates.estimatedEnd,
      inspectorId: userId,
      location: "Sitio de obra",
      result: "pendiente",
      items: [],
      requiredActions: [],
      signatures: {},
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const result = await db.collection("inspections").insertMany(inspections as Inspection[])
  return result.insertedCount
}

async function createPaymentPlan(
  db: Db,
  projectId: ObjectId,
  userId: ObjectId,
  budget?: { approved: number; currency: string },
): Promise<number> {
  if (!budget || !budget.approved) return 0

  const totalAmount = budget.approved
  const adelanto = totalAmount * 0.3
  const progreso1 = totalAmount * 0.2
  const progreso2 = totalAmount * 0.2
  const progreso3 = totalAmount * 0.15
  const final = totalAmount * 0.15

  const payments: Partial<Payment>[] = [
    {
      type: "ingreso",
      projectId,
      paymentNumber: `PAG-${Date.now()}-001`,
      amount: adelanto,
      currency: budget.currency || "ARS",
      dueDate: new Date(),
      status: "pendiente",
      description: "Anticipo 30% - Inicio de obra",
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      type: "ingreso",
      projectId,
      paymentNumber: `PAG-${Date.now()}-002`,
      amount: progreso1,
      currency: budget.currency || "ARS",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "pendiente",
      description: "Progreso 20% - Primera etapa completada",
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      type: "ingreso",
      projectId,
      paymentNumber: `PAG-${Date.now()}-003`,
      amount: progreso2,
      currency: budget.currency || "ARS",
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: "pendiente",
      description: "Progreso 20% - Segunda etapa completada",
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      type: "ingreso",
      projectId,
      paymentNumber: `PAG-${Date.now()}-004`,
      amount: progreso3,
      currency: budget.currency || "ARS",
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      status: "pendiente",
      description: "Progreso 15% - Tercera etapa completada",
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      type: "ingreso",
      projectId,
      paymentNumber: `PAG-${Date.now()}-005`,
      amount: final,
      currency: budget.currency || "ARS",
      dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      status: "pendiente",
      description: "Pago final 15% - Obra completada y entregada",
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const result = await db.collection("payments").insertMany(payments as Payment[])
  return result.insertedCount
}

async function createInitialCertificates(db: Db, projectId: ObjectId, userId: ObjectId): Promise<number> {
  const certificate: Partial<Certificate> = {
    projectId,
    type: "avance_obra",
    number: `CERT-${Date.now()}-001`,
    issueDate: new Date(),
    progressPercentage: 0,
    certifiedAmount: 0,
    description: "Certificado de inicio de obra",
    items: [],
    total: 0,
    status: "borrador",
    signatures: {
      issuedBy: {
        userId,
        date: new Date(),
      },
    },
    attachments: [],
    notes: "Certificado inicial - A completar con primer avance",
    createdBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection("certificates").insertOne(certificate as Certificate)
  return result.insertedId ? 1 : 0
}

async function createProjectDocumentStructure(db: Db, projectId: ObjectId, userId: ObjectId): Promise<void> {
  const documentStructure: Partial<Document>[] = [
    {
      projectId,
      type: "plano",
      name: "Carpeta de Planos del Proyecto",
      description: "Almacenar todos los planos arquitectónicos, estructurales y de instalaciones",
      file: {
        url: "",
        originalName: "carpeta_planos",
        mimeType: "folder",
        size: 0,
      },
      version: 1,
      tags: ["planos", "documentacion_tecnica"],
      metadata: {},
      access: "equipo",
      views: 0,
      downloads: 0,
      uploadedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      projectId,
      type: "contrato",
      name: "Documentación Legal",
      description: "Contratos, permisos y documentación legal del proyecto",
      file: {
        url: "",
        originalName: "documentacion_legal",
        mimeType: "folder",
        size: 0,
      },
      version: 1,
      tags: ["legal", "contratos"],
      metadata: {},
      access: "privado",
      views: 0,
      downloads: 0,
      uploadedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      projectId,
      type: "foto",
      name: "Registro Fotográfico",
      description: "Fotos de avance y progreso de obra",
      file: {
        url: "",
        originalName: "registro_fotografico",
        mimeType: "folder",
        size: 0,
      },
      version: 1,
      tags: ["fotos", "avance"],
      metadata: {},
      access: "equipo",
      views: 0,
      downloads: 0,
      uploadedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  await db.collection("documents").insertMany(documentStructure as Document[])
}

export async function calculateProjectProgress(db: Db, projectId: ObjectId): Promise<number> {
  const tasks = await db.collection("tasks").find({ projectId }).toArray()

  if (tasks.length === 0) return 0

  const totalProgress = tasks.reduce((sum, task) => sum + (task.progress || 0), 0)
  return Math.round(totalProgress / tasks.length)
}

export async function updateProjectProgress(db: Db, projectId: ObjectId): Promise<void> {
  const progress = await calculateProjectProgress(db, projectId)

  await db.collection("projects").updateOne({ _id: projectId }, { $set: { progress, updatedAt: new Date() } })
}
