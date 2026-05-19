# Validación del panel EMPRENOR (100%)

Guía para administradores **sin conocimientos técnicos**. Marque cada ítem al probarlo en **producción** o en su entorno de prueba con su usuario super administrador.

---

## Antes de empezar

- [ ] Inició sesión en `/login` con su cuenta administrador
- [ ] Ve el menú lateral completo (proyectos, finanzas, sitio web, usuarios, etc.)
- [ ] La URL del sitio público (`NEXT_PUBLIC_SITE_URL`) es la correcta

**Comandos técnicos (opcional, para su equipo IT):**

```bash
npm run verify:links    # Detecta enlaces rotos en el código
npm run type-check      # Verifica tipos
npm run build           # Compila para producción
```

---

## 1. Núcleo del panel

| # | Prueba | Ruta | ✓ |
|---|--------|------|---|
| 1.1 | Panel principal carga sin error | `/dashboard` | |
| 1.2 | Mi perfil guarda cambios | `/dashboard/perfil` | |
| 1.3 | Configuración abre y guarda | `/dashboard/configuracion` | |
| 1.4 | Notificaciones listan | `/dashboard/notificaciones` | |
| 1.5 | Búsqueda global (barra superior) devuelve resultados | Cualquier página | |

---

## 2. Proyectos y obra

| # | Prueba | Ruta | ✓ |
|---|--------|------|---|
| 2.1 | Listado de proyectos | `/dashboard/proyectos` | |
| 2.2 | Crear proyecto nuevo | `/dashboard/proyectos/nuevo` | |
| 2.3 | Ver detalle de un proyecto | `/dashboard/proyectos/[id]` | |
| 2.4 | Editar proyecto | `/dashboard/proyectos/[id]/editar` | |
| 2.5 | Tareas: listar, crear, ver detalle | `/dashboard/tareas` | |
| 2.6 | Bitácora: listar, **nueva**, **ver detalle** | `/dashboard/bitacora-diaria` | |
| 2.7 | Punch lists: listar, **nueva**, **ver detalle** | `/dashboard/punch-lists` | |
| 2.8 | RFIs: listar, nuevo, ver detalle | `/dashboard/rfis` | |
| 2.9 | Inspecciones: listar, nueva, detalle | `/dashboard/inspecciones` | |
| 2.10 | Incidencias: listar, nueva, detalle | `/dashboard/incidencias` | |
| 2.11 | Documentos del proyecto | `/dashboard/documentos` | |
| 2.12 | Calendario muestra eventos del mes | `/dashboard/calendario` | |

---

## 3. Comercial y finanzas

| # | Prueba | Ruta | ✓ |
|---|--------|------|---|
| 3.1 | Clientes: listar, nuevo, detalle, editar | `/dashboard/clientes` | |
| 3.2 | Cotizaciones: flujo completo | `/dashboard/cotizaciones` | |
| 3.3 | Contratos | `/dashboard/contratos` | |
| 3.4 | Facturas | `/dashboard/facturas` | |
| 3.5 | Pagos | `/dashboard/pagos` | |
| 3.6 | Finanzas / movimientos | `/dashboard/finanzas` | |
| 3.7 | Reportes y subreportes | `/dashboard/reportes` | |

---

## 4. Recursos humanos y operaciones

| # | Prueba | Ruta | ✓ |
|---|--------|------|---|
| 4.1 | Empleados | `/dashboard/empleados` | |
| 4.2 | Usuarios y roles | `/dashboard/usuarios` | |
| 4.3 | Inventario | `/dashboard/inventario` | |
| 4.4 | Proveedores | `/dashboard/proveedores` | |
| 4.5 | Certificados | `/dashboard/certificados` | |

---

## 5. Portal empleado (probar con usuario trabajador)

| # | Prueba | Ruta | ✓ |
|---|--------|------|---|
| 5.1 | Portal inicio | `/dashboard/portal` | |
| 5.2 | Billetera | `/dashboard/portal/billetera` | |
| 5.3 | Recibos | `/dashboard/portal/recibos` | |
| 5.4 | Legajo | `/dashboard/portal/legajo` | |
| 5.5 | Solicitudes / ART / Mesa de ayuda | Rutas portal | |

---

## 6. Sitio web público (desde el panel)

| # | Prueba | Ruta | ✓ |
|---|--------|------|---|
| 6.1 | Proyectos publicados en el sitio | `/dashboard/sitio-web/proyectos` | |
| 6.2 | Crear/editar proyecto público y marcar **Publicado** | | |
| 6.3 | Ver en la web: `/proyectos` y detalle `/proyectos/[id]` | Sitio público | |
| 6.4 | Páginas del sitio (CMS) | `/dashboard/sitio-web/paginas` | |
| 6.5 | Mensajes de contacto | `/dashboard/contactos` | |

---

## 7. Administración

| # | Prueba | Ruta | ✓ |
|---|--------|------|---|
| 7.1 | Roles y permisos | `/dashboard/roles` | |
| 7.2 | Auditoría de acciones | `/dashboard/auditoria` | |
| 7.3 | Automatizaciones: listar, activar/desactivar, ver detalle | `/dashboard/automatizaciones` | |
| 7.4 | Chat interno | `/dashboard/chat` | |

---

## 8. Seguridad (comprobaciones importantes)

| # | Comprobación | ✓ |
|---|--------------|---|
| 8.1 | Cerrar sesión y no poder volver atrás al panel sin login | |
| 8.2 | `/registro` no crea acceso directo (cuenta pendiente o deshabilitado) | |
| 8.3 | En la web pública no aparecen proyectos en borrador | |
| 8.4 | Usuario cliente solo ve **sus** proyectos (probar con cuenta cliente) | |

---

## 9. Criterio “100% validado”

El panel se considera **validado al 100%** cuando:

1. **Todas** las filas de las tablas 1–7 están marcadas sin errores graves.
2. Las secciones 8 pasan las comprobaciones de seguridad.
3. `npm run build` termina sin errores (equipo técnico).
4. `npm run verify:links` no reporta enlaces rotos (equipo técnico).

---

## Si algo falla

Anote: **qué hizo**, **ruta exacta**, **mensaje en pantalla** y envíelo a soporte/desarrollo. No borre datos de prueba hasta documentar el fallo.

*Última actualización: validación ampliada con bitácora, punch lists, automatizaciones, APIs de incidencias/búsqueda/calendario y script `verify:links`.*
