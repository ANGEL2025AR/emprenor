import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras'),
  
  email: z.string()
    .email('Email inválido')
    .max(255, 'El email es demasiado largo')
    .toLowerCase()
    .trim(),
  
  phone: z.string()
    .regex(/^\+?[0-9\s\-()]{8,20}$/, 'Teléfono inválido'),
  
  service: z.enum([
    'construccion',
    'remodelacion',
    'albanileria',
    'electricidad',
    'plomeria',
    'pintura',
    'gas',
    'prefabricadas',
    'industriales',
    'otro'
  ], { errorMap: () => ({ message: 'Servicio inválido' }) }),
  
  message: z.string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(2000, 'El mensaje no puede exceder 2000 caracteres')
    .trim(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export function sanitizeHtml(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}
