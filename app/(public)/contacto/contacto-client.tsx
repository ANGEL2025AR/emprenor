"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { EMPRENOR_CONTACTOS, EMPRENOR_LEGAL, EMPRENOR_OFICINAS, EMPRENOR_PROVINCIAS } from "@/lib/company/constants"

export default function ContactoClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        })
      } else {
        setSubmitStatus("error")
        setErrorMessage(
          data.error ||
            "Hubo un problema al enviar su mensaje. Por favor, intente nuevamente o contáctenos por teléfono.",
        )
      }
    } catch {
      setSubmitStatus("error")
      setErrorMessage(
        "No se pudo conectar con el servidor. Por favor, verifique su conexión a internet e intente nuevamente.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="formulario" className="py-16 md:py-24 scroll-mt-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Solicitá una cotización</h2>
              <p className="text-muted-foreground leading-relaxed">
                Completá el formulario y nos comunicaremos con vos en menos de 24 horas.
              </p>
            </div>

            {submitStatus === "success" && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  ¡Mensaje enviado exitosamente! Nos comunicaremos con vos pronto.
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium mb-1">Error al enviar mensaje</p>
                  <p className="text-sm text-red-700">{errorMessage}</p>
                  <p className="text-xs text-red-600 mt-2">
                    Si el problema persiste, contactanos directamente por WhatsApp o teléfono.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Nombre Completo *
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Correo Electrónico *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="juan@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Teléfono *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+54 9 387 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="service" className="text-sm font-medium text-foreground">
                  Servicio de Interés *
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                >
                  <option value="">Seleccione un servicio</option>
                  <option value="construccion">Construcción General</option>
                  <option value="remodelacion">Remodelación y Refacciones</option>
                  <option value="albanileria">Albañilería</option>
                  <option value="pintura">Pintura y Revestimientos</option>
                  <option value="instalaciones-electricas">Instalaciones Eléctricas</option>
                  <option value="instalaciones-sanitarias">Instalaciones Sanitarias</option>
                  <option value="gas">Instalaciones de Gas</option>
                  <option value="obras-industriales">Obras Industriales</option>
                  <option value="agropecuario">Proyectos Agropecuarios</option>
                  <option value="climatizacion">Climatización</option>
                  <option value="mantenimiento">Mantenimiento Integral</option>
                  <option value="viviendas-prefabricadas">Viviendas Llave en Mano</option>
                  <option value="otro">Otro / Consulta general</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Mensaje *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Contanos sobre tu proyecto..."
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Información de Contacto</h2>
              <p className="text-muted-foreground leading-relaxed">
                Puede comunicarse con nosotros a través de cualquiera de los siguientes medios.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">Teléfonos</h3>
                      {EMPRENOR_CONTACTOS.map((contacto) => (
                        <p key={contacto.telHref} className="text-sm text-muted-foreground">
                          <a href={`tel:${contacto.telHref}`} className="hover:text-foreground transition-colors">
                            {contacto.telefono}
                          </a>
                          <span className="block text-xs">
                            {contacto.nombre} - {contacto.rol}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <Mail className="h-6 w-6 text-accent" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">Correo Electrónico</h3>
                      <p className="text-sm text-muted-foreground">
                        <a
                          href={`mailto:${EMPRENOR_LEGAL.emailGeneral}`}
                          className="hover:text-foreground transition-colors"
                        >
                          {EMPRENOR_LEGAL.emailGeneral}
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {EMPRENOR_OFICINAS.map((oficina) => (
                <Card key={oficina.nombre} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <MapPin className="h-6 w-6 text-accent" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">Oficina {oficina.nombre}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{oficina.direccion}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <Clock className="h-6 w-6 text-accent" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">Horario de Atención</h3>
                      <p className="text-sm text-muted-foreground">Lunes a viernes: 8:00 - 18:00</p>
                      <p className="text-sm text-muted-foreground">Sábados: 9:00 - 13:00</p>
                      <p className="text-sm text-muted-foreground">Domingos: Cerrado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border overflow-hidden">
              <div className="aspect-[16/10] bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-900 relative flex items-center justify-center">
                <div className="text-center space-y-2 px-6">
                  <MapPin className="h-12 w-12 text-emerald-400 mx-auto" />
                  <p className="text-sm font-medium text-white">Sede · Campamento Vespucio</p>
                  <p className="text-xs text-slate-300">{EMPRENOR_PROVINCIAS.join(" · ")}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
