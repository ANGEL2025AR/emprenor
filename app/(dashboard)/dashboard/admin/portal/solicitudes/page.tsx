import { AdminLeaveRequestsPanel } from "@/components/portal/admin/admin-leave-requests-panel"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = { title: "Administrar solicitudes | EMPRENOR" }

export default function AdminPortalSolicitudesPage() {
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/admin/portal">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al portal empleados
        </Link>
      </Button>
      <AdminLeaveRequestsPanel />
    </div>
  )
}
