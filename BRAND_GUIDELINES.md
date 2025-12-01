# EMPRENOR - Guía de Identidad de Marca

## Resumen de Estandarización de Logotipos

Esta documentación describe el sistema de logotipos implementado en el sitio web de EMPRENOR para garantizar coherencia visual y profesionalismo en todas las páginas.

---

## Inventario de Activos de Marca

### Logos Principales

1. **Logo Horizontal Grande** (`/images/logo-emprenor-large.png`)
   - Dimensiones: 1400×230px aprox.
   - Uso: Header principal (escritorio y móvil)
   - Color: Azul marino (#302665) + Blanco
   - Incluye: Icono de engranaje + Separador + Texto "Emprenor"

2. **Logo Horizontal Pequeño** (`/images/logo-emprenor-small.png`)
   - Dimensiones: 500×80px aprox.
   - Uso: Navegación compacta, emails
   - Color: Azul marino (#302665) + Blanco

3. **Logo Blanco** (`/images/logo-emprenor-white.png`)
   - Dimensiones: 1400×230px aprox.
   - Uso: Fondos oscuros, modo nocturno (futuro)
   - Color: Blanco completo

### Iconos

4. **Icono Circular** (`/images/logo-icon.png`)
   - Dimensiones: 128×128px
   - Uso: Favicon, íconos de aplicación
   - Color: Azul marino sobre blanco

5. **Icono Invertido** (`/images/logo-icon-inverted.png`)
   - Dimensiones: 256×256px
   - Uso: PWA, splash screens
   - Color: Blanco sobre azul marino

---

## Implementación por Sección

### Header (Encabezado)
- **Archivo**: `components/site-header.tsx`
- **Logo utilizado**: `logo-emprenor-large.png`
- **Tamaños responsivos**:
  - Móvil: 32px altura (h-8)
  - Tablet: 40px altura (h-10)
  - Desktop: 48px altura (h-12)
- **Optimización**: `priority` activado para carga inmediata
- **Comportamiento**: Enlace a homepage con aria-label descriptivo

### Footer (Pie de página)
- **Archivo**: `components/site-footer.tsx`
- **Logo utilizado**: `logo-emprenor-large.png`
- **Tamaño**: 36px altura (h-9)
- **Posicionamiento**: Primera columna, sobre descripción de empresa
- **Comportamiento**: Enlace a homepage

### Favicon y App Icons
- **Archivo**: `app/layout.tsx`
- **Iconos configurados**:
  - `favicon.ico` (16×16, 32×32, 48×48)
  - `icon-192.png` (Android Chrome)
  - `icon-512.png` (Android Chrome, splash)
  - `apple-icon.png` (iOS, 180×180)
- **Manifest**: Configurado en `public/manifest.json` para PWA

### Metadatos Open Graph / Social
- **Archivo**: `app/layout.tsx`
- **Imagen compartida**: `logo-emprenor-large.png`
- **Schema.org**: Incluye referencia a logo e imagen corporativa

---

## Especificaciones Técnicas

### Formato de Archivos
- **Formato principal**: PNG con transparencia
- **Formato alternativo**: WebP para optimización futura
- **SVG**: Disponible para escalabilidad perfecta

### Optimización de Rendimiento
- Uso de Next.js Image component con `width` y `height` explícitos
- `priority` en header para eliminar layout shift
- Lazy loading en footer (below-the-fold)
- Compresión de imágenes manteniendo calidad visual

### Accesibilidad
- Alt text descriptivo: "EMPRENOR - Construcciones y Servicios"
- Aria-labels en enlaces que contienen solo imágenes
- Contraste adecuado en todas las variaciones
- Compatible con lectores de pantalla

---

## Paleta de Colores de Marca

### Colores Primarios
- **Azul Marino Principal**: #302665 (RGB: 48, 38, 101)
- **Blanco**: #FFFFFF
- **Acento Verde**: #16a34a (para CTAs y elementos interactivos)

### Uso de Color en Logos
- **Fondo claro**: Logo azul marino estándar
- **Fondo oscuro**: Logo blanco (implementación futura)
- **Iconos**: Siempre circular con engranaje y rayo eléctrico

---

## Guía de Uso

### DO (Hacer)
✓ Usar logo horizontal en espacios amplios (header, hero sections)
✓ Usar icono circular para avatares, favicon y app icons
✓ Mantener espacio negativo alrededor del logo (mínimo 20px)
✓ Escalar proporcionalmente manteniendo aspect ratio
✓ Usar versión blanca sobre fondos oscuros o con imágenes

### DON'T (No Hacer)
✗ Distorsionar el logo cambiando proporciones
✗ Cambiar los colores corporativos
✗ Agregar sombras, efectos 3D o filtros
✗ Colocar logo sobre fondos con bajo contraste
✗ Usar logos de baja resolución o pixelados

---

## Checklist de Implementación

- [x] Logo en header con tamaños responsivos
- [x] Logo en footer con enlace a homepage
- [x] Favicon configurado (múltiples tamaños)
- [x] Apple Touch Icons para iOS
- [x] Manifest.json para PWA
- [x] Open Graph images para redes sociales
- [x] Schema.org con logo corporativo
- [x] Alt text y aria-labels implementados
- [x] Optimización de rendimiento con Next.js Image
- [ ] Modo oscuro con logo blanco (futuro)
- [ ] Conversión a WebP para mejor compresión (futuro)

---

## Ubicaciones de Archivos

\`\`\`
public/
├── images/
│   ├── logo-emprenor-large.png      # Logo horizontal principal
│   ├── logo-emprenor-small.png      # Logo horizontal pequeño
│   ├── logo-emprenor-white.png      # Logo blanco para fondos oscuros
│   ├── logo-icon.png                # Icono circular estándar
│   └── logo-icon-inverted.png       # Icono circular invertido
├── favicon.ico                       # Favicon navegadores
├── icon-192.png                      # Android Chrome pequeño
├── icon-512.png                      # Android Chrome grande
├── apple-icon.png                    # iOS home screen
└── manifest.json                     # PWA configuration
\`\`\`

---

## Contacto para Diseño

Para modificaciones de la identidad de marca o creación de nuevos activos visuales, contactar:
- Sebastian Romero: +54 9 11 2758-6521
- Carlos Guerrero: +54 9 387 352-2920
- Email: info@emprenor.com.ar

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0
**Responsable**: Equipo EMPRENOR
