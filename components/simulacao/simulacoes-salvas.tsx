"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Copy, Trash2, Search, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Dados de exemplo
const simulacoesMock = [
  {
    id: "1",
    nomeObra: "Edifício Residencial Aurora",
    data: "15/04/2023",
    status: "Finalizada",
    construtora: "Construtora Silva",
    precoVenda: 120000,
    areaTotal: 500,
  },
  {
    id: "2",
    nomeObra: "Condomínio Parque das Flores",
    data: "22/05/2023",
    status: "Pendente",
    construtora: "Construtora Oliveira",
    precoVenda: 350000,
    areaTotal: 1200,
  },
  {
    id: "3",
    nomeObra: "Galpão Industrial Norte",
    data: "10/06/2023",
    status: "Finalizada",
    construtora: "Construtora Industrial",
    precoVenda: 180000,
    areaTotal: 800,
  },
  {
    id: "4",
    nomeObra: "Reforma Comercial Centro",
    data: "05/07/2023",
    status: "Pendente",
    construtora: "Reformas Express",
    precoVenda: 75000,
    areaTotal: 300,
  },
  {
    id: "5",
    nomeObra: "Residencial Jardins",
    data: "18/07/2023",
    status: "Finalizada",
    construtora: "Construtora Silva",
    precoVenda: 420000,
    areaTotal: 1500,
  },
]

export function SimulacoesSalvas() {
  const [simulacoes, setSimulacoes] = useState(simulacoesMock)
  const [filtro, setFiltro] = useState({
    busca: "",
    status: "todos",
    periodo: "todos",
    obra: "todas",
  })

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltro((prev) => ({ ...prev, [campo]: valor }))
  }

  const simulacoesFiltradas = simulacoes.filter((sim) => {
    // Filtro de busca
    if (
      filtro.busca &&
      !sim.nomeObra.toLowerCase().includes(filtro.busca.toLowerCase()) &&
      !sim.construtora.toLowerCase().includes(filtro.busca.toLowerCase())
    ) {
      return false
    }

    // Filtro de status
    if (filtro.status !== "todos" && sim.status !== filtro.status) {
      return false
    }

    return true
  })

  const handleExcluir = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta simulação?")) {
      setSimulacoes((prev) => prev.filter((sim) => sim.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium">Filtros</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="busca">Busca</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="busca"
                placeholder="Buscar por nome ou construtora"
                className="pl-8"
                value={filtro.busca}
                onChange={(e) => handleFiltroChange("busca", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={filtro.status} onValueChange={(value) => handleFiltroChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="Finalizada">Finalizada</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="periodo">Período</Label>
            <Select value={filtro.periodo} onValueChange={(value) => handleFiltroChange("periodo", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os períodos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os períodos</SelectItem>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="obra">Obra</Label>
            <Select value={filtro.obra} onValueChange={(value) => handleFiltroChange("obra", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as obras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as obras</SelectItem>
                <SelectItem value="residencial">Residencial</SelectItem>
                <SelectItem value="comercial">Comercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Lista de Simulações</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome da Obra</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Construtora</TableHead>
              <TableHead>Preço/m²</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {simulacoesFiltradas.length > 0 ? (
              simulacoesFiltradas.map((simulacao) => (
                <TableRow key={simulacao.id}>
                  <TableCell className="font-medium">{simulacao.nomeObra}</TableCell>
                  <TableCell>{simulacao.data}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        simulacao.status === "Finalizada"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {simulacao.status}
                    </span>
                  </TableCell>
                  <TableCell>{simulacao.construtora}</TableCell>
                  <TableCell>R$ {(simulacao.precoVenda / simulacao.areaTotal).toLocaleString("pt-BR")}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {}}>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {}}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExcluir(simulacao.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                  Nenhuma simulação encontrada com os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
