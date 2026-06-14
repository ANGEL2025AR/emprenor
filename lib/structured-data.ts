import { SITE_URL } from "@/lib/site-url"
import {
  EMPRENOR_BRAND,
  EMPRENOR_LEGAL,
  EMPRENOR_PROVINCIAS,
  EMPRENOR_TITULAR,
} from "@/lib/company/constants"

const LOGO_PATH = "/images/logo-emprenor-large.png"

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: EMPRENOR_BRAND.siglas,
    legalName: EMPRENOR_TITULAR.apellidoNombre,
    alternateName: [EMPRENOR_BRAND.nombreExtendido, "EMPRENOR"],
    taxID: EMPRENOR_LEGAL.cuit,
    url: SITE_URL,
    logo: `${SITE_URL}${LOGO_PATH}`,
    description: `${EMPRENOR_BRAND.descripcion}. Marca comercial de ${EMPRENOR_TITULAR.nombreCompleto}.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Casiano Casas 3080, Barrio Policial",
      addressLocality: "Campamento Vespucio",
      addressRegion: "Salta",
      postalCode: "4563",
      addressCountry: "AR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: EMPRENOR_LEGAL.telefonoPrincipalHref,
      contactType: "customer service",
      availableLanguage: "Spanish",
      email: EMPRENOR_LEGAL.emailGeneral,
    },
    areaServed: EMPRENOR_PROVINCIAS.map((p) => ({ "@type": "State", name: p })),
    sameAs: [
      "https://www.facebook.com/emprenor",
      "https://www.instagram.com/emprenor",
    ],
  }
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: EMPRENOR_BRAND.siglas,
    legalName: EMPRENOR_TITULAR.apellidoNombre,
    image: `${SITE_URL}${LOGO_PATH}`,
    url: SITE_URL,
    telephone: EMPRENOR_LEGAL.telefonoPrincipal,
    email: EMPRENOR_LEGAL.emailGeneral,
    taxID: EMPRENOR_LEGAL.cuit,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Casiano Casas 3080, Barrio Policial",
      addressLocality: "Campamento Vespucio",
      addressRegion: "Salta",
      postalCode: "4563",
      addressCountry: "AR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    priceRange: "$$",
  }
}

export function generateServiceSchema(service: {
  name: string
  description: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: EMPRENOR_BRAND.siglas,
      legalName: EMPRENOR_TITULAR.apellidoNombre,
      url: SITE_URL,
    },
    areaServed: {
      "@type": "State",
      name: [...EMPRENOR_PROVINCIAS],
    },
    url: service.url,
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
