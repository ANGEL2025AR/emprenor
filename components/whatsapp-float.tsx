"use client"

import { MessageCircle, X, Phone } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false)

  const contacts = [
    {
      name: "Sebastian Romero",
      role: "Gerente General",
      number: "5491127586521",
      message: "Hola Sebastian! Me gustaría obtener más información sobre sus servicios de construcción.",
    },
    {
      name: "Carlos Guerrero",
      role: "Coordinador de Proyectos",
      number: "543873522920",
      message: "Hola Carlos! Necesito información sobre servicios de construcción.",
    },
  ]

  return (
    <>
      {/* Botón flotante principal */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Mensaje de bienvenida con ambos contactos */}
        {isOpen && (
          <Card className="bg-background border border-border rounded-lg shadow-2xl max-w-xs animate-in slide-in-from-bottom-2">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">EMPRENOR</h3>
                    <p className="text-xs text-muted-foreground">En línea</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-foreground mb-4">
                ¿Necesitas ayuda con tu proyecto de construcción? Contáctanos por WhatsApp!
              </p>

              <div className="space-y-2">
                {contacts.map((contact) => (
                  <a
                    key={contact.number}
                    href={`https://wa.me/${contact.number}?text=${encodeURIComponent(contact.message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 hover:bg-[#25D366]/10 hover:border-[#25D366] bg-transparent"
                    >
                      <Phone className="w-4 h-4 text-[#25D366]" />
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.role}</div>
                      </div>
                    </Button>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botón principal */}
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-2xl transition-transform hover:scale-110"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Indicador de pulsación */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="h-14 w-14 rounded-full bg-[#25D366] animate-ping opacity-75"></div>
        </div>
      )}
    </>
  )
}
