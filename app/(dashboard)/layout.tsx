import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Toaster } from "@/components/ui/toaster"
import { AccessProvider } from "@/lib/auth/access-control"
import { getPortalSettings } from "@/lib/portal/settings"
import { isPortalEmployeeRole } from "@/lib/auth/portal-roles"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const portalSettings = isPortalEmployeeRole(user.role) ? await getPortalSettings() : null

  return (
    <AccessProvider user={user}>
      <div className="dashboard-shell min-h-screen flex">
        <DashboardSidebar user={user} initialPortalSettings={portalSettings} />
        <div className="dashboard-main flex-1 flex flex-col min-h-screen lg:ml-0">
          <DashboardHeader user={user} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 pt-20 lg:pt-6 max-w-[1600px] w-full mx-auto">
            <div className="dashboard-content">{children}</div>
          </main>
        </div>
        <Toaster />
      </div>
    </AccessProvider>
  )
}
