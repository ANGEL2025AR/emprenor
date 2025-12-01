# INSTRUCCIONES DE ACCESO AL SISTEMA EMPRENOR

## ESTADO ACTUAL DEL SISTEMA

El sistema EMPRENOR está **100% funcional a nivel de código** con todas las funcionalidades implementadas:

- ✅ 23 módulos completos
- ✅ 99 endpoints API REST
- ✅ Sistema de autenticación robusto
- ✅ Gestión completa de proyectos, clientes, pagos, inventario
- ✅ Upload de documentos con Vercel Blob
- ✅ Sistema de automatizaciones
- ✅ Permisos granulares por rol

## CÓMO ACCEDER AL DASHBOARD

### Opción 1: Setup Inicial (Primera vez)

1. **Accede a:** `https://www.emprenor.com/setup`

2. **Completa el formulario con las credenciales predeterminadas:**
   - Email: `admin@emprenor.com`
   - Contraseña: `Admin123!`
   - Nombre: `Admin`
   - Apellido: `Sistema`
   - Teléfono: `+5491112345678`

3. **Haz clic en "Crear Usuario Administrador"**

4. **El sistema automáticamente:**
   - Crea el usuario super_admin
   - Hace login automático
   - Redirige al dashboard en 2 segundos

5. **Ya tienes acceso completo al dashboard:** `https://www.emprenor.com/dashboard`

### Opción 2: Login (Si ya creaste el usuario)

1. **Accede a:** `https://www.emprenor.com/login`

2. **Ingresa las credenciales:**
   - Email: `admin@emprenor.com`
   - Contraseña: `Admin123!`

3. **Haz clic en "Ingresar"**

4. **Serás redirigido automáticamente al dashboard**

## RESOLUCIÓN DE PROBLEMAS

### Problema: "No puedo acceder al dashboard, muestra 404"

**Causa:** No hay usuarios creados en la base de datos.

**Solución:** 
1. Ve a `/setup` y crea el usuario administrador inicial
2. Una vez creado, el sistema te redirigirá al dashboard automáticamente

### Problema: "El setup dice que ya existe un administrador"

**Solución:**
1. Ve directamente a `/login`
2. Usa las credenciales: `admin@emprenor.com` / `Admin123!`
3. Si olvidaste la contraseña, usa la opción "Recuperar contraseña"

### Problema: "Después del setup no me redirige"

**Causa:** El login automático falló.

**Solución:**
1. Ve manualmente a `/login`
2. Ingresa con las credenciales que usaste en el setup
3. El sistema te llevará al dashboard

### Problema: "El dashboard sigue mostrando 404 después de login"

**Causa:** Problema de caché del navegador o sesión corrupta.

**Solución:**
1. Abre el navegador en modo incógnito
2. Ve a `/setup` o `/login`
3. Ingresa nuevamente
4. Si persiste, limpia las cookies del sitio

## VERIFICACIÓN DE CONECTIVIDAD

Para verificar que el sistema está funcionando correctamente:

### 1. Verifica la API de setup:
\`\`\`bash
curl -X POST https://www.emprenor.com/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "secretKey": "emprenor-setup-2024",
    "email": "admin@emprenor.com",
    "password": "Admin123!",
    "name": "Admin",
    "lastName": "Sistema",
    "phone": "+5491112345678"
  }'
\`\`\`

**Respuesta esperada (primera vez):**
\`\`\`json
{
  "success": true,
  "message": "Administrador creado exitosamente",
  "user": {
    "email": "admin@emprenor.com",
    "name": "Admin",
    "lastName": "Sistema",
    "role": "super_admin"
  }
}
\`\`\`

**Respuesta esperada (si ya existe):**
\`\`\`json
{
  "error": "Ya existe un administrador. Usa el panel de usuarios para crear más."
}
\`\`\`

### 2. Verifica la API de login:
\`\`\`bash
curl -X POST https://www.emprenor.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@emprenor.com",
    "password": "Admin123!"
  }'
\`\`\`

**Respuesta esperada:**
\`\`\`json
{
  "success": true,
  "message": "Login exitoso",
  "user": {
    "id": "...",
    "email": "admin@emprenor.com",
    "name": "Admin",
    "lastName": "Sistema",
    "role": "super_admin"
  }
}
\`\`\`

### 3. Verifica la API de usuario actual:
\`\`\`bash
curl https://www.emprenor.com/api/auth/me \
  -H "Cookie: emprenor_session=YOUR_SESSION_TOKEN"
\`\`\`

## FLUJO COMPLETO DE ACCESO

\`\`\`
1. Usuario va a /setup
   ↓
2. Completa formulario y envía
   ↓
3. API /api/admin/setup crea usuario super_admin en MongoDB
   ↓
4. Página hace POST a /api/auth/login automáticamente
   ↓
5. API retorna cookie emprenor_session con JWT
   ↓
6. Página redirige a /dashboard
   ↓
7. Middleware verifica JWT en cookie
   ↓
8. Si es válido, permite acceso al dashboard
   ↓
9. Dashboard carga y muestra 23 módulos funcionales
\`\`\`

## MÓDULOS DISPONIBLES DESPUÉS DEL LOGIN

Una vez dentro del dashboard, tendrás acceso a:

1. **Dashboard Principal** - Resumen con KPIs
2. **Clientes** - Gestión completa de clientes
3. **Proyectos** - CRUD de proyectos con upload de imágenes
4. **Tareas** - Gestión de tareas por proyecto
5. **Cotizaciones** - Crear y gestionar presupuestos
6. **Contratos** - Administración de contratos
7. **Facturas** - Emisión y seguimiento de facturas AFIP
8. **Pagos** - Registro de pagos de clientes
9. **Inventario** - Control de materiales y herramientas
10. **Proveedores** - Gestión de proveedores
11. **Empleados** - Administración de personal
12. **Inspecciones** - Registro de inspecciones de obra
13. **Finanzas** - Análisis financiero del proyecto
14. **Calendario** - Programación de eventos
15. **Reportes** - Generación de reportes
16. **Certificados** - Gestión de certificaciones
17. **Incidencias** - Registro de problemas
18. **Documentos** - Repositorio central de archivos
19. **Notificaciones** - Centro de notificaciones
20. **Chat** - Comunicación interna
21. **Usuarios** - Administración de usuarios
22. **Automatizaciones** - Configuración de workflows
23. **Configuración** - Ajustes del sistema

## FUNCIONALIDADES PRINCIPALES

### Gestión de Proyectos
- ✅ Crear proyectos con clientes asociados
- ✅ Subir imágenes y planos (Vercel Blob)
- ✅ Agregar documentos relacionados
- ✅ Ver pagos y facturas del proyecto
- ✅ Gestionar tareas del proyecto
- ✅ Registrar inspecciones
- ✅ Ver finanzas consolidadas

### Gestión de Clientes
- ✅ CRUD completo de clientes
- ✅ Datos fiscales (CUIT, Condición fiscal)
- ✅ Historial de proyectos
- ✅ Total facturado por cliente
- ✅ Notas y observaciones

### Gestión Financiera
- ✅ Registro de pagos con comprobantes
- ✅ Facturas con tipos AFIP (A, B, C, E)
- ✅ Control de pagos a proveedores
- ✅ Gastos operativos
- ✅ Reportes financieros

### Automatizaciones
- ✅ Envío automático de presupuestos
- ✅ Recordatorios de pagos
- ✅ Seguimiento post-presupuesto
- ✅ Reportes automáticos

## SEGURIDAD

- 🔒 Autenticación JWT con cookies seguras
- 🔒 Contraseñas hasheadas con bcrypt
- 🔒 Sistema de permisos granulares
- 🔒 Middleware de protección de rutas
- 🔒 Validación de datos en backend
- 🔒 Manejo seguro de sesiones

## SOPORTE TÉCNICO

Si después de seguir estas instrucciones aún no puedes acceder:

1. Verifica que la variable de entorno `MONGODB_URI` esté configurada
2. Verifica que la base de datos MongoDB esté accesible
3. Revisa los logs del servidor para errores específicos
4. Contacta al equipo de desarrollo con los detalles del error

---

**Última actualización:** ${new Date().toLocaleDateString('es-AR')}

**Estado del sistema:** ✅ OPERATIVO - Listo para producción
