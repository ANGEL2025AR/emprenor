// Sistema de permisos granulares con soporte para roles dinámicos desde MongoDB
import type { UserRole } from "@/lib/db/models"

// ============================================
// PERMISOS POR DEFECTO (fallback estático)
// ============================================

export const DEFAULT_PERMISSIONS: Record<string, string[]> = {
  // Proyectos
  "projects.view": ["super_admin", "admin", "gerente", "supervisor", "trabajador", "cliente"],
  "projects.create": ["super_admin", "admin", "gerente"],
  "projects.edit": ["super_admin", "admin", "gerente"],
  "projects.delete": ["super_admin", "admin"],
  "projects.export": ["super_admin", "admin", "gerente"],

  // Tareas
  "tasks.view": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "tasks.create": ["super_admin", "admin", "gerente", "supervisor"],
  "tasks.edit": ["super_admin", "admin", "gerente", "supervisor"],
  "tasks.delete": ["super_admin", "admin", "gerente"],
  "tasks.assign": ["super_admin", "admin", "gerente", "supervisor"],

  // Inspecciones
  "inspections.view": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "inspections.create": ["super_admin", "admin", "gerente", "supervisor"],
  "inspections.edit": ["super_admin", "admin", "gerente", "supervisor"],
  "inspections.approve": ["super_admin", "admin", "gerente"],
  "inspections.sign": ["super_admin", "admin", "gerente", "supervisor"],

  // Finanzas
  "finance.view": ["super_admin", "admin", "gerente"],
  "finance.create": ["super_admin", "admin", "gerente"],
  "finance.edit": ["super_admin", "admin"],
  "finance.approve": ["super_admin", "admin"],
  "finance.export": ["super_admin", "admin", "gerente"],

  // Documentos
  "documents.view": ["super_admin", "admin", "gerente", "supervisor", "trabajador", "cliente"],
  "documents.upload": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "documents.delete": ["super_admin", "admin", "gerente"],
  "documents.download": ["super_admin", "admin", "gerente", "supervisor", "trabajador", "cliente"],

  // Usuarios
  "users.view": ["super_admin", "admin", "gerente"],
  "users.create": ["super_admin", "admin"],
  "users.edit": ["super_admin", "admin"],
  "users.delete": ["super_admin"],
  "users.roles": ["super_admin"],

  // Clientes
  "clients.view": ["super_admin", "admin", "gerente", "supervisor"],
  "clients.create": ["super_admin", "admin", "gerente"],
  "clients.edit": ["super_admin", "admin", "gerente"],
  "clients.delete": ["super_admin", "admin"],

  // Certificados
  "certificates.view": ["super_admin", "admin", "gerente", "supervisor", "cliente"],
  "certificates.create": ["super_admin", "admin", "gerente"],
  "certificates.edit": ["super_admin", "admin", "gerente"],
  "certificates.approve": ["super_admin", "admin"],
  "certificates.sign": ["super_admin", "admin", "gerente"],

  // Inventario
  "inventory.view": ["super_admin", "admin", "gerente", "supervisor"],
  "inventory.create": ["super_admin", "admin", "gerente"],
  "inventory.edit": ["super_admin", "admin", "gerente"],
  "inventory.delete": ["super_admin", "admin"],

  // Proveedores
  "suppliers.view": ["super_admin", "admin", "gerente"],
  "suppliers.create": ["super_admin", "admin", "gerente"],
  "suppliers.edit": ["super_admin", "admin", "gerente"],
  "suppliers.delete": ["super_admin", "admin"],

  // Reportes
  "reports.view": ["super_admin", "admin", "gerente"],
  "reports.create": ["super_admin", "admin", "gerente"],
  "reports.export": ["super_admin", "admin", "gerente"],

  // Calidad
  "quality.view": ["super_admin", "admin", "gerente", "supervisor"],
  "quality.create": ["super_admin", "admin", "gerente"],
  "quality.approve": ["super_admin", "admin"],

  // Incidencias
  "incidents.view": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "incidents.create": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "incidents.edit": ["super_admin", "admin", "gerente", "supervisor"],
  "incidents.resolve": ["super_admin", "admin", "gerente"],

  // Chat y Notificaciones
  "chat.view": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "chat.create": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "notifications.view": ["super_admin", "admin", "gerente", "supervisor", "trabajador", "cliente"],

  // Calendario
  "calendar.view": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "calendar.create": ["super_admin", "admin", "gerente", "supervisor"],
  "calendar.edit": ["super_admin", "admin", "gerente", "supervisor"],

  // Automatizaciones
  "automations.view": ["super_admin", "admin"],
  "automations.create": ["super_admin", "admin"],
  "automations.edit": ["super_admin", "admin"],

  // Contactos (formulario web)
  "contacts.view": ["super_admin", "admin"],
  "contacts.manage": ["super_admin", "admin"],
  "contacts.delete": ["super_admin", "admin"],

  // Bitácora diaria
  "daily_logs.view": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "daily_logs.create": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],

  // Portal del Empleado
  "portal.dashboard": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "portal.wallet": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "portal.payslips": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "portal.personnel_file": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "portal.leave_requests": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "portal.art": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "portal.accidents": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "portal.help_desk": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "portal.announcements": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "portal.advances": ["super_admin", "admin", "gerente", "supervisor", "trabajador"],
  "portal.admin": ["super_admin", "admin", "gerente"],

  // Sitio Web público
  "website.view": ["super_admin", "admin"],
  "website.edit": ["super_admin", "admin"],

  // Admin
  "admin.access": ["super_admin", "admin"],
  "admin.settings": ["super_admin"],
  "admin.logs": ["super_admin", "admin"],
  "admin.roles": ["super_admin", "admin"],
} as const

// ============================================
// CACHE DE PERMISOS DINÁMICOS
// ============================================

let dynamicPermissionsCache: Record<string, string[]> | null = null
let cacheTimestamp = 0
const CACHE_TTL = 60000

export async function loadDynamicPermissions(): Promise<Record<string, string[]>> {
  const now = Date.now()
  if (dynamicPermissionsCache && now - cacheTimestamp < CACHE_TTL) {
    return dynamicPermissionsCache
  }

  try {
    const { getDb } = await import("@/lib/db/connection")
    const db = await getDb()
    const config = await db.collection("roles_config").findOne({ type: "permissions_override" })

    if (config?.permissions) {
      dynamicPermissionsCache = { ...DEFAULT_PERMISSIONS, ...config.permissions }
    } else {
      dynamicPermissionsCache = { ...DEFAULT_PERMISSIONS }
    }
    cacheTimestamp = now
    return dynamicPermissionsCache
  } catch {
    return { ...DEFAULT_PERMISSIONS }
  }
}

export function invalidatePermissionsCache(): void {
  dynamicPermissionsCache = null
  cacheTimestamp = 0
}

// ============================================
// TIPOS Y CATEGORÍAS
// ============================================

export type Permission = keyof typeof DEFAULT_PERMISSIONS

export const PERMISSION_CATEGORIES: Record<string, { label: string; permissions: string[] }> = {
  projects: {
    label: "Proyectos",
    permissions: ["projects.view", "projects.create", "projects.edit", "projects.delete", "projects.export"],
  },
  tasks: {
    label: "Tareas",
    permissions: ["tasks.view", "tasks.create", "tasks.edit", "tasks.delete", "tasks.assign"],
  },
  inspections: {
    label: "Inspecciones",
    permissions: ["inspections.view", "inspections.create", "inspections.edit", "inspections.approve", "inspections.sign"],
  },
  finance: {
    label: "Finanzas",
    permissions: ["finance.view", "finance.create", "finance.edit", "finance.approve", "finance.export"],
  },
  documents: {
    label: "Documentos",
    permissions: ["documents.view", "documents.upload", "documents.delete", "documents.download"],
  },
  users: {
    label: "Usuarios",
    permissions: ["users.view", "users.create", "users.edit", "users.delete", "users.roles"],
  },
  clients: {
    label: "Clientes",
    permissions: ["clients.view", "clients.create", "clients.edit", "clients.delete"],
  },
  certificates: {
    label: "Certificados",
    permissions: ["certificates.view", "certificates.create", "certificates.edit", "certificates.approve", "certificates.sign"],
  },
  inventory: {
    label: "Inventario",
    permissions: ["inventory.view", "inventory.create", "inventory.edit", "inventory.delete"],
  },
  suppliers: {
    label: "Proveedores",
    permissions: ["suppliers.view", "suppliers.create", "suppliers.edit", "suppliers.delete"],
  },
  reports: {
    label: "Reportes",
    permissions: ["reports.view", "reports.create", "reports.export"],
  },
  incidents: {
    label: "Incidencias",
    permissions: ["incidents.view", "incidents.create", "incidents.edit", "incidents.resolve"],
  },
  chat: {
    label: "Chat",
    permissions: ["chat.view", "chat.create"],
  },
  calendar: {
    label: "Calendario",
    permissions: ["calendar.view", "calendar.create", "calendar.edit"],
  },
  contacts: {
    label: "Contactos Web",
    permissions: ["contacts.view", "contacts.manage", "contacts.delete"],
  },
  daily_logs: {
    label: "Bitácora Diaria",
    permissions: ["daily_logs.view", "daily_logs.create"],
  },
  website: {
    label: "Sitio Web",
    permissions: ["website.view", "website.edit"],
  },
  portal: {
    label: "Portal del Empleado",
    permissions: [
      "portal.dashboard", "portal.wallet", "portal.payslips",
      "portal.personnel_file", "portal.leave_requests", "portal.art",
      "portal.accidents", "portal.help_desk", "portal.announcements",
      "portal.advances", "portal.admin",
    ],
  },
  admin: {
    label: "Administración",
    permissions: ["admin.access", "admin.settings", "admin.logs", "admin.roles"],
  },
}

export const PERMISSION_ACTION_LABELS: Record<string, string> = {
  view: "Ver",
  create: "Crear",
  edit: "Editar",
  delete: "Eliminar",
  export: "Exportar",
  approve: "Aprobar",
  sign: "Firmar",
  assign: "Asignar",
  upload: "Subir",
  download: "Descargar",
  resolve: "Resolver",
  manage: "Gestionar",
  access: "Acceder",
  settings: "Configuración",
  logs: "Ver Logs",
  roles: "Gestionar Roles",
}

// ============================================
// FUNCIONES DE VERIFICACIÓN
// ============================================

export function hasPermission(role: UserRole, permission: string): boolean {
  const perms = dynamicPermissionsCache || DEFAULT_PERMISSIONS
  const allowedRoles = perms[permission] as readonly string[] | undefined
  if (!allowedRoles) return false
  return allowedRoles.includes(role)
}

export async function hasPermissionAsync(role: UserRole, permission: string): Promise<boolean> {
  const perms = await loadDynamicPermissions()
  const allowedRoles = perms[permission] as readonly string[] | undefined
  if (!allowedRoles) return false
  return allowedRoles.includes(role)
}

export function hasAnyPermission(role: UserRole, permissions: string[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

export function hasAllPermissions(role: UserRole, permissions: string[]): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

export function getUserPermissions(role: UserRole): string[] {
  const perms = dynamicPermissionsCache || DEFAULT_PERMISSIONS
  return Object.keys(perms).filter((permission) => {
    const allowedRoles = perms[permission]
    return allowedRoles?.includes(role)
  })
}

// ============================================
// LABELS Y COLORES
// ============================================

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Administrador",
  admin: "Administrador",
  gerente: "Gerente de Proyecto",
  supervisor: "Supervisor de Obra",
  trabajador: "Trabajador",
  cliente: "Cliente",
}

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  super_admin: "Control total del sistema. Puede gestionar roles, permisos y toda la configuración.",
  admin: "Administración general. Acceso a todas las secciones operativas y de gestión.",
  gerente: "Gestión de proyectos, finanzas, reportes y coordinación de equipos.",
  supervisor: "Supervisión de obra, tareas, inspecciones e incidencias en campo.",
  trabajador: "Acceso a tareas asignadas, bitácora diaria, chat e incidencias.",
  cliente: "Vista de proyectos, documentos, certificados y notificaciones.",
}

export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  gerente: "bg-green-100 text-green-800",
  supervisor: "bg-yellow-100 text-yellow-800",
  trabajador: "bg-gray-100 text-gray-800",
  cliente: "bg-orange-100 text-orange-800",
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 100,
  admin: 80,
  gerente: 60,
  supervisor: 40,
  trabajador: 20,
  cliente: 10,
}

// ============================================
// MAPA DE RUTAS A PERMISOS
// ============================================

export const ROUTE_PERMISSIONS: Record<string, string> = {
  "/dashboard/proyectos": "projects.view",
  "/dashboard/tareas": "tasks.view",
  "/dashboard/inspecciones": "inspections.view",
  "/dashboard/finanzas": "finance.view",
  "/dashboard/cotizaciones": "finance.view",
  "/dashboard/contratos": "finance.view",
  "/dashboard/facturas": "finance.view",
  "/dashboard/pagos": "finance.view",
  "/dashboard/documentos": "documents.view",
  "/dashboard/usuarios": "users.view",
  "/dashboard/empleados": "users.view",
  "/dashboard/clientes": "clients.view",
  "/dashboard/certificados": "certificates.view",
  "/dashboard/inventario": "inventory.view",
  "/dashboard/proveedores": "suppliers.view",
  "/dashboard/reportes": "reports.view",
  "/dashboard/incidencias": "incidents.view",
  "/dashboard/chat": "chat.view",
  "/dashboard/calendario": "calendar.view",
  "/dashboard/bitacora-diaria": "daily_logs.view",
  "/dashboard/automatizaciones": "automations.view",
  "/dashboard/sitio-web": "website.view",
  "/dashboard/auditoria": "admin.logs",
  "/dashboard/notificaciones": "notifications.view",
  "/dashboard/contactos": "contacts.view",
  "/dashboard/roles": "admin.roles",
  "/dashboard/portal": "portal.dashboard",
  "/dashboard/portal/billetera": "portal.wallet",
  "/dashboard/portal/recibos": "portal.payslips",
  "/dashboard/portal/legajo": "portal.personnel_file",
  "/dashboard/portal/solicitudes": "portal.leave_requests",
  "/dashboard/portal/art": "portal.art",
  "/dashboard/portal/mesa-ayuda": "portal.help_desk",
  "/dashboard/portal/comunicaciones": "portal.announcements",
}
