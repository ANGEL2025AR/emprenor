export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EMPRENOR CONSTRUCCIONES',
    url: 'https://www.emprenor.com',
    logo: 'https://www.emprenor.com/images/logo-emprenor.png',
    description: 'Empresa de construcción con más de 15 años de experiencia en Salta, Jujuy, Tucumán y Formosa',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ituzaingó 920',
      addressLocality: 'Salta Capital',
      addressRegion: 'Salta',
      addressCountry: 'AR'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+54-9-11-2758-6521',
      contactType: 'customer service',
      availableLanguage: 'Spanish'
    },
    sameAs: [
      'https://www.facebook.com/emprenor',
      'https://www.instagram.com/emprenor'
    ]
  }
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.emprenor.com/#business',
    name: 'EMPRENOR CONSTRUCCIONES',
    image: 'https://www.emprenor.com/images/logo-emprenor.png',
    url: 'https://www.emprenor.com',
    telephone: '+54-9-11-2758-6521',
    email: 'info@emprenor.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ituzaingó 920',
      addressLocality: 'Salta Capital',
      addressRegion: 'Salta',
      postalCode: '4400',
      addressCountry: 'AR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -24.7859,
      longitude: -65.4117
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00'
      }
    ],
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '156'
    }
  }
}

export function generateServiceSchema(service: {
  name: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'EMPRENOR CONSTRUCCIONES',
      url: 'https://www.emprenor.com'
    },
    areaServed: {
      '@type': 'State',
      name: ['Salta', 'Jujuy', 'Tucumán', 'Formosa']
    },
    url: service.url
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}
