"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calculator, DollarSign, Clock, Users, Settings, Package, Wrench, Car, CheckCircle } from "lucide-react"
import type { SimulacaoResult } from "@/lib/simulacao-calculator"

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
    if (valor === undefined || valor === null) return 'R$ 0,00'
    // Os valores já estão em reais, não precisamos dividir por 100
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
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
  const equipamentos = data.equipamentos || { equipamentos: [], totalEquipamentos: 0, percentualTotalEquipamentos: 0, quantidadeEquipamentos: 0 }
  
  // Verificar se os equipamentos têm dados incompletos e buscar valores da tabela equipamentos
  const [equipamentosCorrigidos, setEquipamentosCorrigidos] = useState(equipamentos)
  
  useEffect(() => {
    const corrigirEquipamentos = async () => {
      if (equipamentos.equipamentos.length > 0) {
        const equipamentoIncompleto = equipamentos.equipamentos[0]
        if (!equipamentoIncompleto.valorDia && !equipamentoIncompleto.dias && equipamentoIncompleto.id) {
          try {
            const { getSupabaseClient } = await import('@/lib/supabase')
            const supabase = getSupabaseClient()
            
            // Buscar valores dos equipamentos pela tabela equipamentos
            const idsEquipamentos = equipamentos.equipamentos.map(e => e.id).filter(id => id)
            const { data: equipamentosDB, error } = await supabase
              .from('equipamentos')
              .select('id, nome, valor_dia')
              .in('id', idsEquipamentos)
            
            if (!error && equipamentosDB) {
              // Reconstruir equipamentos com valores corretos
              const equipamentosAtualizados = equipamentos.equipamentos.map(equip => {
                const equipDB = equipamentosDB.find(e => e.id === equip.id)
                const valorDia = equipDB?.valor_dia || 0
                const dias = data.dadosTecnicos?.prazoTotal || 0
                const total = equip.quantidade * valorDia * dias
                
                return {
                  ...equip,
                  valorDia: valorDia,
                  dias: dias,
                  total: total
                }
              })
              
              setEquipamentosCorrigidos({
                ...equipamentos,
                equipamentos: equipamentosAtualizados
              })
            }
          } catch (error) {
            console.error('Erro ao buscar valores dos equipamentos:', error)
          }
        }
      }
    }
    
    corrigirEquipamentos()
  }, [equipamentos, data.dadosTecnicos])
  const veiculos = data.veiculos || { veiculos: [], totalVeiculos: 0, percentualTotalVeiculos: 0 }
  const insumos = data.insumos || {}
  const demaisDespesasFixas = data.demaisDespesasFixas || {}
  const custoDerivadosVenda = data.custoDerivadosVenda || {}

  // Usar o custo total da obra diretamente do banco de dados
  const custoTotalObra = data.custoTotalObra || (demaisDespesasFixas.custoExecucao || 0) + (demaisDespesasFixas.despesasFixas || 0)
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

      {/* 2. Equipes e Custos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Equipes e Custos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-medium">Equipe de Preparação:</p>
              <p className="text-gray-600">{preparacaoObra.equipeTotal} pessoas</p>
            </div>
            <div>
              <p className="font-medium">Prazo de Preparação:</p>
              <p className="text-gray-600">{preparacaoObra.prazo} dias</p>
            </div>
            <div>
              <p className="font-medium">Custo da Preparação:</p>
              <p className="text-gray-600">{formatarMoeda(preparacaoObra.custoPreparacao)}</p>
            </div>
            <div>
              <p className="font-medium">Equipe de Concretagem:</p>
              <p className="text-gray-600">{equipeConcretagemAcabamento.equipeConcretagem} pessoas</p>
            </div>
            <div>
              <p className="font-medium">Equipe de Acabamento:</p>
              <p className="text-gray-600">{equipeConcretagemAcabamento.equipeAcabamento} pessoas</p>
            </div>
            <div>
              <p className="font-medium">Custo Concretagem/Acabamento:</p>
              <p className="text-gray-600">{formatarMoeda(equipeConcretagemAcabamento.custoEquipe)}</p>
            </div>
            <div>
              <p className="font-medium">Equipe de Finalização:</p>
              <p className="text-gray-600">{finalizacaoObra.equipeTotal} pessoas</p>
            </div>
            <div>
              <p className="font-medium">Prazo de Finalização:</p>
              <p className="text-gray-600">{finalizacaoObra.prazo} dias</p>
            </div>
            <div>
              <p className="font-medium">Custo da Finalização:</p>
              <p className="text-gray-600">{formatarMoeda(finalizacaoObra.custoFinalizacao)}</p>
            </div>
            <div>
              <p className="font-medium">Horas Extras Concretagem:</p>
              <p className="text-gray-600">{equipeConcretagemAcabamento.horasExtraEquipeConcretagem}h ({formatarMoeda(equipeConcretagemAcabamento.custoHEEquipeConcretagem)})</p>
            </div>
            <div>
              <p className="font-medium">Horas Extras Acabamento:</p>
              <p className="text-gray-600">{equipeConcretagemAcabamento.horaExtraEquipeAcabamento}h ({formatarMoeda(equipeConcretagemAcabamento.custoHEAcabamento)})</p>
            </div>
            <div>
              <p className="font-medium">Horas Extras Total:</p>
              <p className="text-gray-600">
                {equipeConcretagemAcabamento.horasExtraEquipeConcretagem + equipeConcretagemAcabamento.horaExtraEquipeAcabamento}h 
                ({formatarMoeda(equipeConcretagemAcabamento.custoHEEquipeConcretagem + equipeConcretagemAcabamento.custoHEAcabamento)})
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Equipe:</span>
              <span className="font-bold">
                {(() => {
                  const totalEquipes = (preparacaoObra.custoPreparacao || 0) +
                    (equipeConcretagemAcabamento.custoEquipe || 0) +
                    (equipeConcretagemAcabamento.custoHEEquipeConcretagem || 0) +
                    (equipeConcretagemAcabamento.custoHEAcabamento || 0) +
                    (finalizacaoObra.custoFinalizacao || 0);

                  const percentual = custoTotalObra > 0 ? (totalEquipes / custoTotalObra) * 100 : 0;

                  return `${formatarMoeda(totalEquipes)} (${formatarPercentual(percentual)})`;
                })()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Equipamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Equipamentos
            </CardTitle>
          </CardHeader>
        <CardContent>
          {equipamentosCorrigidos.equipamentos.length > 0 && (
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-4 gap-4 font-medium text-sm bg-gray-100 p-2 rounded">
                <span>Equipamento</span>
                <span>Valor/Dia (R$)</span>
                <span>Dias</span>
                <span>Quantidade</span>
              </div>
              {equipamentosCorrigidos.equipamentos.map((equipamento, index) => (
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
              <span className="font-bold">
                {(() => {
                  const percentual = custoTotalObra > 0 ? (equipamentosCorrigidos.totalEquipamentos / custoTotalObra) * 100 : 0;
                  return `${formatarMoeda(equipamentosCorrigidos.totalEquipamentos)} (${formatarPercentual(percentual)})`;
                })()}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span>Qtd. equipamento:</span>
              <span>{equipamentosCorrigidos.quantidadeEquipamentos}</span>
            </div>
          </div>
          </CardContent>
        </Card>

      {/* 4. Veículos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Veículos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {veiculos.veiculos && veiculos.veiculos.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Veículo</th>
                      <th className="text-center p-2">Tipo</th>
                      <th className="text-center p-2">Qtd</th>
                      <th className="text-center p-2">R$/km</th>
                      <th className="text-center p-2">Distância</th>
                      <th className="text-center p-2">Dias</th>
                      <th className="text-right p-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {veiculos.veiculos.map((veiculo, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{veiculo.veiculo}</td>
                        <td className="text-center p-2">{veiculo.tipo}</td>
                        <td className="text-center p-2">{veiculo.quantidade}</td>
                        <td className="text-center p-2">{formatarMoeda(veiculo.rs_km)}</td>
                        <td className="text-center p-2">{veiculo.distancia_obra} km</td>
                        <td className="text-center p-2">{veiculo.dias_obra}</td>
                        <td className="text-right p-2">{formatarMoeda(veiculo.custo_total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum veículo configurado para esta obra
            </div>
          )}
          <Separator className="my-4" />
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total veículos:</span>
              <span className="font-bold">
                {(() => {
                  const percentual = custoTotalObra > 0 ? (veiculos.totalVeiculos / custoTotalObra) * 100 : 0;
                  return `${formatarMoeda(veiculos.totalVeiculos)} (${formatarPercentual(percentual)})`;
                })()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Insumos */}
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
              <span className="font-bold">
                {(() => {
                  const percentual = custoTotalObra > 0 ? (insumos.totalInsumos / custoTotalObra) * 100 : 0;
                  return `${formatarMoeda(insumos.totalInsumos)} (${formatarPercentual(percentual)})`;
                })()}
              </span>
            </div>
          </div>
          </CardContent>
        </Card>

      {/* 6. Demais despesas fixas */}
        <Card>
          <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Custos fixos da empresa
          </CardTitle>
          </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-700">
                {formatarMoeda(demaisDespesasFixas.totalCustosFixos || 0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Custos Fixos Mensais da Empresa</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-700">
                {formatarNumero(demaisDespesasFixas.mediaMes || 0, 0)} m²
              </div>
              <div className="text-sm text-gray-600 mt-1">Média de Metro Quadrado por Mês</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-700">
                {formatarMoeda(demaisDespesasFixas.mediaFinal || demaisDespesasFixas.valorEmpresaPorM2)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Custo Fixo por m²</div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600 text-center">
              <strong>Cálculo do Custo Fixo:</strong> {formatarMoeda(demaisDespesasFixas.mediaFinal || demaisDespesasFixas.valorEmpresaPorM2)}/m² × {formatarNumero(demaisDespesasFixas.areaTotalObra, 0)} m² = {formatarMoeda(demaisDespesasFixas.despesasFixas)}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="font-bold text-center mb-2">Total de custos de execução do piso</p>
            <div className="flex justify-between items-center">
              <span className="font-bold">Custo Fixo Proporcional da Obra:</span>
              <span className="font-bold">{formatarMoeda(demaisDespesasFixas.despesasFixas)} ({formatarPercentual(demaisDespesasFixas.percentualDespesasFixas || 0)})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7. Custo derivados da venda */}
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

      {/* 8. Custos adicionais da obra */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Custos adicionais da obra
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="space-y-2">
                <div>
                  <p className="font-medium">Frete:</p>
                  <p className="text-gray-600">{formatarMoeda(Number(data.outrosCustos?.frete) || 0)}</p>
                </div>
                <div>
                  <p className="font-medium">Hospedagem:</p>
                  <p className="text-gray-600">{formatarMoeda(Number(data.outrosCustos?.hospedagem) || 0)}</p>
                </div>
                <div>
                  <p className="font-medium">Locação de equipamentos:</p>
                  <p className="text-gray-600">{formatarMoeda(Number(data.outrosCustos?.locacaoEquipamento) || 0)}</p>
                </div>
                <div>
                  <p className="font-medium">Locação de veículos:</p>
                  <p className="text-gray-600">{formatarMoeda(Number(data.outrosCustos?.locacaoVeiculo) || 0)}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div>
                  <p className="font-medium">Material:</p>
                  <p className="text-gray-600">{formatarMoeda(Number(data.outrosCustos?.material) || 0)}</p>
                </div>
                <div>
                  <p className="font-medium">Passagem:</p>
                  <p className="text-gray-600">{formatarMoeda(Number(data.outrosCustos?.passagem) || 0)}</p>
                </div>
                <div>
                  <p className="font-medium">Extra:</p>
                  <p className="text-gray-600">{formatarMoeda(Number(data.outrosCustos?.extra) || 0)}</p>
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total custos adicionais:</span>
              <span className="font-bold">{formatarMoeda(data.outrosCustos?.totalOutrosCustos || 0)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-medium">Custo por M²:</span>
              <span>{formatarMoeda(data.outrosCustos?.totalM2 || 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 9. Preço de Venda - Resultado Final */}
      <Card className="border-2 border-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <DollarSign className="h-5 w-5" />
            Preço de Venda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Coluna Esquerda - Preço Calculado */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-center text-blue-700 mb-4">Preço Calculado</h3>
              
              {/* Lucro Desejado */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Lucro Desejado:</span>
                  <div className="text-right">
                    <div className="font-bold text-lg text-blue-600">
                      {formatarMoeda(custoDerivadosVenda.margemLucro || 0)}
                    </div>
                    <div className="text-sm text-gray-600">
                      ({formatarPercentual(custoDerivadosVenda.percentualMargemLucro || 0)})
                    </div>
                  </div>
                </div>
              </div>

              {/* Preço de Venda por m² */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Preço de Venda por m²:</span>
                  <div className="text-right">
                    <div className="font-bold text-lg text-green-600">
                      {formatarMoeda(precoVenda.precoVendaPorM2)}/m²
                    </div>
                  </div>
                </div>
              </div>

              {/* Imposto */}
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Imposto:</span>
                  <div className="text-right">
                    <div className="font-bold text-lg text-red-600">
                      {formatarMoeda(custoDerivadosVenda.impostoSimples || 0)}
                    </div>
                    <div className="text-sm text-gray-600">
                      ({formatarPercentual(custoDerivadosVenda.percentualImpostoSimples || 0)})
                    </div>
                  </div>
                </div>
              </div>

              {/* Comissão */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Comissão:</span>
                  <div className="text-right">
                    <div className="font-bold text-lg text-yellow-600">
                      {formatarMoeda(custoDerivadosVenda.comissoes || 0)}
                    </div>
                    <div className="text-sm text-gray-600">
                      ({formatarPercentual(custoDerivadosVenda.percentualComissoes || 0)})
                    </div>
                  </div>
                </div>
              </div>

              {/* Custo Total da Obra */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Custo Total da Obra:</span>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-700">
                      {formatarMoeda(custoTotalObra)}
                    </div>
                    <div className="text-sm text-gray-600">
                      ({formatarPercentual(100)})
                    </div>
                  </div>
                </div>
              </div>

              {/* Valor Total */}
              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Valor Total:</span>
                  <div className="text-right">
                    <div className="font-bold text-2xl text-purple-700">
                      {formatarMoeda(data.valorTotal || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Preço Manual */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-center text-orange-700 mb-4">Se o Preço de Venda For</h3>
              
              {/* Preço Manual por m² */}
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Preço de Venda por m²:</span>
                  <div className="text-right">
                    <div className="font-bold text-lg text-orange-600">
                      {formatarMoeda(precoVenda.sePrecoVendaPorM2For)}/m²
                    </div>
                  </div>
                </div>
              </div>

              {/* Lucro Manual */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Lucro:</span>
                  <div className="text-right">
                    <div className="font-bold text-lg text-blue-600">
                      {formatarMoeda(precoVenda.resultado1 || 0)}
                    </div>
                    <div className="text-sm text-gray-600">
                      ({(() => {
                        const percentual = precoVenda.resultadoPercentual || 0;
                        return percentual <= -200 ? `< -200%` : formatarPercentual(percentual);
                      })()})
                    </div>
                  </div>
                </div>
              </div>

              {/* Imposto Manual */}
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Imposto:</span>
                  <div className="text-right">
                    <div className="font-bold text-lg text-red-600">
                      {formatarMoeda((precoVenda.sePrecoVendaPorM2For * dadosTecnicos.areaTotal) * ((custoDerivadosVenda.percentualImpostoSimples || 0) / 100))}
                    </div>
                    <div className="text-sm text-gray-600">
                      ({formatarPercentual(custoDerivadosVenda.percentualImpostoSimples || 0)})
                    </div>
                  </div>
                </div>
              </div>

              {/* Comissão Manual */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Comissão:</span>
                  <div className="text-right">
                    <div className="font-bold text-lg text-yellow-600">
                      {formatarMoeda((precoVenda.sePrecoVendaPorM2For * dadosTecnicos.areaTotal) * ((custoDerivadosVenda.percentualComissoes || 0) / 100))}
                    </div>
                    <div className="text-sm text-gray-600">
                      ({formatarPercentual(custoDerivadosVenda.percentualComissoes || 0)})
                    </div>
                  </div>
                </div>
              </div>

              {/* Custo Total da Obra (igual) */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Custo Total da Obra:</span>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-700">
                      {formatarMoeda(custoTotalObra)}
                    </div>
                    <div className="text-sm text-gray-600">
                      ({formatarPercentual(100)})
                    </div>
                  </div>
                </div>
              </div>

              {/* Valor Total Manual */}
              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Valor Total:</span>
                  <div className="text-right">
                    <div className="font-bold text-2xl text-purple-700">
                      {formatarMoeda(precoVenda.sePrecoVendaPorM2For * dadosTecnicos.areaTotal)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
