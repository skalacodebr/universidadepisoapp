"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Printer, Save } from "lucide-react"
import Link from "next/link"

export default function ResultadosSimulacaoPage({ params }) {
  const [activeTab, setActiveTab] = useState("financeiro")

  // Dados de exemplo para a simulação
  const simulacao = {
    id: params.id,
    nomeObra: "Edifício Residencial Aurora",
    data: "15/04/2023",
    construtora: "Construtora Silva",
    endereco: "Av. Principal, 1500",
    contato: "João Silva - (11) 98765-4321",
    custoTotal: 120000,
    precoVenda: 150000,
    lucroEstimado: 30000,
    margemLucro: 20,
    areaTotal: 500,
    custoM2: 240,
    precoM2: 300,
    equipamentos: [
      { nome: "Régua Vibratória", custo: 5000, durabilidade: 500, custoDia: 10 },
      { nome: "Acabadora de Superfície", custo: 3500, durabilidade: 400, custoDia: 8.75 },
    ],
    equipes: {
      concretagem: { tipo: "Padrão", pessoas: 4, custoDiario: 1000 },
      acabamento: { tipo: "Padrão", pessoas: 4, custoDiario: 1120 },
    },
    custosDiversos: {
      frete: 1500,
      hospedagem: 2000,
      locacaoEquipamento: 3000,
      locacaoVeiculo: 1800,
      material: 45000,
      passagem: 1200,
      extra: 500,
    },
  }

  // Cálculo da distribuição de custos para o gráfico de pizza
  const distribuicaoCustos = [
    {
      categoria: "Equipe",
      valor: simulacao.equipes.concretagem.custoDiario + simulacao.equipes.acabamento.custoDiario,
      percentual: 25,
    },
    { categoria: "Equipamentos", valor: 8500, percentual: 15 },
    { categoria: "Material", valor: 45000, percentual: 40 },
    { categoria: "Logística", valor: 6500, percentual: 10 },
    { categoria: "Outros", valor: 10000, percentual: 10 },
  ]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/simulacao">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Resultados da Simulação</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" className="bg-[#007EA3]">
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Informações da Obra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nome:</span>
                <span className="font-medium">{simulacao.nomeObra}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Construtora:</span>
                <span className="font-medium">{simulacao.construtora}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Endereço:</span>
                <span className="font-medium">{simulacao.endereco}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contato:</span>
                <span className="font-medium">{simulacao.contato}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data:</span>
                <span className="font-medium">{simulacao.data}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Custo Total:</span>
                <span className="font-medium">R$ {simulacao.custoTotal.toLocaleString("pt-BR")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Preço de Venda:</span>
                <span className="font-medium">R$ {simulacao.precoVenda.toLocaleString("pt-BR")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lucro Estimado:</span>
                <span className="font-medium text-green-600">R$ {simulacao.lucroEstimado.toLocaleString("pt-BR")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margem de Lucro:</span>
                <span className="font-medium text-green-600">{simulacao.margemLucro}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Preço por m²:</span>
                <span className="font-medium">R$ {simulacao.precoM2.toLocaleString("pt-BR")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="financeiro">Relatório Financeiro</TabsTrigger>
          <TabsTrigger value="numerico">Relatório Numérico</TabsTrigger>
          <TabsTrigger value="grafico">Relatório Gráfico (Pizza)</TabsTrigger>
        </TabsList>

        <TabsContent value="financeiro" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Resumo Geral</h3>
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Custo Total da Obra (R$)</span>
                      <span className="font-medium">R$ {simulacao.custoTotal.toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Custo Total por Metro Quadrado</span>
                      <span className="font-medium">R$ {simulacao.custoM2.toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Preço de Venda</span>
                      <span className="font-medium">R$ {simulacao.precoVenda.toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lucro Estimado</span>
                      <span className="font-medium text-green-600">
                        R$ {simulacao.lucroEstimado.toLocaleString("pt-BR")} ({simulacao.margemLucro}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Tabela Detalhada de Custos</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Categoria de Custo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Detalhes
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Custo Unitário
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Custo Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {distribuicaoCustos.map((item, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.categoria}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.categoria === "Equipe"
                                ? `Concretagem (${simulacao.equipes.concretagem.pessoas} pessoas) e Acabamento (${simulacao.equipes.acabamento.pessoas} pessoas)`
                                : item.categoria === "Material"
                                  ? "Concreto, aditivos e ferramentas"
                                  : item.categoria === "Logística"
                                    ? "Frete, hospedagem e passagens"
                                    : "Diversos"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              {item.categoria === "Equipe"
                                ? `R$ ${(
                                    simulacao.equipes.concretagem.custoDiario / simulacao.equipes.concretagem.pessoas
                                  ).toLocaleString("pt-BR")}/pessoa/dia`
                                : "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              R$ {item.valor.toLocaleString("pt-BR")}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td
                            colSpan={3}
                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right"
                          >
                            Custo Total
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                            R$ {simulacao.custoTotal.toLocaleString("pt-BR")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="numerico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório Numérico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Resumo Operacional</h3>
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Área Total</span>
                      <span className="font-medium">{simulacao.areaTotal} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Área por Dia</span>
                      <span className="font-medium">100 m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projeto de Piso</span>
                      <span className="font-medium">Industrial</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tipo de Acabamento</span>
                      <span className="font-medium">Premium</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Espessura</span>
                      <span className="font-medium">10 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lançamento do Concreto</span>
                      <span className="font-medium">Bomba</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Equipe e Prazos</h3>
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Equipe de Concretagem</span>
                      <span className="font-medium">
                        {simulacao.equipes.concretagem.tipo} ({simulacao.equipes.concretagem.pessoas} pessoas)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equipe de Acabamento</span>
                      <span className="font-medium">
                        {simulacao.equipes.acabamento.tipo} ({simulacao.equipes.acabamento.pessoas} pessoas)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prazo de Preparação</span>
                      <span className="font-medium">2 dias</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prazo de Finalização</span>
                      <span className="font-medium">1 dia</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prazo Total Estimado</span>
                      <span className="font-medium">8 dias</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Lista de Equipamentos</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Equipamento
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Custo (R$)
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durabilidade (dias)
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Custo por Dia (R$)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {simulacao.equipamentos.map((equip, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {equip.nome}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              R$ {equip.custo.toLocaleString("pt-BR")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              {equip.durabilidade}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              R$ {equip.custoDia.toLocaleString("pt-BR")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Custos Diversos</h3>
                  <div className="border rounded-md p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Frete</span>
                        <span className="font-medium">R$ {simulacao.custosDiversos.frete.toLocaleString("pt-BR")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hospedagem</span>
                        <span className="font-medium">
                          R$ {simulacao.custosDiversos.hospedagem.toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Locação de Equipamento</span>
                        <span className="font-medium">
                          R$ {simulacao.custosDiversos.locacaoEquipamento.toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Locação de Veículo</span>
                        <span className="font-medium">
                          R$ {simulacao.custosDiversos.locacaoVeiculo.toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Material</span>
                        <span className="font-medium">
                          R$ {simulacao.custosDiversos.material.toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Passagem</span>
                        <span className="font-medium">
                          R$ {simulacao.custosDiversos.passagem.toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Extra</span>
                        <span className="font-medium">R$ {simulacao.custosDiversos.extra.toLocaleString("pt-BR")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grafico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório Gráfico (Pizza)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-64 h-64 rounded-full bg-gray-100 flex items-center justify-center relative">
                    {/* Simulação visual do gráfico de pizza */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "conic-gradient(#4f46e5 0% 25%, #ef4444 25% 40%, #10b981 40% 80%, #f59e0b 80% 90%, #6b7280 90% 100%)",
                        clipPath: "circle(50% at center)",
                      }}
                    ></div>
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center z-10">
                      <span className="text-sm font-medium">Distribuição de Custos</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Percentual de Cada Categoria</h3>
                  <div className="space-y-2">
                    {distribuicaoCustos.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{
                            backgroundColor:
                              index === 0
                                ? "#4f46e5"
                                : index === 1
                                  ? "#ef4444"
                                  : index === 2
                                    ? "#10b981"
                                    : index === 3
                                      ? "#f59e0b"
                                      : "#6b7280",
                          }}
                        ></div>
                        <div className="flex-1 flex justify-between">
                          <span>{item.categoria}</span>
                          <span className="font-medium">{item.percentual}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Resumo Rápido</h3>
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Custo Total da Obra (R$)</span>
                      <span className="font-medium">R$ {simulacao.custoTotal.toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Área Total (m²)</span>
                      <span className="font-medium">{simulacao.areaTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Custo por Metro Quadrado</span>
                      <span className="font-medium">R$ {simulacao.custoM2.toLocaleString("pt-BR")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
