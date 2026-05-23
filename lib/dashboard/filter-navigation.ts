import type { UserRole } from "@/lib/db/models"
import { hasPermission } from "@/lib/auth/permissions"
import { isPortalAdminRole, isPortalEmployeeRole } from "@/lib/auth/portal-roles"
import { isPortalModuleEnabled, type PortalSettings } from "@/lib/portal/portal-settings-shared"
import type { DashboardNavItem, DashboardNavGroup } from "@/lib/dashboard/navigation"
import {
  DASHBOARD_HOME,
  DASHBOARD_NAV_GROUPS,
  CLIENT_PORTAL_NAV_GROUPS,
} from "@/lib/dashboard/navigation"
import {
  EMPLOYEE_NAV_GROUPS,
  EMPLOYEE_PORTAL_NAV_ITEMS,
} from "@/lib/dashboard/employee-navigation"

function isClientRole(role: UserRole): boolean {
  return role === "cliente"
}

export function isNavItemVisible(
  item: DashboardNavItem,
  userRole: UserRole,
  portalSettings: PortalSettings | null,
): boolean {
  if (item.employeeOnly) {
    if (!isPortalEmployeeRole(userRole)) return false
    if (item.moduleKey && portalSettings && !isPortalModuleEnabled(portalSettings, item.moduleKey)) {
      return false
    }
    return item.permission ? hasPermission(userRole, item.permission) : true
  }

  if (item.permission === "portal.admin") {
    return isPortalAdminRole(userRole) && hasPermission(userRole, "portal.admin")
  }

  if (!item.permission) return true

  try {
    return hasPermission(userRole, item.permission)
  } catch {
    return false
  }
}

export function filterNavGroups(
  userRole: UserRole,
  portalSettings: PortalSettings | null,
): DashboardNavGroup[] {
  if (isClientRole(userRole)) {
    return CLIENT_PORTAL_NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => isNavItemVisible(item, userRole, portalSettings)),
    })).filter((group) => group.items.length > 0)
  }

  if (isPortalEmployeeRole(userRole)) {
    return EMPLOYEE_NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) => isNavItemVisible(item, userRole, portalSettings)),
    })).filter((group) => group.items.length > 0)
  }

  return DASHBOARD_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => isNavItemVisible(item, userRole, portalSettings)),
  })).filter((group) => group.items.length > 0)
}

/** Un solo inicio por rol: clientes y staff; empleados usan lista plana del portal. */
export function getDashboardHome(userRole: UserRole): DashboardNavItem | null {
  if (isClientRole(userRole)) return null
  if (isPortalEmployeeRole(userRole)) return null
  return DASHBOARD_HOME
}

export function isHomeVisible(userRole: UserRole): boolean {
  return getDashboardHome(userRole) !== null
}

export function getEmployeePortalNavItems(
  userRole: UserRole,
  portalSettings: PortalSettings | null,
): DashboardNavItem[] {
  return EMPLOYEE_PORTAL_NAV_ITEMS.filter((item) => isNavItemVisible(item, userRole, portalSettings))
}

export { DASHBOARD_HOME }
