import type { Metadata } from "next"
import { BrochureAdminClient } from "./brochure-admin-client"

export const metadata: Metadata = {
  title: "Brochure y Directorio",
}

export default function BrochureAdminPage() {
  return (
    <div className="container py-8">
      <BrochureAdminClient />
    </div>
  )
}
