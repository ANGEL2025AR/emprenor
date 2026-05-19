import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth/require-permission"
import { requirePermission } from "@/lib/auth/require-permission"
import { isPortalAdminRole } from "@/lib/auth/portal-roles"

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth()

  if (isPortalAdminRole(user.role)) {
    redirect("/dashboard/admin/portal")
  }

  await requirePermission("portal.dashboard", "/dashboard")

  return <>{children}</>
}
