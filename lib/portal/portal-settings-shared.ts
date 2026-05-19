/** Tipos y helpers del portal sin dependencias de servidor (seguro para componentes cliente). */

export type PortalModuleKey =
  | "wallet"
  | "payslips"
  | "personnelFile"
  | "leaveRequests"
  | "art"
  | "helpDesk"
  | "announcements"
  | "advances"

export type PortalModuleSettings = {
  enabled: boolean
  label: string
}

export type PortalSettings = {
  modules: Record<PortalModuleKey, PortalModuleSettings>
  advances: {
    enabled: boolean
    maxAmount: number
    requiresApproval: boolean
  }
}

export const DEFAULT_PORTAL_SETTINGS: PortalSettings = {
  modules: {
    wallet: { enabled: true, label: "Billetera Virtual" },
    payslips: { enabled: true, label: "Recibos de Sueldo" },
    personnelFile: { enabled: true, label: "Mi Legajo" },
    leaveRequests: { enabled: true, label: "Solicitudes" },
    art: { enabled: true, label: "ART / Seguridad" },
    helpDesk: { enabled: true, label: "Mesa de Ayuda" },
    announcements: { enabled: true, label: "Comunicaciones" },
    advances: { enabled: true, label: "Adelantos de sueldo" },
  },
  advances: {
    enabled: true,
    maxAmount: 500000,
    requiresApproval: true,
  },
}

export function mergePortalSettings(partial: Partial<PortalSettings>): PortalSettings {
  return {
    modules: {
      ...DEFAULT_PORTAL_SETTINGS.modules,
      ...partial.modules,
      wallet: { ...DEFAULT_PORTAL_SETTINGS.modules.wallet, ...partial.modules?.wallet },
      payslips: { ...DEFAULT_PORTAL_SETTINGS.modules.payslips, ...partial.modules?.payslips },
      personnelFile: { ...DEFAULT_PORTAL_SETTINGS.modules.personnelFile, ...partial.modules?.personnelFile },
      leaveRequests: { ...DEFAULT_PORTAL_SETTINGS.modules.leaveRequests, ...partial.modules?.leaveRequests },
      art: { ...DEFAULT_PORTAL_SETTINGS.modules.art, ...partial.modules?.art },
      helpDesk: { ...DEFAULT_PORTAL_SETTINGS.modules.helpDesk, ...partial.modules?.helpDesk },
      announcements: { ...DEFAULT_PORTAL_SETTINGS.modules.announcements, ...partial.modules?.announcements },
      advances: { ...DEFAULT_PORTAL_SETTINGS.modules.advances, ...partial.modules?.advances },
    },
    advances: {
      ...DEFAULT_PORTAL_SETTINGS.advances,
      ...partial.advances,
    },
  }
}

export function isPortalModuleEnabled(settings: PortalSettings, key: PortalModuleKey): boolean {
  if (key === "advances") {
    return settings.modules.advances.enabled && settings.advances.enabled
  }
  return settings.modules[key]?.enabled !== false
}
