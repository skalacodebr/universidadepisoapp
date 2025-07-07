"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, AlertCircle, PlusCircle, Car } from "lucide-react"
import { SimulationResult } from "./components/simulation-result"
import { SimulacaoHeader } from "./components/simulacao-header"
import { SimulacaoFilters } from "./components/simulacao-filters"
import { SimulacaoTable } from "./components/simulacao-table"
import { DeleteConfirmationDialog } from "./components/delete-confirmation-dialog"
import { VeiculosObra } from "./components/veiculos-obra"
import { EquipamentosObra } from "./components/equipamentos-obra"
import { useSimulacoes } from "./hooks/useSimulacoes"
import { useSimulacaoFilters } from "./hooks/useSimulacaoFilters"
import type { SimulacaoResult as SimulacaoResultType } from "@/lib/simulacao-calculator.tsx"
import type { SimulacaoItem } from "./hooks/useSimulacoes"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

// Função adaptadora para converter formato antigo para novo formato detalhado
function adaptToDetailedFormat(oldResult: any, obra: any, tipoReforcoEstruturalNome: string = 'N/A'): SimulacaoResultType {
  // Calcular o custo de preparação
  const custoPreparacao = obra.pessoasPreparacao * 1373.47 * (obra.prazo_preparacao_obra || 0);
  
  return {
    dadosTecnicos: {
      reforcoEstrutural: tipoReforcoEstruturalNome,
      areaTotal: obra.area_total_metros_quadrados || 0,
      areaPorDia: obra.area_por_dia || 0,
      prazoTotal: obra.prazo_obra || 0,
      espessura: obra.espessura_piso || 0,
      lancamento: obra.lancamento_concreto || 0,
      areaConcretaPorHora: obra.area_por_hora || 0,
      inicioConcretagem: obra.horas_inicio_concretagem || '08:00',
      inicioAcabamento: obra.horas_inicio_acabamento || '13:00',
      finalAcabamento: obra.final_acabamento || '19:00',
      horasConcretagem: obra.hora_concretagem || 0,
      horasAcabamento: obra.hora_acabamento || 0,
      sobreposicaoCA: obra.sobreposicao_ca || 0,
      concreto: oldResult.volumeConcretoM3 || 0,
      finalConcretagem: obra.final_concretagem || '11:00',
      preparoDiaSeguinte: 6
    },
    equipeConcretagemAcabamento: {
      equipeTotal: 8, // 5 concretagem + 3 acabamento
      custoEquipe: oldResult.custoMaoObra?.total || 0,
      equipeConcretagem: 5,
      horasExtraEquipeConcretagem: obra.horas_extra_concretagem || 0,
      custoHEEquipeConcretagem: obra.custo_horas_extra_concretagem || 0,
      horaExtraEquipeAcabamento: obra.horas_extra_acabamento || 0,
      equipeAcabamento: 3,
      custoHEAcabamento: obra.custo_horas_extra_acabamento || 0,
      totalEquipe: (oldResult.custoMaoObra?.total || 0) + (obra.custo_total_horas_extras || 0),
      percentualTotalEquipe: oldResult.valorTotal > 0 ? (((oldResult.custoMaoObra?.total || 0) + (obra.custo_total_horas_extras || 0)) / oldResult.valorTotal) * 100 : 0
    },
    preparacaoObra: {
      equipeTotal: obra.pessoasPreparacao || 4,
      prazo: obra.prazo_preparacao_obra || 0,
      custoPreparacao: custoPreparacao,
      totalEquipe: custoPreparacao,
      percentualTotalEquipe: oldResult.valorTotal > 0 ? (custoPreparacao / oldResult.valorTotal) * 100 : 0
    },
    finalizacaoObra: {
      equipeTotal: 2, // Valor padrão da finalização
      prazo: obra.prazo_finalizacao_obra || 0,
      custoFinalizacao: obra.custo_finalizacao || 0,
      totalEquipe: obra.custo_finalizacao || 0,
      percentualTotalEquipe: oldResult.valorTotal > 0 ? ((obra.custo_finalizacao || 0) / oldResult.valorTotal) * 100 : 0
    },
    equipamentos: {
      equipamentos: (() => {
        try {
          let equipamentos = obra.equipamentos_selecionados;
          
          // Se for uma string, tentar fazer parse
          if (typeof equipamentos === 'string') {
            equipamentos = JSON.parse(equipamentos);
          }
          
          // Se não for array, retornar array vazio
          if (!Array.isArray(equipamentos)) {
            return [];
          }
          
          return equipamentos.map((eq: any) => ({
            nome: eq.nome || 'Equipamento',
            valorDia: eq.valor_dia || 0,
            dias: oldResult.diasTotais || 0,
            quantidade: eq.quantidade || 1,
            total: eq.custo_total || ((eq.valor_dia || 0) * (eq.quantidade || 1) * (oldResult.diasTotais || 0))
          }));
        } catch (error) {
          console.error('Erro ao processar equipamentos:', error);
          return [];
        }
      })(),
      totalEquipamentos: oldResult.custoEquipamentos || 0,
      percentualTotalEquipamentos: oldResult.valorTotal > 0 ? ((oldResult.custoEquipamentos || 0) / oldResult.valorTotal) * 100 : 0,
      quantidadeEquipamentos: (() => {
        try {
          let equipamentos = obra.equipamentos_selecionados;
          if (typeof equipamentos === 'string') {
            equipamentos = JSON.parse(equipamentos);
          }
          return Array.isArray(equipamentos) ? equipamentos.length : 0;
        } catch (error) {
          return 0;
        }
      })()
    },
    veiculos: {
      veiculos: oldResult.veiculosDetalhados || [],
      totalVeiculos: obra.custo_veiculos || 0,
      percentualTotalVeiculos: oldResult.valorTotal > 0 ? ((obra.custo_veiculos || 0) / oldResult.valorTotal) * 100 : 0
    },
    insumos: {
      tipoAcabamento: obra.tipo_acabamento_id || 'LISO POLIDO',
      area: obra.area_total_metros_quadrados || 0,
      dias: oldResult.diasTotais || 0,
      valorPorM2: 3.2, // Valor fixo já que não existe na tabela
      totalInsumos: oldResult.custoMateriais?.total || 0,
      percentualTotalInsumos: oldResult.valorTotal > 0 ? ((oldResult.custoMateriais?.total || 0) / oldResult.valorTotal) * 100 : 0
    },
    demaisDespesasFixas: {
      valorEmpresaPorM2: 2.33,
      valorTotalPorM2: obra.area_total_metros_quadrados ? (oldResult.custosFixos?.total || 0) / obra.area_total_metros_quadrados : 0,
      areaTotalObra: obra.area_total_metros_quadrados || 0,
      despesasFixas: oldResult.custosFixos?.total || 0,
      percentualDespesasFixas: oldResult.valorTotal > 0 ? ((oldResult.custosFixos?.total || 0) / oldResult.valorTotal) * 100 : 0,
      custoExecucao: oldResult.subtotal || 0,
      percentualCustoExecucao: oldResult.valorTotal > 0 ? ((oldResult.subtotal || 0) / oldResult.valorTotal) * 100 : 0
    },
    custoDerivadosVenda: {
      faturamento12Meses: 3000000,
      percentualFaturamento: 15.05,
      impostoSimples: oldResult.valorTotal * 0.1505,
      percentualImpostoSimples: 15.05,
      margemLucro: oldResult.lucroTotal || 0,
      percentualMargemLucro: oldResult.valorTotal > 0 ? ((oldResult.lucroTotal || 0) / oldResult.valorTotal) * 100 : 0,
      comissoes: oldResult.valorTotal * (obra.percentual_comissao || 0) / 100,
      percentualComissoes: obra.percentual_comissao || 0
    },
    outrosCustos: {
      totalOutrosCustos: (oldResult.custosFixos?.extra || 0) + (oldResult.custosFixos?.passagem || 0),
      totalM2: obra.area_total_metros_quadrados ? ((oldResult.custosFixos?.extra || 0) + (oldResult.custosFixos?.passagem || 0)) / obra.area_total_metros_quadrados : 0
    },
    precoVenda: {
      precoVenda: oldResult.valorTotal || 0,
      precoVendaPorM2: oldResult.precoVendaM2 || 0,
      sePrecoVendaPorM2For: 25.00,
      valorTotal: oldResult.valorTotal || 0,
      resultado1: oldResult.lucroTotal || 0,
      resultadoPercentual: oldResult.valorTotal > 0 ? ((oldResult.lucroTotal || 0) / oldResult.valorTotal) * 100 : 0
    },
    
    // Campos de compatibilidade
    valorTotal: oldResult.valorTotal || 0,
    precoVendaM2: oldResult.precoVendaM2 || 0,
    lucroTotal: oldResult.lucroTotal || 0,
    custoMaoObra: oldResult.custoMaoObra,
    custoMateriais: oldResult.custoMateriais,
    custosFixos: oldResult.custosFixos,
    volumeConcretoM3: oldResult.volumeConcretoM3,
    diasTotais: oldResult.diasTotais,
    custoEquipamentos: oldResult.custoEquipamentos,
    custoVeiculos: obra.custo_veiculos || 0
  }
}

async function getEquipePreparacaoPessoas(equipeId: number | null): Promise<number> {
  if (!equipeId) return 4; // valor padrão
  
  const { data: equipe } = await supabase
    .from('equipes_preparacao')
    .select('qtd_pessoas')
    .eq('id', equipeId)
    .single();
    
  return equipe?.qtd_pessoas || 4;
}

export default function SimulacaoPage() {
  const { simulacoes, loading, duplicarSimulacao, excluirSimulacao } = useSimulacoes()

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    periodoFilter,
    setPeriodoFilter,
    simulacoesFiltradas,
    clearFilters,
  } = useSimulacaoFilters(simulacoes)

  const [simulationResult, setSimulationResult] = useState<SimulacaoResultType | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [simulacaoParaExcluir, setSimulacaoParaExcluir] = useState<SimulacaoItem | null>(null)
  const [loadingView, setLoadingView] = useState(false)

  const handleEdit = async (id: number) => {
    // TODO: Implementar edição
    console.log("Editar simulação:", id)
  }

  const handleDuplicate = async (id: number) => {
    await duplicarSimulacao(id)
  }

  const handleDelete = (simulacao: SimulacaoItem) => {
    setSimulacaoParaExcluir(simulacao)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (simulacaoParaExcluir) {
      await excluirSimulacao(simulacaoParaExcluir.id)
      setIsDeleteDialogOpen(false)
      setSimulacaoParaExcluir(null)
    }
  }

  const handleViewSimulation = async (id: number) => {
    try {
      setLoadingView(true)
      console.log("Visualizando simulação ID:", id)

      // Buscar os dados da simulação no banco
      const { data: obra, error } = await supabase.from("obras").select("*").eq("id", id).eq("simulacao", true).single()

      if (error) {
        console.error("Erro ao buscar simulação:", error)
        return
      }

      if (!obra) {
        console.error("Simulação não encontrada")
        return
      }

      // Buscar o número de pessoas da equipe de preparação
      const pessoasPreparacao = await getEquipePreparacaoPessoas(obra.equipes_preparacao_id)

      // Buscar o nome do tipo de reforço estrutural se existe ID
      let tipoReforcoEstruturalNome = 'N/A'
      if (obra.tipo_reforco_estrutural_id) {
        const { data: tipoReforco } = await supabase
          .from("tipo_reforco_estrutural")
          .select("nome")
          .eq("id", obra.tipo_reforco_estrutural_id)
          .single()
        
        tipoReforcoEstruturalNome = tipoReforco?.nome || 'N/A'
      }

      // Buscar veículos da simulação se tem usuário
      let veiculosDetalhados: any[] = []
      if (obra.usuarios_id) {
        try {
          console.log("Buscando veículos para usuário:", obra.usuarios_id)
          
          // Buscar veículos da obra do usuário
          const { data: veiculosObra, error: errorVeiculos } = await supabase
            .from('obras_veiculos_simulacao')
            .select('*')
            .eq('userid', obra.usuarios_id)

          if (errorVeiculos) {
            console.error("Erro ao buscar veículos:", errorVeiculos)
          } else if (veiculosObra && veiculosObra.length > 0) {
            console.log("Veículos encontrados:", veiculosObra)
            
            // Buscar informações detalhadas dos veículos (rs_km)
            const nomesVeiculos = veiculosObra.map(v => v.veiculo)
            console.log("🔍 NOMES DOS VEÍCULOS PARA BUSCA:", nomesVeiculos)
            console.log("🔍 DETALHES DOS VEÍCULOS DA OBRA:", veiculosObra)
            
            const { data: veiculosInfo, error: errorVeiculosInfo } = await supabase
              .from('veiculos')
              .select('veiculo, rs_km')
              .in('veiculo', nomesVeiculos)

            if (!errorVeiculosInfo && veiculosInfo) {
              console.log("✅ INFORMAÇÕES DOS VEÍCULOS ENCONTRADAS:", veiculosInfo)
              console.log("📊 QUANTIDADE ENCONTRADA:", veiculosInfo.length)
              
              // Verificar cada veículo individualmente
              nomesVeiculos.forEach(nome => {
                const encontrado = veiculosInfo.find(v => v.veiculo === nome)
                if (!encontrado) {
                  console.warn(`❌ VEÍCULO NÃO ENCONTRADO: "${nome}"`)
                  console.log(`🔍 Comparando com veículos disponíveis:`, veiculosInfo.map(v => `"${v.veiculo}"`))
                } else {
                  console.log(`✅ VEÍCULO ENCONTRADO: "${nome}" = R$ ${encontrado.rs_km}/km`)
                }
              })
              
              // Combinar dados e calcular custos
              const distanciaObra = obra.distancia_obra || 0
              const diasObra = obra.prazo_obra || 0
              
              veiculosDetalhados = veiculosObra.map(veiculo => {
                const veiculoInfo = veiculosInfo.find(v => v.veiculo === veiculo.veiculo)
                const rsKm = veiculoInfo?.rs_km || 0
                const quantidade = veiculo.quantidade || 1
                
                // Calcular custo: distância × 2 (ida e volta) × dias × quantidade × rs_km
                const custoTotal = distanciaObra * 2 * diasObra * quantidade * rsKm
                
                return {
                  veiculo: veiculo.veiculo,
                  tipo: veiculo.tipo || 'Não especificado',
                  quantidade: quantidade,
                  rs_km: rsKm,
                  distancia_obra: distanciaObra,
                  dias_obra: diasObra,
                  custo_total: custoTotal
                }
              })
              
              console.log("Veículos com custos calculados:", veiculosDetalhados)
            } else {
              console.error("❌ ERRO AO BUSCAR VEÍCULOS:", errorVeiculosInfo)
            }
          }
        } catch (error) {
          console.error("Erro ao buscar veículos da simulação:", error)
        }
      }

      console.log("Dados da obra encontrados:", obra)
      console.log("Tipo de reforço estrutural:", tipoReforcoEstruturalNome)
      console.log("Campos específicos da obra:")
      console.log("- tipo_reforco_estrutural_id:", obra.tipo_reforco_estrutural_id)
      console.log("- prazo_obra:", obra.prazo_obra)
      console.log("- area_total_metros_quadrados:", obra.area_total_metros_quadrados)
      console.log("- area_por_dia:", obra.area_por_dia)
      console.log("- area_por_hora:", obra.area_por_hora)
      console.log("- horas_inicio_concretagem:", obra.horas_inicio_concretagem)
      console.log("- horas_inicio_acabamento:", obra.horas_inicio_acabamento)
      console.log("- espessura_piso:", obra.espessura_piso)
      console.log("- dias_concretagem:", obra.dias_concretagem)
      console.log("- dias_acabamento:", obra.dias_acabamento)
      console.log("- hora_concretagem:", obra.hora_concretagem)
      console.log("- hora_acabamento:", obra.hora_acabamento)
      console.log("- final_concretagem:", obra.final_concretagem)
      console.log("- final_acabamento:", obra.final_acabamento)
      console.log("- sobreposicao_ca:", obra.sobreposicao_ca)
      console.log("- prazo_preparacao_obra:", obra.prazo_preparacao_obra)
      console.log("- prazo_finalizacao_obra:", obra.prazo_finalizacao_obra)

      // Calcular volume de concreto
      const volumeConcretoM3 = (obra.area_total_metros_quadrados || 0) * ((obra.espessura_piso || 0) / 100)

      // Usar o prazo_obra diretamente da tabela
      const diasTotais = obra.prazo_obra || 
        (obra.dias_concretagem || 0) +
        (obra.dias_acabamento || 0) +
        (obra.prazo_preparacao_obra || 0) +
        (obra.prazo_finalizacao_obra || 0)

      // Usar o custo da mão de obra salvo no banco de dados
      const custoTotalMaoObraSalvo = obra.custo_mao_obra || 0
      
      console.log("Custo da mão de obra do banco de dados:", custoTotalMaoObraSalvo)

      // Calcular custos de equipamentos a partir do JSONB
      let custoEquipamentos = 0
      let equipamentosSelecionados = []

      try {
        let equipamentos = obra.equipamentos_selecionados
        
        // Se for uma string, tentar fazer parse
        if (typeof equipamentos === 'string') {
          equipamentos = JSON.parse(equipamentos)
        }
        
        // Se for array, usar os dados
        if (Array.isArray(equipamentos)) {
          equipamentosSelecionados = equipamentos
        }
      } catch (error) {
        console.error("Erro ao processar equipamentos para cálculo:", error)
      }

      if (equipamentosSelecionados.length > 0) {
        custoEquipamentos = equipamentosSelecionados.reduce((total: number, equip: any) => {
          // Se já tem custo_total salvo, usar ele
          if (equip.custo_total) {
            return total + equip.custo_total
          }
          // Senão, calcular: valor_dia × quantidade × dias_totais
          const custoEquip = (equip.valor_dia || 0) * (equip.quantidade || 0) * diasTotais
          return total + custoEquip
        }, 0)

        console.log("Equipamentos encontrados:", equipamentosSelecionados)
        console.log("Custo total dos equipamentos:", custoEquipamentos)
      }

      console.log("Custos calculados:", {
        maoObra: `Custo total da mão de obra (salvo no banco): R$${custoTotalMaoObraSalvo}`,
        equipamentos: custoEquipamentos,
        veiculos: obra.custo_veiculos || 0
      })

      // Calcular os custos primeiro
      const custoMateriais = {
        concreto: volumeConcretoM3 * 350, // Preço estimado do concreto
        outros: (obra.area_total_metros_quadrados || 0) * 15, // Preço estimado outros materiais
        total: volumeConcretoM3 * 350 + (obra.area_total_metros_quadrados || 0) * 15 + (obra.valor_material || 0),
      }

      const custosFixos = {
        frete: obra.valor_frete || 0,
        hospedagem: obra.valor_hospedagem || 0,
        locacaoEquipamentos: custoEquipamentos, // Usar o valor calculado
        locacaoVeiculos: obra.valor_locacao_veiculos || 0,
        material: obra.valor_material || 0,
        passagem: obra.valor_passagem || 0,
        extra: obra.valor_extra || 0,
        total:
          (obra.valor_frete || 0) +
          (obra.valor_hospedagem || 0) +
          custoEquipamentos +
          (obra.valor_locacao_veiculos || 0) +
          (obra.valor_material || 0) +
          (obra.valor_passagem || 0) +
          (obra.valor_extra || 0),
      }

      // Calcular subtotal
      const subtotal = custoTotalMaoObraSalvo + custoEquipamentos + custoMateriais.total + custosFixos.total

      // Calcular valor total e lucro
      const precoVendaM2 = obra.preco_venda_metro_quadrado || 0
      const valorTotal = precoVendaM2 * (obra.area_total_metros_quadrados || 0)
      const lucroTotal = valorTotal - subtotal

      // Converter os dados da obra para o formato de resultado temporário
      const resultado = {
        custoMaoObra: {
          concretagem: 0, // Não temos breakdown individual, apenas total
          acabamento: 0,
          preparacao: 0,
          finalizacao: 0,
          total: custoTotalMaoObraSalvo,
        },
        custoEquipamentos: custoEquipamentos, // Agora calculado do JSONB
        custoMateriais: custoMateriais,
        custosFixos: custosFixos,
        precoVendaM2: precoVendaM2,
        valorTotal: valorTotal,
        lucroTotal: lucroTotal,
        volumeConcretoM3: volumeConcretoM3,
        diasTotais: diasTotais,
        subtotal: subtotal,
        valorComComissao: subtotal * (1 + (obra.percentual_comissao || 0) / 100),
        veiculosDetalhados: veiculosDetalhados // Adicionar veículos ao resultado
      }

      console.log("Resultado da simulação montado:", resultado)
      console.log("Tipo de equipamentos_selecionados:", typeof obra.equipamentos_selecionados)
      console.log("Valor de equipamentos_selecionados:", obra.equipamentos_selecionados)
      
      // Converter para o formato detalhado
      const resultadoDetalhado = adaptToDetailedFormat(
        resultado, 
        { ...obra, pessoasPreparacao }, 
        tipoReforcoEstruturalNome
      )
      setSimulationResult(resultadoDetalhado)
      setShowResults(true)
    } catch (error) {
      console.error("Erro ao visualizar simulação:", error)
    } finally {
      setLoadingView(false)
    }
  }

  const hasFilters = searchTerm !== "" || statusFilter !== "todos" || periodoFilter !== "todos"

  return (
    <div className="container mx-auto py-6 font-family: Roboto;">
      <SimulacaoHeader simulacoes={simulacoes} />

      <Tabs defaultValue="simulacoes" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid w-auto grid-cols-3">
            <TabsTrigger value="simulacoes">Simulações</TabsTrigger>
            <TabsTrigger value="veiculos">Veículos da Obra</TabsTrigger>
            <TabsTrigger value="equipamentos">Equipamentos da Obra</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Link href="/simulacao/nova">
              <Button className="flex items-center gap-2 bg-[#007EA3] hover:bg-[#006a8a] text-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
                <PlusCircle className="h-4 w-4" />
                Nova Simulação
              </Button>
            </Link>
          </div>
        </div>

        <TabsContent value="simulacoes" className="space-y-6">
          <SimulacaoFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            periodoFilter={periodoFilter}
            setPeriodoFilter={setPeriodoFilter}
          />
          <SimulacaoTable
            simulacoes={simulacoesFiltradas}
            loading={loading}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onViewSimulation={handleViewSimulation}
            onNovaSimulacao={() => {}}
            onClearFilters={clearFilters}
            hasFilters={hasFilters}
          />
        </TabsContent>

        <TabsContent value="veiculos" className="space-y-6">
          <VeiculosObra />
        </TabsContent>

        <TabsContent value="equipamentos" className="space-y-6">
          <EquipamentosObra />
        </TabsContent>
      </Tabs>

      {/* Dialog para exibir resultados */}
      <Dialog
        open={showResults}
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(() => {
              if (!showResults) {
                setSimulationResult(null)
              }
            }, 300)
          }
          setShowResults(open)
        }}
      >
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto" forceMount>
          <div className="w-full flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Resultados da Simulação</h2>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 rounded-full"
              aria-label="Fechar"
              onClick={() => setShowResults(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {loadingView ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007EA3]"></div>
              <p className="mt-4 text-gray-500">Carregando dados da simulação...</p>
            </div>
          ) : simulationResult ? (
            <SimulationResult data={simulationResult} onVoltar={() => setShowResults(false)} />
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-yellow-100 p-3 rounded-full mb-4">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Nenhuma simulação selecionada</h3>
              <p className="text-gray-500 text-center mb-4">Ocorreu um erro ao carregar os dados da simulação.</p>
              <Button
                variant="outline"
                onClick={() => setShowResults(false)}
                className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              >
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        simulacao={simulacaoParaExcluir}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
