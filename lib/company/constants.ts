/** Datos corporativos EMPRENOR — fuente única para páginas públicas y legales. */
export const EMPRENOR_LEGAL = {
  razonSocial: "EMPRENOR CONSTRUCCIONES",
  cuit: "30-XXXXXXXX-X", // Completar CUIT real en configuración
  domicilioLegal: "Ituzaingó 920, Salta Capital, Provincia de Salta, Argentina",
  emailGeneral: "info@emprenor.com.ar",
  emailEtica: "etica@emprenor.com.ar",
  emailLicitaciones: "licitaciones@emprenor.com.ar",
  emailRrhh: "rrhh@emprenor.com.ar",
  telefonoPrincipal: "+54 9 11 2758-6521",
  telefonoSecundario: "+54 9 387 352-2920",
  provincias: ["Salta", "Jujuy", "Tucumán", "Formosa"],
  fundacion: 2009,
} as const

export const FOOTER_LEGAL_LINKS = [
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/cookies", label: "Política de cookies" },
  { href: "/codigo-etica", label: "Código de ética" },
  { href: "/seguridad-y-salud", label: "Seguridad y salud" },
  { href: "/sostenibilidad", label: "Sostenibilidad" },
  { href: "/linea-etica", label: "Línea de ética" },
  { href: "/licitaciones", label: "Licitaciones" },
  { href: "/trabaja-con-nosotros", label: "Trabajá con nosotros" },
] as const
