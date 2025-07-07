"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FluxoCaixa from "@/components/financeiro/fluxo-caixa/fluxo-caixa"
import PlanejamentoFinanceiro from "@/components/financeiro/planejamento/planejamento-financeiro"
import RelatoriosFinanceiros from "@/components/financeiro/relatorios/relatorios-financeiros"

export default function FinanceiroPage() {
  const [activeTab, setActiveTab] = useState("fluxo-caixa")

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestão Financeira</h1>
        </div>

        <Tabs defaultValue="fluxo-caixa" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-white rounded-t-lg shadow-sm border-b border-gray-200">
            <TabsList className="w-full justify-start h-14 bg-transparent p-0 rounded-none">
              <TabsTrigger
                value="fluxo-caixa"
                className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#007EA3] data-[state=active]:text-[#007EA3] data-[state=active]:shadow-none rounded-none text-base font-medium transition-all"
              >
                Fluxo de Caixa
              </TabsTrigger>
              <TabsTrigger
                value="planejamento"
                className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#007EA3] data-[state=active]:text-[#007EA3] data-[state=active]:shadow-none rounded-none text-base font-medium transition-all"
              >
                Planejamento Financeiro
              </TabsTrigger>
              <TabsTrigger
                value="relatorios"
                className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#007EA3] data-[state=active]:text-[#007EA3] data-[state=active]:shadow-none rounded-none text-base font-medium transition-all"
              >
                Relatórios Financeiros
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white shadow-sm rounded-b-lg border-x border-b border-gray-200">
            <TabsContent value="fluxo-caixa" className="p-0 m-0 focus-visible:outline-none focus-visible:ring-0">
              <FluxoCaixa />
            </TabsContent>

            <TabsContent value="planejamento" className="p-0 m-0 focus-visible:outline-none focus-visible:ring-0">
              <PlanejamentoFinanceiro />
            </TabsContent>

            <TabsContent value="relatorios" className="p-0 m-0 focus-visible:outline-none focus-visible:ring-0">
              <RelatoriosFinanceiros />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  )
}
