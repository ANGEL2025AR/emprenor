# Configuración de MongoDB para EMPRENOR

## Resumen
Este documento explica cómo configurar MongoDB para recibir y almacenar los datos del formulario de contacto del sitio web EMPRENOR.

## Requisitos Previos
- Una cuenta de MongoDB Atlas (gratuita) o una instancia local de MongoDB
- La base de datos ya debe estar creada según lo indicado por el usuario

## Pasos de Configuración

### 1. Obtener la Cadena de Conexión

#### Si usas MongoDB Atlas (Cloud):
1. Ve a [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Inicia sesión en tu cuenta
3. Selecciona tu cluster
4. Haz clic en "Connect"
5. Selecciona "Connect your application"
6. Copia la cadena de conexión que se ve así:
   \`\`\`
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   \`\`\`

#### Si usas MongoDB Local:
Tu cadena de conexión será similar a:
\`\`\`
mongodb://localhost:27017/emprenor
\`\`\`

### 2. Configurar Variable de Entorno

En tu proyecto de Vercel o localmente, agrega la siguiente variable de entorno:

**Nombre de la variable:**
\`\`\`
MONGODB_URI
\`\`\`

**Valor de la variable:**
\`\`\`
mongodb+srv://<tu-usuario>:<tu-password>@cluster0.xxxxx.mongodb.net/emprenor?retryWrites=true&w=majority
\`\`\`

#### En Vercel:
1. Ve a tu proyecto en vercel.com
2. Navega a Settings > Environment Variables
3. Agrega `MONGODB_URI` con tu cadena de conexión
4. Haz clic en "Save"
5. Redeploy tu aplicación

#### Localmente:
Crea un archivo `.env.local` en la raíz del proyecto:
\`\`\`bash
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/emprenor?retryWrites=true&w=majority
\`\`\`

### 3. Estructura de la Base de Datos

La aplicación creará automáticamente:

**Base de datos:** `emprenor`

**Colección:** `contactos`

**Esquema de documento:**
\`\`\`javascript
{
  _id: ObjectId("..."),
  name: "Juan Pérez",
  email: "juan@ejemplo.com",
  phone: "+54 9 387 123-4567",
  service: "construccion",
  message: "Necesito construir una casa...",
  createdAt: ISODate("2025-01-10T..."),
  status: "nuevo",  // nuevo | en_proceso | completado
  source: "formulario_web"
}
\`\`\`

### 4. Verificar la Conexión

#### Opción A — Script local (recomendado)

Con `.env.local` configurado:

```bash
npm run db:test    # solo ping + conteos de colecciones
npm run db:sync    # índices + marca EMPRENOR C&S + servicios CMS + portadas
```

#### Opción B — API de salud

```bash
curl http://localhost:3001/api/health/db
```

En producción podés definir `HEALTH_CHECK_SECRET` y enviar el header `x-health-secret`.

#### Opción C — Formulario web

1. Abre el formulario de contacto en tu sitio web
2. Completa y envía un formulario de prueba
3. Verifica en MongoDB Atlas que el documento esté en la colección `contactos`

### 4.1 Sincronizar CMS y marca (EMPRENOR C&S)

El comando `npm run db:sync` actualiza:

- **settings** (`type: company`) — CUIT, titular RM, marca C&S
- **settings** (`type: portal_employee`) — módulos del portal
- **site_services** — los 9 servicios con textos del código
- **site_pages** — portadas home, nosotros, contacto
- **Índices** en users, projects, contactos, site_services, cumplimiento, etc.

Desde el panel admin: **Sitio Web → Servicios → “Sincronizar desde código”** usa `POST /api/site-services/seed?force=true` para forzar actualización sin borrar datos de otros módulos.

### 5. Ver Contactos Recibidos

#### Opción A: MongoDB Atlas Dashboard
1. Accede a tu cluster en MongoDB Atlas
2. Haz clic en "Browse Collections"
3. Selecciona la base de datos `emprenor` > colección `contactos`
4. Verás todos los mensajes recibidos

#### Opción B: Panel de Administración Web
Ingresá al dashboard con rol admin y abrí **Contactos Web** (`/dashboard/contactos`).

### 6. API Endpoints

**POST /api/contact**
- Guarda un nuevo contacto
- Body: `{ name, email, phone, service, message }`
- Response: `{ success: true, id: "..." }`

**GET /api/contact**
- Obtiene todos los contactos (últimos 100)
- Response: `{ contactos: [...] }`

## Seguridad

⚠️ **IMPORTANTE:**
- Nunca expongas tu cadena de conexión en el código
- Usa variables de entorno para credenciales
- En producción, protege el endpoint GET con autenticación
- Configura IP Whitelist en MongoDB Atlas si es necesario

## Solución de Problemas

### Error: "MongoServerError: Authentication failed"
- Verifica que el usuario y contraseña en la cadena de conexión sean correctos
- Asegúrate de que el usuario tenga permisos de lectura/escritura

### Error: "MongooseServerSelectionError: Could not connect"
- Verifica que tu IP esté en la whitelist de MongoDB Atlas
- Comprueba que la cadena de conexión sea correcta
- Verifica la conectividad de red

### Los datos no se guardan
- Revisa los logs del servidor con `console.log`
- Verifica que la variable de entorno esté configurada correctamente
- Comprueba que la base de datos y colección existan

## Respaldo de Datos

Se recomienda:
- Configurar backups automáticos en MongoDB Atlas
- Exportar datos periódicamente
- Mantener logs de auditoría

## Contacto de Soporte

Si necesitas ayuda adicional con la configuración, contacta al equipo de desarrollo.
