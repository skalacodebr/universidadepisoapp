"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Printer, Save } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

interface SimulacaoData {
  id: number
  nomeObra: string
  data: string
  construtora: string
  endereco: string
  contato: string
  custoTotal: number
  precoVenda: number
  lucroEstimado: number
  margemLucro: number
  areaTotal: number
  custoM2: number
  precoM2: number
  equipamentos: Array<{
    nome: string
    custo: number
    durabilidade: number
    custoDia: number
  }>
  equipes: {
    concretagem: { tipo: string; pessoas: number; custoDiario: number }
    acabamento: { tipo: string; pessoas: number; custoDiario: number }
    preparacao: { tipo: string; pessoas: number; custoDiario: number }
    finalizacao: { tipo: string; pessoas: number; custoDiario: number }
  }
  custosDiversos: {
    frete: number
    hospedagem: number
    locacaoEquipamento: number
    locacaoVeiculo: number
    material: number
    passagem: number
    extra: number
  }
  custosFixos: {
    total: number
    mediaMes: number
    mediaFinal: number
  }
  custoExecucao: number
  despesasFixas: number
}

interface CustosFixosData {
  total: number
  media_mes: number
  media_final: number
}

interface PageParams {
  id: string
}

export default function ResultadosSimulacaoPage({ params }: { params: PageParams }) {
  const [activeTab, setActiveTab] = useState("financeiro")
  const [simulacao, setSimulacao] = useState<SimulacaoData | null>(null)
  const [custosFixos, setCustosFixos] = useState<CustosFixosData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true)
        
        // Buscar dados da simulação
        const { data: obra, error: obraError } = await supabase
          .from("obras")
          .select("*")
          .eq("id", params.id)
          .eq("simulacao", true)
          .single()

        if (obraError) {
          console.error("Erro ao buscar simulação:", obraError)
          return
        }

        // Buscar custos fixos da empresa
        const { data: custosFixosData, error: custosFixosError } = await supabase
          .from('custofixo_usuario')
          .select('*')
          .eq('userid', obra.usuarios_id)
          .order('created_at', { ascending: false })
          .limit(1)

        if (custosFixosError) {
          console.error("Erro ao buscar custos fixos:", custosFixosError)
        }

        const custosFixosEmpresa = custosFixosData?.[0] || null

        // Buscar informações das equipes
        const { data: equipeConcretagem } = await supabase
          .from('equipes_concretagem')
          .select('qtd_pessoas')
          .eq('id', obra.equipes_concretagem_id)
          .single()

        const { data: equipeAcabamento } = await supabase
          .from('equipes_acabamento')
          .select('qtd_pessoas')
          .eq('id', obra.equipes_acabamento_id)
          .single()

        const { data: equipePreparacao } = await supabase
          .from('equipes_preparacao')
          .select('qtd_pessoas')
          .eq('id', obra.equipes_preparacao_id)
          .single()

        const { data: equipeFinalizacao } = await supabase
          .from('equipes_acabamento')
          .select('qtd_pessoas')
          .eq('id', obra.equipes_finalizacao_id)
          .single()

        // Processar equipamentos
        let equipamentosSelecionados: any[] = []
        if (obra.equipamentos_selecionados) {
          try {
            equipamentosSelecionados = typeof obra.equipamentos_selecionados === 'string' 
              ? JSON.parse(obra.equipamentos_selecionados) 
              : obra.equipamentos_selecionados
          } catch (e) {
            console.error('Erro ao fazer parse dos equipamentos:', e)
          }
        }

        // Calcular custos
        const custoExecucao = (obra.custo_mao_obra || 0) + 
                             (obra.custo_equipamentos || 0) + 
                             (obra.custo_veiculos || 0) + 
                             (obra.valor_frete || 0) +
                             (obra.valor_hospedagem || 0) +
                             (obra.valor_locacao_veiculos || 0) +
                             (obra.valor_material || 0) +
                             (obra.valor_passagem || 0) +
                             (obra.valor_extra || 0)

        const despesasFixasEmpresa = custosFixosEmpresa ? Number(custosFixosEmpresa.total) || 0 : 0
        const custoTotalGeral = custoExecucao + despesasFixasEmpresa
        const valorTotal = (obra.preco_venda_metro_quadrado || 0) * (obra.area_total_metros_quadrados || 0)
        const lucroTotal = valorTotal - custoTotalGeral

        // Montar dados da simulação
        const dadosSimulacao: SimulacaoData = {
          id: obra.id,
          nomeObra: obra.nome,
          data: new Date(obra.created_at).toLocaleDateString('pt-BR'),
          construtora: obra.construtora,
          endereco: obra.endereco,
          contato: `${obra.nome_contato} - ${obra.telefone_responsavel}`,
          custoTotal: custoTotalGeral,
          precoVenda: valorTotal,
          lucroEstimado: lucroTotal,
          margemLucro: valorTotal > 0 ? (lucroTotal / valorTotal) * 100 : 0,
          areaTotal: obra.area_total_metros_quadrados || 0,
          custoM2: obra.area_total_metros_quadrados > 0 ? custoTotalGeral / obra.area_total_metros_quadrados : 0,
          precoM2: obra.preco_venda_metro_quadrado || 0,
          equipamentos: equipamentosSelecionados.map((eq: any) => ({
            nome: eq.nome,
            custo: eq.custo_total || 0,
            durabilidade: eq.dias_obra || 0,
            custoDia: eq.valor_dia || 0
          })),
          equipes: {
            concretagem: { 
              tipo: "Equipe", 
              pessoas: equipeConcretagem?.qtd_pessoas || 0, 
              custoDiario: obra.custo_mao_obra || 0 
            },
            acabamento: { 
              tipo: "Equipe", 
              pessoas: equipeAcabamento?.qtd_pessoas || 0, 
              custoDiario: obra.custo_mao_obra || 0 
            },
            preparacao: { 
              tipo: "Equipe", 
              pessoas: equipePreparacao?.qtd_pessoas || 0, 
              custoDiario: obra.custo_preparacao || 0 
            },
            finalizacao: { 
              tipo: "Equipe", 
              pessoas: equipeFinalizacao?.qtd_pessoas || 0, 
              custoDiario: obra.custo_finalizacao || 0 
            }
          },
          custosDiversos: {
            frete: obra.valor_frete || 0,
            hospedagem: obra.valor_hospedagem || 0,
            locacaoEquipamento: obra.custo_equipamentos || 0,
            locacaoVeiculo: obra.valor_locacao_veiculos || 0,
            material: obra.valor_material || 0,
            passagem: obra.valor_passagem || 0,
            extra: obra.valor_extra || 0,
          },
          custosFixos: {
            total: custosFixosEmpresa?.total || 0,
            mediaMes: custosFixosEmpresa?.media_mes || 0,
            mediaFinal: custosFixosEmpresa?.media_final || 0
          },
          custoExecucao: custoExecucao,
          despesasFixas: despesasFixasEmpresa
        }

        setSimulacao(dadosSimulacao)
        setCustosFixos(custosFixosEmpresa)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Carregando dados da simulação...</div>
        </div>
      </div>
    )
  }

  if (!simulacao) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Simulação não encontrada</div>
        </div>
      </div>
    )
  }

  // Cálculo da distribuição de custos para o gráfico de pizza
  const distribuicaoCustos = [
    {
      categoria: "Equipe",
      valor: simulacao.equipes.concretagem.custoDiario + simulacao.equipes.acabamento.custoDiario + simulacao.equipes.preparacao.custoDiario + simulacao.equipes.finalizacao.custoDiario,
      percentual: simulacao.custoTotal > 0 ? ((simulacao.equipes.concretagem.custoDiario + simulacao.equipes.acabamento.custoDiario + simulacao.equipes.preparacao.custoDiario + simulacao.equipes.finalizacao.custoDiario) / simulacao.custoTotal) * 100 : 0,
    },
    { 
      categoria: "Equipamentos", 
      valor: simulacao.custosDiversos.locacaoEquipamento, 
      percentual: simulacao.custoTotal > 0 ? (simulacao.custosDiversos.locacaoEquipamento / simulacao.custoTotal) * 100 : 0 
    },
    { 
      categoria: "Material", 
      valor: simulacao.custosDiversos.material, 
      percentual: simulacao.custoTotal > 0 ? (simulacao.custosDiversos.material / simulacao.custoTotal) * 100 : 0 
    },
    { 
      categoria: "Logística", 
      valor: simulacao.custosDiversos.frete + simulacao.custosDiversos.hospedagem + simulacao.custosDiversos.locacaoVeiculo + simulacao.custosDiversos.passagem, 
      percentual: simulacao.custoTotal > 0 ? ((simulacao.custosDiversos.frete + simulacao.custosDiversos.hospedagem + simulacao.custosDiversos.locacaoVeiculo + simulacao.custosDiversos.passagem) / simulacao.custoTotal) * 100 : 0 
    },
    { 
      categoria: "Custos Fixos", 
      valor: simulacao.despesasFixas, 
      percentual: simulacao.custoTotal > 0 ? (simulacao.despesasFixas / simulacao.custoTotal) * 100 : 0 
    },
    { 
      categoria: "Outros", 
      valor: simulacao.custosDiversos.extra, 
      percentual: simulacao.custoTotal > 0 ? (simulacao.custosDiversos.extra / simulacao.custoTotal) * 100 : 0 
    },
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
                <span className="font-medium text-green-600">{simulacao.margemLucro.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Preço por m²:</span>
                <span className="font-medium">R$ {simulacao.precoM2.toLocaleString("pt-BR")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card dos Custos Fixos da Empresa */}
      {custosFixos && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Custos Fixos da Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  R$ {custosFixos.total?.toLocaleString("pt-BR") || "0,00"}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total dos Custos Fixos</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {custosFixos.media_mes?.toLocaleString("pt-BR") || "0,00"} m²
                </div>
                <div className="text-sm text-gray-600 mt-1">Média de Metro Quadrado por Mês</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">
                  R$ {custosFixos.media_final?.toLocaleString("pt-BR") || "0,00"}
                </div>
                <div className="text-sm text-gray-600 mt-1">Média Final (por m²)</div>
              </div>
            </div>
            {custosFixos.media_mes && custosFixos.media_mes > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  Fórmula: {custosFixos.total?.toLocaleString("pt-BR") || "0,00"} ÷ {custosFixos.media_mes?.toLocaleString("pt-BR") || "0,00"} m² = R$ {custosFixos.media_final?.toLocaleString("pt-BR") || "0,00"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
                        R$ {simulacao.lucroEstimado.toLocaleString("pt-BR")} ({simulacao.margemLucro.toFixed(2)}%)
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
                            Custo Total
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Percentual
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
                                ? `Concretagem (${simulacao.equipes.concretagem.pessoas} pessoas), Acabamento (${simulacao.equipes.acabamento.pessoas} pessoas), Preparação (${simulacao.equipes.preparacao.pessoas} pessoas), Finalização (${simulacao.equipes.finalizacao.pessoas} pessoas)`
                                : item.categoria === "Material"
                                  ? "Concreto, aditivos e ferramentas"
                                  : item.categoria === "Logística"
                                    ? "Frete, hospedagem, locação de veículos e passagens"
                                    : item.categoria === "Custos Fixos"
                                      ? "Custos fixos da empresa"
                                      : "Diversos"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              R$ {item.valor.toLocaleString("pt-BR")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              {item.percentual.toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td
                            colSpan={2}
                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right"
                          >
                            Custo Total
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                            R$ {simulacao.custoTotal.toLocaleString("pt-BR")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                            100%
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
                      <span>Custo por Metro Quadrado</span>
                      <span className="font-medium">R$ {simulacao.custoM2.toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Preço de Venda por m²</span>
                      <span className="font-medium">R$ {simulacao.precoM2.toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margem de Lucro</span>
                      <span className="font-medium">{simulacao.margemLucro.toFixed(2)}%</span>
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
                      <span>Equipe de Preparação</span>
                      <span className="font-medium">
                        {simulacao.equipes.preparacao.tipo} ({simulacao.equipes.preparacao.pessoas} pessoas)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equipe de Finalização</span>
                      <span className="font-medium">
                        {simulacao.equipes.finalizacao.tipo} ({simulacao.equipes.finalizacao.pessoas} pessoas)
                      </span>
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
                              R$ {equip.custo.toLocaleString("pt-BR")} (Total)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                              {equip.durabilidade} dias
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
                                      : index === 4
                                        ? "#6b7280"
                                        : "#8b5cf6",
                          }}
                        ></div>
                        <div className="flex-1 flex justify-between">
                          <span>{item.categoria}</span>
                          <span className="font-medium">{item.percentual.toFixed(2)}%</span>
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
