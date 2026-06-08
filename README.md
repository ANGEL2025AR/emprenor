# EMPRENOR Construcciones - Sitio Web Corporativo

> Sitio web de **EMPRENOR C&S** — marca comercial de Silvio Carlos Fabian Guerrero (CUIT 20-40154622-8). Construcción y servicios en el NOA.

## 🏗️ Tecnologías

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2 (con React Compiler)
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Base de Datos**: MongoDB 7.0
- **Analytics**: Vercel Analytics
- **Deploy**: Vercel

## 📁 Estructura del Proyecto

\`\`\`
emprenor-construcciones/
├── app/                      # App Router de Next.js
│   ├── api/                 # API Routes
│   │   └── contact/         # Endpoint de contacto
│   ├── servicios/           # Páginas de servicios
│   ├── contacto/            # Formulario de contacto
│   ├── proyectos/           # Portafolio
│   └── page.tsx             # Homepage
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   ├── site-header.tsx      # Header del sitio
│   ├── site-footer.tsx      # Footer del sitio
│   └── whatsapp-float.tsx   # Botón flotante WhatsApp
├── lib/
│   ├── mongodb.ts           # Configuración MongoDB
│   └── utils.ts             # Utilidades
└── public/                  # Assets estáticos
\`\`\`

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18.x o superior
- pnpm 9.x (recomendado) o npm
- MongoDB Atlas account

### Instalación

\`\`\`bash
# Clonar el repositorio
git clone https://github.com/emprenor/sitio-web.git
cd sitio-web

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales
\`\`\`

### Variables de Entorno

\`\`\`env
# MongoDB
MONGODB_URI=mongodb+srv://...

# Admin API (para endpoints protegidos)
ADMIN_API_KEY=your_secure_api_key

# Next.js
NEXT_PUBLIC_SITE_URL=https://emprenor.com.ar
\`\`\`

### Desarrollo

\`\`\`bash
# Iniciar servidor de desarrollo
pnpm dev

# El sitio estará disponible en http://localhost:3000
\`\`\`

### Producción

\`\`\`bash
# Build para producción
pnpm build

# Iniciar servidor de producción
pnpm start
\`\`\`

## 📊 Scripts Disponibles

\`\`\`bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm lint         # Linter (ESLint)
pnpm lint:fix     # Fix automático de lint
pnpm type-check   # Verificación TypeScript
pnpm test         # Tests (Jest)
pnpm test:watch   # Tests en modo watch
pnpm test:coverage # Coverage de tests
\`\`\`

## 🔒 Seguridad

### Recomendaciones Implementadas

- ✅ Headers de seguridad (HSTS, X-Frame-Options, etc.)
- ✅ Validación de inputs con Zod
- ✅ Sanitización de datos
- ✅ Rate limiting (próximamente)
- ✅ Autenticación en endpoints admin

### Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, por favor envía un email a: security@emprenor.com.ar

## 📝 Convenciones de Código

### TypeScript

- Usa tipos explícitos siempre que sea posible
- Evita `any`, usa `unknown` si es necesario
- Interfaces para props de componentes

### React

- Componentes funcionales con TypeScript
- Hooks personalizados en `/hooks`
- Server Components por defecto, Client Components solo cuando sea necesario

### Naming

- **Componentes**: PascalCase (`SiteHeader.tsx`)
- **Funciones**: camelCase (`fetchContactos()`)
- **Rutas**: kebab-case (`/servicios/albanileria`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`
feat: agregar formulario de cotización
fix: corregir validación de email
docs: actualizar README
style: formato de código
refactor: simplificar lógica de contactos
test: agregar tests para API
chore: actualizar dependencias
\`\`\`

## 🧪 Testing

\`\`\`bash
# Tests unitarios
pnpm test

# Tests con coverage
pnpm test:coverage

# Tests E2E (próximamente)
pnpm test:e2e
\`\`\`

## 📈 Performance

### Lighthouse Score Objetivo

- **Performance**: >90
- **Accessibility**: >95
- **Best Practices**: >95
- **SEO**: >95

### Optimizaciones

- ✅ Imágenes optimizadas (WebP/AVIF)
- ✅ Code splitting automático
- ✅ Lazy loading de componentes
- ✅ Server Components para reducir JS
- ✅ Font optimization con next/font

## 🌐 SEO

### Características Implementadas

- ✅ Metadata dinámica por página
- ✅ Schema.org structured data
- ✅ Sitemap automático
- ✅ robots.txt configurado
- ✅ Open Graph y Twitter Cards
- ✅ URLs semánticas

## 📦 Deploy

### Vercel (Recomendado)

\`\`\`bash
# Instalar Vercel CLI
pnpm i -g vercel

# Deploy
vercel --prod
\`\`\`

### Otras Plataformas

El proyecto es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad de Silvio Carlos Fabian Guerrero, titular de la marca EMPRENOR Construcciones y Servicios.

## 📞 Contacto

- **Website**: https://emprenor.com.ar
- **Email**: info@emprenor.com.ar
- **Tel**: +54 9 11 2758-6521 (Sebastian Romero)
- **Tel**: +54 9 387 352-2920 (Carlos Guerrero)

---

**Hecho con ❤️ por el equipo de EMPRENOR**
