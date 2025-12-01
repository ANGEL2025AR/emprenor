// Sistema de permisos granulares
import type { UserRole } from "@/lib/db/models"

export const PERMISSIONS = {
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

  // Calidad (Certificados y Auditorías)
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

  // Admin
  "admin.access": ["super_admin", "admin"],
  "admin.settings": ["super_admin"],
  "admin.logs": ["super_admin", "admin"],
} as const

export type Permission = keyof typeof PERMISSIONS

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission] as readonly string[]
  return allowedRoles.includes(role)
}

export function getUserPermissions(role: UserRole): Permission[] {
  return (Object.keys(PERMISSIONS) as Permission[]).filter((permission) => hasPermission(role, permission))
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Administrador",
  admin: "Administrador",
  gerente: "Gerente de Proyecto",
  supervisor: "Supervisor de Obra",
  trabajador: "Trabajador",
  cliente: "Cliente",
}

export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  gerente: "bg-green-100 text-green-800",
  supervisor: "bg-yellow-100 text-yellow-800",
  trabajador: "bg-gray-100 text-gray-800",
  cliente: "bg-orange-100 text-orange-800",
}
