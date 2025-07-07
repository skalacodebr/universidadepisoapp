"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RegisterForm() {
  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      setIsLoading(false)
      return
    }

    try {
      // Remove todos os caracteres não numéricos do CPF
      const cpfNumbers = cpf.replace(/\D/g, "")

      // Verifica se o CPF tem 11 dígitos
      if (cpfNumbers.length !== 11) {
        setError("CPF inválido. O CPF deve conter 11 dígitos.")
        setIsLoading(false)
        return
      }

      // Use our custom register function
      const result = await register(email, password, nome, cpf)

      if (result.success) {
        router.push("/login")
      } else {
        setError(result.message)
      }
    } catch (error: any) {
      console.error("Erro ao criar conta:", error)
      setError("Ocorreu um erro ao criar a conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Função para formatar o CPF (000.000.000-00)
  const formatCPF = (value: string) => {
    // Remove todos os caracteres não numéricos
    const cpfNumbers = value.replace(/\D/g, "")

    // Limita a 11 dígitos
    const cpfLimited = cpfNumbers.slice(0, 11)

    // Aplica a máscara
    if (cpfLimited.length <= 3) {
      return cpfLimited
    } else if (cpfLimited.length <= 6) {
      return `${cpfLimited.slice(0, 3)}.${cpfLimited.slice(3)}`
    } else if (cpfLimited.length <= 9) {
      return `${cpfLimited.slice(0, 3)}.${cpfLimited.slice(3, 6)}.${cpfLimited.slice(6)}`
    } else {
      return `${cpfLimited.slice(0, 3)}.${cpfLimited.slice(3, 6)}.${cpfLimited.slice(6, 9)}-${cpfLimited.slice(9)}`
    }
  }

  return (
    <Card className="w-full max-w-lg border-0 shadow-lg">
      <CardHeader className="space-y-2 pb-1">
        <CardTitle className="text-3xl font-bold text-center">Cadastre-se</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              type="text"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="focus:border-[#007EA3] focus:ring-[#007EA3]"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              required
              className="focus:border-[#007EA3] focus:ring-[#007EA3]"
              maxLength={14}
            />
          </div>
          <div className="space-y-1">
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
          <div className="space-y-1 relative">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus:border-[#007EA3] focus:ring-[#007EA3] pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="space-y-1 relative mb-4">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="focus:border-[#007EA3] focus:ring-[#007EA3] pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="mt-8">
            <Button
              type="submit"
              className="w-full bg-[#202F51] hover:bg-[#1a2642] text-white py-4 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Criando..." : "Criar conta"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-base text-center text-gray-500">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-[#007EA3] hover:underline font-medium">
            Entre
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
