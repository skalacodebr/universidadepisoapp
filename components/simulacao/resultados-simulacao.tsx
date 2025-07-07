"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, FileText, PieChart, BarChart } from "lucide-react"

interface ResultadosSimulacaoProps {
  simulacao: any
  onVoltar: () => void
  onSalvar: () => void
}

export function ResultadosSimulacao({ simulacao, onVoltar, onSalvar }: ResultadosSimulacaoProps) {
  const [activeTab, setActiveTab] = useState("resumo")

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Resultados da Simulação</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onVoltar}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={onSalvar}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Simulação
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500">Custo Total da Obra (R$)</div>
                <div className="text-2xl font-bold">R$ {simulacao.custoTotal.toLocaleString("pt-BR")}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500">Preço de Venda (R$/m²)</div>
                <div className="text-2xl font-bold">
                  R$ {(simulacao.precoVenda / simulacao.areaTotal).toLocaleString("pt-BR")}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500">Lucro Estimado (R$)</div>
                <div className="text-2xl font-bold">R$ {simulacao.lucroEstimado.toLocaleString("pt-BR")}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500">Margem de Lucro (%)</div>
                <div className="text-2xl font-bold">{simulacao.margemLucro}%</div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 gap-4">
              <TabsTrigger value="resumo" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Resumo Geral
              </TabsTrigger>
              <TabsTrigger value="detalhado" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Relatório Detalhado
              </TabsTrigger>
              <TabsTrigger value="grafico" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Gráfico de Pizza
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resumo" className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Informações da Obra</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2">
                      <div className="text-sm text-gray-500">Nome da Obra:</div>
                      <div className="text-sm font-medium">{simulacao.nomeObra}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-sm text-gray-500">Construtora:</div>
                      <div className="text-sm font-medium">{simulacao.construtora || "Não informado"}</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-sm text-gray-500">Área Total:</div>
                      <div className="text-sm font-medium">{simulacao.areaTotal} m²</div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-sm text-gray-500">Tipo de Acabamento:</div>
                      <div className="text-sm font-medium">
                        {simulacao.tipoAcabamento === "padrao"
                          ? "Padrão"
                          : simulacao.tipoAcabamento === "premium"
                            ? "Premium"
                            : "Especial"}
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="text-sm text-gray-500">Previsão de Início:</div>
                      <div className="text-sm font-medium">
                        {simulacao.previsaoInicio
                          ? new Date(simulacao.previsaoInicio).toLocaleDateString("pt-BR")
                          : "Não informado"}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Ajustes Rápidos</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Clique nos botões abaixo para ajustar o preço de venda por metro quadrado, recalculando os valores
                    automaticamente.
                  </p>
                  <div className="flex space-x-2 mb-4">
                    <Button variant="outline" size="sm">
                      -5%
                    </Button>
                    <Button variant="outline" size="sm">
                      -2%
                    </Button>
                    <Button variant="default" size="sm">
                      Preço Sugerido
                    </Button>
                    <Button variant="outline" size="sm">
                      +2%
                    </Button>
                    <Button variant="outline" size="sm">
                      +5%
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 mt-4">
                    <div className="text-sm text-gray-500">Preço Sugerido:</div>
                    <div className="text-sm font-medium">
                      R$ {(simulacao.precoVenda / simulacao.areaTotal).toLocaleString("pt-BR")} /m²
                    </div>
                    <div className="text-sm text-gray-500">Custo por m²:</div>
                    <div className="text-sm font-medium">
                      R$ {(simulacao.custoTotal / simulacao.areaTotal).toLocaleString("pt-BR")} /m²
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="detalhado" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Detalhamento de Custos</h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium text-gray-500">Categoria</th>
                        <th className="text-right py-2 font-medium text-gray-500">Valor (R$)</th>
                        <th className="text-right py-2 font-medium text-gray-500">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Mão de Obra</td>
                        <td className="text-right py-2">R$ 5.000,00</td>
                        <td className="text-right py-2">33,3%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Materiais</td>
                        <td className="text-right py-2">R$ 4.500,00</td>
                        <td className="text-right py-2">30,0%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Equipamentos</td>
                        <td className="text-right py-2">R$ 2.000,00</td>
                        <td className="text-right py-2">13,3%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Transporte</td>
                        <td className="text-right py-2">R$ 1.500,00</td>
                        <td className="text-right py-2">10,0%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Custos Diversos</td>
                        <td className="text-right py-2">R$ 2.000,00</td>
                        <td className="text-right py-2">13,3%</td>
                      </tr>
                      <tr className="font-medium">
                        <td className="py-2">Total</td>
                        <td className="text-right py-2">R$ 15.000,00</td>
                        <td className="text-right py-2">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Equipes e Prazos</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-md font-medium mb-2">Equipe de Concretagem</h4>
                      <p className="text-sm">{simulacao.equipeConcretagem} pessoas</p>
                    </div>
                    <div>
                      <h4 className="text-md font-medium mb-2">Equipe de Acabamento</h4>
                      <p className="text-sm">{simulacao.equipeAcabamento} pessoas</p>
                    </div>
                    <div>
                      <h4 className="text-md font-medium mb-2">Prazo de Preparação</h4>
                      <p className="text-sm">{simulacao.prazoPreparacao || "Não informado"} dias</p>
                    </div>
                    <div>
                      <h4 className="text-md font-medium mb-2">Prazo de Finalização</h4>
                      <p className="text-sm">{simulacao.prazoFinalizacao || "Não informado"} dias</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="grafico" className="space-y-4">
              <div className="flex justify-center">
                <div className="w-96 h-96 relative">
                  {/* Aqui seria implementado um gráfico de pizza com a biblioteca de sua preferência */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-500">Gráfico de Pizza</p>
                      <p className="text-sm text-gray-400">Mostra o % de cada custo no custo total</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="text-lg font-medium mb-4">Legenda</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm">Mão de Obra (33,3%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm">Materiais (30,0%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm">Equipamentos (13,3%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm">Transporte (10,0%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                      <span className="text-sm">Custos Diversos (13,3%)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Resumo</h3>
                  <p className="text-sm text-gray-500">
                    O gráfico mostra a distribuição percentual de cada categoria de custo em relação ao custo total da
                    obra. A mão de obra representa o maior custo, seguida pelos materiais.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
