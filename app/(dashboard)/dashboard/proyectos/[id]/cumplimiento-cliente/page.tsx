import { Suspense } from "react"
import { ComplianceHub } from "@/components/compliance/compliance-hub"

export default async function ProyectoCumplimientoClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <Suspense fallback={<div className="py-12 text-center">Cargando…</div>}>
      <ComplianceHub
        projectId={id}
        backHref={`/dashboard/proyectos/${id}`}
        backLabel="Volver al proyecto"
      />
    </Suspense>
  )
}
