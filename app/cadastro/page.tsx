import { AuthLayout } from "@/components/auth/auth-layout"
import { RegisterForm } from "@/components/auth/register-form"
import { LogoContainer } from "@/components/auth/logo-container"

export default function Cadastro() {
  return (
    <AuthLayout leftContainer={<LogoContainer />}>
      <RegisterForm />
    </AuthLayout>
  )
}
