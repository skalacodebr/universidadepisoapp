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
    console.log("🔐 === INÍCIO DO PROCESSO DE LOGIN ===", {
      email,
      rememberMe,
      timestamp: new Date().toISOString(),
      supabaseUrl: supabase.supabaseUrl,
      supabaseKey: supabase.supabaseKey?.substring(0, 20) + "...",
    });
    
    try {
      // 1. Buscar usuário no banco
      console.log("📋 Buscando usuário no banco de dados...");
      const { data, error } = await supabase.from("usuarios").select("*").eq("email", email).single()
      
      console.log("📊 Resultado da busca no banco:", {
        found: !!data,
        error: error?.message || null,
        errorCode: error?.code || null,
        errorDetails: error?.details || null,
        userStatus: data?.status || null,
        userId: data?.id || null,
        userName: data?.nome || null
      });
      
      if (error || !data) { 
        console.log("❌ Usuário não encontrado ou erro na consulta");
        return { success: false, message: `Usuário não encontrado${error ? `: ${error.message}` : ""}` }
      }
      
      if (!data.status) { 
        console.log("⚠️ Usuário encontrado mas está inativo");
        return { success: false, message: "Usuário inativo." }
      }
      
      // 2. Validar senha
      console.log("🔑 Validando senha...");
      const hashedPassword = await hashSHA256(password)
      const senhaCorreta = hashedPassword === data.senha;
      
      console.log("🔍 Resultado da validação de senha:", {
        senhaCorreta,
        hashGerado: hashedPassword.substring(0, 10) + "...",
        hashArmazenado: data.senha?.substring(0, 10) + "..."
      });
      
      if (!senhaCorreta) { 
        console.log("❌ Senha incorreta");
        return { success: false, message: "Senha incorreta" }
      }

      // 3. Obter token customizado
      console.log("🎟️ Obtendo token customizado via Edge Function...");
      const { data: tokenData, error: tokenError } = await supabase.functions.invoke('get-custom-token', {
        body: { userId: data.id, email: data.email },
      })
      
      console.log("🔐 Resultado da obtenção do token:", {
        tokenObtido: !!tokenData?.token,
        tokenError: tokenError?.message || null,
        tokenLength: tokenData?.token?.length || 0,
        tokenStart: tokenData?.token?.substring(0, 20) + "..." || null
      });
      
      if (tokenError || !tokenData.token) {
        console.error("❌ Erro ao obter token customizado:", tokenError)
        return { success: false, message: `Não foi possível iniciar a sessão segura: ${tokenError?.message || 'Token não retornado'}` }
      }
      
      const { token: customToken } = tokenData
      
      // 4. Armazenar dados na sessão
      console.log("💾 Armazenando dados na sessão...");
      const storage = rememberMe ? localStorage : sessionStorage
      const storageType = rememberMe ? "localStorage" : "sessionStorage";
      
      try {
        storage.setItem("custom_token", customToken)
        const { senha, ...userData } = data
        storage.setItem("user", JSON.stringify(userData))
        
        console.log("✅ Dados armazenados com sucesso:", {
          storageType,
          userDataKeys: Object.keys(userData),
          tokenArmazenado: !!storage.getItem("custom_token"),
          userArmazenado: !!storage.getItem("user")
        });
      } catch (storageError) {
        console.error("❌ Erro ao armazenar dados:", storageError);
        return { success: false, message: "Erro ao salvar dados da sessão" }
      }

      // 5. Atualizar cliente Supabase e estado
      console.log("🔄 Atualizando cliente Supabase e estado da aplicação...");
      try {
        updateSupabaseClientToken(customToken);
        const { senha, ...userData } = data
        setUser(userData as CustomUser)
        setIsAuthenticated(true)
        
        console.log("✅ Estado atualizado com sucesso:", {
          userSet: true,
          authenticated: true,
          finalUserId: userData.id,
          finalUserName: userData.nome
        });
      } catch (stateError) {
        console.error("❌ Erro ao atualizar estado:", stateError);
        return { success: false, message: "Erro ao atualizar estado da aplicação" }
      }

      console.log("🎉 === LOGIN CONCLUÍDO COM SUCESSO ===");
      return { success: true, message: "Login realizado com sucesso" }
    } catch (error: any) {
      console.error("💥 === ERRO CRÍTICO NO LOGIN ===", {
        errorMessage: error.message,
        errorName: error.name,
        errorStack: error.stack,
        timestamp: new Date().toISOString()
      });
      return { success: false, message: `Erro crítico: ${error.message}` }
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
