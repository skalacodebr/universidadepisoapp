'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'

// Tipagens
interface Equipe { id: number; nome: string; qtd_pessoas: number }
interface Equipamento { id: number; nome: string; valor_dia: number }
interface EquipamentoSelecionado { id: number; nome: string; quantidade: number; selecionado: boolean }
interface EquipamentoComCusto { 
  id: number; 
  nome: string; 
  quantidade: number; 
  valor_dia: number; 
  dias_obra: number; 
  custo_total: number; 
  selecionado: boolean 
}
interface TipoAcabamento { id: number; nome: string; area500: number; area1000: number; area1500: number; area2000mais: number }
interface SimplesBracket { faturamento_ate: number; aliquota: number }

interface VeiculoObra {
  id: number
  userid: number
  veiculo: string
  tipo?: string
  quantidade?: number
  created_at: string
}

interface VeiculoDisponivel {
  id: number
  veiculo: string
  rs_km: number
  created_at: string
}

interface VeiculoComCusto {
  veiculo: string
  tipo: string
  quantidade: number
  rs_km: number
  distancia_obra: number
  dias_obra: number
  custo_total: number
}

interface Veiculos {
  veiculos: VeiculoComCusto[]
  totalVeiculos: number
  percentualTotalVeiculos: number
}

export interface SimulacaoFormData {
  // Gerais
  nomeObra: string
  construtora: string
  endereco: string
  nomeContato: string
  telefoneContato: string
  reforcoEstrutural: string
  areaTotal: string
  areaPorDia: string
  previsaoInicio: Date | null
  tipoAcabamento: string
  espessura: string
  distanciaObra: string
  lancamentoConcreto: string
  prazoObra: string

  // Equipes e prazos
  inicioHora: string
  equipePreparacao: string
  prazoPreparacao: string
  equipeConcretagem: string
  prazoConcretagem: string
  equipeAcabamento: string
  prazoAcabamento: string
  prazoFinalizacao: string

  // Equipamentos
  equipamentosSelecionados: EquipamentoSelecionado[]

  // Custos diversos
  frete: string
  hospedagem: string
  locacaoEquipamento: string
  locacaoVeiculo: string
  material: string
  passagem: string
  extra: string

  // Comissão e lucro
  comissao: string  // % sobre venda
  precoVenda: string // R$/m²
  lucroDesejado: string // %
}

// Tipagens para o resultado detalhado da simulação
export interface DadosTecnicos {
  reforcoEstrutural: string
  areaTotal: number
  areaPorDia: number
  prazoTotal: number
  espessura: number
  lancamento: number
  areaConcretaPorHora: number
  inicioConcretagem: string
  inicioAcabamento: string
  finalAcabamento: string
  horasConcretagem: number
  horasAcabamento: number
  sobreposicaoCA: number
  concreto: number
  finalConcretagem: string
  preparoDiaSeguinte: number
}

export interface EquipeConcretagemAcabamento {
  equipeTotal: number
  custoEquipe: number
  equipeConcretagem: number
  horasExtraEquipeConcretagem: number
  custoHEEquipeConcretagem: number
  horaExtraEquipeAcabamento: number
  equipeAcabamento: number
  custoHEAcabamento: number
  totalEquipe: number
  percentualTotalEquipe: number
}

export interface PreparacaoObra {
  equipeTotal: number
  prazo: number
  custoPreparacao: number
  totalEquipe: number
  percentualTotalEquipe: number
}

export interface EquipamentoDetalhado {
  nome: string
  valorDia: number
  dias: number
  quantidade: number
  total: number
}

export interface Equipamentos {
  equipamentos: EquipamentoDetalhado[]
  totalEquipamentos: number
  percentualTotalEquipamentos: number
  quantidadeEquipamentos: number
}

export interface Insumos {
  tipoAcabamento: string
  area: number
  dias: number
  valorPorM2: number
  totalInsumos: number
  percentualTotalInsumos: number
}

export interface DemaisDespesasFixas {
  valorEmpresaPorM2: number
  valorTotalPorM2: number
  areaTotalObra: number
  despesasFixas: number
  percentualDespesasFixas: number
  custoExecucao: number
  percentualCustoExecucao: number
}

export interface CustoDerivadosVenda {
  faturamento12Meses: number
  percentualFaturamento: number
  impostoSimples: number
  percentualImpostoSimples: number
  margemLucro: number
  percentualMargemLucro: number
  comissoes: number
  percentualComissoes: number
}

export interface OutrosCustos {
  totalOutrosCustos: number
  totalM2: number
}

export interface PrecoVenda {
  precoVenda: number
  precoVendaPorM2: number
  sePrecoVendaPorM2For: number
  valorTotal: number
  resultado1: number
  resultadoPercentual: number
}

export interface SimulacaoResult {
  dadosTecnicos: DadosTecnicos
  equipeConcretagemAcabamento: EquipeConcretagemAcabamento
  preparacaoObra: PreparacaoObra
  equipamentos: Equipamentos
  veiculos: Veiculos
  insumos: Insumos
  demaisDespesasFixas: DemaisDespesasFixas
  custoDerivadosVenda: CustoDerivadosVenda
  outrosCustos: OutrosCustos
  precoVenda: PrecoVenda
  
  // Campos de compatibilidade com o componente atual
  valorTotal: number
  precoVendaM2: number
  lucroTotal: number
  custoMaoObra?: any
  custoMateriais?: any
  custosFixos?: any
  volumeConcretoM3?: number
  diasTotais?: number
  custoEquipamentos?: number
  custoVeiculos?: number
}

// Funções auxiliares
function addHoursToTime(time: string, add: number): string {
  const [h,m] = time.split(':').map(n=>parseInt(n,10))
  const date = new Date()
  date.setHours(h+add, m)
  return date.toTimeString().slice(0,5)
}

function calcularSobreposicaoCA(inicio: string, horasConc: number, inicioAcab: string): number {
  const [h1,m1] = inicio.split(':').map(n=>parseInt(n,10))
  const [h2,m2] = inicioAcab.split(':').map(n=>parseInt(n,10))
  const fim = h1*60+m1 + horasConc*60
  const iniA = h2*60+m2
  return Math.round((fim - iniA)/60)
}

// Função para processar simulação
export async function processarSimulacao(formData: SimulacaoFormData, userId: string): Promise<SimulacaoResult> {
  console.log("Iniciando processamento da simulação para usuário:", userId)
  
  // Conversões básicas
  const areaTotalNum = parseFloat(formData.areaTotal) || 0
  const areaDiaNum = parseFloat(formData.areaPorDia) || 0
  const espessura = parseFloat(formData.espessura) || 0
  const lancamento = parseFloat(formData.lancamentoConcreto) || 0
  const diasObra = areaDiaNum > 0 ? Math.ceil(areaTotalNum / areaDiaNum) : 0
  
  console.log("Valores básicos:", { areaTotalNum, areaDiaNum, espessura, lancamento, diasObra })
  
  // CÁLCULOS AUTOMÁTICOS DOS HORÁRIOS
  const inicioHora = formData.inicioHora || '08:00'
  
  // 1. Início do acabamento = 5 horas depois do início da concretagem
  const inicioAcabamento = addHoursToTime(inicioHora, 5)
  
  // 2. Área de concreto por hora = lancamento / (espessura em metros)
  const espessuraMetros = espessura / 100
  const areaConcretaPorHora = espessuraMetros > 0 ? lancamento / espessuraMetros : 0
  
  // 3. Horas de concretagem = area_por_dia / area_concreta_por_hora
  const horasConcretagem = areaConcretaPorHora > 0 ? Math.ceil(areaDiaNum / areaConcretaPorHora) : 0
  
  // 4. Horas de acabamento = do início do acabamento até 19h
  const [horaInicioAcabamento] = inicioAcabamento.split(':').map(Number)
  const horasAcabamento = Math.max(0, 19 - horaInicioAcabamento)
  
  // 5. Final da concretagem = início + horas de concretagem
  const finalConcretagem = addHoursToTime(inicioHora, horasConcretagem)
  
  // 6. Final do acabamento = sempre 19:00
  const finalAcabamento = '19:00'
  
  // 7. Sobreposição CA = final concretagem - início acabamento (em horas)
  const sobreposicaoCA = calcularSobreposicaoCA(inicioHora, horasConcretagem, inicioAcabamento)
  
  console.log("Cálculos de horário:", {
    inicioHora,
    inicioAcabamento,
    areaConcretaPorHora,
    horasConcretagem,
    horasAcabamento,
    finalConcretagem,
    finalAcabamento,
    sobreposicaoCA
  })
  
  // Calcular volume de concreto
  const volumeConcretoM3 = areaTotalNum * espessuraMetros
  
  // BUSCAR VALORES DOS EQUIPAMENTOS E CALCULAR CUSTOS
  const equipamentosSelecionados = formData.equipamentosSelecionados.filter(e => e.selecionado)
  let equipamentosComCusto: EquipamentoComCusto[] = []
  let custoTotalEquipamentos = 0
  
  if (equipamentosSelecionados.length > 0) {
    console.log("Buscando valores dos equipamentos selecionados...")
    
    // Buscar valores dos equipamentos na tabela
    const idsEquipamentos = equipamentosSelecionados.map(e => e.id)
    const { data: equipamentosDB, error: errorEquipamentos } = await supabase
      .from('equipamentos')
      .select('id, nome, valor_dia')
      .in('id', idsEquipamentos)
    
    if (errorEquipamentos) {
      console.error("Erro ao buscar equipamentos:", errorEquipamentos)
      throw new Error(`Erro ao buscar dados dos equipamentos: ${errorEquipamentos.message}`)
    }
    
    console.log("Equipamentos encontrados no banco:", equipamentosDB)
    
    // Calcular custo total para cada equipamento
    equipamentosComCusto = equipamentosSelecionados.map(equipSelecionado => {
      const equipDB = equipamentosDB?.find(e => e.id === equipSelecionado.id)
      const valorDia = equipDB?.valor_dia || 0
      const custoTotal = equipSelecionado.quantidade * valorDia * diasObra
      
      custoTotalEquipamentos += custoTotal
      
      console.log(`Equipamento ${equipSelecionado.nome}: ${equipSelecionado.quantidade} × R$${valorDia} × ${diasObra} dias = R$${custoTotal}`)
      
      return {
        id: equipSelecionado.id,
        nome: equipSelecionado.nome,
        quantidade: equipSelecionado.quantidade,
        valor_dia: valorDia,
        dias_obra: diasObra,
        custo_total: custoTotal,
        selecionado: true
      }
    })
    
    console.log("Custo total dos equipamentos:", custoTotalEquipamentos)
  }

  // BUSCAR E CALCULAR CUSTOS DOS VEÍCULOS
  let veiculosComCusto: VeiculoComCusto[] = []
  let custoTotalVeiculos = 0
  
  try {
    console.log("Buscando veículos do usuário...")
    
    // Buscar veículos da obra do usuário
    const { data: veiculosObra, error: errorVeiculosObra } = await supabase
      .from('obras_veiculos_simulacao')
      .select('*')
      .eq('userid', userId)
    
    if (errorVeiculosObra) {
      console.error("Erro ao buscar veículos da obra:", errorVeiculosObra)
      // Não falhar a simulação por causa dos veículos, apenas log do erro
    } else if (veiculosObra && veiculosObra.length > 0) {
      console.log("Veículos da obra encontrados:", veiculosObra)
      
      // Buscar informações dos veículos (rs_km) da tabela veiculos
      const nomesVeiculos = veiculosObra.map(v => v.veiculo)
      const { data: veiculosInfo, error: errorVeiculosInfo } = await supabase
        .from('veiculos')
        .select('veiculo, rs_km')
        .in('veiculo', nomesVeiculos)
      
      if (errorVeiculosInfo) {
        console.error("Erro ao buscar informações dos veículos:", errorVeiculosInfo)
      } else {
        console.log("Informações dos veículos encontradas:", veiculosInfo)
        
        // Calcular custo para cada veículo
        const distanciaObra = parseFloat(formData.distanciaObra) || 0
        
        veiculosComCusto = veiculosObra.map(veiculo => {
          const veiculoInfo = veiculosInfo?.find(v => v.veiculo === veiculo.veiculo)
          const rsKm = veiculoInfo?.rs_km || 0
          const quantidade = veiculo.quantidade || 1
          
          // Fórmula: distância × dias × quantidade × rs_km
          const custoTotal = distanciaObra * diasObra * quantidade * rsKm
          
          custoTotalVeiculos += custoTotal
          
          console.log(`Veículo ${veiculo.veiculo}: ${distanciaObra}km × ${diasObra} dias × ${quantidade} unidades × R$${rsKm}/km = R$${custoTotal}`)
          
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
        
        console.log("Custo total dos veículos:", custoTotalVeiculos)
      }
    } else {
      console.log("Nenhum veículo encontrado para o usuário")
    }
  } catch (error) {
    console.error("Erro ao processar veículos:", error)
    // Não falhar a simulação, apenas continuar sem veículos
  }
  
  // CALCULAR CUSTO TOTAL DA MÃO DE OBRA
  // Buscar número de pessoas das equipes selecionadas
  const valorPorPessoaPorDia = 1373.47
  
  // Buscar dados das equipes para obter o número de pessoas
  console.log("Dados do formulário para equipes:", {
    equipeConcretagem: formData.equipeConcretagem,
    equipeAcabamento: formData.equipeAcabamento,
    equipePreparacao: formData.equipePreparacao
  })
  
  let pessoasConcretagem = 5 // Valor padrão
  let pessoasAcabamento = 3 // Valor padrão
  let pessoasPreparacao = 3 // Valor padrão
  let pessoasFinalizacao = 2 // Valor padrão
  
  // Buscar equipe de concretagem
  if (formData.equipeConcretagem) {
    const { data: equipeConcretagem } = await supabase
      .from("equipes_concretagem")
      .select("qtd_pessoas")
      .eq("id", parseInt(formData.equipeConcretagem, 10))
      .single()
    
    if (equipeConcretagem) {
      pessoasConcretagem = equipeConcretagem.qtd_pessoas
    }
  }
  
  // Buscar equipe de acabamento
  if (formData.equipeAcabamento) {
    const { data: equipeAcabamento } = await supabase
      .from("equipes_acabamento")
      .select("qtd_pessoas")
      .eq("id", parseInt(formData.equipeAcabamento, 10))
      .single()
    
    if (equipeAcabamento) {
      pessoasAcabamento = equipeAcabamento.qtd_pessoas
    }
  }
  
  // Buscar equipe de preparação
  if (formData.equipePreparacao) {
    const { data: equipePreparacao } = await supabase
      .from("equipes_preparacao")
      .select("qtd_pessoas")
      .eq("id", parseInt(formData.equipePreparacao, 10))
      .single()
    
    if (equipePreparacao) {
      pessoasPreparacao = equipePreparacao.qtd_pessoas
    }
  }
  
  console.log("Número de pessoas por equipe:", {
    concretagem: pessoasConcretagem,
    acabamento: pessoasAcabamento,
    preparacao: pessoasPreparacao,
    finalizacao: pessoasFinalizacao
  })
  
  // Calcular custos de mão de obra: pessoas × valor_por_pessoa × dias
  const custoConcretagem = pessoasConcretagem * valorPorPessoaPorDia * (parseInt(formData.prazoConcretagem, 10) || 0)
  const custoAcabamento = pessoasAcabamento * valorPorPessoaPorDia * (parseInt(formData.prazoAcabamento, 10) || 0)
  const custoPreparacao = pessoasPreparacao * valorPorPessoaPorDia * (parseInt(formData.prazoPreparacao, 10) || 0)
  const custoFinalizacao = pessoasFinalizacao * valorPorPessoaPorDia * (parseInt(formData.prazoFinalizacao, 10) || 0)
  
  // Custo total da mão de obra
  const custoTotalMaoObra = custoConcretagem + custoAcabamento + custoPreparacao + custoFinalizacao
  
  console.log("Custos de mão de obra calculados:", {
    concretagem: `${pessoasConcretagem} pessoas x R$${valorPorPessoaPorDia} x ${parseInt(formData.prazoConcretagem, 10) || 0} dias = R$${custoConcretagem}`,
    acabamento: `${pessoasAcabamento} pessoas x R$${valorPorPessoaPorDia} x ${parseInt(formData.prazoAcabamento, 10) || 0} dias = R$${custoAcabamento}`,
    preparacao: `${pessoasPreparacao} pessoas x R$${valorPorPessoaPorDia} x ${parseInt(formData.prazoPreparacao, 10) || 0} dias = R$${custoPreparacao}`,
    finalizacao: `${pessoasFinalizacao} pessoas x R$${valorPorPessoaPorDia} x ${parseInt(formData.prazoFinalizacao, 10) || 0} dias = R$${custoFinalizacao}`,
    total: `R$${custoTotalMaoObra}`
  })

  

  // Função utilitária para pegar a hora (ex: '18:30' => 18)
  function getHora(horaMinutoStr: string) {
    return parseInt(horaMinutoStr.split(':')[0], 10);
  }

  // Horário de término de cada atividade
  const horaFinalConcretagem = getHora(finalConcretagem);
  const horaFinalAcabamento = getHora(finalAcabamento);

  // Quantas horas extra cada atividade teve (depois das 17h)
  const horasExtraConcretagem = Math.max(0, horaFinalConcretagem - 17);
  const horasExtraAcabamento = Math.max(0, horaFinalAcabamento - 17);

  // Valor da hora extra
  const valorHoraExtra = 184.69;

  // Cálculo: horas extra * valor * equipe
  const totalHoraExtraConcretagem = horasExtraConcretagem * valorHoraExtra * pessoasConcretagem;
  const totalHoraExtraAcabamento = horasExtraAcabamento * valorHoraExtra * pessoasAcabamento;

  // Total de horas extras das duas atividades
  const totalHoraExtra = totalHoraExtraConcretagem + totalHoraExtraAcabamento;

  
  // Calcular custo total por M²
  const custoTotalObra = custoTotalMaoObra + custoTotalEquipamentos + custoTotalVeiculos +
    parseFloat(formData.frete || "0") +
    parseFloat(formData.hospedagem || "0") +
    parseFloat(formData.locacaoEquipamento || "0") +
    parseFloat(formData.locacaoVeiculo || "0") +
    parseFloat(formData.material || "0") +
    parseFloat(formData.passagem || "0") +
    parseFloat(formData.extra || "0") +
    totalHoraExtra;

  const custoTotalPorM2 = areaTotalNum > 0 ? custoTotalObra / areaTotalNum : 0;
  
  // Calcular preço de venda por M² baseado no custo e lucro desejado
  const lucroDesejado = parseFloat(formData.lucroDesejado) || 25; // 25% como padrão
  const margemLucro = 1 + (lucroDesejado / 100);
  const precoVendaPorM2Calculado = custoTotalPorM2 * margemLucro;
  
  // Usar preço calculado se não houver preço manual
  const precoVendaPorM2Final = parseFloat(formData.precoVenda) || precoVendaPorM2Calculado;
  const precoVendaTotal = precoVendaPorM2Final * areaTotalNum;
  
  // Calcular resultado e percentual
  const resultado1 = precoVendaTotal - custoTotalObra;
  const resultadoPercentual = precoVendaTotal > 0 ? (resultado1 / precoVendaTotal) * 100 : 0;

  // SALVAR NA TABELA OBRAS
  const dadosObra = {
    nome: formData.nomeObra,
    construtora: formData.construtora,
    endereco: formData.endereco,
    nome_contato: formData.nomeContato,
    telefone_contato: formData.telefoneContato,
    tipo_reforco_estrutural_id: parseInt(formData.reforcoEstrutural) || null,
    area_total_metros_quadrados: areaTotalNum,
    area_por_dia: areaDiaNum,
    area_por_hora: areaConcretaPorHora,
    data_inicio: formData.previsaoInicio ? format(formData.previsaoInicio, 'yyyy-MM-dd') : null,
    tipo_acabamento_id: parseInt(formData.tipoAcabamento) || null,
    espessura_piso: espessura,
    distancia_obra: parseFloat(formData.distanciaObra) || null,
    lancamento_concreto: formData.lancamentoConcreto,
    prazo_obra: diasObra,
    
    // Horários calculados automaticamente
    horas_inicio_concretagem: inicioHora,
    horas_inicio_acabamento: inicioAcabamento,
    hora_concretagem: horasConcretagem,
    hora_acabamento: horasAcabamento,
    final_concretagem: finalConcretagem,
    final_acabamento: finalAcabamento,
    sobreposicao_ca: sobreposicaoCA,
    
    // Equipes e prazos
    equipes_concretagem_id: parseInt(formData.equipeConcretagem) || null,
    equipes_acabamento_id: parseInt(formData.equipeAcabamento) || null,
    equipes_preparacao_id: parseInt(formData.equipePreparacao) || null,
    prazo_preparacao_obra: parseInt(formData.prazoPreparacao) || null,
    prazo_finalizacao_obra: parseInt(formData.prazoFinalizacao) || null,
    
    // Equipamentos com custos calculados (salvar como JSON)
    equipamentos_selecionados: JSON.stringify(equipamentosComCusto),
    
    // Custo total dos equipamentos
    custo_equipamentos: custoTotalEquipamentos,
    
    // Custo total da mão de obra
    custo_mao_obra: custoTotalMaoObra,
    
    // Custo total dos veículos
    custo_veiculos: custoTotalVeiculos,
    
    // Custos diversos
    valor_frete: parseFloat(formData.frete) || 0,
    valor_hospedagem: parseFloat(formData.hospedagem) || 0,
    valor_locacao_veiculos: parseFloat(formData.locacaoVeiculo) || 0,
    valor_material: parseFloat(formData.material) || 0,
    valor_passagem: parseFloat(formData.passagem) || 0,
    valor_extra: parseFloat(formData.extra) || 0,
    
    // Comissão e preço
    percentual_comissao: parseFloat(formData.comissao) || 0,
    preco_venda_metro_quadrado: precoVendaPorM2Final,
    percentual_lucro_desejado: lucroDesejado,
    
    // Campos obrigatórios
    usuarios_id: userId,
    simulacao: true,
    status: 'indefinida',
    data_concretagem: new Date().toISOString()
  }
  
  console.log("Dados preparados para inserção:", dadosObra)
  
  // Inserir na tabela obras
  const { data: obraInserida, error: erroInsercao } = await supabase
    .from('obras')
    .insert([dadosObra])
    .select()
    .single()
    
  if (erroInsercao) {
    console.error("Erro ao inserir obra:", erroInsercao)
    throw new Error(`Erro ao salvar simulação: ${erroInsercao.message}`)
  }
  
  console.log("Obra inserida com sucesso:", obraInserida)

  // Retornar resultado estruturado
  const resultado: SimulacaoResult = {
    dadosTecnicos: {
      reforcoEstrutural: formData.reforcoEstrutural,
      areaTotal: areaTotalNum,
      areaPorDia: areaDiaNum,
      prazoTotal: diasObra,
      espessura: espessura,
      lancamento: lancamento,
      areaConcretaPorHora: areaConcretaPorHora,
      inicioConcretagem: inicioHora,
      inicioAcabamento: inicioAcabamento,
      finalAcabamento: finalAcabamento,
      horasConcretagem: horasConcretagem,
      horasAcabamento: horasAcabamento,
      sobreposicaoCA: sobreposicaoCA,
      concreto: volumeConcretoM3,
      finalConcretagem: finalConcretagem,
      preparoDiaSeguinte: 6
    },
    equipeConcretagemAcabamento: {
      equipeTotal: 8,
      custoEquipe: custoConcretagem + custoAcabamento,
      equipeConcretagem: pessoasConcretagem,
      horasExtraEquipeConcretagem: 0,
      custoHEEquipeConcretagem: 0,
      horaExtraEquipeAcabamento: 2,
      equipeAcabamento: pessoasAcabamento,
      custoHEAcabamento: 0,
      totalEquipe: custoConcretagem + custoAcabamento,
      percentualTotalEquipe: ((custoConcretagem + custoAcabamento) / custoTotalObra) * 100
    },
    preparacaoObra: {
      equipeTotal: pessoasPreparacao,
      prazo: parseInt(formData.prazoPreparacao, 10) || 2,
      custoPreparacao: custoPreparacao,
      totalEquipe: custoPreparacao,
      percentualTotalEquipe: (custoPreparacao / custoTotalObra) * 100
    },
    equipamentos: {
      equipamentos: equipamentosComCusto.map(e => ({
        nome: e.nome,
        valorDia: e.valor_dia,
        dias: e.dias_obra,
        quantidade: e.quantidade,
        total: e.custo_total
      })),
      totalEquipamentos: custoTotalEquipamentos,
      percentualTotalEquipamentos: (custoTotalEquipamentos / custoTotalObra) * 100,
      quantidadeEquipamentos: equipamentosComCusto.length
    },
    veiculos: {
      veiculos: veiculosComCusto,
      totalVeiculos: custoTotalVeiculos,
      percentualTotalVeiculos: (custoTotalVeiculos / custoTotalObra) * 100
    },
    insumos: {
      tipoAcabamento: "LISO POLIDO",
      area: areaDiaNum,
      dias: diasObra,
      valorPorM2: custoTotalPorM2,
      totalInsumos: custoTotalObra,
      percentualTotalInsumos: 100
    },
    demaisDespesasFixas: {
      valorEmpresaPorM2: custoTotalPorM2,
      valorTotalPorM2: precoVendaPorM2Final,
      areaTotalObra: areaTotalNum,
      despesasFixas: custoTotalObra,
      percentualDespesasFixas: 100,
      custoExecucao: custoTotalObra,
      percentualCustoExecucao: 100
    },
    custoDerivadosVenda: {
      faturamento12Meses: precoVendaTotal,
      percentualFaturamento: 100,
      impostoSimples: precoVendaTotal * 0.1505, // 15.05% de imposto
      percentualImpostoSimples: 15.05,
      margemLucro: resultado1,
      percentualMargemLucro: resultadoPercentual,
      comissoes: precoVendaTotal * (parseFloat(formData.comissao) / 100 || 0.01), // 1% como padrão
      percentualComissoes: parseFloat(formData.comissao) || 1
    },
    outrosCustos: {
      totalOutrosCustos: custoTotalObra,
      totalM2: custoTotalPorM2
    },
    precoVenda: {
      precoVenda: precoVendaTotal,
      precoVendaPorM2: precoVendaPorM2Final,
      sePrecoVendaPorM2For: precoVendaPorM2Calculado,
      valorTotal: precoVendaTotal,
      resultado1: resultado1,
      resultadoPercentual: resultadoPercentual
    },
    
    // Compatibilidade
    valorTotal: precoVendaTotal,
    precoVendaM2: precoVendaPorM2Final,
    lucroTotal: resultado1,
    volumeConcretoM3: volumeConcretoM3,
    diasTotais: diasObra,
    custoEquipamentos: custoTotalEquipamentos,
    custoVeiculos: custoTotalVeiculos
  }

  console.log("Resultado final da simulação:", resultado)
  return resultado
}
