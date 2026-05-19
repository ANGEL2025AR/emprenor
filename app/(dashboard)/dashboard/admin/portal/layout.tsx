import { requirePermission } from "@/lib/auth/require-permission"

export default async function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  await requirePermission("portal.admin", "/dashboard")
  return <>{children}</>
}
