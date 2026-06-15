import { redirect } from "next/navigation"
import { GESTION_EMPRENOR } from "@/lib/site/gestion-emprenor-portal"

/** /registro público → portal SaaS Gestión Emprenor (myemprenor.online). */
export default function RegistroRedirectPage() {
  redirect(GESTION_EMPRENOR.registerUrl)
}
