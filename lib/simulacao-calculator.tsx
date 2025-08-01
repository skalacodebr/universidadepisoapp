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
  equipeFinalizacao: string
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
  // Campos específicos dos custos fixos da empresa
  totalCustosFixos?: number
  mediaMes?: number
  mediaFinal?: number
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
  frete: number
  hospedagem: number
  locacaoEquipamento: number
  locacaoVeiculo: number
  material: number
  passagem: number
  extra: number
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

// Função auxiliar
function addHoursToTime(time: string, add: number): string {
  const [h, m] = time.split(':').map(n => parseInt(n, 10));
  const date = new Date();
  date.setHours(h + add, m);
  return date.toTimeString().slice(0, 5);
}

function calcularSobreposicaoCA(inicio: string, horasConc: number, inicioAcab: string): number {
  const [h1, m1] = inicio.split(':').map(n => parseInt(n, 10));
  const [h2, m2] = inicioAcab.split(':').map(n => parseInt(n, 10));
  const fim = h1 * 60 + m1 + horasConc * 60;
  const iniA = h2 * 60 + m2;
  return Math.round((fim - iniA) / 60);
}

// Função para calcular alíquota baseada no faturamento definido pelo usuário
async function calcularAliquotaSimples(userId: string): Promise<{ faturamentoMaximo: number; aliquota: number }> {
  try {
    // Buscar o faturamento_12 da tabela custofixo_usuario
    const { data: custoFixo, error: errorCustoFixo } = await supabase
      .from('custofixo_usuario')
      .select('faturamento_12')
      .eq('userid', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (errorCustoFixo || !custoFixo || !custoFixo.faturamento_12) {
      console.error("❌ Erro ao buscar faturamento_12:", errorCustoFixo)
      console.log("📊 Usando valores padrão: faturamentoMaximo=360000, aliquota=6.54%")
      return { faturamentoMaximo: 360000, aliquota: 6.54 }
    }
    
    console.log("✅ Dados do custo fixo encontrados:", {
      faturamento_12: custoFixo.faturamento_12,
      userId: userId
    })
    
    // Extrair o valor máximo da faixa (após o -)
    // Exemplo: "180000.01-360000" -> 360000
    const faixaFaturamento = custoFixo.faturamento_12
    const valorMaximo = faixaFaturamento.split('-')[1]
    const faturamentoMaximo = parseFloat(valorMaximo) || 360000
    
    console.log("📊 Processando faixa de faturamento:", {
      faixaCompleta: faixaFaturamento,
      valorMinimo: faixaFaturamento.split('-')[0],
      valorMaximo: valorMaximo,
      faturamentoMaximoExtraido: faturamentoMaximo
    })
    
    // Buscar a alíquota correspondente na tabela simples_brackets
    const faturamentoFormatado = faturamentoMaximo.toFixed(2)
    
    console.log("🔍 Buscando alíquota para faturamento formatado:", faturamentoFormatado)
    
    const { data: bracket, error: errorBracket } = await supabase
      .from('simples_brackets')
      .select('aliquota')
      .eq('faturamento_ate', faturamentoFormatado)
      .single()
    
    if (errorBracket || !bracket) {
      console.error("❌ Erro ao buscar alíquota exata:", errorBracket)
      console.log("🔍 Tentando buscar por aproximação...")
      
      const { data: brackets, error: errorBrackets } = await supabase
        .from('simples_brackets')
        .select('faturamento_ate, aliquota')
        .lte('faturamento_ate', faturamentoFormatado)
        .order('faturamento_ate', { ascending: false })
        .limit(1)
      
      if (brackets && brackets.length > 0) {
        console.log("✅ Alíquota encontrada por aproximação:", {
          faturamento_ate: brackets[0].faturamento_ate,
          aliquota: brackets[0].aliquota
        })
        return { faturamentoMaximo, aliquota: brackets[0].aliquota }
      }
      
      console.log("⚠️ Nenhuma alíquota encontrada, usando padrão: 6.54%")
      return { faturamentoMaximo, aliquota: 6.54 }
    }
    
    console.log("✅ Alíquota encontrada com sucesso:", {
      faturamentoMaximo: faturamentoMaximo,
      faturamentoFormatado: faturamentoFormatado,
      aliquotaPercentual: bracket.aliquota,
      fonte: "Busca exata em simples_brackets"
    })
    
    return { faturamentoMaximo, aliquota: bracket.aliquota }
  } catch (error) {
    console.error("❌ Erro no cálculo da alíquota:", error)
    return { faturamentoMaximo: 360000, aliquota: 6.54 }
  }
}

export async function processarSimulacao(formData: SimulacaoFormData, userId: string): Promise<SimulacaoResult> {
  console.log('=== CARREGANDO/PROCESSANDO SIMULAÇÃO ===', { 
    userId,
    nomeObra: formData.nomeObra,
    areaTotal: formData.areaTotal,
    precoVenda: formData.precoVenda,
    lucroDesejado: formData.lucroDesejado,
    origem: 'processarSimulacao foi chamada'
  });
  
  // Parsing and setting defaults
  const areaTotal = parseFloat(formData.areaTotal) || 0;
  const areaPorDia = parseFloat(formData.areaPorDia) || 0;
  const espessuraCm = parseFloat(formData.espessura) || 0;
  const espessura = espessuraCm / 100; // cm para metros
  const prazoTotal = areaPorDia > 0 ? Math.ceil(areaTotal / areaPorDia) : 0;
  const distanciaObra = parseFloat(formData.distanciaObra) || 0;
  const lancamentoConcreto = parseFloat(formData.lancamentoConcreto) || 0;

  // Funções auxiliares
  function addHoursToTime(time: string, add: number): string {
    const [h, m] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h + add, m);
    return date.toTimeString().slice(0, 5);
  }
  function calcularSobreposicaoCA(inicio: string, horasConc: number, inicioAcab: string): number {
    const [h1, m1] = inicio.split(':').map(Number);
    const [h2, m2] = inicioAcab.split(':').map(Number);
    const fim = h1 * 60 + m1 + horasConc * 60;
    const iniA = h2 * 60 + m2;
    return Math.round((fim - iniA) / 60);
  }

  // Fetching data from Supabase
  const { data: equipesConcretagem } = await supabase.from('equipes_concretagem').select('id, nome, qtd_pessoas');
  const { data: equipesAcabamento } = await supabase.from('equipes_acabamento').select('id, nome, qtd_pessoas');
  const { data: equipesPreparacao } = await supabase.from('equipes_preparacao').select('id, nome, qtd_pessoas');
  const { data: equipamentosData } = await supabase.from('equipamentos').select('*');
  const { data: tipoAcabamentoData } = await supabase.from('tipo_acabamento').select('*');
  const { data: simplesData } = await supabase.from('simples_brackets').select('*');
  const { data: veiculosObra } = await supabase.from('obras_veiculos_simulacao').select('*').eq('userid', userId);
  const { data: veiculosDisponiveis } = await supabase.from('veiculos').select('*');
  const { data: custosFixosData } = await supabase.from('custofixo_usuario').select('*').eq('userid', userId).order('created_at', { ascending: false }).limit(1);

  const custosFixos = custosFixosData?.[0] || null;
  const despesasFixasEmpresa = custosFixos ? Number(custosFixos.total) || 0 : 10000;

  // Helpers
  const getEquipeQtd = (id: string, tipo: 'concretagem' | 'acabamento' | 'preparacao') => {
    if (!id) return 0;
    const equipes = {
      'concretagem': equipesConcretagem,
      'acabamento': equipesAcabamento,
      'preparacao': equipesPreparacao
    };
    return equipes[tipo]?.find(e => e.id === parseInt(id))?.qtd_pessoas || 0;
  };

  // CÁLCULOS TÉCNICOS
  const inicioConcretagem = formData.inicioHora || '08:00';
  const inicioAcabamento = addHoursToTime(inicioConcretagem, 5);
  const areaConcretaPorHora = espessura > 0 ? lancamentoConcreto / espessura : 0;
  const horasConcretagem = areaConcretaPorHora > 0 ? Math.ceil(areaPorDia / areaConcretaPorHora) : 0;
  const [horaInicioAcabamento] = inicioAcabamento.split(':').map(Number);
  const horasAcabamento = Math.max(0, 19 - horaInicioAcabamento);
  const finalConcretagem = addHoursToTime(inicioConcretagem, horasConcretagem);
  const finalAcabamento = '19:00';
  const sobreposicaoCA = calcularSobreposicaoCA(inicioConcretagem, horasConcretagem, inicioAcabamento);
  const concreto = areaTotal * espessura;
  
  // Preparo dia seguinte = 17:00 - hora final da concretagem
  const [horaFinalConcretagemPreparo] = finalConcretagem.split(':').map(Number);
  const preparoDiaSeguinte = Math.max(0, 17 - horaFinalConcretagemPreparo);

  const dadosTecnicos: DadosTecnicos = {
    reforcoEstrutural: formData.reforcoEstrutural,
    areaTotal,
    areaPorDia,
    prazoTotal,
    espessura: espessuraCm,
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
  };

  // EQUIPES E MÃO DE OBRA
  const pessoasConcretagem = getEquipeQtd(formData.equipeConcretagem, 'concretagem');
  const pessoasAcabamento = getEquipeQtd(formData.equipeAcabamento, 'acabamento');
  const pessoasPreparacao = getEquipeQtd(formData.equipePreparacao, 'preparacao');
  const pessoasFinalizacao = pessoasAcabamento; // geralmente igual acabamento

  const valorPorPessoaPorDia = 1373.47;
  const valorHoraExtra = 184.69;

  const diasConcretagem = Math.max(0, parseInt(formData.prazoConcretagem) || 0);
  const diasAcabamento = Math.max(0, parseInt(formData.prazoAcabamento) || 0);
  const diasPreparacao = Math.max(0, parseInt(formData.prazoPreparacao) || 0);
  const diasFinalizacao = Math.max(0, parseInt(formData.prazoFinalizacao) || 0);

  const custoConcretagem = pessoasConcretagem * valorPorPessoaPorDia * diasConcretagem;
  const custoAcabamento = pessoasAcabamento * valorPorPessoaPorDia * diasAcabamento;
  const custoPreparacao = pessoasPreparacao * valorPorPessoaPorDia * diasPreparacao;
  const custoFinalizacao = pessoasFinalizacao * valorPorPessoaPorDia * diasFinalizacao;

  // Horas extras por dia (apenas após as 17h)
  function getHora(horaMinutoStr: string) {
    return parseInt(horaMinutoStr.split(':')[0], 10);
  }
  const horaFinalConcretagem = getHora(finalConcretagem);
  const horaFinalAcabamento = getHora(finalAcabamento);
  const horasExtraConcretagem = Math.max(0, horaFinalConcretagem - 17);
  const horasExtraAcabamento = Math.max(0, horaFinalAcabamento - 17);

  const custoHorasExtraConcretagem = horasExtraConcretagem * valorHoraExtra * pessoasConcretagem * prazoTotal;
  const custoHorasExtraAcabamento = horasExtraAcabamento * valorHoraExtra * pessoasAcabamento * prazoTotal;
  const custoTotalHorasExtras = custoHorasExtraConcretagem + custoHorasExtraAcabamento;

  const custoTotalMaoObra = custoConcretagem + custoAcabamento + custoPreparacao + custoFinalizacao + custoTotalHorasExtras;

  console.log("👷 === CÁLCULO DO CUSTO DE MÃO DE OBRA ===", {
    pessoasConcretagem: pessoasConcretagem,
    pessoasAcabamento: pessoasAcabamento,
    pessoasPreparacao: pessoasPreparacao,
    pessoasFinalizacao: pessoasFinalizacao,
    valorPorPessoaPorDia: `R$ ${valorPorPessoaPorDia.toFixed(2)}`,
    diasConcretagem: diasConcretagem,
    diasAcabamento: diasAcabamento,
    diasPreparacao: diasPreparacao,
    diasFinalizacao: diasFinalizacao,
    custoConcretagem: `R$ ${custoConcretagem.toFixed(2)} (${pessoasConcretagem} × ${valorPorPessoaPorDia} × ${diasConcretagem})`,
    custoAcabamento: `R$ ${custoAcabamento.toFixed(2)} (${pessoasAcabamento} × ${valorPorPessoaPorDia} × ${diasAcabamento})`,
    custoPreparacao: `R$ ${custoPreparacao.toFixed(2)} (${pessoasPreparacao} × ${valorPorPessoaPorDia} × ${diasPreparacao})`,
    custoFinalizacao: `R$ ${custoFinalizacao.toFixed(2)} (${pessoasFinalizacao} × ${valorPorPessoaPorDia} × ${diasFinalizacao})`,
    horasExtraConcretagem: horasExtraConcretagem,
    horasExtraAcabamento: horasExtraAcabamento,
    valorHoraExtra: `R$ ${valorHoraExtra.toFixed(2)}`,
    custoHorasExtraConcretagem: `R$ ${custoHorasExtraConcretagem.toFixed(2)}`,
    custoHorasExtraAcabamento: `R$ ${custoHorasExtraAcabamento.toFixed(2)}`,
    custoTotalHorasExtras: `R$ ${custoTotalHorasExtras.toFixed(2)}`,
    custoTotalMaoObra: `R$ ${custoTotalMaoObra.toFixed(2)}`,
    formula: `${custoConcretagem} + ${custoAcabamento} + ${custoPreparacao} + ${custoFinalizacao} + ${custoTotalHorasExtras} = ${custoTotalMaoObra}`
  });

  const equipeConcretagemAcabamento: EquipeConcretagemAcabamento = {
    equipeTotal: pessoasConcretagem + pessoasAcabamento,
    custoEquipe: custoConcretagem + custoAcabamento,
    equipeConcretagem: pessoasConcretagem,
    horasExtraEquipeConcretagem: horasExtraConcretagem,
    custoHEEquipeConcretagem: custoHorasExtraConcretagem,
    horaExtraEquipeAcabamento: horasExtraAcabamento,
    equipeAcabamento: pessoasAcabamento,
    custoHEAcabamento: custoHorasExtraAcabamento,
    totalEquipe: custoConcretagem + custoAcabamento + custoTotalHorasExtras,
    percentualTotalEquipe: 0
  };
  const preparacaoObra: PreparacaoObra = {
    equipeTotal: pessoasPreparacao,
    prazo: diasPreparacao,
    custoPreparacao,
    totalEquipe: custoPreparacao,
    percentualTotalEquipe: 0
  };
  const finalizacaoObra: FinalizacaoObra = {
    equipeTotal: pessoasFinalizacao,
    prazo: diasFinalizacao,
    custoFinalizacao,
    totalEquipe: custoTotalMaoObra, // Total de todas as equipes (concretagem + acabamento + preparação + finalização + horas extras)
    percentualTotalEquipe: 0
  };

  // EQUIPAMENTOS
  const equipamentosComCusto: EquipamentoComCusto[] = formData.equipamentosSelecionados
  .filter(eq => eq.selecionado)
  .map(eq => {
    // Proteção: se equipamentosData for null, trata como array vazio
    const equipamentoInfo = (equipamentosData ?? []).find((e: any) => e.id === eq.id);
    if (!equipamentoInfo) return null;
    const dias_obra = prazoTotal + diasPreparacao + diasFinalizacao;
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
  .filter((eq): eq is EquipamentoComCusto => eq !== null); // Garante tipagem final correta


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
    percentualTotalEquipamentos: 0,
    quantidadeEquipamentos: equipamentosComCusto.reduce((sum, eq) => sum + eq.quantidade, 0),
  };

  // VEÍCULOS
  const veiculosComCusto: VeiculoComCusto[] = (veiculosObra ?? [])
  .map(vo => {
    const veiculoInfo = (veiculosDisponiveis ?? []).find((vd: any) => vd.veiculo === vo.veiculo);
    if (!veiculoInfo) return null;
    const dias_obra = prazoTotal + diasPreparacao + diasFinalizacao;
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
    percentualTotalVeiculos: 0,
  };

  // INSUMOS - valores fixos por tipo de acabamento
  const getValorInsumosPorId = (tipoAcabamentoId: string): { valor: number, nome: string } => {
    const id = parseInt(tipoAcabamentoId);
    
    // Buscar o nome na tabela tipo_acabamento
    const tipoAcabamento = tipoAcabamentoData?.find(t => t.id === id);
    const nomeTipo = tipoAcabamento?.nome || 'Não identificado';
    
    // Valores fixos baseados no ID
    if (id === 1) {
      return { valor: 0.32, nome: nomeTipo }; // Liso polido: R$ 0,32/m²
    } else if (id === 2) {
      return { valor: 0.20, nome: nomeTipo }; // Camurçado: R$ 0,20/m²
    } else if (id === 3) {
      return { valor: 0.12, nome: nomeTipo }; // Vassourado: R$ 0,12/m²
    }
    
    // Fallback: tentar pelo nome se o ID não for reconhecido
    const nomeMinusculo = nomeTipo.toLowerCase();
    if (nomeMinusculo.includes('liso') || nomeMinusculo.includes('polido')) {
      return { valor: 0.32, nome: nomeTipo };
    } else if (nomeMinusculo.includes('camurçado') || nomeMinusculo.includes('camurcado')) {
      return { valor: 0.20, nome: nomeTipo };
    } else if (nomeMinusculo.includes('vassourado')) {
      return { valor: 0.12, nome: nomeTipo };
    }
    
    return { valor: 0.20, nome: nomeTipo }; // Padrão: Camurçado
  };

  const { valor: valorPorM2Insumo, nome: nomeAcabamento } = getValorInsumosPorId(formData.tipoAcabamento);
  const totalInsumos = valorPorM2Insumo * areaTotal;
  
  console.log("🏗️ === CÁLCULO DE INSUMOS ===", {
    tipoAcabamentoId: formData.tipoAcabamento,
    nomeAcabamento: nomeAcabamento,
    valorPorM2: `R$ ${valorPorM2Insumo.toFixed(2)}/m²`,
    areaTotal: `${areaTotal} m²`,
    totalInsumos: `R$ ${totalInsumos.toFixed(2)}`,
    formula: `${valorPorM2Insumo} × ${areaTotal} = ${totalInsumos.toFixed(2)}`
  });

  const insumos: Insumos = {
    tipoAcabamento: nomeAcabamento,
    area: areaTotal,
    dias: prazoTotal,
    valorPorM2: valorPorM2Insumo,
    totalInsumos,
    percentualTotalInsumos: 0
  };

  // DESPESAS ADICIONAIS
  const despesasAdicionais = {
    frete: parseFloat(formData.frete || "0"),
    hospedagem: parseFloat(formData.hospedagem || "0"),
    locacaoEquipamento: parseFloat(formData.locacaoEquipamento || "0"),
    locacaoVeiculo: parseFloat(formData.locacaoVeiculo || "0"),
    material: parseFloat(formData.material || "0"),
    passagem: parseFloat(formData.passagem || "0"),
    extra: parseFloat(formData.extra || "0"),
    total: 0
  };
  despesasAdicionais.total = Object.values(despesasAdicionais).reduce((acc, val) => typeof val === 'number' ? acc + val : acc, 0);

  // CUSTO GERAL
  const custoExecucao = totalEquipamentos + totalVeiculos + totalInsumos + despesasAdicionais.total + custoTotalMaoObra;
  const custoTotalGeral = custoExecucao + despesasFixasEmpresa;

  console.log('=== DEBUG COMPOSIÇÃO DOS CUSTOS ===', {
    custoTotalObra: custoTotalGeral,
    custoTotalMaoObra: custoTotalMaoObra,
    custoTotalEquipamentos: totalEquipamentos,
    custoTotalVeiculos: totalVeiculos,  
    despesasFixas: despesasFixasEmpresa,
    'insumosCalculados.totalInsumos': totalInsumos,
    outrosCustos: despesasAdicionais.total,
    custoExecucao: custoExecucao,
    formula_custoExecucao: `${totalEquipamentos} + ${totalVeiculos} + ${totalInsumos} + ${despesasAdicionais.total} + ${custoTotalMaoObra} = ${custoExecucao}`,
    formula_custoTotalGeral: `${custoExecucao} + ${despesasFixasEmpresa} = ${custoTotalGeral}`,
  });

  // DESPESAS FIXAS
  const demaisDespesasFixas: DemaisDespesasFixas = {
    valorEmpresaPorM2: areaTotal > 0 ? despesasFixasEmpresa / areaTotal : 0,
    valorTotalPorM2: areaTotal > 0 ? custoTotalGeral / areaTotal : 0,
    areaTotalObra: areaTotal,
    despesasFixas: despesasFixasEmpresa,
    percentualDespesasFixas: custoTotalGeral > 0 ? (despesasFixasEmpresa / custoTotalGeral) * 100 : 0,
    custoExecucao: custoExecucao,
    percentualCustoExecucao: custoTotalGeral > 0 ? (custoExecucao / custoTotalGeral) * 100 : 0
  };

  // CUSTOS DERIVADOS DA VENDA
  const precoVendaM2 = parseFloat(formData.precoVenda) || 0;
  const valorTotalVenda = precoVendaM2 * areaTotal;
  
  // Calcular alíquota do Simples baseada no faturamento definido pelo usuário
  console.log("🔍 Buscando alíquota do Simples para userId:", userId);
  const { faturamentoMaximo, aliquota } = await calcularAliquotaSimples(userId);
  
  console.log("📊 Resultado da função calcularAliquotaSimples:", {
    faturamentoMaximo: faturamentoMaximo,
    aliquota: aliquota
  });
  
  const lucroDesejado = parseFloat(formData.lucroDesejado) || 0;
  const comissaoPercentual = parseFloat(formData.comissao) || 0;
  
  // Calcular valores temporários para a fórmula do preço de venda
  // Estes serão recalculados depois com o preço de venda correto
  const impostoSimples = valorTotalVenda * (aliquota / 100);
  const margemLucro = valorTotalVenda * (lucroDesejado / 100);
  const comissoes = valorTotalVenda * (comissaoPercentual / 100);
  
  // Log temporário removido - será calculado após obter o preço de venda correto

  const custoDerivadosVenda: CustoDerivadosVenda = {
    faturamento12Meses: faturamentoMaximo,
    percentualFaturamento: 0,
    impostoSimples,
    percentualImpostoSimples: aliquota,
    margemLucro,
    percentualMargemLucro: 0,
    comissoes,
    percentualComissoes: 0
  };

  // OUTROS CUSTOS
  const outrosCustos: OutrosCustos = {
    totalOutrosCustos: despesasAdicionais.total,
    totalM2: areaTotal > 0 ? despesasAdicionais.total / areaTotal : 0,
    frete: despesasAdicionais.frete,
    hospedagem: despesasAdicionais.hospedagem,
    locacaoEquipamento: despesasAdicionais.locacaoEquipamento,
    locacaoVeiculo: despesasAdicionais.locacaoVeiculo,
    material: despesasAdicionais.material,
    passagem: despesasAdicionais.passagem,
    extra: despesasAdicionais.extra
  };  
  

  // PREÇO DE VENDA E RESULTADO
  // Fórmula: PreçoVenda = CustoTotal / (1 - (comissão% + alíquota% + lucro%))
  const percentualTotal = (comissaoPercentual + aliquota + lucroDesejado) / 100;
  const divisor = 1 - percentualTotal;
  
  // Prevenir divisão por zero ou valores negativos
  const precoVendaCalculado = divisor > 0 ? custoTotalGeral / divisor : custoTotalGeral;
  const precoVendaFinalPorM2 = areaTotal > 0 ? precoVendaCalculado / areaTotal : 0;
  const resultado1 = precoVendaCalculado;
  
  // TESTE FORÇADO: Forçar preço manual igual ao calculado
  const precoVendaPorM2Manual = precoVendaFinalPorM2;
  const precoVendaTotalManualForcado = precoVendaPorM2Manual * areaTotal;
  
  console.log('=== DEBUG PREÇO CALCULADO ===', {
    areaTotalNum: areaTotal,
    custoTotalObra: custoTotalGeral,
    custoTotalPorM2: areaTotal > 0 ? custoTotalGeral / areaTotal : 0,
    margemLucro: 1 + (lucroDesejado / 100),
    precoVendaPorM2Calculado: precoVendaFinalPorM2,
    precoVendaTotalCalculado: precoVendaCalculado,
    lucroCalculado: precoVendaCalculado - custoTotalGeral,
  });

  console.log('=== ANÁLISE PERCENTUAL DO LUCRO ===', {
    lucroDesejadoInput: lucroDesejado,
    custoTotalObra: custoTotalGeral,
    precoVendaPorM2Calculado: precoVendaFinalPorM2,
    precoVendaTotalCalculado: precoVendaCalculado,
    lucroCalculado: precoVendaCalculado - custoTotalGeral,
    'lucroCalculado / custoTotalObra * 100': ((precoVendaCalculado - custoTotalGeral) / custoTotalGeral) * 100,
    'lucroCalculado / precoVendaCalculado * 100': ((precoVendaCalculado - custoTotalGeral) / precoVendaCalculado) * 100,
    resultado1: resultado1,
    'resultado1 === precoVendaCalculado': resultado1 === precoVendaCalculado,
    'precoVendaFinalPorM2 * areaTotal === precoVendaCalculado': (precoVendaFinalPorM2 * areaTotal) === precoVendaCalculado,
    diferenca_multiplicacao: (precoVendaFinalPorM2 * areaTotal) - precoVendaCalculado,
  });
  
  console.log("📈 === CÁLCULO DO PREÇO DE VENDA ===", {
    custoTotal: `R$ ${custoTotalGeral.toFixed(2)}`,
    comissaoPercentual: `${comissaoPercentual}%`,
    aliquotaPercentual: `${aliquota}%`, 
    lucroDesejado: `${lucroDesejado}%`,
    percentualTotal: `${(percentualTotal * 100).toFixed(2)}%`,
    divisor: divisor.toFixed(4),
    precoVendaCalculado: `R$ ${precoVendaCalculado.toFixed(2)}`,
    precoVendaPorM2: `R$ ${precoVendaFinalPorM2.toFixed(2)}/m²`,
    formula: `${custoTotalGeral.toFixed(2)} / (1 - ${(percentualTotal).toFixed(4)}) = ${precoVendaCalculado.toFixed(2)}`
  });
  
  // Recalcular valores baseados no preço de venda calculado
  const impostoSimplesCalculado = precoVendaCalculado * (aliquota / 100);
  const margemLucroCalculada = precoVendaCalculado * (lucroDesejado / 100);
  const comissoesCalculadas = precoVendaCalculado * (comissaoPercentual / 100);
  
  console.log("💰 === VALORES FINAIS CALCULADOS ===", {
    precoVendaCalculado: `R$ ${precoVendaCalculado.toFixed(2)}`,
    impostoSimples: `R$ ${impostoSimplesCalculado.toFixed(2)} (${aliquota}%)`,
    comissoes: `R$ ${comissoesCalculadas.toFixed(2)} (${comissaoPercentual}%)`,
    margemLucro: `R$ ${margemLucroCalculada.toFixed(2)} (${lucroDesejado}%)`,
    custoTotal: `R$ ${custoTotalGeral.toFixed(2)}`,
    lucroLiquido: `R$ ${(precoVendaCalculado - custoTotalGeral - impostoSimplesCalculado - comissoesCalculadas).toFixed(2)}`
  });
  
  // Coluna da direita: Se o preço de venda for X, qual é a margem de lucro
  const precoVendaTotalManual = precoVendaM2 * areaTotal; // USANDO VALOR MANUAL INSERIDO
  
  // CORREÇÃO: Usar o mesmo método de cálculo de lucro que o lado esquerdo
  // Calcular impostos, comissões e outros derivados do preço manual
  const impostoSimplesManual = precoVendaTotalManual * (aliquota / 100);
  const comissoesManual = precoVendaTotalManual * (comissaoPercentual / 100);
  
  // Margem de lucro = preço total - custos totais - impostos - comissões
  const margemLucroManual = precoVendaTotalManual > custoTotalGeral ? 
    precoVendaTotalManual - custoTotalGeral - impostoSimplesManual - comissoesManual : 0;
  
  // Percentual de lucro sobre o preço de venda (igual ao lado esquerdo)
  const percentualLucroManual = precoVendaTotalManual > 0 ? (margemLucroManual / precoVendaTotalManual) * 100 : 0;

  console.log("🔄 === CORREÇÃO DO CÁLCULO MANUAL ===", {
    precoVendaTotalManual: `R$ ${precoVendaTotalManual.toFixed(2)}`,
    custoTotalGeral: `R$ ${custoTotalGeral.toFixed(2)}`,
    impostoSimplesManual: `R$ ${impostoSimplesManual.toFixed(2)} (${aliquota}%)`,
    comissoesManual: `R$ ${comissoesManual.toFixed(2)} (${comissaoPercentual}%)`,
    margemLucroManual: `R$ ${margemLucroManual.toFixed(2)}`,
    percentualLucroManual: `${percentualLucroManual.toFixed(2)}%`,
    formula: `${precoVendaTotalManual.toFixed(2)} - ${custoTotalGeral.toFixed(2)} - ${impostoSimplesManual.toFixed(2)} - ${comissoesManual.toFixed(2)} = ${margemLucroManual.toFixed(2)}`
  });

  console.log('=== DEBUG PREÇO INFORMADO ===', {
    areaTotalNum: areaTotal,
    custoTotalObra: custoTotalGeral,
    precoVendaPorM2Manual: precoVendaM2,
    precoVendaTotalManual,
    lucroManual: precoVendaTotalManual - custoTotalGeral,
  });

  console.log('=== COMPARAÇÃO LADO A LADO ===', {
    custoTotalObra: custoTotalGeral,
    precoVendaCalculadoTotal: precoVendaCalculado,
    precoVendaManualTotal: precoVendaTotalManual,
    lucroCalculado: precoVendaCalculado - custoTotalGeral,
    lucroManual: precoVendaTotalManual - custoTotalGeral,
    diferencaLucro: (precoVendaCalculado - custoTotalGeral) - (precoVendaTotalManual - custoTotalGeral),
  });

  console.log('=== COMPARAÇÃO CALCULADO VS INFORMADO ===', {
    custoTotalObra: custoTotalGeral,
    precoVendaPorM2Calculado: precoVendaFinalPorM2,
    precoVendaTotalCalculado: precoVendaFinalPorM2 * areaTotal,
    lucroCalculado: (precoVendaFinalPorM2 * areaTotal) - custoTotalGeral,
    precoVendaPorM2Manual: precoVendaM2,
    precoVendaTotalManual,
    lucroManual: precoVendaTotalManual - custoTotalGeral,
    diferencaLucro: ((precoVendaFinalPorM2 * areaTotal) - custoTotalGeral) - (precoVendaTotalManual - custoTotalGeral),
  });

  console.log('=== TESTE FORÇADO: PREÇOS IGUAIS ===', {
    areaTotal,
    custoTotalObra: custoTotalGeral,
    // CALCULADO
    precoVendaPorM2Calculado: precoVendaFinalPorM2,
    precoVendaTotalCalculado: precoVendaFinalPorM2 * areaTotal,
    lucroCalculado: (precoVendaFinalPorM2 * areaTotal) - custoTotalGeral,
    // MANUAL (FORÇADO)
    precoVendaPorM2Manual: precoVendaPorM2Manual,
    precoVendaTotalManual: precoVendaTotalManual,
    lucroManual: precoVendaTotalManual - custoTotalGeral,
    // COMPARAÇÃO
    precosSaoExatamenteIguais: precoVendaFinalPorM2 === precoVendaPorM2Manual,
    precosEmReaisSaoIguais: (precoVendaFinalPorM2 * areaTotal) === precoVendaTotalManual,
    lucrosSaoIguais: ((precoVendaFinalPorM2 * areaTotal) - custoTotalGeral) === (precoVendaTotalManual - custoTotalGeral),
    diferencaLucro: ((precoVendaFinalPorM2 * areaTotal) - custoTotalGeral) - (precoVendaTotalManual - custoTotalGeral),
    diferencaPrecoTotal: (precoVendaFinalPorM2 * areaTotal) - precoVendaTotalManual,
  });

  console.log('=== DEBUG VARIÁVEIS DETALHADAS ===', {
    areaTotal,
    custoTotalPorM2: areaTotal > 0 ? custoTotalGeral / areaTotal : 0,
    resultado1,
    precoVendaFinalPorM2,
    precoVendaCalculado,
    // Verificar se há arredondamentos
    precoVendaFinalPorM2_original: areaTotal > 0 ? precoVendaCalculado / areaTotal : 0,
    precoVendaFinalPorM2_sofreu_arredondamento: precoVendaFinalPorM2 !== (areaTotal > 0 ? precoVendaCalculado / areaTotal : 0),
    // Valores usados no cálculo manual
    precoVendaPorM2Manual,
    precoVendaTotalManualForcado,
    precoVendaTotalManual,
    // Comparações de precisão
    multiplicacao_calculado: precoVendaFinalPorM2 * areaTotal,
    multiplicacao_manual: precoVendaPorM2Manual * areaTotal,
    diferenca_multiplicacao: (precoVendaFinalPorM2 * areaTotal) - (precoVendaPorM2Manual * areaTotal),
  });

  const precoVenda: PrecoVenda = {
    precoVendaPorM2: precoVendaFinalPorM2, // Preço por m² calculado pela fórmula
    sePrecoVendaPorM2For: precoVendaM2, // Preço manual inserido pelo usuário
    valorTotal: resultado1, // Valor total calculado pela fórmula
    resultado1: margemLucroManual, // CORREÇÃO: Margem de lucro em R$ corrigida
    resultadoPercentual: percentualLucroManual // CORREÇÃO: Percentual de lucro corrigido
  };

  // FINAL
  const resultadoFinal: SimulacaoResult = {
    dadosTecnicos,
    equipeConcretagemAcabamento: {
      ...equipeConcretagemAcabamento,
      percentualTotalEquipe: (equipeConcretagemAcabamento.totalEquipe / custoTotalGeral) * 100
    },
    preparacaoObra: {
      ...preparacaoObra,
      percentualTotalEquipe: (preparacaoObra.totalEquipe / custoTotalGeral) * 100
    },
    finalizacaoObra: {
      ...finalizacaoObra,
      percentualTotalEquipe: (custoTotalMaoObra / custoTotalGeral) * 100
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
      percentualDespesasFixas: (despesasFixasEmpresa / custoTotalGeral) * 100,
      percentualCustoExecucao: (custoExecucao / custoTotalGeral) * 100,
    },
    custoDerivadosVenda: {
      faturamento12Meses: faturamentoMaximo,
      percentualFaturamento: 100,
      impostoSimples: impostoSimplesCalculado,
      percentualImpostoSimples: aliquota,
      margemLucro: margemLucroCalculada,
      percentualMargemLucro: lucroDesejado,
      comissoes: comissoesCalculadas,
      percentualComissoes: comissaoPercentual,
    },
    outrosCustos,
    precoVenda,
    valorTotal: resultado1,
    precoVendaM2: precoVendaFinalPorM2,
    lucroTotal: margemLucroCalculada,
    custoEquipamentos: totalEquipamentos,
    custoVeiculos: totalVeiculos,
    diasTotais: prazoTotal + diasPreparacao + diasFinalizacao,
    volumeConcretoM3: concreto,
  };

  console.log('=== RESULTADO FINAL CALCULADO ===', {
    custoTotalObra: custoTotalGeral,
    valorTotalPorM2: areaTotal > 0 ? custoTotalGeral / areaTotal : 0,
    custoExecucao: custoExecucao,
    despesasFixas: despesasFixasEmpresa,
    precoVendaM2: precoVendaFinalPorM2,
    lucroCalculado: resultado1 - custoTotalGeral,
    percentualLucroSobreCusto: ((resultado1 - custoTotalGeral) / custoTotalGeral) * 100,
    percentualLucroSobreVenda: ((resultado1 - custoTotalGeral) / resultado1) * 100,
  });

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
  console.log('Iniciando salvamento da simulação...');
  console.log('UserID:', userId);
  
  console.log('=== SALVANDO SIMULAÇÃO ===', { 
    custoTotalObra: resultado.demaisDespesasFixas?.custoExecucao + resultado.demaisDespesasFixas?.despesasFixas || 0, 
    valorTotalPorM2: resultado.demaisDespesasFixas?.valorTotalPorM2 || 0,
    custoExecucao: resultado.demaisDespesasFixas?.custoExecucao || 0,
    despesasFixas: resultado.demaisDespesasFixas?.despesasFixas || 0,
    precoVendaM2: resultado.precoVendaM2 || 0
  });
  
  try {
    const { data, error } = await supabase
      .from('obras')
      .insert([
        {
          usuarios_id: parseInt(userId),
          simulacao: true,
          nome: formData.nomeObra,
          construtora: formData.construtora,
          status: 'SIMULACAO',
          telefone_responsavel: formData.telefoneContato,
          nome_contato: formData.nomeContato,
          endereco: formData.endereco,
          area_total_metros_quadrados: parseFloat(formData.areaTotal),
          tipo_acabamento_id: parseInt(formData.tipoAcabamento) || null,
          distancia_ate_obra: parseFloat(formData.distanciaObra),
          equipes_concretagem_id: parseInt(formData.equipeConcretagem) || null,
          equipes_acabamento_id: parseInt(formData.equipeAcabamento) || null,
          equipes_preparacao_id: parseInt(formData.equipePreparacao) || null,
          equipes_finalizacao_id: parseInt(formData.equipeFinalizacao) || null,
          prazo_preparacao_obra: parseInt(formData.prazoPreparacao) || 0,
          prazo_concretagem: parseInt(formData.prazoConcretagem) || 0,
          prazo_acabamento: parseInt(formData.prazoAcabamento) || 0,
          prazo_finalizacao_obra: parseInt(formData.prazoFinalizacao) || 0,
          valor_frete: parseFloat(formData.frete),
          valor_hospedagem: parseFloat(formData.hospedagem),
          valor_material: parseFloat(formData.material),
          valor_passagem: parseFloat(formData.passagem),
          valor_extra: parseFloat(formData.extra),
          percentual_comissao: parseFloat(formData.comissao) || 0,
          preco_venda_metro_quadrado: parseFloat(formData.precoVenda),
          preco_venda_metro_quadrado_calculo: resultado.precoVendaM2,
          custo_total_obra: (() => {
            // Somar todos os custos de mão de obra
            const custoEquipeConcretagemAcabamento = resultado.equipeConcretagemAcabamento?.totalEquipe || 0;
            const custoPreparacao = resultado.preparacaoObra?.totalEquipe || 0;
            const custoFinalizacao = resultado.finalizacaoObra?.custoFinalizacao || 0;
            const custoMaoObraTotal = custoEquipeConcretagemAcabamento + custoPreparacao + custoFinalizacao;
            
            const custoEquipamentos = resultado.custoEquipamentos || 0;
            const custoVeiculos = resultado.custoVeiculos || 0;
            const custoInsumos = resultado.insumos?.totalInsumos || 0;
            const outrosCustos = resultado.outrosCustos?.totalOutrosCustos || 0;
            const despesasFixas = resultado.demaisDespesasFixas?.despesasFixas || 0;
            const custoTotal = custoMaoObraTotal + custoEquipamentos + custoVeiculos + custoInsumos + outrosCustos + despesasFixas;
            
            console.log("💰 === CÁLCULO DO CUSTO TOTAL PARA SALVAR ===", {
              custoEquipeConcretagemAcabamento: `R$ ${custoEquipeConcretagemAcabamento.toFixed(2)}`,
              custoPreparacao: `R$ ${custoPreparacao.toFixed(2)}`,
              custoFinalizacao: `R$ ${custoFinalizacao.toFixed(2)}`,
              custoMaoObraTotal: `R$ ${custoMaoObraTotal.toFixed(2)}`,
              custoEquipamentos: `R$ ${custoEquipamentos.toFixed(2)}`,
              custoVeiculos: `R$ ${custoVeiculos.toFixed(2)}`,
              custoInsumos: `R$ ${custoInsumos.toFixed(2)}`,
              outrosCustos: `R$ ${outrosCustos.toFixed(2)}`,
              despesasFixas: `R$ ${despesasFixas.toFixed(2)}`,
              custoTotal: `R$ ${custoTotal.toFixed(2)}`,
              formula: `${custoMaoObraTotal} + ${custoEquipamentos} + ${custoVeiculos} + ${custoInsumos} + ${outrosCustos} + ${despesasFixas} = ${custoTotal}`
            });
            
            return custoTotal;
          })(),
          percentual_lucro_desejado: parseFloat(formData.lucroDesejado),
          valor_total: resultado.valorTotal,
          lucro_total: resultado.lucroTotal,
          horas_inicio_concretagem: formData.inicioHora,
          horas_inicio_acabamento: resultado.dadosTecnicos.inicioAcabamento,
          equipamentos_selecionados: formData.equipamentosSelecionados,
          area_por_dia: parseInt(formData.areaPorDia),
          custo_equipamentos: resultado.custoEquipamentos,
          custo_mao_obra: resultado.custoMaoObra?.total || 0,
          custo_materiais: resultado.custoMateriais?.total || 0,
          custo_insumos: resultado.insumos?.totalInsumos || 0,
          custo_veiculos: resultado.custoVeiculos,
          distancia_obra: parseInt(formData.distanciaObra),
          espessura_piso: parseInt(formData.espessura),
          lancamento_concreto: formData.lancamentoConcreto,
          prazo_obra: parseInt(formData.prazoObra),
          tipo_reforco_estrutural_id: parseInt(formData.reforcoEstrutural) || null,
          area_por_hora: resultado.dadosTecnicos.areaConcretaPorHora,
          final_concretagem: resultado.dadosTecnicos.finalConcretagem,
          final_acabamento: resultado.dadosTecnicos.finalAcabamento,
          hora_concretagem: Math.round(resultado.dadosTecnicos.horasConcretagem),
          hora_acabamento: Math.round(resultado.dadosTecnicos.horasAcabamento),
          sobreposicao_ca: Math.round(resultado.dadosTecnicos.sobreposicaoCA),
          valor_locacao_veiculos: parseFloat(formData.locacaoVeiculo),
          valor_locacao_equipamento: parseFloat(formData.locacaoEquipamento),
          custo_horas_extra_concretagem: resultado.equipeConcretagemAcabamento.custoHEEquipeConcretagem,
          custo_horas_extra_acabamento: resultado.equipeConcretagemAcabamento.custoHEAcabamento,
          custo_total_horas_extras: resultado.equipeConcretagemAcabamento.custoHEEquipeConcretagem + resultado.equipeConcretagemAcabamento.custoHEAcabamento,
          horas_extra_acabamento: Math.round(resultado.equipeConcretagemAcabamento.horaExtraEquipeAcabamento),
          horas_extra_concretagem: Math.round(resultado.equipeConcretagemAcabamento.horasExtraEquipeConcretagem),
          custo_finalizacao: resultado.finalizacaoObra.custoFinalizacao,
          custo_preparacao: resultado.preparacaoObra.custoPreparacao
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro detalhado ao salvar simulação:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      // Verificar erros específicos
      if (error.code === 'PGRST301') {
        throw new Error('Erro de permissão: Verifique as políticas RLS da tabela obras');
      } else if (error.code === '42501') {
        throw new Error('Erro de permissão: Usuário não tem permissão para inserir dados');
      } else if (error.code === '23505') {
        throw new Error('Erro de duplicidade: Esta obra já existe');
      } else {
        throw new Error(`Erro ao salvar simulação: ${error.message}`);
      }
    }

    console.log('Simulação salva com sucesso:', data?.id);
    return {
      simulacaoId: data.id,
      orcamentoData: orcamentoData.map(o => ({ ...o, data_orcamento: format(new Date(o.data_orcamento), 'yyyy-MM-dd') })),
      ...resultado,
    }
  } catch (error: any) {
    console.error('Erro ao salvar simulação:', error);
    throw error; // Re-throw para ser tratado pelo chamador
  }
}

export async function calcularCustosTotais(simulacaoId: number) {
  // Implementação futura ou ajuste se necessário
}
