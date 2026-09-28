export const PREFAB_SYSTEMS = [
  {
    id: "steel-frame",
    name: "Steel Frame",
    badge: "En seco",
    tagline: "Construcción en seco industrializada",
    desc: "Estructura de acero galvanizado, fabricación en planta y montaje en lote. El plazo y el precio se escriben en la propuesta.",
    modality: "Prefabricada · planta + montaje",
    plazo: "Según relevamiento",
    color: "from-teal-500 to-teal-600",
    borderActive: "border-teal-500",
    ideal: "Primera vivienda, campo, plazos ajustados",
    pros: ["Obra en seco", "Aislación según el proyecto", "Montaje en lote", "Precio definido en la propuesta"],
  },
  {
    id: "wood-frame",
    name: "Wood Frame",
    badge: "Natural",
    tagline: "Entramado de madera tratada",
    desc: "Madera estructural con cerramiento OSB o similar. Ambiente cálido, liviano y muy adecuado para clima seco del NOA y casas de campo.",
    modality: "Semi-industrializada · taller + obra",
    plazo: "Según relevamiento",
    color: "from-amber-600 to-amber-700",
    borderActive: "border-amber-500",
    ideal: "Campo, fin de semana, estética natural",
    pros: ["Material renovable", "Buena aislación en zonas secas", "Liviano para lotes difíciles", "Ampliaciones sencillas"],
  },
  {
    id: "hormigon",
    name: "Hormigón armado",
    badge: "Hormigón",
    tagline: "Estructura y paneles de hormigón",
    desc: "Losas, muros portantes o paneles de hormigón armado. La resistencia y el cálculo se definen en el proyecto.",
    modality: "Prefabricada o mixta · planta + obra",
    plazo: "Según relevamiento",
    color: "from-slate-600 to-slate-800",
    borderActive: "border-slate-600",
    ideal: "Vivienda permanente, zonas sísmicas, bajo mantenimiento",
    pros: ["Masa térmica del hormigón", "Mantenimiento según el proyecto", "Cálculo estructural si el contrato lo incluye", "Precio definido en la propuesta"],
  },
  {
    id: "tradicional",
    name: "Obra tradicional",
    badge: "A medida",
    tagline: "Mampostería y hormigón in situ",
    desc: "Construcción con ladrillos, bloques u hormigón en el lote. El diseño y las terminaciones se definen en la propuesta.",
    modality: "Obra en lote · albañilería",
    plazo: "Según relevamiento",
    color: "from-green-600 to-green-700",
    borderActive: "border-green-500",
    ideal: "Proyectos únicos, ampliaciones, máxima personalización",
    pros: ["Diseño a medida", "Terminaciones según presupuesto", "Obra en el lote", "Puede integrar ampliaciones"],
  },
] as const

export type PrefabSystemId = (typeof PREFAB_SYSTEMS)[number]["id"]

export function buildPrefabPrice(_line: string, _sqm: number, _systemId: PrefabSystemId = "steel-frame") {
  return {
    priceList: "A cotizar",
    anticipo: "Según propuesta",
    cuotaDesde: "Según propuesta",
    cuotas: "El plan de pagos se define en la propuesta",
    m2Rate: 0,
  }
}

export function buildDeliveryTime(_baseDays: number, _systemId: PrefabSystemId = "steel-frame") {
  return "Según relevamiento"
}

export function pricingFootnote(systemId: PrefabSystemId) {
  const sys = PREFAB_SYSTEMS.find((s) => s.id === systemId)
  return `Precio a cotizar · ${sys?.name ?? "sistema a definir"} · zona NOA · después del relevamiento`
}
