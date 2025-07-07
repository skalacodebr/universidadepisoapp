"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LucroPorObra from "./lucro-por-obra"
import OrcadoVsRealizado from "./orcado-vs-realizado"

export default function RelatoriosFinanceiros() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("2023")
  const [obraSelecionada, setObraSelecionada] = useState("todas")

  // Dados de exemplo
  const dadosLucroPorObra = {
    lucroTotal: 30000,
    obrasComPrejuizo: 1,
    obras: [
      { nome: "Obra A", receitaTotal: 120000, despesaTotal: 100000, lucro: 20000, percentual: 16.67 },
      { nome: "Obra B", receitaTotal: 80000, despesaTotal: 75000, lucro: 5000, percentual: 6.25 },
      { nome: "Obra C", receitaTotal: 50000, despesaTotal: 45000, lucro: 5000, percentual: 10 },
      { nome: "Obra D", receitaTotal: 30000, despesaTotal: 35000, lucro: -5000, percentual: -16.67 },
      { nome: "Obra E", receitaTotal: 70000, despesaTotal: 65000, lucro: 5000, percentual: 7.14 },
    ],
  }

  const dadosOrcadoVsRealizado = {
    totalPlanejado: 350000,
    totalRealizado: 320000,
    diferencaPercentual: -8.57,
    categorias: [
      { nome: "Mão de obra", planejado: 150000, realizado: 145000, diferenca: -5000, percentual: -3.33 },
      { nome: "Materiais", planejado: 120000, realizado: 110000, diferenca: -10000, percentual: -8.33 },
      { nome: "Equipamentos", planejado: 50000, realizado: 45000, diferenca: -5000, percentual: -10 },
      { nome: "Administrativo", planejado: 30000, realizado: 20000, diferenca: -10000, percentual: -33.33 },
    ],
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold">Relatórios Financeiros</h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="1trim2023">1º Trimestre 2023</SelectItem>
              <SelectItem value="2trim2023">2º Trimestre 2023</SelectItem>
              <SelectItem value="3trim2023">3º Trimestre 2023</SelectItem>
              <SelectItem value="4trim2023">4º Trimestre 2023</SelectItem>
            </SelectContent>
          </Select>

          <Select value={obraSelecionada} onValueChange={setObraSelecionada}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Selecione a obra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as obras</SelectItem>
              <SelectItem value="obraA">Obra A</SelectItem>
              <SelectItem value="obraB">Obra B</SelectItem>
              <SelectItem value="obraC">Obra C</SelectItem>
              <SelectItem value="obraD">Obra D</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Tabs defaultValue="lucro-por-obra" className="w-full">
          <div className="border-b border-gray-200">
            <TabsList className="w-full h-14 bg-transparent p-0 rounded-none flex">
              <TabsTrigger
                value="lucro-por-obra"
                className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#007EA3] data-[state=active]:text-[#007EA3] data-[state=active]:shadow-none rounded-none text-base font-medium transition-all"
              >
                Lucro por Obra
              </TabsTrigger>
              <TabsTrigger
                value="orcado-vs-realizado"
                className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#007EA3] data-[state=active]:text-[#007EA3] data-[state=active]:shadow-none rounded-none text-base font-medium transition-all"
              >
                Orçado vs. Realizado
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="lucro-por-obra" className="p-6 focus-visible:outline-none focus-visible:ring-0">
            <LucroPorObra dados={dadosLucroPorObra} />
          </TabsContent>

          <TabsContent value="orcado-vs-realizado" className="p-6 focus-visible:outline-none focus-visible:ring-0">
            <OrcadoVsRealizado dados={dadosOrcadoVsRealizado} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
