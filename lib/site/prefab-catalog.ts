import { buildDeliveryTime, buildPrefabPrice, PREFAB_SYSTEMS, type PrefabSystemId } from "./prefab-pricing"

export const PREFAB_LINES = [
  { id: "esencial", name: "Línea Esencial", tagline: "Primera vivienda, campo y renta", color: "from-teal-500 to-teal-600", badge: "Entrada" },
  { id: "familiar", name: "Línea Familiar", tagline: "Vivienda permanente en el NOA", color: "from-green-500 to-green-600", badge: "Vivienda" },
  { id: "signature", name: "Línea Signature", tagline: "Arquitectura contemporánea", color: "from-slate-700 to-slate-900", badge: "Diseño" },
]

const MODEL_DEFS = [
  { id: "esencial-36", line: "esencial", m2: 36, baseDays: 45, name: "Modelo Campo 36", beds: 1, baths: 1, desc: "Unidad compacta para lote rural, guardia o primera vivienda.", rooms: "1 dormitorio · Living-cocina integrado · Baño completo", img: "/assets/prefab/model-36.jpg", planImg: "/assets/prefab/plan-1.jpg", features: ["Distribución optimizada", "Terminación funcional", "Aberturas aluminio"], included: ["Anteproyecto y gestión municipal", "Pisos cerámicos", "Sanitarios de primera línea"] },
  { id: "esencial-47", line: "esencial", m2: 47, baseDays: 50, name: "Modelo Salta 47", beds: 2, baths: 1, desc: "Dos dormitorios con circulación clara y sector día integrado.", rooms: "2 dormitorios · Living-comedor · Cocina · Baño", img: "/assets/prefab/model-47.jpg", planImg: "/assets/prefab/plan-2.jpg", features: ["Cocina con mueble bajo mesada", "Semicubierto opcional", "Preinstalación climatización"], included: ["Termotanque eléctrico", "Iluminación LED", "Conexión a servicios"] },
  { id: "familiar-60", line: "familiar", m2: 60, baseDays: 60, name: "Modelo NOA 60", beds: 2, baths: 1, desc: "Distribución familiar con sector día y noche separados.", rooms: "2 dormitorios · Living · Comedor · Cocina · Baño", img: "/assets/prefab/model-60.jpg", planImg: "/assets/prefab/plan-2.jpg", badge: "Referencia NOA", features: ["Sector día/noche separado", "Cielorraso terminado", "Aislación acústica"], included: ["Platea de hormigón", "Mosquiteros en aberturas", "Garantía de estructura según contrato"] },
  { id: "familiar-81", line: "familiar", m2: 81, baseDays: 70, name: "Modelo Familiar 81", beds: 3, baths: 1, desc: "Tres dormitorios y living generoso para familia numerosa.", rooms: "3 dormitorios · Living · Comedor · Cocina · Baño + toilette", img: "/assets/prefab/model-81.jpg", planImg: "/assets/prefab/plan-3.jpg", features: ["Suite opcional", "Placa cementicia exterior", "Preinstalación calefacción"], included: ["Mesada según presupuesto", "Instalación de gas si el proyecto la incluye", "Carpintería según propuesta"] },
  { id: "familiar-90", line: "familiar", m2: 90, baseDays: 75, name: "Modelo Amplio 90", beds: 3, baths: 2, desc: "Dos baños completos, lavadero y circulación fluida.", rooms: "3 dormitorios · Living · Comedor · Cocina · 2 baños", img: "/assets/prefab/model-90.jpg", planImg: "/assets/prefab/plan-3.jpg", features: ["Doble baño", "Lavadero independiente", "Aislación térmica superior"], included: ["Gestión municipal si el contrato la incluye", "Seguros según la propuesta", "Seguimiento de montaje"] },
  { id: "signature-95", line: "signature", m2: 95, baseDays: 85, name: "Modelo Moderna 95", beds: 3, baths: 2, desc: "Arquitectura contemporánea con cubierta plana y grandes vanos.", rooms: "3 dormitorios · Living integrado · Cocina island · 2 baños", img: "/assets/prefab/model-95.jpg", planImg: "/assets/prefab/plan-4.jpg", features: ["Revestimiento cementicio", "Carpintería premium", "Diseño minimalista"], included: ["Anteproyecto arquitectónico custom", "Render 3D", "Entrega llave en mano"] },
  { id: "signature-120", line: "signature", m2: 120, baseDays: 90, name: "Modelo Residencial 120", beds: 4, baths: 2, desc: "Residencia de alto confort con suite y cocina gourmet.", rooms: "Suite + 3 dorm. · Living · Comedor · Cocina gourmet · 2 baños", img: "/assets/prefab/model-120.jpg", planImg: "/assets/prefab/plan-4.jpg", badge: "Residencial", features: ["Suite con vestidor", "Cocina island", "Porcelanato 60×60"], included: ["Seguimiento de obra", "Documentación de cierre según contrato", "Garantía de estructura según contrato"] },
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
    { label: "En seco", systemId: "steel-frame" },
    { label: "Madera", systemId: "wood-frame" },
    { label: "Hormigón", systemId: "hormigon" },
    { label: "Obra en el lote", systemId: "tradicional" },
  ],
}

export const PREFAB_AUTHORITY = {
  eyebrow: "EMPRENOR en el NOA",
  title: "Constructora e instaladora — no solo vendedor de casas",
  subtitle: "Desde 2018, EMPRENOR C&S toma viviendas llave en mano en el NOA. El sistema constructivo y el precio se definen en la propuesta.",
  pillars: [
    { title: "Un contrato", desc: "El modelo, las terminaciones y el plazo se escriben antes de empezar." },
    { title: "Obra integrada — todos los sistemas", desc: "Steel Frame, madera, hormigón o tradicional bajo un contrato." },
    { title: "Cobertura territorial", desc: "Operación habitual en Salta, Jujuy, Tucumán y Formosa." },
    { title: "Respaldo corporativo", desc: "CUIT 20-40154622-8 · Sede fiscal Casiano Casas 3080, Salta." },
  ],
}

export const PREFAB_FINANCING = {
  eyebrow: "Financiación de obra",
  title: "El plan de pagos se arma en la propuesta",
  subtitle: "No hay un anticipo ni una cantidad de cuotas publicados. Se acuerdan con el alcance de la vivienda.",
  highlights: [
    { title: "Precio por escrito", desc: "El valor se cotiza después del relevamiento del lote y de las terminaciones." },
    { title: "Anticipo a pactar", desc: "El porcentaje y la forma de pago figuran en el contrato." },
    { title: "Alcance cerrado", desc: "El contrato define qué incluye la vivienda y qué queda como adicional." },
    { title: "Obra en el NOA", desc: "El traslado y el montaje se cotizan según la localidad." },
  ],
  plans: [
    { name: "Según contrato", price: "A cotizar", period: "Anticipo y cuotas en la propuesta", color: "border-teal-200", features: ["Relevamiento del lote", "Precio y plazo por escrito", "Terminaciones definidas", "Documentación acordada"] },
    { name: "Mayor anticipo", price: "A cotizar", period: "Si el proyecto lo permite", color: "border-green-400", features: ["Menor saldo durante la obra", "Cronograma en el contrato", "Mismo alcance escrito", "Sin un plan único publicado"] },
    { name: "Contado", price: "A cotizar", period: "Condición en la propuesta", color: "border-slate-200", features: ["Pago según contrato", "Inicio según cronograma", "Terminaciones del presupuesto", "Sin bonificación publicada"] },
  ],
}

export const PREFAB_PROCESS = {
  eyebrow: "Metodología de obra",
  title: "Del relevamiento del lote a la entrega llave en mano",
  steps: [
    { title: "Visita técnica al lote", desc: "Relevamos accesos, servicios, pendiente y restricciones municipales." },
    { title: "Anteproyecto y presupuesto", desc: "Se definen modelo, sistema, terminaciones y precio por escrito." },
    { title: "Contrato", desc: "El contrato fija el anticipo, el cronograma y el alcance." },
    { title: "Proyecto y trámites", desc: "Cálculo, planos y expediente municipal si el contrato los incluye." },
    { title: "Producción / obra en sitio", desc: "Fabricación en planta o construcción en el lote, según el sistema elegido." },
    { title: "Montaje, terminaciones y entrega", desc: "Instalaciones, terminaciones y acta según lo pactado." },
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
    { category: "Instalaciones", details: "Electricidad, sanitaria y gas si el presupuesto las incluye" },
    { category: "Terminaciones", details: "Pisos, pintura y grifería según la propuesta" },
    { category: "Normativa", details: "La norma aplicable se indica en el contrato, según el sistema" },
  ],
}

export const PREFAB_FAQ = [
  { q: "¿Qué sistema constructivo me conviene?", a: "Depende del lote, el clima y el plazo. En la visita se recomienda un sistema. No hay uno publicado como el más rápido." },
  { q: "¿EMPRENOR trabaja solo Steel Frame?", a: "No. La propuesta puede ser Steel Frame, madera, hormigón u obra tradicional." },
  { q: "¿Cuánto tarda la obra según el sistema?", a: "El plazo se escribe en el contrato, después del relevamiento. No publicamos una cantidad de días por sistema." },
  { q: "¿Los mismos modelos sirven para todos los sistemas?", a: "Sí. Los siete diseños pueden ejecutarse en cualquiera de los cuatro sistemas. Cambian precio, plazo y detalles constructivos." },
  { q: "¿Quién gestiona los permisos municipales?", a: "EMPRENOR prepara planos, memoria y documentación para el expediente municipal." },
  { q: "¿Qué garantía ofrece la obra?", a: "La garantía de estructura, terminaciones e instalaciones se define en el contrato y el acta de entrega." },
]
