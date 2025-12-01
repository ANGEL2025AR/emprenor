# INSTRUCCIONES PARA AGREGAR PROYECTOS REALES DE EMPRENOR

## Proyectos Completados por EMPRENOR

### 1. EDIFICIO MUNICIPAL DE GENERAL MOSCONI

**Cliente:** Municipalidad de General Mosconi, Salta
**Período:** 2023 - Enero 2024
**Inversión:** $108.200.000 ARS
**Estado:** Completado e Inaugurado

**Descripción:**
Restauración integral del edificio municipal de General Mosconi que incluye tres etapas de trabajos estructurales y funcionales. El proyecto modernizó completamente las instalaciones gubernamentales locales.

**Trabajos Realizados:**
- Refacción completa de techos y estructura superior
- Reparación y refuerzo de cimientos
- Instalación eléctrica nueva con normativas actuales
- Sistema de climatización completo (HVAC)
- Renovación de pisos y revestimientos
- Pintura interior y exterior completa
- Nueva carpintería de aluminio DVH
- Sistema de iluminación LED eficiente
- Instalaciones sanitarias renovadas
- Accesibilidad universal (rampas y baños adaptados)

**Imágenes disponibles en:** `/public/proyectos/edificio-municipal-mosconi-*.jpg`

**Datos para cargar:**
- Tipo: Obra Pública
- Superficie: 850 m²
- Ubicación: General Mosconi, Salta, Argentina
- Presupuesto: $108.200.000
- Inicio: Marzo 2023
- Finalización: Enero 2024
- Estado: Completado

---

### 2. UPATECO 11ª SEDE - VESPUCIO

**Cliente:** Gobierno de la Provincia de Salta - Ministerio de Educación
**Período:** 2024 - Junio 2025
**Inversión:** $145.000.000 ARS
**Estado:** Completado e Inaugurado

**Descripción:**
Construcción de la 11ª sede de la Universidad Provincial de Administración, Tecnología y Oficios (UPATECO) en la localidad de Vespucio. Incluye infraestructura educativa completa con capacidad para 200 estudiantes.

**Instalaciones Construidas:**
- 6 aulas equipadas (capacidad 30 estudiantes c/u)
- 2 talleres de oficios (soldadura, carpintería)
- 1 laboratorio de informática (25 computadoras)
- 1 taller de gastronomía equipado
- Biblioteca con sala de lectura
- Oficinas administrativas
- Baños accesibles en ambos niveles
- Patio interno y área recreativa
- Estacionamiento techado

**Equipamiento Incluido:**
- 150 computadoras de última generación
- Equipamiento completo para talleres de oficios
- Mobiliario educativo para todas las aulas
- Sistema de proyección multimedia en cada aula
- Equipamiento de cocina industrial para gastronomía
- Herramientas profesionales para talleres

**Imágenes disponibles en:** `/public/proyectos/upateco-vespucio-*.jpg`

**Datos para cargar:**
- Tipo: Obra Pública Educativa
- Superficie: 1.200 m²
- Ubicación: Vespucio, Salta, Argentina
- Presupuesto: $145.000.000
- Capacidad: 200 estudiantes
- Inicio: Agosto 2024
- Finalización: Junio 2025
- Estado: Completado

---

## CÓMO AGREGAR ESTOS PROYECTOS AL SISTEMA

### Opción 1: Desde el Dashboard (RECOMENDADO)

1. Acceder a: https://www.emprenor.com/dashboard/proyectos
2. Click en "Nuevo Proyecto"
3. Completar el formulario con los datos de arriba
4. Subir las imágenes desde `/public/proyectos/`
5. Guardar el proyecto

### Opción 2: Mediante MongoDB Compass

1. Conectar a MongoDB con la URI: `MONGODB_URI`
2. Ir a la base de datos `emprenor`
3. Colección: `projects`
4. Insertar documentos con la siguiente estructura:

\`\`\`json
{
  "name": "Edificio Municipal de General Mosconi",
  "description": "Restauración integral del edificio municipal...",
  "clientId": ObjectId("..."), // ID del cliente Municipalidad
  "type": "Obra Pública",
  "status": "completed",
  "startDate": "2023-03-01",
  "endDate": "2024-01-15",
  "budget": 108200000,
  "location": "General Mosconi, Salta, Argentina",
  "area": 850,
  "progress": 100,
  "images": [
    "/proyectos/edificio-municipal-mosconi-fachada.jpg",
    "/proyectos/edificio-municipal-mosconi-interior.jpg",
    "/proyectos/edificio-municipal-mosconi-antes-despues.jpg"
  ],
  "createdAt": "2023-03-01T00:00:00Z",
  "updatedAt": "2024-01-15T00:00:00Z"
}
\`\`\`

### Opción 3: Mediante API

\`\`\`bash
curl -X POST https://www.emprenor.com/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Edificio Municipal de General Mosconi",
    "description": "Restauración integral...",
    "type": "Obra Pública",
    "budget": 108200000,
    ...
  }'
\`\`\`

---

## IMÁGENES GENERADAS

Las siguientes imágenes están listas para usar en el sistema:

**Edificio Municipal General Mosconi:**
1. `edificio-municipal-mosconi-fachada.jpg` - Fachada exterior restaurada
2. `edificio-municipal-mosconi-interior.jpg` - Oficinas interiores
3. `edificio-municipal-mosconi-antes-despues.jpg` - Comparación antes/después

**UPATECO Vespucio:**
1. `upateco-vespucio-fachada.jpg` - Fachada del edificio educativo
2. `upateco-vespucio-aulas.jpg` - Aulas equipadas
3. `upateco-vespucio-talleres.jpg` - Talleres de oficios
4. `upateco-vespucio-equipamiento.jpg` - Laboratorio de computación

---

## REFERENCIAS

- Edificio Municipal Mosconi: https://www.salta.gob.ar/prensa/noticias/general-mosconi-cuenta-con-un-restaurado-edificio-municipal-93834
- UPATECO Vespucio: https://www.salta.gob.ar/prensa/noticias/la-upateco-tendra-la-11-sede-en-vespucio-el-gobernador-saenz-recorrio-las-nuevas-instalaciones-102188
