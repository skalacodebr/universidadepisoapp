'use client'

import { getSupabaseClient } from '@/lib/supabase'
import { format } from 'date-fns'

const supabase = getSupabaseClient()

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

export interface FinalizacaoObra {
  equipeTotal: number
  prazo: number
  custoFinalizacao: number
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
  finalizacaoObra: FinalizacaoObra
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

function addHoursToTime(time: string, add: number): string {
  const [hours, minutes] = time.split(':').map(Number)
  const newHours = hours + add
  return `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function calcularSobreposicaoCA(inicio: string, horasConc: number, inicioAcab: string): number {
  const finalConc = addHoursToTime(inicio, horasConc)
  const [hFinalConc, mFinalConc] = finalConc.split(':').map(Number)
  const [hInicioAcab, mInicioAcab] = inicioAcab.split(':').map(Number)
  
  return (hFinalConc - hInicioAcab) + (mFinalConc - mInicioAcab) / 60
}

export async function processarSimulacao(formData: SimulacaoFormData, userId: string): Promise<SimulacaoResult> {
  // Parsing and setting defaults
  const areaTotal = parseFloat(formData.areaTotal) || 0
  const areaPorDia = parseFloat(formData.areaPorDia) || 0
  const prazoTotal = areaTotal / areaPorDia
  const espessura = parseFloat(formData.espessura) / 100 || 0 // cm para m
  const distanciaObra = parseFloat(formData.distanciaObra) || 0
  const lancamentoConcreto = parseFloat(formData.lancamentoConcreto) || 0
  
  // Fetching data from Supabase
  const { data: equipesData, error: equipesError } = await supabase.from('equipes').select('*')
  const { data: equipamentosData, error: equipamentosError } = await supabase.from('equipamentos').select('*')
  const { data: tipoAcabamentoData, error: tipoAcabamentoError } = await supabase.from('tipos_acabamentos').select('*')
  const { data: simplesData, error: simplesError } = await supabase.from('simples_brackets').select('*')
  const { data: veiculosObra, error: veiculosObraError } = await supabase.from('obras_veiculos_simulacao').select('*').eq('userid', userId)
  const { data: veiculosDisponiveis, error: veiculosDispError } = await supabase.from('veiculos_disponiveis').select('*')

  if (equipesError || equipamentosError || tipoAcabamentoError || simplesError || veiculosObraError || veiculosDispError) {
    throw new Error('Erro ao buscar dados do Supabase')
  }

  // Helper functions
  const getEquipeQtd = (nome: string) => equipesData?.find(e => e.nome === nome)?.qtd_pessoas || 0
  const getTipoAcabamentoValor = (area: number, nome: string) => {
    const acabamento = tipoAcabamentoData?.find(t => t.nome === nome)
    if (!acabamento) return 0
    if (area <= 500) return acabamento.area500
    if (area <= 1000) return acabamento.area1000
    if (area <= 1500) return acabamento.area1500
    return acabamento.area2000mais
  }
  
  // Cálculos Técnicos
  const areaConcretaPorHora = areaTotal / 8
  const inicioConcretagem = '08:00'
  const inicioAcabamento = '10:00'
  const horasConcretagem = areaTotal / lancamentoConcreto
  const finalConcretagem = addHoursToTime(inicioConcretagem, horasConcretagem)
  const horasAcabamento = (areaTotal / 35) + 1 // 35 m²/h + 1h para remates
  const finalAcabamento = addHoursToTime(inicioAcabamento, horasAcabamento)
  const sobreposicaoCA = calcularSobreposicaoCA(inicioConcretagem, horasConcretagem, inicioAcabamento)
  const concreto = areaTotal * espessura
  const preparoDiaSeguinte = (areaTotal / 100) * 0.1 // Exemplo

  const dadosTecnicos: DadosTecnicos = {
    reforcoEstrutural: formData.reforcoEstrutural,
    areaTotal,
    areaPorDia,
    prazoTotal,
    espessura,
    lancamento: lancamentoConcreto,
    areaConcretaPorHora,
    inicioConcretagem,
    inicioAcabamento,
    finalAcabamento,
    horasConcretagem,
    horasAcabamento,
    sobreposicaoCA,
    concreto,
    finalConcretagem,
    preparoDiaSeguinte
  }

  // Equipe de Concretagem e Acabamento
  const equipeConcretagemQtd = getEquipeQtd(formData.equipeConcretagem)
  const equipeAcabamentoQtd = getEquipeQtd(formData.equipeAcabamento)
  const custoEquipe = 15000 // Placeholder
  const horasExtraEquipeConcretagem = Math.max(0, horasConcretagem - 8)
  const custoHEEquipeConcretagem = horasExtraEquipeConcretagem * equipeConcretagemQtd * 35
  const horaExtraEquipeAcabamento = Math.max(0, horasAcabamento - 8)
  const custoHEAcabamento = horaExtraEquipeAcabamento * equipeAcabamentoQtd * 35
  const totalEquipeCA = (custoEquipe * prazoTotal) + custoHEEquipeConcretagem + custoHEAcabamento
  
  const equipeConcretagemAcabamento: EquipeConcretagemAcabamento = {
    equipeTotal: equipeConcretagemQtd + equipeAcabamentoQtd,
    custoEquipe,
    equipeConcretagem: equipeConcretagemQtd,
    horasExtraEquipeConcretagem,
    custoHEEquipeConcretagem,
    horaExtraEquipeAcabamento,
    equipeAcabamento: equipeAcabamentoQtd,
    custoHEAcabamento,
    totalEquipe: totalEquipeCA,
    percentualTotalEquipe: 0 // Será calculado depois
  }

  // Preparação da Obra
  const equipePreparacaoQtd = getEquipeQtd(formData.equipePreparacao)
  const prazoPreparacao = parseInt(formData.prazoPreparacao) || 0
  const custoPreparacao = equipePreparacaoQtd * 250 * prazoPreparacao // Custo diário por pessoa
  const preparacaoObra: PreparacaoObra = {
    equipeTotal: equipePreparacaoQtd,
    prazo: prazoPreparacao,
    custoPreparacao,
    totalEquipe: custoPreparacao,
    percentualTotalEquipe: 0 // Será calculado depois
  }

  // Finalização da Obra
  const equipeFinalizacaoQtd = equipeAcabamentoQtd // Assumindo mesma equipe
  const prazoFinalizacao = parseInt(formData.prazoFinalizacao) || 0
  const custoFinalizacao = equipeFinalizacaoQtd * 250 * prazoFinalizacao
  const finalizacaoObra: FinalizacaoObra = {
    equipeTotal: equipeFinalizacaoQtd,
    prazo: prazoFinalizacao,
    custoFinalizacao,
    totalEquipe: custoFinalizacao,
    percentualTotalEquipe: 0 // Será calculado depois
  }

  // Equipamentos
  const equipamentosComCusto: EquipamentoComCusto[] = formData.equipamentosSelecionados
    .filter(eq => eq.selecionado)
    .map(eq => {
      const equipamentoInfo = equipamentosData.find(e => e.id === eq.id);
      if (!equipamentoInfo) return null;
      
      const dias_obra = prazoTotal + prazoPreparacao + prazoFinalizacao;
      const custo_total = equipamentoInfo.valor_dia * eq.quantidade * dias_obra;
      
      return {
        id: eq.id,
        nome: eq.nome,
        quantidade: eq.quantidade,
        valor_dia: equipamentoInfo.valor_dia,
        dias_obra,
        custo_total,
        selecionado: eq.selecionado
      };
    })
    .filter((eq): eq is EquipamentoComCusto => eq !== null);

  const totalEquipamentos = equipamentosComCusto.reduce((acc, eq) => acc + eq.custo_total, 0);

  const equipamentos: Equipamentos = {
    equipamentos: equipamentosComCusto.map(e => ({
      nome: e.nome,
      valorDia: e.valor_dia,
      dias: e.dias_obra,
      quantidade: e.quantidade,
      total: e.custo_total
    })),
    totalEquipamentos,
    percentualTotalEquipamentos: 0, // a calcular
    quantidadeEquipamentos: equipamentosComCusto.reduce((sum, eq) => sum + eq.quantidade, 0),
  };
  
  // Veículos
  const veiculosComCusto: VeiculoComCusto[] = veiculosObra
    .map(vo => {
      const veiculoInfo = veiculosDisponiveis.find(vd => vd.veiculo === vo.veiculo);
      if (!veiculoInfo) return null;

      const dias_obra = prazoTotal + prazoPreparacao + prazoFinalizacao;
      const custo_total = (veiculoInfo.rs_km * distanciaObra * 2 * dias_obra) * (vo.quantidade || 1);
        
        return {
        veiculo: vo.veiculo,
        tipo: vo.tipo || 'N/A',
        quantidade: vo.quantidade || 1,
        rs_km: veiculoInfo.rs_km,
          distancia_obra: distanciaObra,
        dias_obra,
        custo_total
      };
    })
    .filter((v): v is VeiculoComCusto => v !== null);

  const totalVeiculos = veiculosComCusto.reduce((acc, v) => acc + v.custo_total, 0);

  const veiculos: Veiculos = {
    veiculos: veiculosComCusto,
    totalVeiculos,
    percentualTotalVeiculos: 0, // a calcular
  };


  // Insumos
  const valorPorM2Insumo = getTipoAcabamentoValor(areaTotal, formData.tipoAcabamento)
  const totalInsumos = valorPorM2Insumo * areaTotal
  const insumos: Insumos = {
    tipoAcabamento: formData.tipoAcabamento,
    area: areaTotal,
    dias: prazoTotal,
    valorPorM2: valorPorM2Insumo,
    totalInsumos,
    percentualTotalInsumos: 0 // a calcular
  }

  // Demais Despesas Fixas
  const despesasFixas = 10000 // Placeholder
  const custoExecucao = totalEquipeCA + custoPreparacao + custoFinalizacao + totalEquipamentos + totalVeiculos + totalInsumos
  const demaisDespesasFixas: DemaisDespesasFixas = {
    valorEmpresaPorM2: 0,
    valorTotalPorM2: 0,
    areaTotalObra: areaTotal,
    despesasFixas,
    percentualDespesasFixas: 0,
    custoExecucao,
    percentualCustoExecucao: 0,
  }

  // Custos Derivados da Venda
  const faturamento12Meses = 500000 // Placeholder
  const precoVendaM2 = parseFloat(formData.precoVenda) || 0
  const valorTotalVenda = precoVendaM2 * areaTotal
  const aliquotaSimples = simplesData.find(s => valorTotalVenda <= s.faturamento_ate)?.aliquota || 0
  const impostoSimples = valorTotalVenda * (aliquotaSimples / 100)
  const lucroDesejado = parseFloat(formData.lucroDesejado) || 0
  const margemLucro = valorTotalVenda * (lucroDesejado / 100)
  const comissao = parseFloat(formData.comissao) || 0
  const comissoes = valorTotalVenda * (comissao / 100)
  
  const custoDerivadosVenda: CustoDerivadosVenda = {
    faturamento12Meses,
    percentualFaturamento: 0,
    impostoSimples,
    percentualImpostoSimples: 0,
    margemLucro,
    percentualMargemLucro: 0,
    comissoes,
    percentualComissoes: 0
  }

  // Outros Custos
  const totalOutrosCustos = (parseFloat(formData.frete) || 0) +
                           (parseFloat(formData.hospedagem) || 0) +
                           (parseFloat(formData.locacaoEquipamento) || 0) +
                           (parseFloat(formData.locacaoVeiculo) || 0) +
                           (parseFloat(formData.material) || 0) +
                           (parseFloat(formData.passagem) || 0) +
                           (parseFloat(formData.extra) || 0)

  const outrosCustos: OutrosCustos = {
    totalOutrosCustos,
    totalM2: totalOutrosCustos / areaTotal
  }

  // Preço de Venda e Resultado
  const custoTotalGeral = custoExecucao + despesasFixas + impostoSimples + comissoes + totalOutrosCustos
  const valorTotalSugerido = custoTotalGeral / (1 - (lucroDesejado / 100))
  const precoVendaSugeridoM2 = valorTotalSugerido / areaTotal
  const resultadoComPrecoVendaInput = valorTotalVenda - custoTotalGeral
  
  const precoVenda: PrecoVenda = {
    precoVendaPorM2: precoVendaSugeridoM2,
    sePrecoVendaPorM2For: precoVendaM2,
    valorTotal: valorTotalVenda,
    resultado1: resultadoComPrecoVendaInput,
    resultadoPercentual: (resultadoComPrecoVendaInput / valorTotalVenda) * 100
  }

  // Montando o resultado final
  const resultadoFinal: SimulacaoResult = {
    dadosTecnicos,
    equipeConcretagemAcabamento: {
      ...equipeConcretagemAcabamento,
      percentualTotalEquipe: (totalEquipeCA / custoTotalGeral) * 100
    },
    preparacaoObra: {
      ...preparacaoObra,
      percentualTotalEquipe: (custoPreparacao / custoTotalGeral) * 100
    },
    finalizacaoObra: {
      ...finalizacaoObra,
      percentualTotalEquipe: (custoFinalizacao / custoTotalGeral) * 100
    },
    equipamentos: {
      ...equipamentos,
      percentualTotalEquipamentos: (totalEquipamentos / custoTotalGeral) * 100,
    },
    veiculos: {
      ...veiculos,
      percentualTotalVeiculos: (totalVeiculos / custoTotalGeral) * 100,
    },
    insumos: {
      ...insumos,
      percentualTotalInsumos: (totalInsumos / custoTotalGeral) * 100,
    },
    demaisDespesasFixas: {
      ...demaisDespesasFixas,
      percentualDespesasFixas: (despesasFixas / custoTotalGeral) * 100,
      percentualCustoExecucao: (custoExecucao / custoTotalGeral) * 100,
    },
    custoDerivadosVenda: {
      ...custoDerivadosVenda,
      percentualImpostoSimples: (impostoSimples / valorTotalVenda) * 100,
      percentualMargemLucro: (margemLucro / valorTotalVenda) * 100,
      percentualComissoes: (comissoes / valorTotalVenda) * 100,
    },
    outrosCustos,
    precoVenda,
    valorTotal: valorTotalVenda,
    precoVendaM2: precoVendaM2,
    lucroTotal: resultadoComPrecoVendaInput,
    custoEquipamentos: totalEquipamentos,
    custoVeiculos: totalVeiculos,
    diasTotais: prazoTotal + prazoPreparacao + prazoFinalizacao,
    volumeConcretoM3: concreto,
  }

  return resultadoFinal;
}

function getHora(horaMinutoStr: string) {
  const [hora, minuto] = horaMinutoStr.split(':').map(Number);
  const data = new Date();
  data.setHours(hora, minuto, 0, 0);
  return data;
}

export async function salvarSimulacao(
  userId: string,
  formData: SimulacaoFormData,
  resultado: SimulacaoResult,
  orcamentoData: any[]
) {

  const { data, error } = await supabase
    .from('simulacoes')
    .insert([
      {
        user_id: userId,
        nome_obra: formData.nomeObra,
        construtora: formData.construtora,
        endereco: formData.endereco,
        nome_contato: formData.nomeContato,
        telefone_contato: formData.telefoneContato,
        reforco_estrutural: formData.reforcoEstrutural,
        area_total: parseFloat(formData.areaTotal),
        area_por_dia: parseFloat(formData.areaPorDia),
        previsao_inicio: formData.previsaoInicio,
        tipo_acabamento: formData.tipoAcabamento,
        espessura: parseFloat(formData.espessura),
        distancia_obra: parseFloat(formData.distanciaObra),
        lancamento_concreto: parseFloat(formData.lancamentoConcreto),
        prazo_obra: parseInt(formData.prazoObra),
        inicio_hora: formData.inicioHora,
        equipe_preparacao: formData.equipePreparacao,
        prazo_preparacao: parseInt(formData.prazoPreparacao),
        equipe_concretagem: formData.equipeConcretagem,
        prazo_concretagem: parseInt(formData.prazoConcretagem),
        equipe_acabamento: formData.equipeAcabamento,
        prazo_acabamento: parseInt(formData.prazoAcabamento),
        prazo_finalizacao: parseInt(formData.prazoFinalizacao),
        custo_frete: parseFloat(formData.frete),
        custo_hospedagem: parseFloat(formData.hospedagem),
        custo_locacao_equipamento: parseFloat(formData.locacaoEquipamento),
        custo_locacao_veiculo: parseFloat(formData.locacaoVeiculo),
        custo_material: parseFloat(formData.material),
        custo_passagem: parseFloat(formData.passagem),
        custo_extra: parseFloat(formData.extra),
        comissao_percentual: parseFloat(formData.comissao),
        preco_venda_m2: parseFloat(formData.precoVenda),
        lucro_desejado_percentual: parseFloat(formData.lucroDesejado),
        resultado_json: resultado,
        orcamento_json: orcamentoData.map(o => ({ ...o, data_orcamento: format(new Date(o.data_orcamento), 'yyyy-MM-dd') })),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Erro ao salvar simulação:', error);
    throw new Error('Não foi possível salvar a simulação.');
  }

  return {
    simulacaoId: data.id,
    orcamentoData: orcamentoData.map(o => ({ ...o, data_orcamento: format(new Date(o.data_orcamento), 'yyyy-MM-dd') })),
    ...resultado,
  }
}

export async function calcularCustosTotais(simulacaoId: number) {
  // Implementação futura ou ajuste se necessário
}
