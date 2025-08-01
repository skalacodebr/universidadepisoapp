"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Search, PlusCircle, Eye, RefreshCw, DollarSign } from "lucide-react"
import type { SimulacaoItem } from "../hooks/useSimulacoes"

interface SimulacaoTableProps {
  simulacoes: SimulacaoItem[]
  loading: boolean
  onEdit: (id: number) => void
  onDuplicate: (id: number) => void
  onDelete: (simulacao: SimulacaoItem) => void
  onViewSimulation: (id: number) => void
  onRefazer: (id: number) => void
  onAjustarPreco: (id: number) => void
  onNovaSimulacao: () => void
  onClearFilters: () => void
  hasFilters: boolean
}

export function SimulacaoTable({
  simulacoes,
  loading,
  onEdit,
  onDuplicate,
  onDelete,
  onViewSimulation,
  onRefazer,
  onAjustarPreco,
  onNovaSimulacao,
  onClearFilters,
  hasFilters,
}: SimulacaoTableProps) {
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "fechada":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Fechada</Badge>
      case "perdida":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Perdida</Badge>
      case "indefinida":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Indefinida</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Simulações Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007EA3]"></div>
          <p className="mt-4 text-gray-500">Carregando simulações...</p>
        </CardContent>
      </Card>
    )
  }

  if (simulacoes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Simulações Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-8 flex flex-col items-center justify-center text-center">
          <div className="bg-gray-100 p-3 rounded-full mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhuma simulação encontrada</h3>
          <p className="text-gray-500 mb-4">
            {hasFilters
              ? "Não encontramos nenhuma simulação com os filtros selecionados."
              : "Você ainda não possui simulações. Crie uma nova simulação para começar."}
          </p>
          {hasFilters ? (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
            >
              Limpar filtros
            </Button>
          ) : (
            <Button
              className="bg-[#007EA3] hover:bg-[#006a8a] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              onClick={onNovaSimulacao}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Simulação
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulações Recentes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obra</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço/m²
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lucro
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {simulacoes.map((simulacao) => (
                <tr key={simulacao.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{simulacao.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{simulacao.area}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{simulacao.data}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderStatusBadge(simulacao.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{simulacao.precoM2}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{simulacao.lucro}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 rounded-full focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none hover:bg-blue-50"
                        onClick={() => onViewSimulation(simulacao.id)}
                        title="Ver Simulação"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 rounded-full focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none hover:bg-green-50"
                        onClick={() => onRefazer(simulacao.id)}
                        title="Refazer Simulação"
                      >
                        <RefreshCw className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 rounded-full focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none hover:bg-yellow-50"
                        onClick={() => onAjustarPreco(simulacao.id)}
                        title="Ajustar Preço"
                      >
                        <DollarSign className="h-4 w-4 text-yellow-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 rounded-full focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none hover:bg-red-50"
                        onClick={() => onDelete(simulacao)}
                        title="Excluir Simulação"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
