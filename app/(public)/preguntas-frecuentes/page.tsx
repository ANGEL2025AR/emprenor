import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, HelpCircle } from "lucide-react"

export const metadata = {
  title: "Preguntas Frecuentes",
  description:
    "Respuestas a las preguntas más comunes sobre nuestros servicios de construcción, remodelación y renovación en Salta, Jujuy, Tucumán y Formosa.",
}

export default function PreguntasFrecuentesPage() {
  const faqs = [
    {
      categoria: "Servicios y Cobertura",
      preguntas: [
        {
          pregunta: "¿En qué zonas ofrecen sus servicios?",
          respuesta:
            "Ofrecemos servicios en toda la provincia de Salta (incluyendo Salta Capital y Tartagal), Jujuy, Tucumán y Formosa. Contamos con oficinas en Ituzaingó 920, Salta Capital e Ituzaingó 1279, Tartagal.",
        },
        {
          pregunta: "¿Qué tipos de proyectos realizan?",
          respuesta:
            "Realizamos proyectos residenciales, comerciales e industriales. Desde construcción de viviendas nuevas hasta remodelaciones completas, ampliaciones, trabajos de albañilería, instalaciones eléctricas, plomería y pintura.",
        },
        {
          pregunta: "¿Trabajan con proyectos pequeños o solo grandes obras?",
          respuesta:
            "Trabajamos con proyectos de todos los tamaños. Desde pequeñas reparaciones y remodelaciones hasta grandes construcciones. Cada proyecto es importante para nosotros.",
        },
      ],
    },
    {
      categoria: "Cotización y Presupuesto",
      preguntas: [
        {
          pregunta: "¿Cuánto cuesta una cotización?",
          respuesta:
            "Todas nuestras cotizaciones son completamente gratuitas y sin compromiso. Visitamos el lugar, evaluamos las necesidades y entregamos un presupuesto detallado.",
        },
        {
          pregunta: "¿Cuánto tiempo toma recibir una cotización?",
          respuesta:
            "Generalmente entregamos cotizaciones en menos de 24-48 horas después de la visita al sitio. Para proyectos más complejos, puede tomar entre 3-5 días hábiles.",
        },
        {
          pregunta: "¿Los precios incluyen materiales?",
          respuesta:
            "Sí, nuestros presupuestos incluyen tanto la mano de obra como los materiales necesarios. Detallamos cada componente para total transparencia.",
        },
      ],
    },
    {
      categoria: "Plazos y Ejecución",
      preguntas: [
        {
          pregunta: "¿Cuánto tiempo tarda un proyecto típico?",
          respuesta:
            "Los plazos varían según la complejidad: una remodelación de baño puede tomar 2-3 semanas, mientras que una construcción nueva puede tardar 6-12 meses. Le proporcionamos un cronograma detallado al inicio.",
        },
        {
          pregunta: "¿Qué pasa si hay retrasos?",
          respuesta:
            "Nos esforzamos por cumplir todos los plazos. Si hay demoras inevitables (clima, permisos, etc.), le comunicamos inmediatamente y ajustamos el cronograma de forma transparente.",
        },
        {
          pregunta: "¿Puedo hacer cambios durante la obra?",
          respuesta:
            "Sí, los cambios son posibles. Sin embargo, pueden afectar el presupuesto y los plazos. Evaluamos cada solicitud y le informamos el impacto antes de proceder.",
        },
      ],
    },
    {
      categoria: "Garantías y Permisos",
      preguntas: [
        {
          pregunta: "¿Ofrecen garantía en sus trabajos?",
          respuesta:
            "Sí, todos nuestros trabajos cuentan con garantía. La duración varía según el tipo de trabajo: desde 6 meses para pintura hasta 5 años para estructuras.",
        },
        {
          pregunta: "¿Se encargan de los permisos y trámites?",
          respuesta:
            "Sí, gestionamos todos los permisos municipales y documentación necesaria. Incluimos esto en nuestro servicio integral para su comodidad.",
        },
        {
          pregunta: "¿Tienen seguro de responsabilidad civil?",
          respuesta:
            "Sí, contamos con seguro de responsabilidad civil y todos nuestros trabajadores están asegurados. Su propiedad y nuestro equipo están protegidos.",
        },
      ],
    },
    {
      categoria: "Pagos y Financiación",
      preguntas: [
        {
          pregunta: "¿Qué formas de pago aceptan?",
          respuesta:
            "Aceptamos efectivo, transferencias bancarias, cheques y tarjetas de crédito/débito. Ofrecemos planes de pago flexibles según el proyecto.",
        },
        {
          pregunta: "¿Debo pagar todo por adelantado?",
          respuesta:
            "No. Generalmente trabajamos con un esquema: 30% anticipo, 40% a mitad de obra y 30% al finalizar. El plan de pagos se ajusta a cada proyecto.",
        },
        {
          pregunta: "¿Ofrecen financiación?",
          respuesta:
            "Para proyectos grandes, podemos ofrecer planes de pago en cuotas. Consultenos sobre las opciones disponibles según su proyecto.",
        },
      ],
    },
  ]

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                <HelpCircle className="h-8 w-8 text-accent-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Preguntas Frecuentes</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Encuentre respuestas a las preguntas más comunes sobre nuestros servicios y procesos
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl space-y-12">
            {faqs.map((categoria, idx) => (
              <div key={idx} className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3">
                  {categoria.categoria}
                </h2>
                <div className="space-y-4">
                  {categoria.preguntas.map((item, qIdx) => (
                    <Card key={qIdx} className="border-border hover:border-accent transition-colors">
                      <CardContent className="p-6 space-y-3">
                        <h3 className="text-lg font-semibold text-foreground flex items-start gap-2">
                          <span className="text-accent">Q:</span>
                          {item.pregunta}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed pl-6">
                          <span className="font-semibold text-accent">R:</span> {item.respuesta}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Card className="mt-16 border-accent bg-accent/5">
            <CardContent className="p-8 md:p-12">
              <div className="mx-auto max-w-2xl text-center space-y-6">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-balance">
                  ¿No encontró la respuesta que buscaba?
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Contáctenos directamente y con gusto responderemos todas sus consultas
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/contacto">
                      Contactar Ahora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a
                      href="https://wa.me/5491127586521?text=Hola%2C%20tengo%20una%20consulta"
                      target="_blank"
                      rel="noreferrer"
                    >
                      WhatsApp Directo
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
