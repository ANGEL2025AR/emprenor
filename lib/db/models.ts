// Modelos de datos para MongoDB - Sistema Enterprise EMPRENOR
import type { ObjectId } from "mongodb"

// ============================================
// TIPOS BASE
// ============================================

export interface BaseDocument {
  _id?: ObjectId
  createdAt: Date
  updatedAt: Date
}

// ============================================
// USUARIOS Y AUTENTICACIÓN
// ============================================

export const USER_ROLES = ["super_admin", "admin", "gerente", "supervisor", "trabajador", "cliente"] as const
export type UserRole = (typeof USER_ROLES)[number]

export interface User extends BaseDocument {
  email: string
  password: string // bcrypt hash
  name: string
  lastName: string
  phone?: string
  avatar?: string
  role: UserRole
  companyId?: ObjectId
  permissions: string[]
  isActive: boolean
  emailVerified: boolean
  lastLogin?: Date
  resetPasswordToken?: string
  resetPasswordExpires?: Date
}

// ============================================
// EMPRESAS
// ============================================

export interface Company extends BaseDocument {
  name: string
  legalName: string
  cuit: string
  address: {
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  contact: {
    phone: string
    email: string
    website?: string
  }
  logo?: string
  plan: "basico" | "profesional" | "enterprise"
  settings: {
    currency: string
    timezone: string
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
  }
}

// ============================================
// PROYECTOS
// ============================================

export type ProjectStatus = "borrador" | "aprobado" | "en_progreso" | "pausado" | "completado" | "cancelado"
export type ProjectType = "construccion" | "remodelacion" | "mantenimiento" | "industrial" | "otro"
export type Priority = "baja" | "media" | "alta" | "urgente"

export interface Project extends BaseDocument {
  code: string // PRY-2025-001
  name: string
  description: string
  type: ProjectType
  client: {
    name: string
    email: string
    phone: string
    address: string
  }
  location: {
    address: string
    city: string
    province: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  dates: {
    start: Date
    estimatedEnd: Date
    actualEnd?: Date
  }
  budget: {
    estimated: number
    approved: number
    spent: number
    currency: string
  }
  status: ProjectStatus
  progress: number // 0-100
  priority: Priority
  team: {
    managerId: ObjectId
    supervisorId?: ObjectId
    workers: ObjectId[]
  }
  companyId?: ObjectId // companyId ahora es opcional ya que usuarios pueden no tener empresa asociada
  tags: string[]
  coverImage?: string
  createdBy: ObjectId
}

// ============================================
// TAREAS
// ============================================

export type TaskStatus = "pendiente" | "en_progreso" | "en_revision" | "completada" | "cancelada"
export type TaskType = "construccion" | "inspeccion" | "mantenimiento" | "documentacion" | "otro"

export interface Task extends BaseDocument {
  projectId: ObjectId
  code: string // TSK-2025-001
  title: string
  description: string
  type: TaskType
  status: TaskStatus
  priority: Priority
  startDate: Date
  endDate: Date
  estimatedHours: number
  actualHours?: number
  progress: number
  assignedTo: ObjectId[]
  dependencies: ObjectId[] // tareas que deben completarse antes
  checklist: {
    item: string
    completed: boolean
    completedBy?: ObjectId
    completedAt?: Date
  }[]
  estimatedCost?: number
  actualCost?: number
  location?: string
  notes: string
  attachments: string[]
  createdBy: ObjectId
}

// ============================================
// INSPECCIONES
// ============================================

export type InspectionType = "inicial" | "progreso" | "final" | "calidad" | "seguridad"
export type InspectionResult = "aprobado" | "aprobado_con_observaciones" | "rechazado" | "pendiente"

export interface Inspection extends BaseDocument {
  projectId: ObjectId
  taskId?: ObjectId
  code: string // INS-2025-001
  type: InspectionType
  title: string
  description?: string
  date: Date
  inspectorId: ObjectId
  location: string
  result: InspectionResult
  items: {
    category: string
    description: string
    status: "ok" | "observacion" | "falla"
    comment?: string
    images?: string[]
  }[]
  observations?: string
  requiredActions: {
    description: string
    responsibleId?: ObjectId
    deadline?: Date
    completed: boolean
  }[]
  signatures: {
    inspector?: {
      userId: ObjectId
      signature: string
      date: Date
    }
    siteManager?: {
      userId: ObjectId
      signature: string
      date: Date
    }
  }
  attachments: string[]
}

// ============================================
// SISTEMA FINANCIERO
// ============================================

export type TransactionType = "ingreso" | "egreso"
export type TransactionCategory =
  | "pago_cliente"
  | "pago_proveedor"
  | "pago_empleado"
  | "material"
  | "equipo"
  | "servicio"
  | "otro"
export type TransactionStatus = "pendiente" | "pagado" | "parcial" | "vencido" | "cancelado"
export type PaymentMethod = "efectivo" | "transferencia" | "cheque" | "tarjeta" | "otro"

export interface Transaction extends BaseDocument {
  type: TransactionType
  category: TransactionCategory
  projectId: ObjectId
  amount: number
  currency: string
  date: Date
  dueDate?: Date
  status: TransactionStatus
  paymentMethod?: PaymentMethod
  reference: string
  description: string
  supplier?: {
    name: string
    cuit?: string
    contact?: string
  }
  invoice?: {
    number: string
    date: Date
    file?: string
  }
  receipt?: string
  notes: string
  createdBy: ObjectId
  approvedBy?: ObjectId
}

// ============================================
// CERTIFICADOS
// ============================================

export type CertificateType = "avance_obra" | "finalizacion" | "inspeccion" | "garantia" | "otro"
export type CertificateStatus = "borrador" | "emitido" | "aprobado" | "pagado" | "anulado"

export interface Certificate extends BaseDocument {
  projectId: ObjectId
  type: CertificateType
  number: string // CERT-2025-001
  issueDate: Date
  expirationDate?: Date
  progressPercentage?: number
  certifiedAmount?: number
  description: string
  items: {
    description: string
    quantity: number
    unit: string
    unitPrice: number
    subtotal: number
  }[]
  total: number
  status: CertificateStatus
  signatures: {
    issuedBy: {
      userId: ObjectId
      date: Date
      signature?: string
    }
    approvedBy?: {
      userId: ObjectId
      date: Date
      signature?: string
    }
  }
  attachments: string[]
  notes: string
  createdBy: ObjectId
}

// ============================================
// DOCUMENTOS
// ============================================

export type DocumentType = "plano" | "contrato" | "factura" | "certificado" | "informe" | "foto" | "video" | "otro"
export type DocumentAccess = "publico" | "privado" | "equipo"

export interface Document extends BaseDocument {
  projectId: ObjectId
  taskId?: ObjectId
  inspectionId?: ObjectId
  type: DocumentType
  name: string
  description?: string
  file: {
    url: string
    originalName: string
    mimeType: string
    size: number
    hash?: string
  }
  version: number
  tags: string[]
  metadata: {
    width?: number
    height?: number
    captureDate?: Date
    location?: string
    camera?: string
  }
  access: DocumentAccess
  views: number
  downloads: number
  uploadedBy: ObjectId
}

// ============================================
// NOTIFICACIONES
// ============================================

export type NotificationType = "info" | "alerta" | "urgente" | "exito" | "error"
export type NotificationCategory = "proyecto" | "tarea" | "inspeccion" | "pago" | "mensaje" | "sistema"

export interface Notification extends BaseDocument {
  userId: ObjectId
  type: NotificationType
  category: NotificationCategory
  title: string
  message: string
  data?: Record<string, unknown>
  link?: string
  read: boolean
  readAt?: Date
  sentBy?: ObjectId
  channels: ("app" | "email" | "push" | "sms")[]
}

// ============================================
// MENSAJES Y CHAT
// ============================================

export type MessageType = "texto" | "imagen" | "archivo" | "ubicacion" | "sistema"
export type ConversationType = "directa" | "grupo" | "proyecto"

export interface Message extends BaseDocument {
  conversationId: ObjectId
  senderId: ObjectId
  type: MessageType
  content: string
  attachments?: {
    type: string
    url: string
    name: string
  }[]
  replyTo?: ObjectId
  readBy: {
    userId: ObjectId
    date: Date
  }[]
  edited: boolean
  deleted: boolean
}

export interface Conversation extends BaseDocument {
  type: ConversationType
  name?: string
  description?: string
  participants: ObjectId[]
  projectId?: ObjectId
  adminIds: ObjectId[]
  settings: {
    notifications: boolean
    archived: boolean
  }
  lastMessage?: {
    content: string
    date: Date
    senderId: ObjectId
  }
}

// ============================================
// LOG DE ACTIVIDAD
// ============================================

export interface ActivityLog extends BaseDocument {
  userId: ObjectId
  action: string
  entityType: string
  entityId: ObjectId
  previousData?: Record<string, unknown>
  newData?: Record<string, unknown>
  ip: string
  userAgent: string
}

// ============================================
// COTIZACIONES
// ============================================

export type QuotationStatus = "borrador" | "enviada" | "aprobada" | "rechazada" | "expirada"

export interface Quotation extends BaseDocument {
  code: string // COT-2025-001
  clientId?: ObjectId
  clientInfo: {
    name: string
    email: string
    phone: string
    address: string
    cuit?: string
  }
  projectName: string
  projectDescription: string
  validUntil: Date
  items: {
    description: string
    quantity: number
    unit: string
    unitPrice: number
    discount?: number
    subtotal: number
  }[]
  subtotal: number
  discount: number
  tax: number
  total: number
  currency: string
  notes?: string
  terms?: string
  status: QuotationStatus
  approvedAt?: Date
  approvedBy?: ObjectId
  convertedToContractId?: ObjectId
  createdBy: ObjectId
}

// ============================================
// CONTRATOS
// ============================================

export type ContractStatus = "borrador" | "pendiente_firma" | "activo" | "finalizado" | "cancelado"
export type ContractType = "obra_nueva" | "remodelacion" | "mantenimiento" | "consultoria" | "otro"

export interface Contract extends BaseDocument {
  code: string // CONT-2025-001
  quotationId?: ObjectId
  clientId?: ObjectId
  clientInfo: {
    name: string
    legalName?: string
    cuit?: string
    email: string
    phone: string
    address: string
  }
  projectName: string
  type: ContractType
  description: string
  scope: string // alcance del trabajo
  startDate: Date
  estimatedEndDate: Date
  actualEndDate?: Date
  duration: number // días
  amount: number
  currency: string
  paymentTerms: {
    type: "adelanto" | "progreso" | "finalizacion" | "mensual"
    percentage?: number
    amount?: number
    description: string
    dueDate?: Date
  }[]
  penaltyClause?: {
    description: string
    amountPerDay?: number
    percentage?: number
  }
  warranties: {
    type: string
    duration: number // meses
    description: string
  }[]
  deliverables: {
    description: string
    deadline: Date
    delivered: boolean
    deliveredAt?: Date
  }[]
  status: ContractStatus
  signatures: {
    contractor?: {
      signedBy: ObjectId
      date: Date
      signature?: string
    }
    client?: {
      name: string
      date: Date
      signature?: string
    }
  }
  attachments: string[]
  notes?: string
  createdBy: ObjectId
}

// ============================================
// PAGOS
// ============================================

export interface Payment extends BaseDocument {
  type: "ingreso" | "egreso"
  contractId?: ObjectId
  projectId?: ObjectId
  invoiceId?: ObjectId
  paymentNumber: string // PAG-2025-001
  amount: number
  currency: string
  dueDate: Date
  paidDate?: Date
  status: "pendiente" | "parcial" | "pagado" | "atrasado" | "cancelado"
  paymentMethod?: PaymentMethod
  reference?: string
  description: string
  payer?: {
    name: string
    email?: string
    phone?: string
  }
  recipient?: {
    name: string
    email?: string
    phone?: string
  }
  bankDetails?: {
    bankName: string
    accountNumber: string
    accountType: string
  }
  receipt?: string
  notes?: string
  createdBy: ObjectId
  approvedBy?: ObjectId
  approvedAt?: Date
}

// ============================================
// FACTURAS
// ============================================

export type InvoiceType = "A" | "B" | "C" | "E"
export type InvoiceStatus = "borrador" | "emitida" | "enviada" | "pagada" | "parcial" | "vencida" | "anulada"

export interface Invoice extends BaseDocument {
  invoiceNumber: string // FC-A-0001-00000001
  type: InvoiceType
  contractId?: ObjectId
  projectId?: ObjectId
  certificateId?: ObjectId
  issueDate: Date
  dueDate: Date
  client: {
    name: string
    legalName?: string
    cuit?: string
    taxCondition: "responsable_inscripto" | "monotributo" | "exento" | "consumidor_final"
    email: string
    phone?: string
    address: string
  }
  items: {
    code?: string
    description: string
    quantity: number
    unit: string
    unitPrice: number
    discount?: number
    taxRate: number
    subtotal: number
    tax: number
    total: number
  }[]
  subtotal: number
  discount: number
  taxBase: number
  tax: number
  total: number
  currency: string
  exchangeRate?: number
  paymentTerms: string
  observations?: string
  status: InvoiceStatus
  paidAmount: number
  paidDate?: Date
  cae?: string // Código de Autorización Electrónica (AFIP Argentina)
  caeExpiration?: Date
  afipUrl?: string
  pdfUrl?: string
  payments: {
    paymentId: ObjectId
    amount: number
    date: Date
  }[]
  createdBy: ObjectId
}

// ============================================
// PROYECTOS PÚBLICOS DEL SITIO WEB
// ============================================

export type PublicProjectCategory =
  | "Residencial"
  | "Comercial"
  | "Industrial"
  | "Remodelación"
  | "Oficina Gubernamental"
  | "Otro"

export interface PublicProject extends BaseDocument {
  title: string
  category: PublicProjectCategory
  description: string
  detailedDescription?: string
  duration: string // ej: "8 meses"
  location: string
  image: string
  gallery?: string[] // URLs de imágenes adicionales
  featured: boolean // destacar en inicio
  order: number // orden de visualización
  published: boolean
  publishDate?: Date
  metadata?: {
    client?: string
    area?: string
    budget?: number
    year?: number
    [key: string]: unknown
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
  createdBy: ObjectId
}

// ============================================
// RECURSOS HUMANOS POR PROYECTO
// ============================================

export type EmployeeRole =
  | "gerente_proyecto"
  | "supervisor"
  | "ingeniero"
  | "maestro_mayor_obras"
  | "oficial"
  | "ayudante"
  | "operador_maquinaria"
  | "administrativo"

export interface Employee extends BaseDocument {
  personalInfo: {
    firstName: string
    lastName: string
    dni: string
    cuil: string
    birthDate: Date
    address: string
    phone: string
    email: string
    emergencyContact: {
      name: string
      relationship: string
      phone: string
    }
  }
  employment: {
    role: EmployeeRole
    startDate: Date
    endDate?: Date
    status: "activo" | "licencia" | "suspendido" | "finalizado"
    contractType: "efectivo" | "temporal" | "contratista"
    salary: number
    currency: string
  }
  skills: string[]
  certifications: {
    name: string
    issuedBy: string
    issueDate: Date
    expiryDate?: Date
    documentUrl?: string
  }[]
  projectAssignments: {
    projectId: ObjectId
    role: EmployeeRole
    startDate: Date
    endDate?: Date
    hoursWorked: number
  }[]
  attendanceRecords: {
    date: Date
    projectId?: ObjectId
    checkIn: Date
    checkOut?: Date
    hoursWorked: number
    notes?: string
  }[]
  documents: {
    type: "cv" | "contrato" | "certificado" | "examen_medico" | "otro"
    name: string
    url: string
    uploadDate: Date
  }[]
  companyId?: ObjectId
  createdBy: ObjectId
}

// ============================================
// MATERIALES Y PRODUCTOS POR PROYECTO
// ============================================

export type MaterialCategory =
  | "cemento_hormigon"
  | "acero_hierro"
  | "madera"
  | "ceramicos_revestimientos"
  | "pintura"
  | "electricos"
  | "plomeria"
  | "aislantes"
  | "herramientas"
  | "equipos"
  | "otros"

export interface Material extends BaseDocument {
  code: string // MAT-2025-001
  name: string
  description: string
  category: MaterialCategory
  unit: string // m2, kg, unidad, litro, etc
  specifications: {
    brand?: string
    model?: string
    quality?: string
    dimensions?: string
    weight?: string
    color?: string
    [key: string]: string | undefined
  }
  pricing: {
    costPrice: number
    currency: string
    supplier?: string
    lastUpdate: Date
  }
  stock: {
    warehouse: string
    quantity: number
    minStock: number
    maxStock: number
  }
  images: string[]
  datasheetUrl?: string
  companyId?: ObjectId
}

export interface ProjectMaterial extends BaseDocument {
  projectId: ObjectId
  materialId: ObjectId
  taskId?: ObjectId
  quantity: {
    estimated: number
    actual: number
    unit: string
  }
  cost: {
    estimated: number
    actual: number
    currency: string
  }
  supplier?: {
    name: string
    contact: string
    deliveryDate?: Date
  }
  status: "por_pedir" | "pedido" | "en_transito" | "entregado" | "instalado"
  location?: string
  notes?: string
  purchaseOrderNumber?: string
  invoiceNumber?: string
  deliveryReceipt?: string
  usedBy: ObjectId[]
  usageLog: {
    date: Date
    quantity: number
    taskId?: ObjectId
    usedBy: ObjectId
    notes?: string
  }[]
  createdBy: ObjectId
}

// ============================================
// REPORTES LEGALES
// ============================================

export interface LegalReport extends BaseDocument {
  projectId: ObjectId
  reportType: "proyecto_completo" | "financiero" | "tecnico" | "auditoria"
  reportNumber: string
  generatedBy: ObjectId
  content: Record<string, unknown>
  legalValidity: {
    certified: boolean
    certificationNumber?: string
    certificationDate?: Date
    validUntil?: Date
    digitalSignature?: string
  }
  signatures: {
    projectManager?: {
      userId: ObjectId
      name: string
      signature?: string
      date: Date
    }
    technicalDirector?: {
      userId: ObjectId
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
  pdfUrl?: string
  status: "borrador" | "emitido" | "firmado" | "archivado"
}
