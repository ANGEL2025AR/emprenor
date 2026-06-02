import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import { ClientDashboard } from "@/components/dashboard/client-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { isClientRole } from "@/lib/auth/project-access"
import { isFieldStaffRole, isManagementRole } from "@/lib/auth/employee-routes"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (isClientRole(user.role)) {
    return <ClientDashboard user={user} />
  }

  if (isFieldStaffRole(user.role)) {
    redirect("/dashboard/proyectos")
  }

  if (isManagementRole(user.role)) {
    return <AdminDashboard userName={user.name || "Administrador"} userRole={user.role} />
  }

  redirect("/dashboard/proyectos")
}
