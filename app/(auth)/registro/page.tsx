import { PublicRegistrationForm } from "@/components/auth/public-registration-form"
import { RegistrationDisabledMessage } from "@/components/auth/registration-disabled-message"
import { isPublicRegistrationAllowed } from "@/lib/env"

export default function RegisterPage() {
  if (!isPublicRegistrationAllowed()) {
    return <RegistrationDisabledMessage />
  }

  return <PublicRegistrationForm />
}
