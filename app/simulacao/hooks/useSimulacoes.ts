"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase"
import { processarSimulacao, type SimulacaoFormData, type SimulacaoResult } from "@/lib/simulacao-calculator"

export interface SimulacaoItem {
  id: number
  nome: string
  area: string
  data: string
  status: string
  valor: string
  precoM2: string
  lucro: string
}

export function useSimulacoes() {
  const { user } = useAuth()
  const supabase = useMemo(() => getSupabaseClient(), [user]);
  const [simulacoes, setSimulacoes] = useState<SimulacaoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)

  const formatarData = (dataString: string | null): string => {
    if (!dataString) return "Data não definida"
    try {
      const data = new Date(dataString)
      return data.toLocaleDateString("pt-BR")
    } catch (error) {
      return "Data inválida"
    }
  }

  const formatarMoeda = (valor: number): string => {
    return `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const fetchSimulacoes = async () => {
    if (!user) return

    try {
      setLoading(true)

      const { data, error, count } = await supabase
        .from("obras")
        .select("*", { count: "exact" })
        .eq("simulacao", true)
        .eq("usuarios_id", user.id)
        .order("id", { ascending: false })

      if (error) {
        console.error("Erro ao buscar simulações:", error)
        return
      }

      const simulacoesFormatadas: SimulacaoItem[] = data.map((obra) => ({
        id: obra.id,
        nome: obra.nome || "Sem nome",
        area: `${obra.area_total_metros_quadrados || 0} m²`,
        data: formatarData(obra.data_inicio),
        status: obra.status || "indefinida",
        valor: formatarMoeda(obra.valor_total || 0),
        precoM2: formatarMoeda(obra.preco_venda_metro_quadrado || 0),
        lucro: `${obra.percentual_lucro_desejado || 0}%`,
      }))

      setSimulacoes(simulacoesFormatadas)
      setTotalItems(count || 0)
    } catch (error) {
      console.error("Erro ao buscar simulações:", error)
    } finally {
      setLoading(false)
    }
  }

  const criarSimulacao = async (data: SimulacaoFormData): Promise<SimulacaoResult | null> => {
    if (!user) return null

    try {
      console.log("Processando simulação com dados:", data)

      // Processar simulação com cálculos completos
      const resultado = await processarSimulacao(data, user.id.toString())

      console.log("Resultado da simulação:", resultado)

      // Atualizar lista de simulações
      await fetchSimulacoes()

      return resultado
    } catch (error) {
      console.error("Erro ao criar simulação:", error)
      throw error
    }
  }

  const duplicarSimulacao = async (id: number) => {
    if (!user) return false

    try {
      const { data: obraData, error } = await supabase.from("obras").select("*").eq("id", id).single()

      if (error || !obraData) {
        console.error("Erro ao buscar dados da obra:", error)
        return false
      }

      const { error: insertError } = await supabase.from("obras").insert([
        {
          ...obraData,
          id: undefined,
          nome: `Cópia de ${obraData.nome}`,
          usuarios_id: user.id,
          simulacao: true,
          data_inicio: new Date().toISOString().split("T")[0],
        },
      ])

      if (insertError) {
        console.error("Erro ao duplicar simulação:", insertError)
        return false
      }

      await fetchSimulacoes()
      return true
    } catch (error) {
      console.error("Erro ao duplicar simulação:", error)
      return false
    }
  }

  const excluirSimulacao = async (id: number) => {
    if (!user) return false

    try {
      const { error } = await supabase.from("obras").delete().eq("id", id).eq("usuarios_id", user.id)

      if (error) {
        console.error("Erro ao excluir simulação:", error)
        return false
      }

      setSimulacoes(simulacoes.filter((s) => s.id !== id))
      setTotalItems((prev) => prev - 1)
      return true
    } catch (error) {
      console.error("Erro ao excluir simulação:", error)
      return false
    }
  }

  useEffect(() => {
    fetchSimulacoes()
  }, [user, supabase])

  return {
    simulacoes,
    loading,
    totalItems,
    fetchSimulacoes,
    criarSimulacao,
    duplicarSimulacao,
    excluirSimulacao,
  }
}
