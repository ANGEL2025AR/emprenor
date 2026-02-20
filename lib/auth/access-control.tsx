"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { UserRole } from "@/lib/db/models"
import { hasPermission, hasAnyPermission, getUserPermissions } from "@/lib/auth/permissions"
import type { SerializableUser } from "@/lib/auth/session"

// ============================================
// CONTEXTO DE ACCESO
// ============================================

interface AccessContextValue {
  user: SerializableUser | null
  role: UserRole
  can: (permission: string) => boolean
  canAny: (permissions: string[]) => boolean
  canAll: (permissions: string[]) => boolean
  permissions: string[]
  isAdmin: boolean
  isSuperAdmin: boolean
}

const AccessContext = createContext<AccessContextValue>({
  user: null,
  role: "cliente",
  can: () => false,
  canAny: () => false,
  canAll: () => false,
  permissions: [],
  isAdmin: false,
  isSuperAdmin: false,
})

export function AccessProvider({
  children,
  user,
}: {
  children: ReactNode
  user: SerializableUser
}) {
  const role = (user?.role || "cliente") as UserRole
  const permissions = getUserPermissions(role)

  const value: AccessContextValue = {
    user,
    role,
    can: (permission: string) => hasPermission(role, permission),
    canAny: (perms: string[]) => hasAnyPermission(role, perms),
    canAll: (perms: string[]) => perms.every((p) => hasPermission(role, p)),
    permissions,
    isAdmin: ["super_admin", "admin"].includes(role),
    isSuperAdmin: role === "super_admin",
  }

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
}

// ============================================
// HOOK DE PERMISOS
// ============================================

export function usePermissions() {
  const context = useContext(AccessContext)
  if (!context.user) {
    return {
      user: null,
      role: "cliente" as UserRole,
      can: () => false,
      canAny: () => false,
      canAll: () => false,
      permissions: [],
      isAdmin: false,
      isSuperAdmin: false,
    }
  }
  return context
}

// ============================================
// COMPONENTE PERMISSION GATE (client-side)
// ============================================

interface PermissionGateProps {
  children: ReactNode
  permission?: string
  permissions?: string[]
  requireAll?: boolean
  fallback?: ReactNode
  role?: UserRole // Prop directa si no se usa el contexto
}

export function PermissionGate({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  role: roleProp,
}: PermissionGateProps) {
  const { can, canAny, canAll, role: contextRole } = usePermissions()
  const role = roleProp || contextRole

  let hasAccess = false

  if (permission) {
    hasAccess = roleProp ? hasPermission(roleProp, permission) : can(permission)
  } else if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasAccess = roleProp
        ? permissions.every((p) => hasPermission(roleProp, p))
        : canAll(permissions)
    } else {
      hasAccess = roleProp
        ? hasAnyPermission(roleProp, permissions)
        : canAny(permissions)
    }
  }

  if (!hasAccess) return <>{fallback}</>
  return <>{children}</>
}

// ============================================
// COMPONENTE ROLE GATE (client-side, por rol)
// ============================================

interface RoleGateProps {
  children: ReactNode
  roles: UserRole[]
  fallback?: ReactNode
}

export function RoleGate({ children, roles, fallback = null }: RoleGateProps) {
  const { role } = usePermissions()

  if (!roles.includes(role)) return <>{fallback}</>
  return <>{children}</>
}

// ============================================
// COMPONENTE DE ACCESO DENEGADO
// ============================================

export function AccessDenied({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Acceso Denegado</h2>
      <p className="text-slate-500 max-w-md">
        {message || "No tienes permisos para acceder a esta sección. Contacta al administrador si crees que esto es un error."}
      </p>
    </div>
  )
}
