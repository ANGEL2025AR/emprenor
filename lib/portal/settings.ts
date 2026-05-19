import { getDb } from "@/lib/db/connection"
import {
  DEFAULT_PORTAL_SETTINGS,
  mergePortalSettings,
  type PortalSettings,
} from "@/lib/portal/portal-settings-shared"

export type {
  PortalModuleKey,
  PortalModuleSettings,
  PortalSettings,
} from "@/lib/portal/portal-settings-shared"

export {
  DEFAULT_PORTAL_SETTINGS,
  mergePortalSettings,
  isPortalModuleEnabled,
} from "@/lib/portal/portal-settings-shared"

const SETTINGS_DOC_TYPE = "portal_employee"

export async function getPortalSettings(): Promise<PortalSettings> {
  try {
    const db = await getDb()
    const doc = await db.collection("settings").findOne({ type: SETTINGS_DOC_TYPE })
    if (!doc?.portal) return DEFAULT_PORTAL_SETTINGS
    return mergePortalSettings(doc.portal as Partial<PortalSettings>)
  } catch {
    return DEFAULT_PORTAL_SETTINGS
  }
}
