import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import CertificatesClient from "@/components/certificates/certificates-client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function CertificadosPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Certificados de Obra</h1>
          <p className="text-slate-600">Gestiona certificaciones y validaciones de proyectos</p>
        </div>
        <Link href="/dashboard/certificados/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Certificado
          </Button>
        </Link>
      </div>

      <CertificatesClient />
    </div>
  )
}
