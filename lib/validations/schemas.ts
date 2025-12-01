// Schemas de validación con Zod
import { z } from "zod"

// ============================================
// AUTENTICACIÓN
// ============================================

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export const registerSchema = z
  .object({
    email: z.string().email("Email inválido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmPassword: z.string(),
    name: z.string().min(2, "El nombre es requerido"),
    lastName: z.string().min(2, "El apellido es requerido"),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
})

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

// ============================================
// PROYECTOS
// ============================================

export const projectSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  type: z.enum(["construccion", "remodelacion", "mantenimiento", "industrial", "otro"]),
  client: z.object({
    name: z.string().min(2, "El nombre del cliente es requerido"),
    email: z.string().email("Email del cliente inválido"),
    phone: z.string().min(8, "Teléfono del cliente inválido"),
    address: z.string().min(5, "Dirección del cliente requerida"),
  }),
  location: z.object({
    address: z.string().min(5, "Dirección de obra requerida"),
    city: z.string().min(2, "Ciudad requerida"),
    province: z.string().min(2, "Provincia requerida"),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }),
  dates: z.object({
    start: z.coerce.date(),
    estimatedEnd: z.coerce.date(),
  }),
  budget: z.object({
    estimated: z.number().positive("El presupuesto debe ser positivo"),
    currency: z.string().default("ARS"),
  }),
  priority: z.enum(["baja", "media", "alta", "urgente"]),
  tags: z.array(z.string()).optional(),
})

// ============================================
// TAREAS
// ============================================

export const taskSchema = z.object({
  projectId: z.string(),
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  type: z.enum(["construccion", "inspeccion", "mantenimiento", "documentacion", "otro"]),
  priority: z.enum(["baja", "media", "alta", "urgente"]),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  estimatedHours: z.number().positive("Las horas estimadas deben ser positivas"),
  assignedTo: z.array(z.string()).optional(),
  estimatedCost: z.number().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
})

// ============================================
// INSPECCIONES
// ============================================

export const inspectionSchema = z.object({
  projectId: z.string(),
  taskId: z.string().optional(),
  type: z.enum(["inicial", "progreso", "final", "calidad", "seguridad"]),
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  date: z.coerce.date(),
  location: z.string().min(3, "La ubicación es requerida"),
  items: z.array(
    z.object({
      category: z.string(),
      description: z.string(),
      status: z.enum(["ok", "observacion", "falla"]),
      comment: z.string().optional(),
    }),
  ),
  observations: z.string().optional(),
})

// ============================================
// TRANSACCIONES FINANCIERAS
// ============================================

export const transactionSchema = z.object({
  type: z.enum(["ingreso", "egreso"]),
  category: z.enum(["pago_cliente", "pago_proveedor", "pago_empleado", "material", "equipo", "servicio", "otro"]),
  projectId: z.string(),
  amount: z.number().positive("El monto debe ser positivo"),
  currency: z.string().default("ARS"),
  date: z.coerce.date(),
  dueDate: z.coerce.date().optional(),
  paymentMethod: z.enum(["efectivo", "transferencia", "cheque", "tarjeta", "otro"]).optional(),
  reference: z.string().optional(),
  description: z.string().min(5, "La descripción es requerida"),
  supplier: z
    .object({
      name: z.string(),
      cuit: z.string().optional(),
      contact: z.string().optional(),
    })
    .optional(),
  notes: z.string().optional(),
})

// ============================================
// CERTIFICADOS
// ============================================

export const certificateSchema = z.object({
  projectId: z.string(),
  type: z.enum(["avance_obra", "finalizacion", "inspeccion", "garantia", "otro"]),
  description: z.string().min(10, "La descripción es requerida"),
  progressPercentage: z.number().min(0).max(100).optional(),
  items: z.array(
    z.object({
      description: z.string(),
      quantity: z.number().positive(),
      unit: z.string(),
      unitPrice: z.number().positive(),
    }),
  ),
  notes: z.string().optional(),
})

// ============================================
// DOCUMENTOS
// ============================================

export const documentSchema = z.object({
  projectId: z.string(),
  taskId: z.string().optional(),
  type: z.enum(["plano", "contrato", "factura", "certificado", "informe", "foto", "video", "otro"]),
  name: z.string().min(3, "El nombre es requerido"),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  access: z.enum(["publico", "privado", "equipo"]).default("equipo"),
})

// ============================================
// USUARIOS
// ============================================

export const userSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "El nombre es requerido"),
  lastName: z.string().min(2, "El apellido es requerido"),
  phone: z.string().optional(),
  role: z.enum(["super_admin", "admin", "gerente", "supervisor", "trabajador", "cliente"]),
  isActive: z.boolean().default(true),
})

// Types exportados
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type TaskInput = z.infer<typeof taskSchema>
export type InspectionInput = z.infer<typeof inspectionSchema>
export type TransactionInput = z.infer<typeof transactionSchema>
export type CertificateInput = z.infer<typeof certificateSchema>
export type DocumentInput = z.infer<typeof documentSchema>
export type UserInput = z.infer<typeof userSchema>
