# GUÍA PARA AGREGAR FOTOS REALES DE LOS PROYECTOS EMPRENOR

## PROYECTOS COMPLETADOS POR EMPRENOR CONSTRUCCIONES

### 1. EDIFICIO MUNICIPAL DE GENERAL MOSCONI
**Enlace del proyecto:** https://www.salta.gob.ar/prensa/noticias/general-mosconi-cuenta-con-un-restaurado-edificio-municipal-93834

**Información del Proyecto:**
- **Cliente:** Municipalidad de General Mosconi / Gobierno de Salta
- **Inversión:** $108.2 millones ARS
- **Fecha de finalización:** Enero 2024
- **Ubicación:** Calle Belgrano (ala este), General Mosconi, San Martín, Salta

**Trabajos realizados:**
- Contrapisos y pisos
- Mamposterías y revoques
- Molduras y cubiertas
- Instalaciones eléctricas y sanitarias completas
- Desagües pluviales
- Preinstalación de sistema de vigilancia
- Tabiques divisorios de placas de yeso
- Cielorrasos y colocación de zócalos
- Cerámicos en baños
- Impermeabilización de losas planas
- Carpintería completa
- Cisterna de reserva de 5.000 litros
- Pintura exterior e interior

**FOTOS DISPONIBLES EN:**
El artículo menciona "Galería de Fotos" - Debes:
1. Ir al enlace: https://www.salta.gob.ar/prensa/noticias/general-mosconi-cuenta-con-un-restaurado-edificio-municipal-93834
2. Buscar el botón "Galería de Fotos" en el artículo
3. Descargar todas las fotos de:
   - Fachada restaurada del edificio
   - Interior de oficinas
   - Trabajos de restauración
   - Vista general del edificio municipal
4. Guardar las fotos con nombres descriptivos

---

### 2. UPATECO 11ª SEDE - CAMPAMENTO VESPUCIO
**Enlace del proyecto:** https://www.salta.gob.ar/prensa/noticias/la-upateco-tendra-la-11-sede-en-vespucio-el-gobernador-saenz-recorrio-las-nuevas-instalaciones-102188

**Información del Proyecto:**
- **Cliente:** Universidad Provincial de Administración, Tecnología y Oficios (UPATECO) / Gobierno de Salta
- **Inversión:** Aproximadamente $145 millones ARS
- **Fecha de inauguración:** 13 de Junio 2025
- **Ubicación:** Av. Martín Miguel de Güemes y calle Petróleo Argentino, Campamento Vespucio, General Mosconi

**Infraestructura construida:**
- 2 aulas para clases teóricas
- 2 salas de informática equipadas
- 1 aula taller para práctica con herramientas y materiales
- Área administrativa completa
- Sala de reuniones
- Sanitarios renovados

**Trabajos de refacción realizados:**
- Refacción integral de área de administración
- Renovación de aulas y talleres
- Renovación total de techos y cielorrasos
- Instalación de red eléctrica completa
- Centro de transformación de 100 kva/33kv
- Alumbrado público
- Cableado subterráneo
- Sanitarios completos

**Equipamiento instalado:**
- Computadoras en salas de informática
- Herramientas para talleres de:
  - Electricidad domiciliaria
  - Mecánica ligera
  - Reparación de PC
  - Electrodomésticos
  - Aire acondicionado
  - Celulares y dispositivos móviles

**FOTOS Y VIDEO DISPONIBLES EN:**
El artículo menciona "Galería de Fotos" y "Video Relacionado" - Debes:
1. Ir al enlace: https://www.salta.gob.ar/prensa/noticias/la-upateco-tendra-la-11-sede-en-vespucio-el-gobernador-saenz-recorrio-las-nuevas-instalaciones-102188
2. Buscar el botón "Galería de Fotos" en el artículo
3. Descargar todas las fotos de:
   - Fachada del edificio UPATECO
   - Aulas equipadas
   - Salas de informática
   - Talleres con herramientas
   - Áreas administrativas
   - Recorrido del Gobernador Sáenz
4. Opcional: Ver el video relacionado para capturar más imágenes
5. Guardar las fotos con nombres descriptivos

---

## CÓMO AGREGAR LAS FOTOS AL SISTEMA EMPRENOR

### OPCIÓN 1: Desde el Dashboard (Recomendado)

1. **Acceder al sistema:**
   - Ir a https://www.emprenor.com/setup
   - Crear usuario admin si no existe
   - Login en https://www.emprenor.com/login

2. **Ir a Proyectos:**
   - Click en "Proyectos" en el menú lateral
   - Click en "Nuevo Proyecto"

3. **Crear el proyecto del Edificio Municipal:**
   - **Nombre:** Restauración Edificio Municipal de General Mosconi
   - **Cliente:** Seleccionar o crear "Gobierno de Salta"
   - **Tipo:** Infraestructura Pública
   - **Estado:** Completado
   - **Presupuesto:** $108,200,000
   - **Fecha de inicio:** 01/04/2023
   - **Fecha de finalización:** 31/01/2024
   - **Ubicación:** Calle Belgrano, General Mosconi, San Martín, Salta
   - **Descripción:** [Copiar descripción completa de arriba]
   
4. **Subir las fotos reales:**
   - En el formulario de creación, buscar la sección "Imágenes del Proyecto"
   - Click en "Seleccionar archivos" o arrastrar las fotos descargadas
   - Subir todas las fotos de la galería del sitio web
   - Guardar el proyecto

5. **Agregar documentos al proyecto:**
   - Una vez creado el proyecto, ir a la pestaña "Documentos"
   - Subir:
     - Planos originales (si los tienes)
     - Contrato con el gobierno
     - Certificados de obra
     - Acta de finalización
     - Fotos de "antes y después"

6. **Repetir el proceso para UPATECO:**
   - Crear nuevo proyecto con datos de UPATECO
   - Subir todas las fotos reales del segundo enlace

### OPCIÓN 2: API directa (Para desarrolladores)

\`\`\`bash
# 1. Subir imágenes a Vercel Blob
curl -X POST "https://www.emprenor.com/api/documents/upload" \
  -H "Authorization: Bearer [TU_TOKEN]" \
  -F "file=@edificio-mosconi-1.jpg" \
  -F "type=image" \
  -F "category=foto-obra"

# 2. Crear proyecto con las URLs de las imágenes
curl -X POST "https://www.emprenor.com/api/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [TU_TOKEN]" \
  -d '{
    "name": "Restauración Edificio Municipal de General Mosconi",
    "clientId": "[ID_DEL_CLIENTE]",
    "type": "Infraestructura Pública",
    "status": "completado",
    "budget": 108200000,
    "startDate": "2023-04-01",
    "endDate": "2024-01-31",
    "location": "Calle Belgrano, General Mosconi, San Martín, Salta",
    "description": "...",
    "images": [
      "[URL_BLOB_IMAGEN_1]",
      "[URL_BLOB_IMAGEN_2]",
      "[URL_BLOB_IMAGEN_3]"
    ]
  }'
\`\`\`

### OPCIÓN 3: Importación masiva desde MongoDB

\`\`\`javascript
// Script para ejecutar en MongoDB Compass o mongosh
use emprenor_db

// Insertar proyecto Edificio Municipal
db.projects.insertOne({
  name: "Restauración Edificio Municipal de General Mosconi",
  client: ObjectId("[ID_DEL_CLIENTE_GOBIERNO_SALTA]"),
  type: "Infraestructura Pública",
  status: "completado",
  budget: 108200000,
  spent: 108200000,
  startDate: new Date("2023-04-01"),
  endDate: new Date("2024-01-31"),
  location: "Calle Belgrano, General Mosconi, San Martín, Salta",
  description: "Obras de terminación y restauración del edificio municipal de General Mosconi realizadas en tres etapas...",
  images: [
    // REEMPLAZAR CON URLs REALES DE LAS FOTOS DESCARGADAS
    "https://[BLOB_URL]/edificio-mosconi-fachada.jpg",
    "https://[BLOB_URL]/edificio-mosconi-interior.jpg",
    "https://[BLOB_URL]/edificio-mosconi-obras.jpg"
  ],
  createdAt: new Date(),
  updatedAt: new Date()
})

// Insertar proyecto UPATECO
db.projects.insertOne({
  name: "UPATECO 11ª Sede - Campamento Vespucio",
  client: ObjectId("[ID_DEL_CLIENTE_GOBIERNO_SALTA]"),
  type: "Educación",
  status: "completado",
  budget: 145000000,
  spent: 145000000,
  startDate: new Date("2024-06-01"),
  endDate: new Date("2025-06-13"),
  location: "Av. Martín Miguel de Güemes y calle Petróleo Argentino, Campamento Vespucio",
  description: "Construcción y equipamiento de la 11ª sede de UPATECO en Campamento Vespucio...",
  images: [
    // REEMPLAZAR CON URLs REALES DE LAS FOTOS DESCARGADAS
    "https://[BLOB_URL]/upateco-fachada.jpg",
    "https://[BLOB_URL]/upateco-aulas.jpg",
    "https://[BLOB_URL]/upateco-talleres.jpg",
    "https://[BLOB_URL]/upateco-informatica.jpg"
  ],
  createdAt: new Date(),
  updatedAt: new Date()
})
\`\`\`

---

## IMPORTANTE: URLs DE FOTOS REALES

**NO uses imágenes ilustrativas o generadas.** 

**DEBES:**
1. Ir a los enlaces proporcionados
2. Abrir las galerías de fotos oficiales
3. Descargar las fotos REALES de las obras
4. Subirlas al sistema EMPRENOR

Las fotos oficiales del Gobierno de Salta son las únicas válidas ya que documentan el trabajo real ejecutado por EMPRENOR CONSTRUCCIONES.

---

## CONTACTO PARA MÁS FOTOS

Si necesitas más fotos o documentación:
- **Gobierno de Salta - Secretaría de Prensa:** https://www.salta.gob.ar/prensa
- **Teléfono:** Secretaría de Obras Públicas de Salta
- **Email:** Solicitar al área de prensa del gobierno

---

**Fecha del documento:** 28 de Noviembre 2025
**Empresa:** EMPRENOR CONSTRUCCIONES
**Sistema:** EMPRENOR - Gestión de Proyectos de Construcción
