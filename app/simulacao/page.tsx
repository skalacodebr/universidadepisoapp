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
import type { SimulacaoResult as SimulacaoResultType } from "@/lib/simulacao-calculator"
import type { SimulacaoItem } from "./hooks/useSimulacoes"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"

// Revenue ranges for the select input
const revenueRanges = [
  { value: "0-180000", label: "R$ 0,00 - R$ 180.000,00" },
  { value: "180000.01-360000", label: "R$ 180.000,01 - R$ 360.000,00" },
  { value: "360000.01-540000", label: "R$ 360.000,01 - R$ 540.000,00" },
  { value: "540000.01-720000", label: "R$ 540.000,01 - R$ 720.000,00" },
  { value: "720000.01-900000", label: "R$ 720.000,01 - R$ 900.000,00" },
  { value: "900000.01-1080000", label: "R$ 900.000,01 - R$ 1.080.000,00" },
  { value: "1080000.01-1260000", label: "R$ 1.080.000,01 - R$ 1.260.000,00" },
  { value: "1260000.01-1440000", label: "R$ 1.260.000,01 - R$ 1.440.000,00" },
  { value: "1440000.01-1620000", label: "R$ 1.440.000,01 - R$ 1.620.000,00" },
  { value: "1620000.01-1800000", label: "R$ 1.620.000,01 - R$ 1.800.000,00" },
  { value: "1800000.01-1980000", label: "R$ 1.800.000,01 - R$ 1.980.000,00" },
  { value: "1980000.01-2160000", label: "R$ 1.980.000,01 - R$ 2.160.000,00" },
  { value: "2160000.01-2340000", label: "R$ 2.160.000,01 - R$ 2.340.000,00" },
  { value: "2340000.01-2520000", label: "R$ 2.340.000,01 - R$ 2.520.000,00" },
  { value: "2520000.01-2700000", label: "R$ 2.520.000,01 - R$ 2.700.000,00" },
  { value: "2700000.01-2880000", label: "R$ 2.700.000,01 - R$ 2.880.000,00" },
  { value: "2880000.01-3060000", label: "R$ 2.880.000,01 - R$ 3.060.000,00" },
  { value: "3060000.01-3240000", label: "R$ 3.060.000,01 - R$ 3.240.000,00" },
  { value: "3240000.01-3420000", label: "R$ 3.240.000,01 - R$ 3.420.000,00" },
  { value: "3420000.01-3600000", label: "R$ 3.420.000,01 - R$ 3.600.000,00" },
]

// Função adaptadora para converter formato antigo para novo formato detalhado
function adaptToDetailedFormat(oldResult: any, obra: any, tipoReforcoEstruturalNome: string = 'N/A'): SimulacaoResultType {
  console.log('=== ADAPTADOR CHAMADO ===', {
    obraId: obra.id,
    temVeiculosSelecionados: !!obra.veiculos_selecionados,
    custoVeiculos: obra.custo_veiculos
  });
  
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
      preparoDiaSeguinte: Math.max(0, 19 - 17) // Calcula baseado no final do acabamento (19h) - 17h
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
      veiculos: (() => {
        try {
          console.log('=== DEBUG VEÍCULOS NA VISUALIZAÇÃO ===', {
            veiculos_selecionados_raw: obra.veiculos_selecionados,
            tipo: typeof obra.veiculos_selecionados,
            custo_veiculos: obra.custo_veiculos,
            obra_id: obra.id,
            obraCompleta: obra
          });
          
          let veiculos = obra.veiculos_selecionados;
          
          // Se for uma string, tentar fazer parse
          if (typeof veiculos === 'string') {
            veiculos = JSON.parse(veiculos);
          }
          
          // Se não for array ou estiver vazio
          if (!Array.isArray(veiculos) || veiculos.length === 0) {
            console.log('Veículos não encontrados em veiculos_selecionados');
            return [];
          }
          
          // Calcular detalhes para cada veículo
          const distanciaObra = obra.distancia_obra || 0;
          const diasObra = (obra.prazo_obra || 0) + (obra.prazo_preparacao_obra || 0) + (obra.prazo_finalizacao_obra || 0);
          
          console.log('Processando veículos salvos:', veiculos);
          
          return veiculos.map((v: any) => {
            // Os veículos já têm o rs_km salvo, só precisamos calcular o custo se não existir
            const rs_km = v.rs_km || 0;
            const quantidade = v.quantidade || 1;
            const custo_total = rs_km * distanciaObra * 2 * diasObra * quantidade;
            
            const veiculoProcessado = {
              veiculo: v.veiculo || 'Veículo',
              tipo: v.tipo || 'GERAL',
              quantidade: quantidade,
              rs_km: rs_km,
              distancia_obra: distanciaObra,
              dias_obra: diasObra,
              custo_total: custo_total
            };
            
            console.log('Veículo processado:', veiculoProcessado);
            return veiculoProcessado;
          });
        } catch (error) {
          console.error('Erro ao processar veículos:', error);
          return [];
        }
      })(),
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
      totalOutrosCustos: (obra.valor_frete || 0) + 
                        (obra.valor_hospedagem || 0) + 
                        (obra.valor_locacao_equipamento || 0) + 
                        (obra.valor_locacao_veiculos || 0) + 
                        (obra.valor_material || 0) + 
                        (obra.valor_passagem || 0) + 
                        (obra.valor_extra || 0),
      totalM2: obra.area_total_metros_quadrados ? ((obra.valor_frete || 0) + 
                                                  (obra.valor_hospedagem || 0) + 
                                                  (obra.valor_locacao_equipamento || 0) + 
                                                  (obra.valor_locacao_veiculos || 0) + 
                                                  (obra.valor_material || 0) + 
                                                  (obra.valor_passagem || 0) + 
                                                  (obra.valor_extra || 0)) / obra.area_total_metros_quadrados : 0,
      frete: obra.valor_frete || 0,
      hospedagem: obra.valor_hospedagem || 0,
      locacaoEquipamento: obra.valor_locacao_equipamento || 0,
      locacaoVeiculo: obra.valor_locacao_veiculos || 0,
      material: obra.valor_material || 0,
      passagem: obra.valor_passagem || 0,
      extra: obra.valor_extra || 0
    },
    precoVenda: {
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
  const { user } = useAuth()
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
  const [selectedRevenueRange, setSelectedRevenueRange] = useState<string>("")
  const [custoFixoError, setCustoFixoError] = useState<string>("")

  // Load existing revenue data when component mounts
  useEffect(() => {
    const loadExistingRevenue = async () => {
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from('custofixo_usuario')
          .select('faturamento_12, total')
          .eq('userid', user.id)
          .order('created_at', { ascending: false })
          .limit(1)

        if (error) {
          console.error('Erro ao carregar faturamento existente:', error)
          setCustoFixoError('Erro ao carregar dados do custo fixo')
          return
        }

        if (data && data.length > 0) {
          if (data[0].faturamento_12) {
            setSelectedRevenueRange(data[0].faturamento_12)
          }
          setCustoFixoError("") // Clear any previous errors
        } else {
          setCustoFixoError('Você precisa configurar seus custos fixos antes de usar as simulações. Acesse a página de Custo Fixo.')
        }
      } catch (error) {
        console.error('Erro ao carregar faturamento:', error)
        setCustoFixoError('Erro ao carregar dados do custo fixo')
      }
    }

    loadExistingRevenue()
  }, [user?.id])

  // Save revenue when selection changes
  const handleRevenueChange = async (value: string) => {
    setSelectedRevenueRange(value)
    
    if (!user?.id) return

    try {
      // Check if user already has a record
      const { data: existingData, error: checkError } = await supabase
        .from('custofixo_usuario')
        .select('id')
        .eq('userid', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (checkError) {
        console.error('Erro ao verificar registro existente:', checkError)
        setCustoFixoError('Erro ao verificar dados do custo fixo')
        return
      }

      if (existingData && existingData.length > 0) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('custofixo_usuario')
          .update({ faturamento_12: value })
          .eq('id', existingData[0].id)

        if (updateError) {
          console.error('Erro ao atualizar faturamento:', updateError)
          setCustoFixoError('Erro ao salvar faturamento')
        } else {
          setCustoFixoError("") // Clear error on success
        }
      } else {
        // Create new record with only faturamento_12
        const { error: insertError } = await supabase
          .from('custofixo_usuario')
          .insert({
            userid: user.id,
            faturamento_12: value,
            total: 0 // Default value for other required fields
          })

        if (insertError) {
          console.error('Erro ao criar registro de faturamento:', insertError)
          setCustoFixoError('Erro ao salvar faturamento')
        } else {
          setCustoFixoError("") // Clear error on success
        }
      }
    } catch (error) {
      console.error('Erro ao salvar faturamento:', error)
      setCustoFixoError('Erro ao salvar faturamento')
    }
  }

  const handleEdit = async (id: number) => {
    // TODO: Implementar edição
    console.log("Editar simulação:", id)
  }

  const handleRefazer = async (id: number) => {
    // Redirecionar para nova simulação com dados da simulação existente
    window.location.href = `/simulacao/nova?refazer=${id}`
  }

  const handleAjustarPreco = async (id: number) => {
    console.log("Ajustando preço da simulação", id)
    window.location.href = `/simulacao/ajustar-preco?id=${id}`
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

  const handleViewSimulation = async (simulacaoId: number) => {
    try {
      console.log("Visualizando simulação ID:", simulacaoId)
      setLoadingView(true)

      // Buscar os dados da simulação no banco
      const { data: obra, error } = await supabase.from("obras").select("*").eq("id", simulacaoId).eq("simulacao", true).single()

      if (error) {
        console.error("Erro ao buscar simulação:", error)
        return
      }

      if (!obra) {
        console.error("Simulação não encontrada")
        return
      }

      // Buscar custos fixos do usuário
      console.log('🔍 Buscando custos fixos para o usuário:', obra.usuarios_id)
      const { data: custosFixosData, error: custosFixosError } = await supabase
        .from('custofixo_usuario')
        .select('*')
        .eq('userid', obra.usuarios_id)
        .order('created_at', { ascending: false })
        .limit(1)
      
      // Buscar tabela de alíquotas do Simples
      const { data: simplesData, error: simplesError } = await supabase
        .from('simples_brackets')
        .select('*')
        .order('faturamento_ate', { ascending: true })

      console.log('📊 Resposta da busca de custos fixos:', {
        success: !custosFixosError,
        error: custosFixosError?.message,
        recordCount: custosFixosData?.length || 0,
        firstRecord: custosFixosData?.[0] ? {
          id: custosFixosData[0].id,
          userid: custosFixosData[0].userid,
          total: custosFixosData[0].total,
          created_at: custosFixosData[0].created_at
        } : 'Nenhum registro encontrado'
      })

      const custosFixosEmpresa = custosFixosData?.[0]
      const despesasFixasEmpresa = custosFixosEmpresa ? Number(custosFixosEmpresa.total) || 0 : 10000
      
      // Calcular alíquota baseada no faturamento
      let faturamentoMaximo = 360000 // valor padrão
      let aliquotaSimples = 6.54 // valor padrão
      
      if (custosFixosEmpresa?.faturamento_12) {
        const faixa = custosFixosEmpresa.faturamento_12
        const valorMaximo = faixa.split('-')[1]
        faturamentoMaximo = parseFloat(valorMaximo) || 360000
        
        // Encontrar a alíquota correspondente
        if (simplesData && simplesData.length > 0) {
          const bracket = simplesData.find(s => parseFloat(s.faturamento_ate) === faturamentoMaximo)
          if (bracket) {
            aliquotaSimples = bracket.aliquota
          } else {
            // Se não encontrar exato, pegar por aproximação
            const bracketAprox = simplesData.find(s => parseFloat(s.faturamento_ate) >= faturamentoMaximo)
            if (bracketAprox) {
              aliquotaSimples = bracketAprox.aliquota
            }
          }
        }
      }
      
      console.log('💰 Faturamento e alíquota calculados:', {
        faturamento12: custosFixosEmpresa?.faturamento_12,
        faturamentoMaximo,
        aliquotaSimples
      })

      // Buscar o número de pessoas da equipe de preparação
      const pessoasPreparacao = obra.equipe_preparacao || 0

      // Buscar custo da mão de obra
      const custoPorPessoa = 1373.47;
      const prazoObra = obra.prazo_obra || 0;
      const prazoPreparacao = obra.prazo_preparacao_obra || 0;
      const prazoFinalizacao = obra.prazo_finalizacao_obra || 0;

      // Buscar quantidades das equipes
      const { data: equipesConcretagem } = await supabase
        .from('equipes_concretagem')
        .select('qtd_pessoas')
        .eq('id', obra.equipes_concretagem_id)
        .single();

      const { data: equipesAcabamento } = await supabase
        .from('equipes_acabamento')
        .select('qtd_pessoas')
        .eq('id', obra.equipes_acabamento_id)
        .single();

      const { data: equipesPreparacao } = await supabase
        .from('equipes_preparacao')
        .select('qtd_pessoas')
        .eq('id', obra.equipes_preparacao_id)
        .single();

      const { data: equipesFinalizacao } = await supabase
        .from('equipes_acabamento') // Finalization uses same team as finishing
        .select('qtd_pessoas')
        .eq('id', obra.equipes_finalizacao_id)
        .single();

      const equipeConcretagemQtd = equipesConcretagem?.qtd_pessoas || 0;
      const equipeAcabamentoQtd = equipesAcabamento?.qtd_pessoas || 0;
      const equipePreparacaoQtd = equipesPreparacao?.qtd_pessoas || 0;
      const equipeFinalizacaoQtd = equipesFinalizacao?.qtd_pessoas || equipeAcabamentoQtd;

      // Calcular custos específicos de cada equipe usando prazos salvos ou prazoObra como fallback
      const prazoConcretagem = obra.prazo_concretagem || prazoObra;
      const prazoAcabamento = obra.prazo_acabamento || prazoObra;
      const custoEquipeConcretagem = equipeConcretagemQtd * custoPorPessoa * prazoConcretagem;
      const custoEquipeAcabamento = equipeAcabamentoQtd * custoPorPessoa * prazoAcabamento;
      const custoEquipePreparacao = obra.custo_preparacao || (equipePreparacaoQtd * custoPorPessoa * prazoPreparacao);
      const custoEquipeFinalizacao = obra.custo_finalizacao || (equipeFinalizacaoQtd * custoPorPessoa * prazoFinalizacao);

      // Custos de horas extras
      const custoHorasExtraConcretagem = obra.custo_horas_extra_concretagem || 0;
      const custoHorasExtraAcabamento = obra.custo_horas_extra_acabamento || 0;
      const custoTotalHorasExtras = obra.custo_total_horas_extras || (custoHorasExtraConcretagem + custoHorasExtraAcabamento);

      const custoTotalMaoObraSalvo = custoEquipeConcretagem + custoEquipeAcabamento + custoEquipePreparacao + custoEquipeFinalizacao + custoTotalHorasExtras;

      console.log("Custos de mão de obra:", {
        equipeConcretagemQtd,
        equipeAcabamentoQtd,
        equipePreparacaoQtd,
        equipeFinalizacaoQtd,
        custoEquipeConcretagem,
        custoEquipeAcabamento,
        custoEquipePreparacao,
        custoEquipeFinalizacao,
        custoHorasExtraConcretagem,
        custoHorasExtraAcabamento,
        custoTotalHorasExtras,
        custoTotalMaoObraSalvo
      });

      // Processar equipamentos
      let equipamentosSelecionados = obra.equipamentos_selecionados;
      if (typeof equipamentosSelecionados === 'string') {
        try {
          equipamentosSelecionados = JSON.parse(equipamentosSelecionados);
        } catch (e) {
          console.error('Erro ao fazer parse dos equipamentos:', e);
          equipamentosSelecionados = [];
        }
      }

      // Usar custo de equipamentos já calculado se disponível
      const custoEquipamentos = obra.custo_equipamentos || equipamentosSelecionados.reduce((total: number, equip: any) => {
        const valorDia = parseFloat(equip.valor_dia) || 0;
        const quantidade = parseInt(equip.quantidade) || 0;
        const dias = prazoObra || 0;
        return total + (valorDia * quantidade * dias);
      }, 0);

      console.log("Custos de equipamentos:", {
        equipamentosSelecionados,
        custoEquipamentos
      });

      // Calcular custos fixos adicionais
      const custosFixosAdicionais = {
        frete: obra.valor_frete || 0,
        hospedagem: obra.valor_hospedagem || 0,
        locacaoEquipamentos: obra.valor_locacao_equipamento || 0,
        locacaoVeiculos: obra.valor_locacao_veiculos || 0,
        material: obra.valor_material || 0,
        passagem: obra.valor_passagem || 0,
        extra: obra.valor_extra || 0,
        total: (obra.valor_frete || 0) +
          (obra.valor_hospedagem || 0) +
          (obra.valor_locacao_equipamento || 0) +
          (obra.valor_locacao_veiculos || 0) +
          (obra.valor_material || 0) +
          (obra.valor_passagem || 0) +
               (obra.valor_extra || 0)
      };

      console.log("🔧 Debug custosFixosAdicionais:", custosFixosAdicionais);

      // Calcular subtotal
      const custoExecucao = custoTotalMaoObraSalvo + 
                           custoEquipamentos + 
                           (obra.custo_veiculos || 0) + 
                           custosFixosAdicionais.total

      // Calcular valor total e lucro
      const valorTotal = (obra.preco_venda_metro_quadrado || 0) * (obra.area_total_metros_quadrados || 0)
      const lucroTotal = valorTotal - custoExecucao

      // Buscar nome do tipo de acabamento
      let tipoAcabamentoData = null;
      let valorInsumosPorM2 = 0;

      if (obra.tipo_acabamento_id) {
        const { data, error } = await supabase
          .from('tipo_acabamento')
          .select('*')
          .eq('id', obra.tipo_acabamento_id)
          .single();
        
        if (!error && data) {
          tipoAcabamentoData = data;
          // Definir valor dos insumos baseado no tipo de acabamento
          switch (data.nome) {
            case 'Liso Polido':
              valorInsumosPorM2 = 0.32;
              break;
            case 'Camurçado':
              valorInsumosPorM2 = 0.20;
              break;
            case 'Vassourado':
              valorInsumosPorM2 = 0.12;
              break;
            default:
              valorInsumosPorM2 = 0;
          }
        }
      }

      console.log("Tipo de acabamento encontrado:", tipoAcabamentoData);
      console.log("Valor dos insumos por m²:", { tipoAcabamento: tipoAcabamentoData?.nome, valorPorM2: valorInsumosPorM2 });
      const custoTotalInsumos = valorInsumosPorM2 * (obra.area_total_metros_quadrados || 0)

      // Debug: verificar valores da obra
      console.log("Valores da obra:", {
        id: obra.id,
        nome: obra.nome,
        created_at: obra.created_at,
        area_por_dia: obra.area_por_dia,
        prazo_obra: obra.prazo_obra,
        area_total_metros_quadrados: obra.area_total_metros_quadrados,
        custo_locacao_equipamento: obra.custo_locacao_equipamento,
        valor_locacao_equipamento: obra.valor_locacao_equipamento
      });

      // Montar resultado da simulação
      const resultado: SimulacaoResultType = {
        dadosTecnicos: {
          reforcoEstrutural: obra.tipo_reforco_estrutural_id?.toString() || "",
          areaTotal: obra.area_total_metros_quadrados || 0,
          areaPorDia: obra.area_por_dia || 0,
          prazoTotal: obra.prazo_obra || 0,
          espessura: (obra.espessura_piso || 0) / 100,
          lancamento: obra.lancamento_concreto || 0,
          areaConcretaPorHora: obra.area_por_hora || 0,
          inicioConcretagem: obra.horas_inicio_concretagem || "",
          inicioAcabamento: obra.horas_inicio_acabamento || "",
          finalAcabamento: obra.final_acabamento || "",
          horasConcretagem: obra.hora_concretagem || 0,
          horasAcabamento: obra.hora_acabamento || 0,
          sobreposicaoCA: obra.sobreposicao_ca || 0,
          concreto: (obra.area_total_metros_quadrados || 0) * ((obra.espessura_piso || 0) / 100),
          finalConcretagem: obra.final_concretagem || "",
          preparoDiaSeguinte: Math.max(0, 19 - 17) // Calcula baseado no final do acabamento (19h) - 17h
        },
        equipeConcretagemAcabamento: {
          equipeTotal: equipeConcretagemQtd + equipeAcabamentoQtd,
          custoEquipe: custoEquipeConcretagem + custoEquipeAcabamento, // Usar valores calculados das equipes específicas
          equipeConcretagem: equipeConcretagemQtd,
          horasExtraEquipeConcretagem: obra.horas_extra_concretagem || 0,
          custoHEEquipeConcretagem: obra.custo_horas_extra_concretagem || 0,
          horaExtraEquipeAcabamento: obra.horas_extra_acabamento || 0,
          equipeAcabamento: equipeAcabamentoQtd,
          custoHEAcabamento: obra.custo_horas_extra_acabamento || 0,
          totalEquipe: obra.custo_mao_obra || 0, // Total de toda a mão de obra (já calculado e salvo)
          percentualTotalEquipe: valorTotal > 0 ? ((obra.custo_mao_obra || 0) / valorTotal) * 100 : 0
        },
        preparacaoObra: {
          equipeTotal: equipePreparacaoQtd,
          prazo: prazoPreparacao,
          custoPreparacao: obra.custo_preparacao || 0, // Usar valor do banco
          totalEquipe: obra.custo_preparacao || 0,
          percentualTotalEquipe: valorTotal > 0 ? ((obra.custo_preparacao || 0) / valorTotal) * 100 : 0
        },
        finalizacaoObra: {
          equipeTotal: equipeFinalizacaoQtd,
          prazo: prazoFinalizacao,
          custoFinalizacao: obra.custo_finalizacao || 0, // Usar valor do banco
          totalEquipe: obra.custo_mao_obra || 0, // Total de toda a mão de obra
          percentualTotalEquipe: valorTotal > 0 ? ((obra.custo_mao_obra || 0) / valorTotal) * 100 : 0
        },
        equipamentos: {
          equipamentos: equipamentosSelecionados,
          totalEquipamentos: obra.custo_equipamentos || 0, // Usar valor do banco
          percentualTotalEquipamentos: valorTotal > 0 ? ((obra.custo_equipamentos || 0) / valorTotal) * 100 : 0,
          quantidadeEquipamentos: equipamentosSelecionados.reduce((total: number, equip: any) => total + (equip.quantidade || 0), 0)
        },
        veiculos: {
          veiculos: [], // Usar dados dos veículos do banco se necessário
          totalVeiculos: obra.custo_veiculos || 0, // Usar valor do banco
          percentualTotalVeiculos: valorTotal > 0 ? ((obra.custo_veiculos || 0) / valorTotal) * 100 : 0
        },
        insumos: {
          tipoAcabamento: tipoAcabamentoData?.nome || "",
          area: obra.area_total_metros_quadrados || 0,
          dias: obra.prazo_obra || 0,
          valorPorM2: valorInsumosPorM2,
          totalInsumos: valorInsumosPorM2 * (obra.area_total_metros_quadrados || 0),
          percentualTotalInsumos: valorTotal > 0 ? ((valorInsumosPorM2 * (obra.area_total_metros_quadrados || 0)) / valorTotal) * 100 : 0
        },
        demaisDespesasFixas: {
          valorEmpresaPorM2: custosFixosEmpresa?.media_final || 0, // Usar media_final da tabela
          valorTotalPorM2: obra.area_total_metros_quadrados > 0 ? (custoExecucao + despesasFixasEmpresa) / obra.area_total_metros_quadrados : 0,
          areaTotalObra: obra.area_total_metros_quadrados || 0,
          despesasFixas: despesasFixasEmpresa,
          percentualDespesasFixas: (custoExecucao + despesasFixasEmpresa) > 0 ? (despesasFixasEmpresa / (custoExecucao + despesasFixasEmpresa)) * 100 : 0,
          custoExecucao: custoExecucao,
          percentualCustoExecucao: (custoExecucao + despesasFixasEmpresa) > 0 ? (custoExecucao / (custoExecucao + despesasFixasEmpresa)) * 100 : 0,
          // Adicionar campos específicos dos custos fixos
          totalCustosFixos: custosFixosEmpresa?.total || 0,
          mediaMes: custosFixosEmpresa?.media_mes || 0,
          mediaFinal: custosFixosEmpresa?.media_final || 0,
          // Custo total usado na fórmula do preço de venda
          custoTotalObra: obra.custo_total_obra || (custoExecucao + despesasFixasEmpresa)
        },
        custoDerivadosVenda: {
          faturamento12Meses: faturamentoMaximo,
          percentualFaturamento: 100,
          impostoSimples: (obra.valor_total || 0) * (aliquotaSimples / 100),
          percentualImpostoSimples: aliquotaSimples,
          margemLucro: obra.lucro_total || 0,
          percentualMargemLucro: obra.percentual_lucro_desejado || 25,
          comissoes: (obra.valor_total || 0) * ((obra.percentual_comissao || 0) / 100),
          percentualComissoes: obra.percentual_comissao || 0
        },
        outrosCustos: {
          totalOutrosCustos: custosFixosAdicionais.total,
          totalM2: custosFixosAdicionais.total / (obra.area_total_metros_quadrados || 1),
          frete: custosFixosAdicionais.frete,
          hospedagem: custosFixosAdicionais.hospedagem,
          locacaoEquipamento: custosFixosAdicionais.locacaoEquipamentos,
          locacaoVeiculo: custosFixosAdicionais.locacaoVeiculos,
          material: custosFixosAdicionais.material,
          passagem: custosFixosAdicionais.passagem,
          extra: custosFixosAdicionais.extra
        },
        precoVenda: {
          precoVendaPorM2: obra.preco_venda_metro_quadrado_calculo || obra.preco_venda_metro_quadrado || 0, // Preço calculado pela fórmula
          sePrecoVendaPorM2For: obra.preco_venda_metro_quadrado || 0, // Valor manual inserido pelo usuário
          valorTotal: obra.valor_total || 0, // Usar valor total do banco
          resultado1: obra.lucro_total || 0, // Usar lucro total do banco
          resultadoPercentual: (obra.valor_total && obra.lucro_total) ? (obra.lucro_total / obra.valor_total) * 100 : 0
        },
        valorTotal: obra.valor_total || 0, // Usar valor total do banco
        precoVendaM2: obra.preco_venda_metro_quadrado_calculo || obra.preco_venda_metro_quadrado || 0,
        lucroTotal: obra.lucro_total || 0, // Usar lucro total do banco
        custoEquipamentos: obra.custo_equipamentos || 0, // Usar valor do banco
        custoVeiculos: obra.custo_veiculos || 0, // Usar valor do banco
        diasTotais: obra.prazo_obra || 0,
        volumeConcretoM3: (obra.area_total_metros_quadrados || 0) * ((obra.espessura_piso || 0) / 100)
      }

      console.log("Resultado da simulação montado:", resultado)
      console.log("Tipo de equipamentos_selecionados:", typeof equipamentosSelecionados)
      console.log("Valor de equipamentos_selecionados:", equipamentosSelecionados)

      setSimulationResult(resultado)
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

      {/* Revenue Input Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Faturamento da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Label htmlFor="revenue-range" className="text-sm font-medium">
              Faturamento dos últimos 12 meses
            </Label>
            <Select value={selectedRevenueRange} onValueChange={handleRevenueChange}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione o faturamento" />
              </SelectTrigger>
              <SelectContent>
                {revenueRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {custoFixoError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{custoFixoError}</p>
                {custoFixoError.includes('configurar seus custos fixos') && (
                  <Link href="/custo-fixo" className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800 underline">
                    Ir para Custo Fixo
                  </Link>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
            onRefazer={handleRefazer}
            onAjustarPreco={handleAjustarPreco}
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
            <SimulationResult
              data={simulationResult}
              onVoltar={() => setShowResults(false)}
            />
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
