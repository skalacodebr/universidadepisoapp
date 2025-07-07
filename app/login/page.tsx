"use client"
import { AuthLayout } from "@/components/auth/auth-layout"
import { LoginForm } from "@/components/auth/login-form"
import { LogoContainer } from "@/components/auth/logo-container"

export default function Login() {
  // We no longer need to use setSuccessMessage since we're handling messages differently now

  return (
    <AuthLayout leftContainer={<LogoContainer />}>
      <LoginForm />
    </AuthLayout>
  )
}
