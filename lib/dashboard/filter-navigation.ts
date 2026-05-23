import type { UserRole } from "@/lib/db/models"
import { hasPermission } from "@/lib/auth/permissions"
import { isPortalAdminRole, isPortalEmployeeRole } from "@/lib/auth/portal-roles"
import { isPortalModuleEnabled, type PortalSettings } from "@/lib/portal/portal-settings-shared"
import type { DashboardNavItem, DashboardNavGroup } from "@/lib/dashboard/navigation"
import { DASHBOARD_HOME, DASHBOARD_NAV_GROUPS, CLIENT_PORTAL_NAV_GROUPS } from "@/lib/dashboard/navigation"

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
  const groups = isClientRole(userRole) ? CLIENT_PORTAL_NAV_GROUPS : DASHBOARD_NAV_GROUPS
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => isNavItemVisible(item, userRole, portalSettings)),
    }))
    .filter((group) => group.items.length > 0)
}

export function isHomeVisible(userRole: UserRole): boolean {
  if (isClientRole(userRole)) return false
  return isNavItemVisible(DASHBOARD_HOME, userRole, null)
}

export { DASHBOARD_HOME }
