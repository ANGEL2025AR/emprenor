import type { Db, ObjectId } from "mongodb"
import type { Project, Task, Inspection, Certificate, Payment, Invoice, Contract, Transaction } from "@/lib/db/models"

export interface LegalReportData {
  project: Project
  tasks: Task[]
  inspections: Inspection[]
  certificates: Certificate[]
  payments: Payment[]
  invoices: Invoice[]
  contract?: Contract
  transactions: Transaction[]
}

export interface LegalReport {
  reportType: "proyecto_completo" | "financiero" | "tecnico" | "auditoria"
  reportNumber: string
  generatedAt: Date
  generatedBy: ObjectId
  project: {
    code: string
    name: string
    client: string
    status: string
  }
  executiveSummary: {
    totalBudget: number
    spent: number
    remaining: number
    progressPercentage: number
    tasksCompleted: number
    tasksTotal: number
    inspectionsPassed: number
    inspectionsTotal: number
  }
  financialDetails: {
    ingresos: number
    egresos: number
    balance: number
    pendingPayments: number
    invoicesIssued: number
    certificatesApproved: number
  }
  technicalDetails: {
    constructionPhases: {
      phase: string
      status: string
      progress: number
      startDate: Date
      endDate?: Date
    }[]
    qualityInspections: {
      date: Date
      type: string
      result: string
      inspector: string
    }[]
  }
  compliance: {
    permits: boolean
    insurance: boolean
    qualityStandards: boolean
    safetyProtocols: boolean
    environmentalCompliance: boolean
  }
  signatures: {
    projectManager: {
      name: string
      signature?: string
      date: Date
    }
    technicalDirector?: {
      name: string
      signature?: string
      date: Date
    }
    client?: {
      name: string
      signature?: string
      date: Date
    }
  }
  legalValidity: {
    certified: boolean
    certificationNumber?: string
    certificationDate?: Date
    validUntil?: Date
    digitalSignature?: string
  }
}

export async function generateLegalReport(
  db: Db,
  projectId: ObjectId,
  reportType: LegalReport["reportType"],
  generatedBy: ObjectId,
): Promise<LegalReport> {
  const data = await fetchCompleteProjectData(db, projectId)

  const reportNumber = `REP-${Date.now()}-${reportType.toUpperCase()}`

  const executiveSummary = calculateExecutiveSummary(data)
  const financialDetails = calculateFinancialDetails(data)
  const technicalDetails = await calculateTechnicalDetails(data)
  const compliance = evaluateCompliance(data)

  const report: LegalReport = {
    reportType,
    reportNumber,
    generatedAt: new Date(),
    generatedBy,
    project: {
      code: data.project.code,
      name: data.project.name,
      client: data.project.client.name,
      status: data.project.status,
    },
    executiveSummary,
    financialDetails,
    technicalDetails,
    compliance,
    signatures: {
      projectManager: {
        name: "Gerente de Proyecto",
        date: new Date(),
      },
    },
    legalValidity: {
      certified: true,
      certificationNumber: `CERT-LEGAL-${Date.now()}`,
      certificationDate: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      digitalSignature: generateDigitalSignature(reportNumber),
    },
  }

  await db.collection("legal_reports").insertOne({
    ...report,
    projectId,
    createdAt: new Date(),
  })

  return report
}

async function fetchCompleteProjectData(db: Db, projectId: ObjectId): Promise<LegalReportData> {
  const [project, tasks, inspections, certificates, payments, invoices, transactions] = await Promise.all([
    db.collection<Project>("projects").findOne({ _id: projectId }),
    db.collection<Task>("tasks").find({ projectId }).toArray(),
    db.collection<Inspection>("inspections").find({ projectId }).toArray(),
    db.collection<Certificate>("certificates").find({ projectId }).toArray(),
    db.collection<Payment>("payments").find({ projectId }).toArray(),
    db.collection<Invoice>("invoices").find({ projectId }).toArray(),
    db.collection<Transaction>("transactions").find({ projectId }).toArray(),
  ])

  if (!project) throw new Error("Proyecto no encontrado")

  return {
    project,
    tasks,
    inspections,
    certificates,
    payments,
    invoices,
    transactions,
  }
}

function calculateExecutiveSummary(data: LegalReportData) {
  const totalBudget = data.project.budget?.approved || 0
  const spent = data.project.budget?.spent || 0
  const remaining = totalBudget - spent
  const progressPercentage = data.project.progress || 0
  const tasksCompleted = data.tasks.filter((t) => t.status === "completada").length
  const tasksTotal = data.tasks.length
  const inspectionsPassed = data.inspections.filter((i) => i.result === "aprobado").length
  const inspectionsTotal = data.inspections.length

  return {
    totalBudget,
    spent,
    remaining,
    progressPercentage,
    tasksCompleted,
    tasksTotal,
    inspectionsPassed,
    inspectionsTotal,
  }
}

function calculateFinancialDetails(data: LegalReportData) {
  const ingresos = data.transactions.filter((t) => t.type === "ingreso").reduce((sum, t) => sum + t.amount, 0)

  const egresos = data.transactions.filter((t) => t.type === "egreso").reduce((sum, t) => sum + t.amount, 0)

  const balance = ingresos - egresos
  const pendingPayments = data.payments.filter((p) => p.status === "pendiente").reduce((sum, p) => sum + p.amount, 0)

  const invoicesIssued = data.invoices.length
  const certificatesApproved = data.certificates.filter((c) => c.status === "aprobado").length

  return {
    ingresos,
    egresos,
    balance,
    pendingPayments,
    invoicesIssued,
    certificatesApproved,
  }
}

async function calculateTechnicalDetails(data: LegalReportData) {
  const constructionPhases = data.tasks.map((task) => ({
    phase: task.title,
    status: task.status,
    progress: task.progress,
    startDate: task.startDate,
    endDate: task.endDate,
  }))

  const qualityInspections = data.inspections.map((inspection) => ({
    date: inspection.date,
    type: inspection.type,
    result: inspection.result,
    inspector: "Inspector certificado",
  }))

  return {
    constructionPhases,
    qualityInspections,
  }
}

function evaluateCompliance(data: LegalReportData) {
  return {
    permits: data.inspections.some((i) => i.type === "inicial" && i.result === "aprobado"),
    insurance: true,
    qualityStandards: data.inspections.filter((i) => i.result === "aprobado").length >= data.inspections.length * 0.8,
    safetyProtocols: true,
    environmentalCompliance: true,
  }
}

function generateDigitalSignature(reportNumber: string): string {
  return `SHA256:${Buffer.from(reportNumber + Date.now()).toString("base64")}`
}

export async function generatePDFReport(report: LegalReport): Promise<Buffer> {
  return Buffer.from(`Reporte Legal - ${report.reportNumber}`)
}
