"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthLayout } from "@/components/auth/auth-layout"
import { LogoContainer } from "@/components/auth/logo-container"

export default function RecuperarSenha() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess("Email de recuperação enviado. Verifique sua caixa de entrada.")
    } catch (error: any) {
      console.error("Erro ao enviar email de recuperação:", error)
      if (error.code === "auth/user-not-found") {
        setError("Não existe uma conta com este email.")
      } else {
        setError("Ocorreu um erro ao enviar o email de recuperação. Tente novamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout leftContainer={<LogoContainer />}>
      <Card className="w-full max-w-lg border-0 shadow-lg">
        <CardHeader className="space-y-3 pb-2">
          <CardTitle className="text-3xl font-bold text-center">Recuperar Senha</CardTitle>
          <CardDescription className="text-center text-base whitespace-nowrap">
            Digite seu email para receber instruções de recuperação
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus:border-[#007EA3] focus:ring-[#007EA3]"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#007EA3] hover:bg-[#006a8a] text-white py-6 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar instruções"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-base text-center text-gray-500">
            Lembrou sua senha?{" "}
            <Link href="/login" className="text-[#007EA3] hover:underline font-medium">
              Voltar para o login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
