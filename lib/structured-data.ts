import { SITE_URL } from "@/lib/site-url"
import { EMPRENOR_LEGAL, EMPRENOR_SOCIAL, RM_LEGAL, EMPRENOR_BRAND } from "@/lib/company/constants"

const LOGO_PATH = "/images/logo-emprenor-large.png"

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: EMPRENOR_BRAND.siglas,
    legalName: RM_LEGAL.razonSocial,
    alternateName: [EMPRENOR_BRAND.nombreExtendido, "EMPRENOR"],
    taxID: RM_LEGAL.cuit,
    url: SITE_URL,
    logo: `${SITE_URL}${LOGO_PATH}`,
    description: `${EMPRENOR_BRAND.descripcion}. Titular: ${RM_LEGAL.razonSocial}.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Maipú 566, Piso 4 D",
      addressLocality: "Ciudad Autónoma de Buenos Aires",
      postalCode: "C1006",
      addressCountry: "AR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+54-9-11-2758-6521",
      contactType: "customer service",
      availableLanguage: "Spanish",
    },
    sameAs: [EMPRENOR_SOCIAL.facebook, EMPRENOR_SOCIAL.instagram, EMPRENOR_SOCIAL.linkedin],
  }
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: EMPRENOR_BRAND.siglas,
    legalName: RM_LEGAL.razonSocial,
    image: `${SITE_URL}${LOGO_PATH}`,
    url: SITE_URL,
    telephone: "+54-9-11-2758-6521",
    email: EMPRENOR_LEGAL.emailGeneral,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ituzaingó 920",
      addressLocality: "Salta Capital",
      addressRegion: "Salta",
      postalCode: "4400",
      addressCountry: "AR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -24.7859,
      longitude: -65.4117,
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

export function generateFAQSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
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
      legalName: RM_LEGAL.razonSocial,
      url: SITE_URL,
    },
    areaServed: {
      "@type": "State",
      name: ["Salta", "Jujuy", "Tucumán", "Formosa"],
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
