"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, CheckCircle2, AlertCircle } from "lucide-react"

export default function ContactoPage() {
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
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <MessageSquare className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">Contáctenos</h1>
            <p className="text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Estamos aquí para ayudarle a hacer realidad su proyecto. Contáctenos hoy para una consulta gratuita.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">Solicite una Cotización</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Complete el formulario y nos pondremos en contacto con usted en menos de 24 horas.
                </p>
              </div>

              {submitStatus === "success" && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-800">
                    ¡Mensaje enviado exitosamente! Nos pondremos en contacto con usted pronto.
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
                      Si el problema persiste, contáctenos directamente por WhatsApp o teléfono.
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
                    onChange={handleChange as any}
                    required
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                  >
                    <option value="">Seleccione un servicio</option>
                    <option value="construccion">Construcción</option>
                    <option value="remodelacion">Remodelación</option>
                    <option value="albanileria">Albañilería</option>
                    <option value="electricidad">Electricidad</option>
                    <option value="plomeria">Plomería</option>
                    <option value="pintura">Pintura</option>
                    <option value="gas">Instalaciones de Gas</option>
                    <option value="prefabricadas">Viviendas Prefabricadas</option>
                    <option value="industriales">Obras Industriales</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Mensaje *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Cuéntenos sobre su proyecto..."
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

            {/* Contact Information */}
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
                        <p className="text-sm text-muted-foreground">
                          <a href="tel:+5491127586521" className="hover:text-foreground transition-colors">
                            +54 9 11 2758-6521
                          </a>
                          <span className="block text-xs">Sebastian Romero - Gerente General</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <a href="tel:+543873522920" className="hover:text-foreground transition-colors">
                            +54 9 387 352-2920
                          </a>
                          <span className="block text-xs">Carlos Guerrero - Coordinador</span>
                        </p>
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
                          <a href="mailto:info@emprenor.com.ar" className="hover:text-foreground transition-colors">
                            info@emprenor.com.ar
                          </a>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <a href="mailto:ventas@emprenor.com.ar" className="hover:text-foreground transition-colors">
                            ventas@emprenor.com.ar
                          </a>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <MapPin className="h-6 w-6 text-accent" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">Oficina Salta Capital</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Ituzaingó 920
                          <br />
                          Salta Capital, Salta
                          <br />
                          Argentina
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <MapPin className="h-6 w-6 text-accent" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">Oficina Tartagal</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Ituzaingó 1279
                          <br />
                          Tartagal, Salta
                          <br />
                          Argentina
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <MapPin className="h-6 w-6 text-accent" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">Oficina Campamento Vespucio</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Av. Casiano Casas S/N
                          <br />
                          Barrio Policial, Campamento Vespucio
                          <br />
                          Salta, Argentina
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                        <Clock className="h-6 w-6 text-accent" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">Horario de Atención</h3>
                        <p className="text-sm text-muted-foreground">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                        <p className="text-sm text-muted-foreground">Sábados: 9:00 AM - 2:00 PM</p>
                        <p className="text-sm text-muted-foreground">Domingos: Cerrado</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Map Placeholder */}
              <Card className="border-border overflow-hidden">
                <div className="aspect-[16/10] bg-muted relative">
                  <img src="/map-location-pin.png" alt="Ubicación en el mapa" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm">
                    <div className="text-center space-y-2">
                      <MapPin className="h-12 w-12 text-accent mx-auto" />
                      <p className="text-sm font-medium text-foreground">3 Oficinas en Salta</p>
                      <p className="text-xs text-muted-foreground">Capital, Tartagal y Campamento Vespucio</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
