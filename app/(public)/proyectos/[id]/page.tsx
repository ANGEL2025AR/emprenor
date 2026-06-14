import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PublicProjectGallery } from "@/components/public/public-project-gallery"
import { getPublishedProjectById } from "@/lib/public-projects/get-published-project"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const project = await getPublishedProjectById(id)

  if (!project) {
    return { title: "Proyecto no encontrado | Emprenor" }
  }

  const title = project.seo?.metaTitle || `${project.title} | Emprenor`
  const description =
    project.seo?.metaDescription || project.description?.slice(0, 160) || `Proyecto ${project.title} en ${project.location}`

  return {
    title,
    description,
    keywords: project.seo?.keywords,
  }
}

export default async function PublicProjectDetailPage({ params }: PageProps) {
  const { id } = await params
  const project = await getPublishedProjectById(id)

  if (!project) {
    notFound()
  }

  const bodyText = project.detailedDescription?.trim() || project.description

  return (
    <main className="flex flex-col">
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2 text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
            asChild
          >
            <Link href="/proyectos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a proyectos
            </Link>
          </Button>
          <div className="mx-auto max-w-3xl space-y-4">
            <span className="inline-block rounded-full bg-primary-foreground/15 px-3 py-1 text-sm font-medium">
              {project.category}
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-balance">{project.title}</h1>
            <div className="flex flex-wrap gap-6 text-primary-foreground/90 text-sm md:text-base">
              {project.duration && (
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  {project.duration}
                </span>
              )}
              {project.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {project.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl space-y-10">
            <PublicProjectGallery title={project.title} image={project.image} gallery={project.gallery} />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Descripción del proyecto</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{bodyText}</p>
            </div>

            {project.metadata && (project.metadata.client || project.metadata.area || project.metadata.year || project.metadata.budget) && (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 pt-4 border-t border-border">
                {project.metadata.client && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Cliente / contratante</p>
                    <p className="text-sm font-medium">{String(project.metadata.client)}</p>
                  </div>
                )}
                {project.metadata.area && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Área</p>
                    <p className="text-sm font-medium">{String(project.metadata.area)}</p>
                  </div>
                )}
                {project.metadata.year && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Año</p>
                    <p className="text-sm font-medium">{String(project.metadata.year)}</p>
                  </div>
                )}
                {project.metadata.budget != null && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Alcance referencial</p>
                    <p className="text-sm font-medium">
                      {typeof project.metadata.budget === "number"
                        ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(
                            project.metadata.budget,
                          )
                        : String(project.metadata.budget)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container px-4 md:px-6">
          <Card className="mx-auto max-w-2xl border-accent bg-accent/5">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-xl font-bold sm:text-2xl text-balance">¿Querés un proyecto como este?</h2>
              <p className="text-muted-foreground text-pretty">
                Contactanos para cotizar tu obra con el mismo nivel de calidad y profesionalismo.
              </p>
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/contacto">
                  Solicitar cotización
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
