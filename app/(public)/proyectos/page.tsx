"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Images, ArrowRight, Building2, Home, Store, Factory } from "lucide-react"
import Link from "next/link"

const categories = ["Todos", "Residencial", "Comercial", "Industrial", "Remodelación"]

const projects = [
  {
    id: 1,
    title: "NUEVO EDIFICIO MUNICIPAL DE GRAL. E. MOSCONI ",
    category: "Oficina Gubernamental",
    description:
      "Inicio de la segunda etapa de construcción del Edificio Municipal.",
    image: "/modern-residential-house-construction.jpg",
    details: "Duración: 8 meses | Ubicación:Departamento San Martin",
  },
  {
    id: 2,
    title: "Edificio Corporativo de Oficinas",
    category: "Comercial",
    description:
      "Construcción de edificio de 5 pisos para uso corporativo con fachada de cristal y espacios de trabajo modernos.",
    image: "/modern-office-building-construction.jpg",
    details: "Duración: 18 meses | Ubicación: Centro Financiero",
  },
  {
    id: 3,
    title: "Remodelación Integral de Cocina",
    category: "Remodelación",
    description:
      "Renovación completa de cocina con gabinetes italianos, encimera de cuarzo y electrodomésticos de última generación.",
    image: "/luxury-kitchen-remodel.jpg",
    details: "Duración: 2 meses | Ubicación: Residencial Privado",
  },
  {
    id: 4,
    title: "Nave Industrial con Oficinas",
    category: "Industrial",
    description:
      "Construcción de nave industrial de 2,000m² con área de oficinas administrativas y sistemas de seguridad avanzados.",
    image: "/industrial-warehouse-construction.png",
    details: "Duración: 12 meses | Ubicación: Parque Industrial",
  },
  {
    id: 5,
    title: "Centro Comercial Local",
    category: "Comercial",
    description: "Desarrollo de plaza comercial con 15 locales, estacionamiento y áreas comunes de convivencia.",
    image: "/shopping-center-construction.jpg",
    details: "Duración: 14 meses | Ubicación: Zona Comercial",
  },
  {
    id: 6,
    title: "Condominio Residencial",
    category: "Residencial",
    description: "Construcción de complejo habitacional con 20 unidades, áreas verdes y amenidades recreativas.",
    image: "/residential-condominium-complex.jpg",
    details: "Duración: 16 meses | Ubicación: Zona Suburbana",
  },
  {
    id: 7,
    title: "Renovación de Baños Completos",
    category: "Remodelación",
    description: "Transformación de 3 baños con acabados de mármol, duchas modernas y sistemas de ahorro de agua.",
    image: "/luxury-bathroom-renovation.png",
    details: "Duración: 6 semanas | Ubicación: Casa Particular",
  },
  {
    id: 8,
    title: "Ampliación de Casa Habitación",
    category: "Residencial",
    description: "Construcción de segundo piso con 3 recámaras, baño completo y terraza con vista panorámica.",
    image: "/house-extension-second-floor.jpg",
    details: "Duración: 5 meses | Ubicación: Zona Residencial",
  },
  {
    id: 9,
    title: "Restaurante y Bar",
    category: "Comercial",
    description: "Construcción y diseño interior de restaurante de 300m² con cocina industrial y área de bar premium.",
    image: "/restaurant-interior-construction.jpg",
    details: "Duración: 4 meses | Ubicación: Centro Histórico",
  },
]

export default function ProyectosPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")

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

          {/* Projects Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="border-border overflow-hidden group hover:border-accent transition-colors"
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-muted">
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
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold text-foreground line-clamp-1">{project.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{project.description}</p>
                  <p className="text-xs text-muted-foreground pt-2 border-t border-border">{project.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>

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
