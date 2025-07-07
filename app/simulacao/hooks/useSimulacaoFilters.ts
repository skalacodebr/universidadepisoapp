"use client"

import { useState, useMemo } from "react"
import type { SimulacaoItem } from "./useSimulacoes"

export function useSimulacaoFilters(simulacoes: SimulacaoItem[]) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [periodoFilter, setPeriodoFilter] = useState("todos")

  const simulacoesFiltradas = useMemo(() => {
    return simulacoes.filter((simulacao) => {
      const matchesSearch = simulacao.nome.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "todos" || simulacao.status.toLowerCase() === statusFilter
      const matchesPeriodo =
        periodoFilter === "todos" || (periodoFilter === "30dias" && true) || (periodoFilter === "90dias" && true)

      return matchesSearch && matchesStatus && matchesPeriodo
    })
  }, [simulacoes, searchTerm, statusFilter, periodoFilter])

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("todos")
    setPeriodoFilter("todos")
  }

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    periodoFilter,
    setPeriodoFilter,
    simulacoesFiltradas,
    clearFilters,
  }
}
