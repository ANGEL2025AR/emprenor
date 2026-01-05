import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight, ImageOff } from "lucide-react"
import { getDb } from "@/lib/db/connection"
import type { PublicProject } from "@/lib/db/models"

async function getFeaturedProjects(): Promise<PublicProject[]> {
  try {
    const db = await getDb()

    // Obtener proyectos publicados y destacados, ordenados por orden y fecha
    const projects = await db
      .collection<PublicProject>("public_projects")
      .find({
        published: true,
        $or: [{ featured: true }, { featured: { $exists: false } }],
      })
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .limit(6)
      .toArray()

    return projects
  } catch (error) {
    console.error("Error al obtener proyectos destacados:", error)
    return []
  }
}

export default async function FeaturedProjects() {
  const projects = await getFeaturedProjects()

  // Si no hay proyectos publicados, mostrar mensaje informativo
  if (projects.length === 0) {
    return (
      <section className="py-20 bg-slate-900">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Proyectos Destacados</h2>
            <p className="text-lg text-slate-400">
              Conoce algunos de nuestros proyectos más representativos en la región del NOA.
            </p>
          </div>

          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-800 flex items-center justify-center">
              <ImageOff className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-slate-400 text-lg mb-4">Próximamente mostraremos nuestros proyectos más destacados.</p>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link href="/contacto">
                Solicitar Información
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-slate-900">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Proyectos Destacados</h2>
          <p className="text-lg text-slate-400">
            Conoce algunos de nuestros proyectos más representativos en la región del NOA.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const mainImage = project.image || null

            return (
              <Link
                key={project._id?.toString()}
                href={`/proyectos/${project._id}`}
                className="group relative overflow-hidden rounded-2xl block"
              >
                <div className="relative w-full h-72">
                  {mainImage ? (
                    <Image
                      src={mainImage || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                      <ImageOff className="w-16 h-16 text-slate-600" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-green-400 transition-colors">
                    {project.title}
                  </h3>
                  {project.location && (
                    <p className="text-slate-400 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            asChild
          >
            <Link href="/proyectos">
              Ver todos los proyectos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
