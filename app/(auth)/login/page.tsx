import { redirect } from "next/navigation"
import { GESTION_EMPRENOR } from "@/lib/site/gestion-emprenor-portal"

/** /login público → portal SaaS Gestión Emprenor (myemprenor.online). */
export default function LoginRedirectPage() {
  redirect(GESTION_EMPRENOR.loginUrl)
}
