import type { MetadataRoute } from "next"
import { FOOTER_LEGAL_LINKS } from "@/lib/company/constants"
import { getAllServiceSlugs } from "@/lib/site/services-catalog"
import { getDb } from "@/lib/db/connection"
import { SITE_URL } from "@/lib/site-url"

const LEGAL_SITEMAP = FOOTER_LEGAL_LINKS.map((link) => ({
  url: `${SITE_URL}${link.href}`,
  changeFrequency: "yearly" as const,
  priority: link.href === "/aviso-legal" || link.href === "/privacidad" ? 0.5 : 0.4,
}))

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL
  const currentDate = new Date()

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/proyectos`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/preguntas-frecuentes`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/brochure`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...getAllServiceSlugs().map((slug) => ({
      url: `${baseUrl}/servicios/${slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...LEGAL_SITEMAP.map((entry) => ({ ...entry, lastModified: currentDate })),
  ]

  // Obtener proyectos públicos dinámicamente desde MongoDB
  let dynamicProjects: MetadataRoute.Sitemap = []
  try {
    const db = await getDb()
    const projects = await db
      .collection("public_projects")
      .find({ published: true })
      .project({ _id: 1, updatedAt: 1 })
      .toArray()

    dynamicProjects = projects.map((project) => ({
      url: `${baseUrl}/proyectos/${project._id.toString()}`,
      lastModified: project.updatedAt || currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  } catch {
    // Si hay error de conexión, continuar sin proyectos dinámicos
    console.error("Error fetching projects for sitemap")
  }

  return [...staticPages, ...dynamicProjects]
}
