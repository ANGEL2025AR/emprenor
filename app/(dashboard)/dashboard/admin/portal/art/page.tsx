import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AdminArtPanel } from "@/components/portal/admin/admin-art-panel"

export const metadata = { title: "ART / Seguridad (admin) | EMPRENOR" }

export default function AdminPortalArtPage() {
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/admin/portal">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al portal empleados
        </Link>
      </Button>
      <AdminArtPanel />
    </div>
  )
}
