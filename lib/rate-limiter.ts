import { NextRequest } from 'next/server'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

export function rateLimit(config: RateLimitConfig = { windowMs: 60000, maxRequests: 10 }) {
  return async function checkRateLimit(request: NextRequest): Promise<{
    success: boolean
    remaining: number
    resetTime: number
  }> {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const now = Date.now()
    
    const userLimit = rateLimitMap.get(ip)
    
    if (!userLimit || now > userLimit.resetTime) {
      // Nueva ventana de tiempo
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + config.windowMs
      })
      
      return {
        success: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs
      }
    }
    
    if (userLimit.count >= config.maxRequests) {
      // Límite excedido
      return {
        success: false,
        remaining: 0,
        resetTime: userLimit.resetTime
      }
    }
    
    // Incrementar contador
    userLimit.count++
    rateLimitMap.set(ip, userLimit)
    
    return {
      success: true,
      remaining: config.maxRequests - userLimit.count,
      resetTime: userLimit.resetTime
    }
  }
}

// Limpiar entradas viejas cada 5 minutos
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000)
