import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site-url"
import { EMPRENOR_SITE } from "@/lib/company/constants"

type PageMetaInput = {
  title: string
  description: string
  path: string
  image?: string
  noIndex?: boolean
}

/** Metadata por ruta con canonical correcto (evita consolidar todo en la home). */
export function buildPageMetadata({ title, description, path, image, noIndex }: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
  const ogImage = image || "/images/logo-emprenor-large.png"

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "es_AR",
      siteName: EMPRENOR_SITE.siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  }
}
