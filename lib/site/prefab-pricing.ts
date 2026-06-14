export const PRICING_REFERENCE = {
  anticipoPct: 0.3,
  cuotas: 72,
}

export const PREFAB_SYSTEMS = [
  {
    id: "steel-frame",
    name: "Steel Frame",
    badge: "Más rápido",
    tagline: "Construcción en seco industrializada",
    desc: "Estructura de acero galvanizado, fabricación en planta y montaje en lote. Ideal cuando buscás plazo corto y precio predecible.",
    modality: "Prefabricada · planta + montaje",
    plazo: "45 a 90 días",
    color: "from-teal-500 to-teal-600",
    borderActive: "border-teal-500",
    ideal: "Primera vivienda, campo, plazos ajustados",
    pros: ["Obra en seco y plazo acotado", "Excelente relación costo-beneficio", "Aislación térmica dimensionada", "Montaje con cuadrilla propia"],
  },
  {
    id: "wood-frame",
    name: "Wood Frame",
    badge: "Natural",
    tagline: "Entramado de madera tratada",
    desc: "Madera estructural con cerramiento OSB o similar. Ambiente cálido, liviano y muy adecuado para clima seco del NOA y casas de campo.",
    modality: "Semi-industrializada · taller + obra",
    plazo: "50 a 95 días",
    color: "from-amber-600 to-amber-700",
    borderActive: "border-amber-500",
    ideal: "Campo, fin de semana, estética natural",
    pros: ["Material renovable", "Buena aislación en zonas secas", "Liviano para lotes difíciles", "Ampliaciones sencillas"],
  },
  {
    id: "hormigon",
    name: "Hormigón armado",
    badge: "Máxima durabilidad",
    tagline: "Estructura y paneles de hormigón",
    desc: "Losas, muros portantes o paneles prefabricados de hormigón armado. Máxima resistencia, inercia térmica y vida útil prolongada.",
    modality: "Prefabricada o mixta · planta + obra",
    plazo: "70 a 120 días",
    color: "from-slate-600 to-slate-800",
    borderActive: "border-slate-600",
    ideal: "Vivienda permanente, zonas sísmicas, bajo mantenimiento",
    pros: ["Alta resistencia al fuego", "Excelente masa térmica", "Bajo mantenimiento", "Estructura calculada CIRSOC"],
  },
  {
    id: "tradicional",
    name: "Obra tradicional",
    badge: "A medida",
    tagline: "Mampostería y hormigón in situ",
    desc: "Construcción clásica con ladrillos, bloques u hormigón visto ejecutada íntegramente en el lote. Máxima libertad de diseño y terminaciones.",
    modality: "Obra en lote · albañilería",
    plazo: "4 a 8 meses",
    color: "from-green-600 to-green-700",
    borderActive: "border-green-500",
    ideal: "Proyectos únicos, ampliaciones, máxima personalización",
    pros: ["Diseño totalmente custom", "Terminaciones premium ilimitadas", "Referencia ICC/UOCRA directa", "Integración con ampliaciones futuras"],
  },
] as const

export type PrefabSystemId = (typeof PREFAB_SYSTEMS)[number]["id"]

const SYSTEM_LINE_M2: Record<PrefabSystemId, Record<string, number>> = {
  "steel-frame": { esencial: 1_180_000, familiar: 1_340_000, signature: 1_580_000 },
  "wood-frame": { esencial: 1_120_000, familiar: 1_300_000, signature: 1_520_000 },
  hormigon: { esencial: 1_380_000, familiar: 1_520_000, signature: 1_720_000 },
  tradicional: { esencial: 1_420_000, familiar: 1_505_000, signature: 1_680_000 },
}

const SYSTEM_DAY_FACTOR: Record<PrefabSystemId, number> = {
  "steel-frame": 1,
  "wood-frame": 1.12,
  hormigon: 1.4,
  tradicional: 3.2,
}

export function formatArs(amount: number) {
  const n = Math.round(amount / 1000) * 1000
  return `$${n.toLocaleString("es-AR")}`
}

export function buildPrefabPrice(line: string, sqm: number, systemId: PrefabSystemId = "steel-frame") {
  const rates = SYSTEM_LINE_M2[systemId] ?? SYSTEM_LINE_M2["steel-frame"]
  const rate = rates[line] ?? rates.familiar
  const total = rate * sqm
  const anticipo = total * PRICING_REFERENCE.anticipoPct
  const cuota = (total - anticipo) / PRICING_REFERENCE.cuotas
  return {
    priceList: formatArs(total),
    anticipo: formatArs(anticipo),
    cuotaDesde: formatArs(cuota),
    cuotas: `${PRICING_REFERENCE.cuotas} cuotas fijas en pesos`,
    m2Rate: rate,
  }
}

export function buildDeliveryTime(baseDays: number, systemId: PrefabSystemId = "steel-frame") {
  const factor = SYSTEM_DAY_FACTOR[systemId] ?? 1
  const days = Math.round(baseDays * factor)
  if (systemId === "tradicional") {
    const monthsMin = Math.max(4, Math.round(days / 30))
    return `${monthsMin} a ${monthsMin + 2} meses`
  }
  return `${days} días`
}

export function pricingFootnote(systemId: PrefabSystemId) {
  const sys = PREFAB_SYSTEMS.find((s) => s.id === systemId)
  return `Referencia llave en mano · ${sys?.name ?? "Steel Frame"} · zona NOA · sujeto a relevamiento`
}
