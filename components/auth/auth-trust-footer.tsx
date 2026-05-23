import Link from "next/link"
import { EMPRENOR_BRAND } from "@/lib/company/constants"
import { Shield } from "lucide-react"

export function AuthTrustFooter() {
  return (
    <div className="mt-6 pt-4 border-t border-slate-200/80 space-y-2 text-center">
      <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500 flex-wrap">
        <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>
          Conexión segura · Datos protegidos según nuestra{" "}
          <Link href="/privacidad" className="text-emerald-600 hover:underline font-medium">
            política de privacidad
          </Link>
        </span>
      </p>
      <p className="text-xs text-slate-400">
        {EMPRENOR_BRAND.siglas} — empresa registrada · obra con trazabilidad y cumplimiento documentado
      </p>
    </div>
  )
}
