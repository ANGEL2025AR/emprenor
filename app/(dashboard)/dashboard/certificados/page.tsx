import { getCurrentUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import CertificatesClient from "@/components/certificates/certificates-client"

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
      </div>

      <CertificatesClient />
    </div>
  )
}
