import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { getCurrentUser } from "@/lib/auth/session"
import { hasPermission } from "@/lib/auth/permissions"
import {
  DEFAULT_PORTAL_SETTINGS,
  mergePortalSettings,
  type PortalSettings,
} from "@/lib/portal/settings"
import type { UserRole } from "@/lib/db/models"

const SETTINGS_DOC_TYPE = "portal_employee"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const isAdmin = hasPermission(user.role as UserRole, "portal.admin")
    const isEmployee = hasPermission(user.role as UserRole, "portal.dashboard")

    if (!isAdmin && !isEmployee) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const db = await getDb()
    const doc = await db.collection("settings").findOne({ type: SETTINGS_DOC_TYPE })
    const settings = doc?.portal
      ? mergePortalSettings(doc.portal as Partial<PortalSettings>)
      : DEFAULT_PORTAL_SETTINGS

    if (isAdmin) {
      return NextResponse.json({ settings })
    }

    return NextResponse.json({
      modules: settings.modules,
      advances: { enabled: settings.advances.enabled },
    })
  } catch {
    return NextResponse.json({ error: "Error al cargar configuración" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    if (!hasPermission(user.role as UserRole, "portal.admin")) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 })
    }

    const body = await request.json()
    const settings = mergePortalSettings(body.portal || body)

    const db = await getDb()
    await db.collection("settings").updateOne(
      { type: SETTINGS_DOC_TYPE },
      {
        $set: {
          type: SETTINGS_DOC_TYPE,
          portal: settings,
          updatedAt: new Date(),
          updatedBy: user._id,
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ success: true, settings })
  } catch {
    return NextResponse.json({ error: "Error al guardar configuración" }, { status: 500 })
  }
}
