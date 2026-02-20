import { requirePermission } from "@/lib/auth/require-permission"

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  await requirePermission("portal.dashboard")
  return <>{children}</>
}
