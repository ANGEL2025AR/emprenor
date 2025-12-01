import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth/session"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <DashboardSidebar user={user} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <DashboardHeader user={user} />
        <main className="flex-1 p-4 md:p-6 pt-20 lg:pt-6">{children}</main>
      </div>
    </div>
  )
}
