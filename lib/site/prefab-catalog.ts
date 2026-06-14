import { buildDeliveryTime, buildPrefabPrice, PREFAB_SYSTEMS, type PrefabSystemId } from "./prefab-pricing"

export const PREFAB_LINES = [
  { id: "esencial", name: "Línea Esencial", tagline: "Primera vivienda, campo y renta", color: "from-teal-500 to-teal-600", badge: "Entrada" },
  { id: "familiar", name: "Línea Familiar", tagline: "Vivienda permanente en el NOA", color: "from-green-500 to-green-600", badge: "Más solicitada" },
  { id: "signature", name: "Línea Signature", tagline: "Arquitectura contemporánea", color: "from-slate-700 to-slate-900", badge: "Diseño" },
]

const MODEL_DEFS = [
  { id: "esencial-36", line: "esencial", m2: 36, baseDays: 45, name: "Modelo Campo 36", beds: 1, baths: 1, desc: "Unidad compacta para lote rural, guardia o primera vivienda.", rooms: "1 dormitorio · Living-cocina integrado · Baño completo", img: "/assets/prefab/model-36.jpg", planImg: "/assets/prefab/plan-1.jpg", features: ["Distribución optimizada", "Terminación funcional", "Aberturas aluminio"], included: ["Anteproyecto y gestión municipal", "Pisos cerámicos", "Sanitarios de primera línea"] },
  { id: "esencial-47", line: "esencial", m2: 47, baseDays: 50, name: "Modelo Salta 47", beds: 2, baths: 1, desc: "Dos dormitorios con circulación clara y sector día integrado.", rooms: "2 dormitorios · Living-comedor · Cocina · Baño", img: "/assets/prefab/model-47.jpg", planImg: "/assets/prefab/plan-2.jpg", features: ["Cocina con mueble bajo mesada", "Semicubierto opcional", "Preinstalación climatización"], included: ["Termotanque eléctrico", "Iluminación LED", "Conexión a servicios"] },
  { id: "familiar-60", line: "familiar", m2: 60, baseDays: 60, name: "Modelo NOA 60", beds: 2, baths: 1, desc: "Distribución familiar con sector día y noche separados.", rooms: "2 dormitorios · Living · Comedor · Cocina · Baño", img: "/assets/prefab/model-60.jpg", planImg: "/assets/prefab/plan-2.jpg", badge: "Referencia NOA", features: ["Sector día/noche separado", "Cielorraso terminado", "Aislación acústica"], included: ["Platea de hormigón", "Mosquiteros en aberturas", "Garantía 5 años en estructura"] },
  { id: "familiar-81", line: "familiar", m2: 81, baseDays: 70, name: "Modelo Familiar 81", beds: 3, baths: 1, desc: "Tres dormitorios y living generoso para familia numerosa.", rooms: "3 dormitorios · Living · Comedor · Cocina · Baño + toilette", img: "/assets/prefab/model-81.jpg", planImg: "/assets/prefab/plan-3.jpg", features: ["Suite opcional", "Placa cementicia exterior", "Preinstalación calefacción"], included: ["Mesada granito", "Gas matriculado ENARGAS", "Carpintería media-alta"] },
  { id: "familiar-90", line: "familiar", m2: 90, baseDays: 75, name: "Modelo Amplio 90", beds: 3, baths: 2, desc: "Dos baños completos, lavadero y circulación fluida.", rooms: "3 dormitorios · Living · Comedor · Cocina · 2 baños", img: "/assets/prefab/model-90.jpg", planImg: "/assets/prefab/plan-3.jpg", features: ["Doble baño", "Lavadero independiente", "Aislación térmica superior"], included: ["Coordinación municipal completa", "Seguro de obra", "Residente de obra en montaje"] },
  { id: "signature-95", line: "signature", m2: 95, baseDays: 85, name: "Modelo Moderna 95", beds: 3, baths: 2, desc: "Arquitectura contemporánea con cubierta plana y grandes vanos.", rooms: "3 dormitorios · Living integrado · Cocina island · 2 baños", img: "/assets/prefab/model-95.jpg", planImg: "/assets/prefab/plan-4.jpg", features: ["Revestimiento cementicio", "Carpintería premium", "Diseño minimalista"], included: ["Anteproyecto arquitectónico custom", "Render 3D", "Entrega llave en mano"] },
  { id: "signature-120", line: "signature", m2: 120, baseDays: 90, name: "Modelo Residencial 120", beds: 4, baths: 2, desc: "Residencia de alto confort con suite y cocina gourmet.", rooms: "Suite + 3 dorm. · Living · Comedor · Cocina gourmet · 2 baños", img: "/assets/prefab/model-120.jpg", planImg: "/assets/prefab/plan-4.jpg", badge: "Residencial", features: ["Suite con vestidor", "Cocina island", "Porcelanato 60×60"], included: ["Supervisión de ingeniero residente", "Certificaciones finales", "Garantía 5 años estructura"] },
]

export type PrefabModel = (typeof MODEL_DEFS)[number] & {
  sup: string
  time: string
  priceList: string
  anticipo: string
  cuotaDesde: string
  cuotas: string
}

export const PREFAB_MODELS: PrefabModel[] = MODEL_DEFS.map((def) => {
  const pricing = buildPrefabPrice(def.line, def.m2, "steel-frame")
  return {
    ...def,
    sup: `${def.m2} m²`,
    time: buildDeliveryTime(def.baseDays, "steel-frame"),
    ...pricing,
  }
})

export function enrichModelForSystem(model: PrefabModel, systemId: PrefabSystemId) {
  const pricing = buildPrefabPrice(model.line, model.m2, systemId)
  const system = PREFAB_SYSTEMS.find((s) => s.id === systemId)
  return {
    ...model,
    ...pricing,
    time: buildDeliveryTime(model.baseDays, systemId),
    systemId,
    systemName: system?.name,
  }
}

export const PREFAB_SYSTEMS_INTRO = {
  eyebrow: "Sistemas constructivos EMPRENOR",
  title: "Cuatro caminos hacia tu vivienda — un solo contrato de obra",
  subtitle: "No vendemos un producto único: somos constructora. El mismo diseño puede ejecutarse en seco, madera, hormigón o albañilería tradicional.",
  systems: PREFAB_SYSTEMS,
  compare: [
    { label: "Plazo más corto", systemId: "steel-frame" },
    { label: "Estética natural / campo", systemId: "wood-frame" },
    { label: "Máxima durabilidad", systemId: "hormigon" },
    { label: "Diseño 100% a medida", systemId: "tradicional" },
  ],
}

export const PREFAB_AUTHORITY = {
  eyebrow: "EMPRENOR en el NOA",
  title: "Constructora e instaladora — no solo vendedor de casas",
  subtitle: "Desde 2018, EMPRENOR C&S opera con equipos propios de obra civil, electricidad y montaje industrializado.",
  pillars: [
    { title: "Equipo técnico propio", desc: "Ingenieros civiles, arquitectos, capataces y electricistas matriculados en la misma organización." },
    { title: "Obra integrada — todos los sistemas", desc: "Steel Frame, madera, hormigón o tradicional bajo un contrato." },
    { title: "Cobertura territorial", desc: "Operación habitual en Salta, Jujuy, Tucumán y Formosa." },
    { title: "Respaldo corporativo", desc: "CUIT 20-40154622-8 · Sede fiscal Casiano Casas 3080, Salta." },
  ],
}

export const PREFAB_FINANCING = {
  eyebrow: "Financiación de obra",
  title: "Plan de pagos directo con la constructora",
  subtitle: "Anticipo + cuotas fijas en pesos para cualquier sistema constructivo.",
  highlights: [
    { title: "Anticipo desde 30%", desc: "Reserva de modelo, fecha en planta y precio acordado al firmar." },
    { title: "Hasta 72 cuotas", desc: "Cuotas mensuales fijas en pesos, alineadas al plan de obra." },
    { title: "Presupuesto cerrado", desc: "El contrato define alcance, plazos y extras opcionales." },
    { title: "Logística NOA", desc: "Transporte, montaje y coordinación de fundaciones en zona de influencia." },
  ],
  plans: [
    { name: "Plan Estándar", price: "30% anticipo", period: "+ 72 cuotas en pesos", color: "border-teal-200", features: ["Reserva de modelo", "Cuotas mensuales fijas", "Sin hipoteca bancaria", "Financiación directa EMPRENOR"] },
    { name: "Plan Prioridad", price: "50% anticipo", period: "Cuota mensual reducida", color: "border-green-400", badge: "Recomendado", features: ["Prioridad en fabricación", "Menor saldo financiado", "Cronograma preferente", "Arquitecto de seguimiento"] },
    { name: "Contado", price: "Consultar", period: "Mejor condición final", color: "border-slate-200", features: ["Bonificación por pago anticipado", "Inicio de obra acelerado", "Mejoras de terminación", "Opción en moneda extranjera"] },
  ],
}

export const PREFAB_PROCESS = {
  eyebrow: "Metodología de obra",
  title: "Del relevamiento del lote a la entrega llave en mano",
  steps: [
    { title: "Visita técnica al lote", desc: "Relevamos accesos, servicios, pendiente y restricciones municipales." },
    { title: "Anteproyecto y presupuesto", desc: "Definimos modelo, sistema constructivo, terminaciones y precio cerrado." },
    { title: "Contrato y anticipo", desc: "Firmás contrato de obra, abonás anticipo y bloqueamos cronograma." },
    { title: "Proyecto ejecutivo y municipal", desc: "Cálculo estructural, planos para habilitación y expediente municipal." },
    { title: "Producción / obra en sitio", desc: "Fabricación en planta o construcción in situ según sistema elegido." },
    { title: "Montaje, terminaciones y entrega", desc: "Instalaciones, terminaciones, acta de entrega y garantía." },
  ],
}

export const PREFAB_SPECS = {
  eyebrow: "Memoria técnica de referencia",
  title: "Especificaciones por sistema constructivo",
  systems: PREFAB_SYSTEMS.map((sys) => ({
    id: sys.id,
    name: sys.name,
    items: sys.pros.map((p, i) => ({
      category: ["Estructura", "Cerramientos", "Ejecución", "Ventajas"][i] ?? "Detalle",
      details: p,
    })),
  })),
  shared: [
    { category: "Instalaciones", details: "Electricidad BT AEA 90364 · Sanitaria completa · Gas ENARGAS · Preinstalación AC" },
    { category: "Terminaciones", details: "Pisos cerámicos/porcelanato · Pintura látex · Griferías monocomando" },
    { category: "Normativa", details: "Municipal local · AEA · ENARGAS · CIRSOC según sistema" },
  ],
}

export const PREFAB_FAQ = [
  { q: "¿Qué sistema constructivo me conviene?", a: "Steel Frame es el más rápido; madera ideal para campo; hormigón para máxima durabilidad; tradicional para diseño a medida. En la visita técnica te orientamos sin cargo." },
  { q: "¿EMPRENOR trabaja solo Steel Frame?", a: "No. Somos constructora integral: ejecutamos Steel Frame, Wood Frame, hormigón armado y obra tradicional con el mismo equipo." },
  { q: "¿Cuánto tarda la obra según el sistema?", a: "Steel Frame: 45–90 días. Madera: 50–95 días. Hormigón: 70–120 días. Tradicional: 4–8 meses." },
  { q: "¿Los mismos modelos sirven para todos los sistemas?", a: "Sí. Los siete diseños pueden ejecutarse en cualquiera de los cuatro sistemas. Cambian precio, plazo y detalles constructivos." },
  { q: "¿Quién gestiona los permisos municipales?", a: "EMPRENOR prepara planos, memoria y documentación para el expediente municipal." },
  { q: "¿Qué garantía ofrece la obra?", a: "5 años en estructura y 1 año en terminaciones e instalaciones, según contrato y acta de entrega." },
]
