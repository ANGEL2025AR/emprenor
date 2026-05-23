import { Suspense } from "react"
import { ComplianceHub } from "@/components/compliance/compliance-hub"

export default async function MiObraProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  return (
    <Suspense fallback={<div className="py-12 text-center">Cargando portal de cumplimiento…</div>}>
      <ComplianceHub projectId={projectId} backHref="/dashboard/mi-obra" backLabel="Volver al listado" />
    </Suspense>
  )
}
