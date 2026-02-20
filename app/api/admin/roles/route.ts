import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission, DEFAULT_PERMISSIONS, invalidatePermissionsCache } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/db/models"

// GET: Obtener la configuración de permisos actual
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    if (!hasPermission(user.role as UserRole, "admin.roles")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const db = await getDb()
    const config = await db.collection("roles_config").findOne({ type: "permissions_override" })

    return NextResponse.json({
      permissions: config?.permissions || DEFAULT_PERMISSIONS,
      lastUpdatedBy: config?.lastUpdatedBy || null,
      lastUpdatedAt: config?.lastUpdatedAt || null,
      isCustomized: !!config?.permissions,
    })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// PUT: Actualizar la configuración de permisos
export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    if (!hasPermission(user.role as UserRole, "admin.roles")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const { permissions } = body

    if (!permissions || typeof permissions !== "object") {
      return NextResponse.json({ error: "Formato de permisos inválido" }, { status: 400 })
    }

    // Validar que los permisos tengan estructura correcta
    const validRoles = ["super_admin", "admin", "gerente", "supervisor", "trabajador", "cliente"]
    for (const [key, roles] of Object.entries(permissions)) {
      if (!Array.isArray(roles)) {
        return NextResponse.json({ error: `Permiso "${key}" debe ser un array de roles` }, { status: 400 })
      }
      for (const role of roles) {
        if (!validRoles.includes(role as string)) {
          return NextResponse.json({ error: `Rol "${role}" no es válido en permiso "${key}"` }, { status: 400 })
        }
      }
    }

    // Proteger permisos de super_admin: siempre debe tener admin.access y admin.roles
    const protectedPermissions = ["admin.access", "admin.settings", "admin.logs", "admin.roles"]
    for (const perm of protectedPermissions) {
      if (permissions[perm] && !permissions[perm].includes("super_admin")) {
        permissions[perm] = ["super_admin", ...permissions[perm]]
      }
    }

    const db = await getDb()

    await db.collection("roles_config").updateOne(
      { type: "permissions_override" },
      {
        $set: {
          type: "permissions_override",
          permissions,
          lastUpdatedBy: {
            userId: user._id,
            name: `${user.name} ${user.lastName}`,
            email: user.email,
          },
          lastUpdatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    // Registrar en audit log
    await db.collection("audit_logs").insertOne({
      action: "permissions_updated",
      userId: user._id,
      userName: `${user.name} ${user.lastName}`,
      userEmail: user.email,
      details: "Configuración de permisos actualizada desde el panel de administración",
      timestamp: new Date(),
    })

    // Invalidar cache
    invalidatePermissionsCache()

    return NextResponse.json({ success: true, message: "Permisos actualizados correctamente" })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// POST: Restaurar permisos por defecto
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    if (!hasPermission(user.role as UserRole, "admin.roles")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    if (body.action !== "reset") {
      return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
    }

    const db = await getDb()
    await db.collection("roles_config").deleteOne({ type: "permissions_override" })

    await db.collection("audit_logs").insertOne({
      action: "permissions_reset",
      userId: user._id,
      userName: `${user.name} ${user.lastName}`,
      userEmail: user.email,
      details: "Permisos restaurados a valores por defecto",
      timestamp: new Date(),
    })

    invalidatePermissionsCache()

    return NextResponse.json({ success: true, message: "Permisos restaurados a valores por defecto" })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
