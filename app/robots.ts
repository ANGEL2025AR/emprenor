import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.emprenor.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/servicios/", "/proyectos/", "/nosotros", "/contacto", "/preguntas-frecuentes"],
        disallow: ["/api/", "/dashboard/", "/admin/", "/login", "/registro", "/_next/", "/scripts/", "/*.json$"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/admin/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/images/", "/public/"],
      },
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
      {
        userAgent: "ChatGPT-User",
        disallow: ["/"],
      },
      {
        userAgent: "CCBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
