"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, FileText } from "lucide-react"
import IndicadoresFluxoCaixa from "./indicadores-fluxo-caixa"
import GraficoFluxoCaixa from "./grafico-fluxo-caixa"
import MovimentacaoModal from "./movimentacao-modal"
import ListaMovimentacoes from "./lista-movimentacoes"

export default function FluxoCaixa() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showMovimentacoes, setShowMovimentacoes] = useState(false)
  const [movimentacoes, setMovimentacoes] = useState([
    { id: 1, data: "2023-04-01", tipo: "entrada", valor: 15000, descricao: "Pagamento Obra A" },
    { id: 2, data: "2023-04-05", tipo: "saida", valor: 5000, descricao: "Compra de materiais" },
    { id: 3, data: "2023-04-10", tipo: "entrada", valor: 20000, descricao: "Pagamento Obra B" },
    { id: 4, data: "2023-04-15", tipo: "saida", valor: 8000, descricao: "Pagamento funcionários" },
    { id: 5, data: "2023-04-20", tipo: "entrada", valor: 10000, descricao: "Pagamento Obra C" },
    { id: 6, data: "2023-04-25", tipo: "saida", valor: 7000, descricao: "Aluguel de equipamentos" },
  ])

  // Função para excluir uma movimentação
  const handleExcluirMovimentacao = (id: number) => {
    setMovimentacoes(movimentacoes.filter((mov) => mov.id !== id))
  }

  // Dados de exemplo atualizados para usar o estado
  const dadosFluxo = {
    saldoAtual: calcularSaldoAtual(movimentacoes),
    totalEntradas: calcularTotalEntradas(movimentacoes),
    totalSaidas: calcularTotalSaidas(movimentacoes),
    movimentacoes: movimentacoes,
    dadosGrafico: {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      entradas: [30000, 35000, 40000, 45000, 42000, 50000],
      saidas: [20000, 22000, 18000, 20000, 25000, 23000],
    },
  }

  // Funções auxiliares para calcular os totais
  function calcularSaldoAtual(movs) {
    return movs.reduce((total, mov) => {
      if (mov.tipo === "entrada") {
        return total + mov.valor
      } else {
        return total - mov.valor
      }
    }, 0)
  }

  function calcularTotalEntradas(movs) {
    return movs.filter((mov) => mov.tipo === "entrada").reduce((total, mov) => total + mov.valor, 0)
  }

  function calcularTotalSaidas(movs) {
    return movs.filter((mov) => mov.tipo === "saida").reduce((total, mov) => total + mov.valor, 0)
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <IndicadoresFluxoCaixa
          saldoAtual={dadosFluxo.saldoAtual}
          totalEntradas={dadosFluxo.totalEntradas}
          totalSaidas={dadosFluxo.totalSaidas}
        />

        <Card className="col-span-1 lg:col-span-2 shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Gráfico Comparativo</h3>
            </div>
            <GraficoFluxoCaixa dados={dadosFluxo.dadosGrafico} />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gerenciamento de Fluxo</h2>
        <div className="flex gap-3">
          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Movimentação
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowMovimentacoes(!showMovimentacoes)}
            className="border-blue-500 text-blue-500 hover:bg-blue-50"
          >
            <FileText className="mr-2 h-4 w-4" />
            {showMovimentacoes ? "Ocultar Movimentações" : "Ver Movimentações"}
          </Button>
        </div>
      </div>

      {showMovimentacoes && (
        <ListaMovimentacoes
          movimentacoes={dadosFluxo.movimentacoes}
          onExcluirMovimentacao={handleExcluirMovimentacao}
        />
      )}

      <MovimentacaoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
