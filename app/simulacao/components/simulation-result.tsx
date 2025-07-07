"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calculator, DollarSign, Clock, Users, Settings, Package, Wrench, Car, CheckCircle } from "lucide-react"
import type { SimulacaoResult } from "@/lib/simulacao-calculator.tsx"

interface SimulationResultProps {
  data: SimulacaoResult
  onVoltar: () => void
}

export function SimulationResult({ data, onVoltar }: SimulationResultProps) {
  if (!data || !data.dadosTecnicos) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4">Dados da simulação não disponíveis.</p>
        <Button onClick={onVoltar}>Voltar</Button>
      </div>
    )
  }

  const formatarMoeda = (valor: number | undefined | null): string => {
    if (valor === undefined || valor === null || isNaN(valor)) {
      return "R$ 0,00"
    }
    return `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatarNumero = (valor: number | undefined | null, decimais = 2): string => {
    if (valor === undefined || valor === null || isNaN(valor)) {
      return "0,00"
    }
    return valor.toLocaleString("pt-BR", { minimumFractionDigits: decimais, maximumFractionDigits: decimais })
  }

  const formatarPercentual = (valor: number): string => {
    return `${valor.toFixed(2)}%`
  }

  // Verificações de segurança para objetos aninhados
  const dadosTecnicos = data.dadosTecnicos || {}
  const equipeConcretagemAcabamento = data.equipeConcretagemAcabamento || {}
  const preparacaoObra = data.preparacaoObra || {}
  console.log('[DEBUG] preparacaoObra recebido:', preparacaoObra)
  const equipamentos = data.equipamentos || { equipamentos: [], totalEquipamentos: 0, percentualTotalEquipamentos: 0, quantidadeEquipamentos: 0 }
  const veiculos = data.veiculos || { veiculos: [], totalVeiculos: 0, percentualTotalVeiculos: 0 }
  const insumos = data.insumos || {}
  const demaisDespesasFixas = data.demaisDespesasFixas || {}
  const custoDerivadosVenda = data.custoDerivadosVenda || {}
  const outrosCustos = data.outrosCustos || {}
  const precoVenda = data.precoVenda || {}
  const finalizacaoObra = data.finalizacaoObra || {}

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">

      {/* 1. Dados Técnicos */}
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Dados técnicos
          </CardTitle>
          </CardHeader>
          <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="font-medium">Reforço Estrutural: {dadosTecnicos.reforcoEstrutural || 'N/A'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="font-medium">Área total da obra:</p>
              <p className="text-gray-600">{formatarNumero(dadosTecnicos.areaTotal, 0)} M²</p>
            </div>
            <div>
              <p className="font-medium">Área/Dia:</p>
              <p className="text-gray-600">{formatarNumero(dadosTecnicos.areaPorDia, 0)} M²/Dia</p>
            </div>
            <div>
              <p className="font-medium">Prazo total da obra:</p>
              <p className="text-gray-600">{dadosTecnicos.prazoTotal || 0} Dias</p>
            </div>
            <div>
              <p className="font-medium">Espessura:</p>
              <p className="text-gray-600">{dadosTecnicos.espessura || 0} cm</p>
            </div>
            <div>
              <p className="font-medium">Lançamento:</p>
              <p className="text-gray-600">{formatarNumero(dadosTecnicos.lancamento, 0)}M³/hora</p>
            </div>
            <div>
              <p className="font-medium">Área concreta p/ hora:</p>
              <p className="text-gray-600">{formatarNumero(dadosTecnicos.areaConcretaPorHora, 2)} M²/hora</p>
            </div>
            <div>
              <p className="font-medium">Início da concretagem:</p>
              <p className="text-gray-600">{dadosTecnicos.inicioConcretagem || 'N/A'} horas</p>
            </div>
            <div>
              <p className="font-medium">Início do acabamento:</p>
              <p className="text-gray-600">{dadosTecnicos.inicioAcabamento || 'N/A'} horas</p>
            </div>
            <div>
              <p className="font-medium">Final do Acabamento:</p>
              <p className="text-gray-600">{dadosTecnicos.finalAcabamento || 'N/A'} horas</p>
            </div>
            <div>
              <p className="font-medium">Horas de Concretagem:</p>
              <p className="text-gray-600">{dadosTecnicos.horasConcretagem || 0} horas</p>
            </div>
            <div>
              <p className="font-medium">Horas de acabamento:</p>
              <p className="text-gray-600">{dadosTecnicos.horasAcabamento || 0} horas</p>
            </div>
            <div>
              <p className="font-medium">Sobreposição C/A:</p>
              <p className="text-gray-600">{dadosTecnicos.sobreposicaoCA || 0} horas</p>
            </div>
            <div>
              <p className="font-medium">Concreto:</p>
                              <p className="text-gray-600">{formatarNumero(dadosTecnicos.concreto, 0)} m³</p>
            </div>
            <div>
              <p className="font-medium">Final da concretagem:</p>
              <p className="text-gray-600">{dadosTecnicos.finalConcretagem || 'N/A'} horas</p>
            </div>
            <div>
              <p className="font-medium">Preparo dia seguinte:</p>
              <p className="text-gray-600">{dadosTecnicos.preparoDiaSeguinte || 0} horas</p>
            </div>
          </div>
          </CardContent>
        </Card>

      {/* 2. Equipe concretagem e acabamento */}
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Equipe concretagem e acabamento
          </CardTitle>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-medium">Equipe Total:</p>
              <p className="text-gray-600">{equipeConcretagemAcabamento.equipeTotal || 0} pessoas</p>
            </div>
            <div>
              <p className="font-medium">Custo Equipe:</p>
              <p className="text-gray-600">{formatarMoeda(equipeConcretagemAcabamento.custoEquipe)}</p>
            </div>
            <div>
              <p className="font-medium">Equipe Concretagem:</p>
              <p className="text-gray-600">{equipeConcretagemAcabamento.equipeConcretagem || 0} pessoas</p>
            </div>
            <div>
              <p className="font-medium">Horas extra equipe concretagem:</p>
              <p className="text-gray-600">{equipeConcretagemAcabamento.horasExtraEquipeConcretagem || 0} horas</p>
            </div>
            <div>
              <p className="font-medium">Custo HE equipe concretagem:</p>
              <p className="text-gray-600">{formatarMoeda(equipeConcretagemAcabamento.custoHEEquipeConcretagem)}</p>
            </div>
            <div>
              <p className="font-medium">Hora extra equipe acabamento:</p>
              <p className="text-gray-600">{equipeConcretagemAcabamento.horaExtraEquipeAcabamento || 0} Horas</p>
            </div>
            <div>
              <p className="font-medium">Equipe Acabamento:</p>
              <p className="text-gray-600">{equipeConcretagemAcabamento.equipeAcabamento || 0} pessoas</p>
            </div>
            <div>
              <p className="font-medium">Custo HE acabamento:</p>
              <p className="text-gray-600">{formatarMoeda(equipeConcretagemAcabamento.custoHEAcabamento)}</p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Equipe:</span>
              <span className="font-bold">{formatarMoeda(equipeConcretagemAcabamento.totalEquipe)} ({formatarPercentual(equipeConcretagemAcabamento.percentualTotalEquipe || 0)})</span>
            </div>
          </div>
          </CardContent>
        </Card>

      {/* 3. Preparação da obra */}
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Preparação da obra
          </CardTitle>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-medium">Equipe Total:</p>
              <p className="text-gray-600">{preparacaoObra.equipeTotal || 0} pessoas</p>
            </div>
            <div>
              <p className="font-medium">Prazo:</p>
              <p className="text-gray-600">{preparacaoObra.prazo || 0} dias</p>
            </div>
            <div>
              <p className="font-medium">Custo de preparação:</p>
              <p className="text-gray-600">{formatarMoeda(preparacaoObra.custoPreparacao)}</p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Equipe:</span>
              <span className="font-bold">{formatarMoeda(preparacaoObra.totalEquipe)} ({formatarPercentual(preparacaoObra.percentualTotalEquipe || 0)})</span>
            </div>
          </div>
          </CardContent>
        </Card>

      {/* 4. Finalização da obra */}
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Finalização da obra
          </CardTitle>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-medium">Equipe Total:</p>
              <p className="text-gray-600">{finalizacaoObra.equipeTotal || 0} pessoas</p>
            </div>
            <div>
              <p className="font-medium">Prazo:</p>
              <p className="text-gray-600">{finalizacaoObra.prazo || 0} dias</p>
            </div>
            <div>
              <p className="font-medium">Custo de finalização:</p>
              <p className="text-gray-600">{formatarMoeda(finalizacaoObra.custoFinalizacao)}</p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Equipe:</span>
              <span className="font-bold">{formatarMoeda(finalizacaoObra.totalEquipe)} ({formatarPercentual(finalizacaoObra.percentualTotalEquipe || 0)})</span>
            </div>
          </div>
          </CardContent>
        </Card>

      {/* 5. Equipamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Equipamentos
            </CardTitle>
          </CardHeader>
        <CardContent>
          {equipamentos.equipamentos.length > 0 && (
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-4 gap-4 font-medium text-sm bg-gray-100 p-2 rounded">
                <span>Equipamento</span>
                <span>Valor/Dia (R$)</span>
                <span>Dias</span>
                <span>Quantidade</span>
              </div>
              {equipamentos.equipamentos.map((equipamento, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 p-2 border rounded">
                  <span>{equipamento.nome}</span>
                  <span>{formatarMoeda(equipamento.valorDia)}</span>
                  <span>{equipamento.dias}</span>
                  <span>{equipamento.quantidade}</span>
            </div>
              ))}
            </div>
          )}
          <Separator className="my-4" />
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total equipamentos:</span>
              <span className="font-bold">{formatarMoeda(equipamentos.totalEquipamentos)} ({formatarPercentual(equipamentos.percentualTotalEquipamentos || 0)})</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span>Qtd. equipamento:</span>
              <span>{equipamentos.quantidadeEquipamentos}</span>
            </div>
            </div>
          </CardContent>
        </Card>

      {/* 6. Veículos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Veículos
            </CardTitle>
          </CardHeader>
        <CardContent>
          {veiculos.veiculos.length > 0 && (
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-5 gap-4 font-medium text-sm bg-gray-100 p-2 rounded">
                <span>Veículo</span>
                <span>Tipo</span>
                <span>R$/Km</span>
                <span>Quantidade</span>
                <span>Custo Total</span>
              </div>
              {veiculos.veiculos.map((veiculo, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 p-2 border rounded">
                  <span>{veiculo.veiculo}</span>
                  <span className="text-sm">{veiculo.tipo}</span>
                  <span>{formatarMoeda(veiculo.rs_km)}</span>
                  <span>{veiculo.quantidade}</span>
                  <span className="font-medium">{formatarMoeda(veiculo.custo_total)}</span>
                </div>
              ))}
            </div>
          )}
          {veiculos.veiculos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum veículo configurado para esta obra
            </div>
          )}
          <Separator className="my-4" />
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total veículos:</span>
              <span className="font-bold">{formatarMoeda(veiculos.totalVeiculos)} ({formatarPercentual(veiculos.percentualTotalVeiculos || 0)})</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span>Qtd. veículos:</span>
              <span>{veiculos.veiculos.length}</span>
            </div>
            </div>
          </CardContent>
        </Card>

      {/* 7. Insumos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Insumos
            </CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-medium">{insumos.tipoAcabamento || 'N/A'}</p>
              </div>
              <div>
                <p className="text-center">{formatarNumero(insumos.area, 0)}</p>
              </div>
              <div>
                <p className="text-center">{insumos.dias || 0}</p>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Insumos:</span>
              <span className="font-bold">{formatarMoeda(insumos.totalInsumos)} ({formatarPercentual(insumos.percentualTotalInsumos || 0)})</span>
            </div>
            </div>
          </CardContent>
        </Card>

      {/* 8. Demais despesas fixas */}
        <Card>
          <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Demais despesas fixas
          </CardTitle>
          </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="font-medium">Valor de cada empresa/M²</p>
              <p className="text-gray-600">{formatarMoeda(demaisDespesasFixas.valorEmpresaPorM2)} {formatarMoeda(demaisDespesasFixas.valorTotalPorM2)}</p>
            </div>
            <div>
              <p className="font-medium">Área total da obra</p>
              <p className="text-gray-600">{formatarNumero(demaisDespesasFixas.areaTotalObra, 0)}</p>
            </div>
            <div>
              <p className="font-medium">D. Fixas:</p>
              <p className="text-gray-600">{formatarMoeda(demaisDespesasFixas.despesasFixas)} ({formatarPercentual(demaisDespesasFixas.percentualDespesasFixas || 0)})</p>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="font-bold text-center mb-2">Total de custos de execução do piso</p>
            <div className="flex justify-between items-center">
              <span className="font-bold">Custos de execução:</span>
              <span className="font-bold">{formatarMoeda(demaisDespesasFixas.custoExecucao)} ({formatarPercentual(demaisDespesasFixas.percentualCustoExecucao || 0)})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 9. Custo derivados da venda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Custo derivados da venda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-center mb-3">Impostos</h4>
              <div className="space-y-2">
                <div>
                  <p className="font-medium">Faturamento 12 meses:</p>
                  <p className="text-gray-600">{formatarMoeda(custoDerivadosVenda.faturamento12Meses)} ({formatarPercentual(custoDerivadosVenda.percentualFaturamento || 0)})</p>
                </div>
                <div>
                  <p className="font-medium">Imposto simples:</p>
                  <p className="text-gray-600">{formatarMoeda(custoDerivadosVenda.impostoSimples)} ({formatarPercentual(custoDerivadosVenda.percentualImpostoSimples || 0)})</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-center mb-3">Lucros</h4>
              <div>
                <p className="font-medium">Margem de lucro:</p>
                <p className="text-gray-600">{formatarMoeda(custoDerivadosVenda.margemLucro)}({formatarPercentual(custoDerivadosVenda.percentualMargemLucro || 0)})</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-center mb-3">Comissões:</h4>
              <div>
                <p className="text-gray-600">{formatarMoeda(custoDerivadosVenda.comissoes)}({formatarPercentual(custoDerivadosVenda.percentualComissoes || 0)})</p>
              </div>
            </div>
            </div>
          </CardContent>
        </Card>

      {/* 10. Outros Custos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Outros Custos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Total Outros Custos</p>
              <p className="text-gray-600">{formatarMoeda(outrosCustos.totalOutrosCustos)}</p>
          </div>
            <div>
              <p className="font-medium">Total M²</p>
              <p className="text-gray-600">{formatarMoeda(outrosCustos.totalM2)}</p>
          </div>
          </div>
        </CardContent>
      </Card>

      {/* 11. Preço de Venda - Resultado Final */}
      <Card className="border-2 border-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <DollarSign className="h-5 w-5" />
            Preço de Venda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Preço de venda:</span>
                  <span>100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-lg">{formatarMoeda(precoVenda.precoVenda)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Valor total:</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-lg">{formatarMoeda(precoVenda.valorTotal)}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Preço de venda/ M²:</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-lg">{formatarMoeda(precoVenda.precoVendaPorM2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Resultado 1:</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-lg">{formatarMoeda(precoVenda.resultado1)}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Se preço de venda por M² for:</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-lg">{formatarMoeda(precoVenda.sePrecoVendaPorM2For)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Resultado (porcentagem):</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-lg text-green-600">{formatarPercentual(precoVenda.resultadoPercentual || 0)}</span>
                </div>
              </div>
            </div>
      </div>
        </CardContent>
      </Card>
    </div>
  )
}
