import type { ServicePageConfig } from "@/lib/site/service-page-types"
import { getCatalogBySlug, resolveServiceSlug } from "@/lib/site/services-catalog"

import remodelacion from "../../shared/service-configs/remodelacion.json"
import albanileria from "../../shared/service-configs/albanileria.json"
import pintura from "../../shared/service-configs/pintura.json"
import agropecuario from "../../shared/service-configs/agropecuario.json"
import climatizacion from "../../shared/service-configs/climatizacion.json"
import construccion from "../../shared/service-configs/construccion.json"
import gas from "../../shared/service-configs/gas.json"
import instalacionesElectricas from "../../shared/service-configs/instalaciones-electricas.json"
import instalacionesSanitarias from "../../shared/service-configs/instalaciones-sanitarias.json"
import mantenimiento from "../../shared/service-configs/mantenimiento.json"
import obrasIndustriales from "../../shared/service-configs/obras-industriales.json"
import viviendasPrefabricadas from "../../shared/service-configs/viviendas-prefabricadas.json"
import ingenieria from "../../shared/service-configs/ingenieria.json"
import gestionDeProyectos from "../../shared/service-configs/gestion-de-proyectos.json"
import terminacionesSecas from "../../shared/service-configs/terminaciones-secas.json"
import herreria from "../../shared/service-configs/herreria.json"
import infraestructuraVial from "../../shared/service-configs/infraestructura-vial.json"
import obrasInstitucionales from "../../shared/service-configs/obras-institucionales.json"

const CONFIG_BY_SLUG: Record<string, ServicePageConfig> = {
  construccion: construccion as ServicePageConfig,
  remodelacion: remodelacion as ServicePageConfig,
  albanileria: albanileria as ServicePageConfig,
  pintura: pintura as ServicePageConfig,
  "instalaciones-electricas": instalacionesElectricas as ServicePageConfig,
  "instalaciones-sanitarias": instalacionesSanitarias as ServicePageConfig,
  gas: gas as ServicePageConfig,
  "obras-industriales": obrasIndustriales as ServicePageConfig,
  agropecuario: agropecuario as ServicePageConfig,
  climatizacion: climatizacion as ServicePageConfig,
  mantenimiento: mantenimiento as ServicePageConfig,
  "viviendas-prefabricadas": viviendasPrefabricadas as ServicePageConfig,
  ingenieria: ingenieria as ServicePageConfig,
  "gestion-de-proyectos": gestionDeProyectos as ServicePageConfig,
  "terminaciones-secas": terminacionesSecas as ServicePageConfig,
  herreria: herreria as ServicePageConfig,
  "infraestructura-vial": infraestructuraVial as ServicePageConfig,
  "obras-institucionales": obrasInstitucionales as ServicePageConfig,
}

export function getServicePageConfig(slug: string): ServicePageConfig | null {
  const resolved = resolveServiceSlug(slug)
  const config = CONFIG_BY_SLUG[resolved]
  if (!config) return null
  const entry = getCatalogBySlug(resolved)
  return {
    ...config,
    slug: resolved,
    catalogTitle:
      entry?.title ??
      (config.hero?.type === "page-header" ? config.hero.title : undefined) ??
      slug,
  }
}

export function hasServicePageConfig(slug: string): boolean {
  return Boolean(CONFIG_BY_SLUG[resolveServiceSlug(slug)])
}
