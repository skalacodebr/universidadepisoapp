"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient, updateSupabaseClientToken } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { hashSHA256 } from "@/lib/crypto"

// Manter a sua interface de usuário customizada
interface CustomUser {
  id: string // O ID do Supabase Auth é um UUID (string)
  nome: string
  email: string
  cpf: string
  cargos_id: number
  status: boolean
  salario: number
  beneficios: string
  encargos: string
}

interface AuthContextType {
  user: CustomUser | null
  loading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  register: (email: string, password: string, nome: string, cpf: string) => Promise<{ success: boolean; message: string }>
  isAuthenticated: boolean
  successMessage: string
  setSuccessMessage: (message: string) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false, message: "" }),
  logout: async () => {},
  register: async () => ({ success: false, message: "" }),
  isAuthenticated: false,
  successMessage: "",
  setSuccessMessage: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()
  
  // Usamos useMemo para garantir que a instância do cliente seja estável durante o render
  const supabase = useMemo(() => getSupabaseClient(), [user]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erro ao checar sessão:", error)
        await logout()
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [])

  const login = async (
    email: string,
    password: string,
    rememberMe = false,
  ): Promise<{ success: boolean; message: string }> => {
    const supabase = getSupabaseClient(); // Pega cliente sem token
    try {
      // 1. Sua lógica de login original
      const { data, error } = await supabase.from("usuarios").select("*").eq("email", email).single()
      if (error || !data) { return { success: false, message: "Usuário não encontrado" } }
      if (!data.status) { return { success: false, message: "Usuário inativo." } }
      const hashedPassword = await hashSHA256(password)
      if (hashedPassword !== data.senha) { return { success: false, message: "Senha incorreta" } }

      // 2. Chame a Edge Function
      const { data: tokenData, error: tokenError } = await supabase.functions.invoke('get-custom-token', {
        body: { userId: data.id, email: data.email },
      })
      if (tokenError || !tokenData.token) {
        console.error("Erro ao obter token customizado:", tokenError)
        return { success: false, message: "Não foi possível iniciar a sessão segura." }
      }
      const { token: customToken } = tokenData
      
      // 3. Armazene o usuário e o token
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem("custom_token", customToken)
      const { senha, ...userData } = data
      storage.setItem("user", JSON.stringify(userData))

      // 4. Força a recriação do cliente com o novo token
      updateSupabaseClientToken(customToken);
      setUser(userData as CustomUser)
      setIsAuthenticated(true)

      return { success: true, message: "Login realizado com sucesso" }
    } catch (error) {
      console.error("Erro no login:", error)
      return { success: false, message: "Erro ao fazer login. Tente novamente." }
    }
  }

  const register = async (
    email: string,
    password: string,
    nome: string,
    cpf: string,
  ): Promise<{ success: boolean; message: string }> => {
    const supabase = getSupabaseClient();
    try {
      setLoading(true)
      const { data: existingUser } = await supabase.from("usuarios").select("email").eq("email", email).maybeSingle()
      if (existingUser) { return { success: false, message: "Este email já está em uso." } }
      const hashedPassword = await hashSHA256(password)
      const { error: insertError } = await supabase.from("usuarios").insert([{ nome, cpf, email, senha: hashedPassword, cargos_id: 1, status: true, salario: 0, beneficios: "", encargos: "" }])
      if (insertError) { return { success: false, message: "Erro ao criar conta." } }
      return { success: true, message: "Conta criada com sucesso! Faça login para continuar." }
    } catch (error) {
      console.error("Erro no registro:", error)
      return { success: false, message: "Erro ao criar conta." }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    localStorage.removeItem("user")
    localStorage.removeItem("custom_token")
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("custom_token")
    
    // Força a recriação do cliente sem token
    updateSupabaseClientToken(null);
      setUser(null)
      setIsAuthenticated(false)
      router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated,
        successMessage,
        setSuccessMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
