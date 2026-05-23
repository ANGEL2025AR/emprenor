import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import { ClientDashboard } from "@/components/dashboard/client-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { isClientRole } from "@/lib/auth/project-access"
import { isStaffZoneRole } from "@/lib/auth/employee-routes"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (isClientRole(user.role)) {
    return <ClientDashboard user={user} />
  }

  if (isStaffZoneRole(user.role)) {
    redirect("/dashboard/zona-empleados")
  }

  if (user.role === "super_admin" || user.role === "admin") {
    return <AdminDashboard userName={user.name || "Administrador"} />
  }

  redirect("/dashboard/zona-empleados")
}
