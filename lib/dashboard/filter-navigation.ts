import type { UserRole } from "@/lib/db/models"
import { hasPermission } from "@/lib/auth/permissions"
import type { DashboardNavItem, DashboardNavGroup } from "@/lib/dashboard/navigation"
import {
  DASHBOARD_HOME,
  DASHBOARD_NAV_GROUPS,
  CLIENT_PORTAL_NAV_GROUPS,
  STAFF_ZONE_NAV_GROUPS,
} from "@/lib/dashboard/navigation"
import { isStaffZoneRole } from "@/lib/auth/employee-routes"

function isClientRole(role: UserRole): boolean {
  return role === "cliente"
}

function isAdminDashboardRole(role: UserRole): boolean {
  return role === "super_admin" || role === "admin"
}

export function isNavItemVisible(item: DashboardNavItem, userRole: UserRole): boolean {
  if (!item.permission) return true
  try {
    return hasPermission(userRole, item.permission)
  } catch {
    return false
  }
}

export function filterNavGroups(userRole: UserRole): DashboardNavGroup[] {
  if (isClientRole(userRole)) {
    return CLIENT_PORTAL_NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => isNavItemVisible(item, userRole)),
    })).filter((group) => group.items.length > 0)
  }

  if (isStaffZoneRole(userRole)) {
    return STAFF_ZONE_NAV_GROUPS
  }

  if (!isAdminDashboardRole(userRole)) {
    return []
  }

  return DASHBOARD_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => isNavItemVisible(item, userRole)),
  })).filter((group) => group.items.length > 0)
}

export function getDashboardHome(userRole: UserRole): DashboardNavItem | null {
  if (isClientRole(userRole) || isStaffZoneRole(userRole)) return null
  if (isAdminDashboardRole(userRole)) return DASHBOARD_HOME
  return null
}

export function isHomeVisible(userRole: UserRole): boolean {
  return getDashboardHome(userRole) !== null
}

export { DASHBOARD_HOME }
