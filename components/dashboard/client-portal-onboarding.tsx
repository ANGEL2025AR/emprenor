import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, FolderKanban, FileText, ArrowRight } from "lucide-react"

export function ClientPortalOnboarding() {
  const steps = [
    {
      icon: FolderKanban,
      title: "1. Mis obras",
      text: "Vea el avance y estado de cada proyecto contratado con EMPRENOR.",
      href: "/dashboard/mi-obra",
    },
    {
      icon: ClipboardList,
      title: "2. Cumplimiento de obra",
      text: "Nómina, ART, documentos, incidentes y compras locales según su contrato.",
      href: "/dashboard/mi-obra",
    },
    {
      icon: FileText,
      title: "3. Documentos y certificados",
      text: "Descargue planos, actas y certificaciones desde el menú lateral.",
      href: "/dashboard/documentos",
    },
  ]

  return (
    <Card className="border-emerald-200 bg-emerald-50/40">
      <CardContent className="p-6 space-y-4">
        <div>
          <p className="font-semibold text-emerald-900">Primeros pasos en su portal</p>
          <p className="text-sm text-emerald-800/90 mt-1">
            Guía rápida para clientes de obra pública, organismos internacionales y empresas.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {steps.map((step) => (
            <Link
              key={step.title}
              href={step.href}
              className="rounded-lg border border-emerald-100 bg-white p-4 hover:border-emerald-300 transition-colors block"
            >
              <step.icon className="h-6 w-6 text-emerald-600 mb-2" />
              <p className="font-medium text-sm">{step.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{step.text}</p>
            </Link>
          ))}
        </div>
        <Button asChild variant="outline" size="sm" className="border-emerald-300">
          <Link href="/dashboard/mi-obra">
            Ir a cumplimiento de obra
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
