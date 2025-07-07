"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

export interface Equipamento {
  id: number
  nome: string
  user_id?: string | null
}

export function useEquipamentos() {
  const { user, isAuthenticated } = useAuth()
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [loading, setLoading] = useState(false)

  const fetchEquipamentos = async () => {
    if (!isAuthenticated || !user) {
      console.log("Usuário não autenticado, pulando query de equipamentos")
      setLoading(false)
      return []
    }

    try {
      setLoading(true)
      console.log("Buscando equipamentos (padrão + do usuário)...")

      // Buscar equipamentos padrão (user_id = 0) e do usuário logado
      const { data: equipamentosData, error: equipamentosError } = await supabase
        .from("equipamentos")
        .select("id, nome, user_id")
        .or(`user_id.eq.0,user_id.eq.${user.id}`)
        .order("nome")

      if (equipamentosError) {
        console.error("Erro ao buscar equipamentos:", equipamentosError)
        return []
      }

      console.log("Equipamentos encontrados:", equipamentosData?.length)
      const equipamentosFormatados = equipamentosData || []
      setEquipamentos(equipamentosFormatados)
      return equipamentosFormatados
    } catch (error) {
      console.error("Erro geral ao buscar equipamentos:", error)
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEquipamentos()
  }, [isAuthenticated, user])

  return {
    equipamentos,
    loading,
    fetchEquipamentos,
  }
} 