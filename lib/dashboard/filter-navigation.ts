import type { UserRole } from "@/lib/db/models"
import { hasPermission } from "@/lib/auth/permissions"
import { isPortalAdminRole, isPortalEmployeeRole } from "@/lib/auth/portal-roles"
import { isPortalModuleEnabled, type PortalSettings } from "@/lib/portal/portal-settings-shared"
import type { DashboardNavItem, DashboardNavGroup } from "@/lib/dashboard/navigation"
import {
  DASHBOARD_HOME,
  DASHBOARD_NAV_GROUPS,
  CLIENT_PORTAL_NAV_GROUPS,
  EMPLOYEE_PORTAL_HOME,
} from "@/lib/dashboard/navigation"
import {
  EMPLOYEE_NAV_GROUPS,
  EMPLOYEE_SUPERVISOR_ONLY_GROUP_IDS,
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
    return EMPLOYEE_NAV_GROUPS.filter(
      (group) => userRole === "supervisor" || !EMPLOYEE_SUPERVISOR_ONLY_GROUP_IDS.has(group.id),
    )
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => isNavItemVisible(item, userRole, portalSettings)),
      }))
      .filter((group) => group.items.length > 0)
  }

  return DASHBOARD_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => isNavItemVisible(item, userRole, portalSettings)),
  })).filter((group) => group.items.length > 0)
}

/** Un solo inicio por rol: empleados → portal RRHH; clientes → grupo Mi obra; resto → dashboard ejecutivo. */
export function getDashboardHome(userRole: UserRole): DashboardNavItem | null {
  if (isClientRole(userRole)) return null
  if (isPortalEmployeeRole(userRole)) return EMPLOYEE_PORTAL_HOME
  return DASHBOARD_HOME
}

export function isHomeVisible(userRole: UserRole): boolean {
  return getDashboardHome(userRole) !== null
}

export { DASHBOARD_HOME, EMPLOYEE_PORTAL_HOME }
