import { AdminAdvancesPanel } from "@/components/portal/admin/admin-advances-panel"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const metadata = { title: "Administrar billetera | EMPRENOR" }

export default function AdminPortalBilleteraPage() {
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/admin/portal">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al portal empleados
        </Link>
      </Button>
      <AdminAdvancesPanel />
    </div>
  )
}
