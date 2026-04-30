import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site-url"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL

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
