import type { UserRole } from "@/lib/db/models"
import { hasPermission } from "@/lib/auth/permissions"
import type { DashboardNavItem, DashboardNavGroup } from "@/lib/dashboard/navigation"
import {
  DASHBOARD_HOME,
  CLIENT_PORTAL_NAV_GROUPS,
  STAFF_ZONE_NAV_GROUPS,
} from "@/lib/dashboard/navigation"
import { MANAGEMENT_NAV_GROUPS } from "@/lib/dashboard/management-navigation"
import { EMPLOYEE_PORTAL_NAV_ITEMS } from "@/lib/dashboard/employee-navigation"
import { isFieldStaffRole, isManagementRole } from "@/lib/auth/employee-routes"
import { UserCircle } from "lucide-react"

function isClientRole(role: UserRole): boolean {
  return role === "cliente"
}

export function isNavItemVisible(item: DashboardNavItem, userRole: UserRole): boolean {
  if (!item.permission) return true
  try {
    return hasPermission(userRole, item.permission)
  } catch {
    return false
  }
}

function filterGroupItems(groups: DashboardNavGroup[], userRole: UserRole): DashboardNavGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => isNavItemVisible(item, userRole)),
    }))
    .filter((group) => group.items.length > 0)
}

export function filterNavGroups(userRole: UserRole): DashboardNavGroup[] {
  if (isClientRole(userRole)) {
    return filterGroupItems(CLIENT_PORTAL_NAV_GROUPS, userRole)
  }

  if (isFieldStaffRole(userRole)) {
    const groups = filterGroupItems(STAFF_ZONE_NAV_GROUPS, userRole)
    const portalItems = EMPLOYEE_PORTAL_NAV_ITEMS.filter((item) => isNavItemVisible(item, userRole))
    if (portalItems.length > 0) {
      groups.push({
        id: "portal-empleado",
        label: "Mi Portal",
        icon: UserCircle,
        items: portalItems,
      })
    }
    return groups
  }

  if (isManagementRole(userRole)) {
    return filterGroupItems(MANAGEMENT_NAV_GROUPS, userRole)
  }

  return []
}

export function getDashboardHome(userRole: UserRole): DashboardNavItem | null {
  if (isClientRole(userRole)) {
    return { name: "Resumen", href: "/dashboard", icon: DASHBOARD_HOME.icon, permission: null }
  }
  if (isManagementRole(userRole)) return DASHBOARD_HOME
  if (isFieldStaffRole(userRole)) {
    return {
      name: "Proyectos",
      href: "/dashboard/proyectos",
      icon: STAFF_ZONE_NAV_GROUPS[0].items[0].icon,
      permission: "projects.view",
    }
  }
  return null
}

export function isHomeVisible(userRole: UserRole): boolean {
  return getDashboardHome(userRole) !== null
}

export { DASHBOARD_HOME }
