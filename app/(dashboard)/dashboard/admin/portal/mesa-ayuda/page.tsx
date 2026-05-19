import { AdminHelpDeskPanel } from "@/components/portal/admin/admin-help-desk-panel"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = { title: "Mesa de ayuda (admin) | EMPRENOR" }

export default function AdminPortalMesaAyudaPage() {
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/admin/portal">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al portal empleados
        </Link>
      </Button>
      <AdminHelpDeskPanel />
    </div>
  )
}
