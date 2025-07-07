"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface SimulacaoFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  periodoFilter: string
  setPeriodoFilter: (value: string) => void
}

export function SimulacaoFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  periodoFilter,
  setPeriodoFilter,
}: SimulacaoFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6 space-y-2">
            <label className="text-sm text-gray-500">Pesquisar</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nome da obra..."
                className="pl-8 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <label className="text-sm text-gray-500">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="fechada">Fechada</SelectItem>
                <SelectItem value="perdida">Perdida</SelectItem>
                <SelectItem value="indefinida">Indefinida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3 space-y-2">
            <label className="text-sm text-gray-500">Período</label>
            <Select value={periodoFilter} onValueChange={setPeriodoFilter}>
              <SelectTrigger className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os períodos</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
