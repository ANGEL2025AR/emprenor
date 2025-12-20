"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Images, ArrowRight, Building2, Home, Store, Factory, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const categories = ["Todos", "Residencial", "Comercial", "Industrial", "Remodelación", "Oficina Gubernamental"]

interface Project {
  _id: string
  title: string
  category: string
  description: string
  duration: string
  location: string
  image: string
  gallery?: string[]
}

export default function ProyectosPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/public-projects?published=true")
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (error) {
      console.error("Error al cargar proyectos:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects =
    selectedCategory === "Todos" ? projects : projects.filter((project) => project.category === selectedCategory)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Residencial":
        return <Home className="h-4 w-4" />
      case "Comercial":
        return <Store className="h-4 w-4" />
      case "Industrial":
        return <Factory className="h-4 w-4" />
      case "Remodelación":
        return <Building2 className="h-4 w-4" />
      default:
        return <Images className="h-4 w-4" />
    }
  }

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Images className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Nuestros Proyectos</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Descubra la calidad y profesionalismo de nuestro trabajo a través de proyectos completados exitosamente
              para clientes satisfechos.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando proyectos...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay proyectos disponibles en esta categoría</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card
                  key={project._id}
                  className="border-border overflow-hidden group hover:border-accent transition-colors"
                >
                  <Dialog onOpenChange={() => setSelectedGalleryIndex(0)}>
                    <DialogTrigger asChild>
                      <div className="relative aspect-[3/2] overflow-hidden bg-muted cursor-pointer">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-foreground">
                            {getCategoryIcon(project.category)}
                            {project.category}
                          </span>
                        </div>
                        {project.gallery && project.gallery.length > 0 && (
                          <div className="absolute bottom-3 right-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-foreground">
                              <Images className="h-3 w-3" />
                              {project.gallery.length + 1}
                            </span>
                          </div>
                        )}
                      </div>
                    </DialogTrigger>
                    {project.gallery && project.gallery.length > 0 && (
                      <DialogContent className="max-w-4xl">
                        <DialogTitle className="sr-only">Galería de {project.title}</DialogTitle>
                        <div className="relative">
                          <img
                            src={
                              selectedGalleryIndex === 0
                                ? project.image
                                : project.gallery[selectedGalleryIndex - 1] || "/placeholder.svg"
                            }
                            alt={`${project.title} - Imagen ${selectedGalleryIndex + 1}`}
                            className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="ml-2"
                              onClick={() =>
                                setSelectedGalleryIndex((prev) => (prev === 0 ? project.gallery!.length : prev - 1))
                              }
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute inset-y-0 right-0 flex items-center">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="mr-2"
                              onClick={() =>
                                setSelectedGalleryIndex((prev) => (prev === project.gallery!.length ? 0 : prev + 1))
                              }
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
                            {selectedGalleryIndex + 1} / {project.gallery.length + 1}
                          </div>
                        </div>
                      </DialogContent>
                    )}
                  </Dialog>

                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-xl font-semibold text-foreground line-clamp-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{project.description}</p>
                    <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                      {project.duration} | {project.location}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16">
            <Card className="border-accent bg-accent/5">
              <CardContent className="p-8 md:p-12">
                <div className="mx-auto max-w-2xl text-center space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-balance">
                    ¿Le gustaría que su proyecto sea el siguiente?
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-pretty">
                    Transformamos ideas en realidad. Contáctenos hoy para discutir su proyecto y recibir una cotización
                    personalizada.
                  </p>
                  <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/contacto">
                      Iniciar Mi Proyecto
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
