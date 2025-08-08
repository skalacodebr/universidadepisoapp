"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, successMessage } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(email, password, rememberMe)

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.message)
      }
    } catch (error: any) {
      console.error("Erro ao fazer login:", error)
      setError("Ocorreu um erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg border-0 shadow-lg mx-4 sm:mx-0">
      <CardHeader className="space-y-3 pb-2 px-4 sm:px-6">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-center">Login</CardTitle>
        <CardDescription className="text-center text-sm sm:text-base px-2">
          Entre com seu email e senha para acessar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {successMessage && (
          <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>{successMessage}</AlertDescription>
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
            <Label htmlFor="email">E-mail</Label>
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:border-[#007EA3] focus:ring-[#007EA3]"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-gray-300 data-[state=checked]:bg-[#007EA3] data-[state=checked]:border-[#007EA3]"
                />
                <Label
                  htmlFor="remember-me"
                  className="text-xs sm:text-sm text-gray-500 font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Lembrar-me
                </Label>
              </div>
              <Link
                href="/recuperar-senha"
                className="text-xs sm:text-sm text-gray-500 hover:text-[#007EA3] hover:underline transition-colors whitespace-nowrap"
              >
                Esqueci minha senha
              </Link>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#202F51] hover:bg-[#2a3b68] text-white py-4 sm:py-6 text-base sm:text-lg"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center px-4 sm:px-6">
        <p className="text-sm sm:text-base text-center text-gray-500">
          Não tem uma conta?{" "}
          <Link href="/cadastro" className="text-[#007EA3] hover:underline font-medium">
            Cadastre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
