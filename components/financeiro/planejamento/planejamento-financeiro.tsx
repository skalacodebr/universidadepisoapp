"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, FileText } from "lucide-react"
import VisaoGeralPlanejamento from "./visao-geral-planejamento"
import PlanejamentoModal from "./planejamento-modal"
import ListaPlanejamentos from "./lista-planejamentos"
import DetalhesPlanejamento from "./detalhes-planejamento"

export default function PlanejamentoFinanceiro() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showPlanejamentos, setShowPlanejamentos] = useState(false)
  const [planejamentoSelecionado, setPlanejamentoSelecionado] = useState<number | null>(null)

  // Dados de exemplo
  const dadosPlanejamento = {
    receitaPlanejada: 150000,
    despesaPlanejada: 120000,
    margemLucro: 20,
    planejamentos: [
      {
        id: 1,
        nome: "Planejamento Q2 2023",
        periodo: "2º Trimestre 2023",
        receitaPlanejada: 150000,
        despesaPlanejada: 120000,
        margemLucro: 20,
        categorias: [
          { nome: "Mão de obra", valorPlanejado: 50000, valorRealizado: 48000 },
          { nome: "Materiais", valorPlanejado: 40000, valorRealizado: 42000 },
          { nome: "Equipamentos", valorPlanejado: 20000, valorRealizado: 19000 },
          { nome: "Administrativo", valorPlanejado: 10000, valorRealizado: 9500 },
        ],
      },
      {
        id: 2,
        nome: "Planejamento Q3 2023",
        periodo: "3º Trimestre 2023",
        receitaPlanejada: 180000,
        despesaPlanejada: 140000,
        margemLucro: 22.2,
        categorias: [
          { nome: "Mão de obra", valorPlanejado: 60000, valorRealizado: 58000 },
          { nome: "Materiais", valorPlanejado: 45000, valorRealizado: 47000 },
          { nome: "Equipamentos", valorPlanejado: 25000, valorRealizado: 24000 },
          { nome: "Administrativo", valorPlanejado: 10000, valorRealizado: 11000 },
        ],
      },
    ],
  }

  const handleVerDetalhes = (id: number) => {
    setPlanejamentoSelecionado(id)
    setShowPlanejamentos(false)
  }

  const handleVoltarLista = () => {
    setPlanejamentoSelecionado(null)
  }

  return (
    <div className="p-6">
      {planejamentoSelecionado ? (
        <DetalhesPlanejamento
          planejamento={dadosPlanejamento.planejamentos.find((p) => p.id === planejamentoSelecionado)!}
          onVoltar={handleVoltarLista}
        />
      ) : (
        <>
          <div className="mb-6">
            <VisaoGeralPlanejamento
              receitaPlanejada={dadosPlanejamento.receitaPlanejada}
              despesaPlanejada={dadosPlanejamento.despesaPlanejada}
              margemLucro={dadosPlanejamento.margemLucro}
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Gerenciamento de Planejamentos</h2>
            <div className="flex gap-3">
              <Button onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="mr-2 h-4 w-4" /> Criar Planejamento
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPlanejamentos(!showPlanejamentos)}
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                <FileText className="mr-2 h-4 w-4" />
                {showPlanejamentos ? "Ocultar Planejamentos" : "Visualizar Planejamentos"}
              </Button>
            </div>
          </div>

          {showPlanejamentos && (
            <ListaPlanejamentos planejamentos={dadosPlanejamento.planejamentos} onVerDetalhes={handleVerDetalhes} />
          )}

          <PlanejamentoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
      )}
    </div>
  )
}
