import type { LucideIcon } from "lucide-react"
import {
  Building2,
  Droplets,
  Factory,
  Flame,
  Hammer,
  Home,
  Lightbulb,
  Paintbrush,
  Tractor,
  Wind,
  Wrench,
  Zap,
} from "lucide-react"
import type { SiteServiceIconKey } from "@/lib/db/models"

export const SERVICE_ICON_MAP: Record<SiteServiceIconKey, LucideIcon> = {
  Building2,
  Hammer,
  Home,
  Factory,
  Flame,
  Lightbulb,
  Droplets,
  Paintbrush,
  Zap,
  Wind,
  Wrench,
  Tractor,
}

export function getServiceIcon(key: SiteServiceIconKey): LucideIcon {
  return SERVICE_ICON_MAP[key] ?? Building2
}
