"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Building2,
} from "lucide-react"

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
            "Hubo un problema al enviar su mensaje. Por favor, intente nuevamente o contactenos por telefono.",
        )
      }
    } catch {
      setSubmitStatus("error")
      setErrorMessage(
        "No se pudo conectar con el servidor. Por favor, verifique su conexion a internet e intente nuevamente.",
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

  const offices = [
    {
      name: "Salta Capital",
      address: "Ituzaingo 920",
      city: "Salta Capital, Salta",
    },
    {
      name: "Tartagal",
      address: "Ituzaingo 1279",
      city: "Tartagal, Salta",
    },
    {
      name: "Campamento Vespucio",
      address: "Av. Casiano Casas S/N",
      city: "Campamento Vespucio, Salta",
    },
  ]

  return (
    <main className="flex flex-col pt-20">
      {/* Hero Section */}
      <section className="relative bg-foreground py-24 md:py-32 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Respuesta en menos de 24 horas</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight text-balance">
              Hagamos realidad tu{" "}
              <span className="gradient-text">proyecto</span>
            </h1>
            <p className="text-lg md:text-xl text-background/70 leading-relaxed max-w-2xl mx-auto">
              Estamos listos para ayudarte. Completale el formulario o contactanos directamente.
              Cotizacion gratuita y sin compromiso.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Contact Form */}
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Solicita una Cotizacion</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Complete el formulario y nos pondremos en contacto con usted en menos de 24 horas.
                </p>
              </div>

              {submitStatus === "success" && (
                <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-sm text-foreground">
                    Mensaje enviado exitosamente! Nos pondremos en contacto con usted pronto.
                  </p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground font-medium mb-1">Error al enviar mensaje</p>
                    <p className="text-sm text-muted-foreground">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Nombre Completo *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Juan Perez"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Correo Electronico *
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
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Telefono *
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
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="service" className="text-sm font-medium text-foreground">
                    Servicio de Interes *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                  >
                    <option value="">Seleccione un servicio</option>
                    <option value="construccion">Construccion</option>
                    <option value="remodelacion">Remodelacion</option>
                    <option value="albanileria">Albanileria</option>
                    <option value="electricidad">Electricidad</option>
                    <option value="plomeria">Plomeria</option>
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
                    placeholder="Cuentenos sobre su proyecto..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="rounded-xl resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 rounded-xl text-lg hover-lift"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Contacto Directo</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Tambien puede comunicarse con nosotros directamente.
                </p>
              </div>

              <div className="space-y-4">
                {/* Phone Card */}
                <Card className="border-border hover:border-primary/30 transition-colors hover-lift">
                  <CardContent className="p-5">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-foreground">Telefonos</h3>
                        <div className="space-y-1">
                          <a
                            href="tel:+5491127586521"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                          >
                            +54 9 11 2758-6521
                            <span className="block text-xs">Sebastian Romero</span>
                          </a>
                          <a
                            href="tel:+543873522920"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                          >
                            +54 9 387 352-2920
                            <span className="block text-xs">Carlos Guerrero</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Email Card */}
                <Card className="border-border hover:border-primary/30 transition-colors hover-lift">
                  <CardContent className="p-5">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-foreground">Email</h3>
                        <a
                          href="mailto:info@emprenor.com.ar"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                        >
                          info@emprenor.com.ar
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Hours Card */}
                <Card className="border-border hover:border-primary/30 transition-colors hover-lift">
                  <CardContent className="p-5">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-foreground">Horario</h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Lun - Vie: 8:00 - 18:00</p>
                          <p>Sabados: 9:00 - 14:00</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Offices */}
              <div className="space-y-4 pt-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Nuestras Oficinas
                </h3>
                <div className="space-y-3">
                  {offices.map((office, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground text-sm">{office.name}</p>
                          <p className="text-sm text-muted-foreground">{office.address}</p>
                          <p className="text-sm text-muted-foreground">{office.city}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                Preferis hablar por WhatsApp?
              </h2>
              <p className="text-primary-foreground/80">
                Respondemos al instante. Hace click en el boton flotante.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 rounded-xl px-8 hover-lift"
              asChild
            >
              <a href="https://wa.me/5491127586521" target="_blank" rel="noopener noreferrer">
                Chatear por WhatsApp
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
