import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Calculator, 
  FileText, 
  PieChart, 
  Plus, 
  RefreshCw, 
  Download, 
  Printer, 
  Mail, 
  ArrowLeft,
  DollarSign,
  Percent,
  Coins,
  BarChart4
} from "lucide-react";
import { FormDataType } from './simulacao-form';

interface SimulacaoResultadosProps {
  data: FormDataType;
  onNovaSimulacao: () => void;
}

export function SimulacaoResultados({ data, onNovaSimulacao }: SimulacaoResultadosProps) {
  const [custoTotal, setCustoTotal] = useState<number>(calcularCustoTotal());
  const [precoVendaM2, setPrecoVendaM2] = useState<number>(parseFloat(data.precoVendaM2) || 0);
  const [lucroDesejado, setLucroDesejado] = useState<number>(parseFloat(data.lucroDesejado) || 25);
  
  function calcularCustoTotal(): number {
    // Simulação de cálculo de custo total
    const areaTotal = parseFloat(data.areaTotal) || 0;
    const custoBase = 120; // Custo base por m²
    
    // Fatores que podem influenciar o custo
    const fatorEspessura = parseFloat(data.espessura) / 10 || 1;
    const fatorAcabamento = data.tipoAcabamento === 'polido' ? 1.2 : 
                            data.tipoAcabamento === 'antiderrapante' ? 1.15 : 1;
    const fatorReforco = data.reforcoEstrutural ? 1.25 : 1;
    
    // Custos extras
    const custosFrete = parseFloat(data.custosFrete) || 0;
    const custosHospedagem = parseFloat(data.custosHospedagem) || 0;
    const custosLocacaoEquipamento = parseFloat(data.custosLocacaoEquipamento) || 0;
    const custosLocacaoVeiculo = parseFloat(data.custosLocacaoVeiculo) || 0;
    const custosMaterial = parseFloat(data.custosMaterial) || 0;
    const custosPassagem = parseFloat(data.custosPassagem) || 0;
    const custosExtra = parseFloat(data.custosExtra) || 0;
    
    // Custos de equipamentos
    const custoEquipamentos = data.equipamentos.reduce((acc, item) => {
      // Custo estimado por equipamento
      const custoPorItem = item.id === 1 ? 150 : // Betoneira
                          item.id === 2 ? 200 : // Régua Vibratória
                          item.id === 3 ? 300 : // Acabadora de Piso
                          item.id === 4 ? 250 : // Alisadora de Piso
                          item.id === 5 ? 180 : 0; // Serra de Corte
      return acc + (custoPorItem * item.quantidade);
    }, 0);
    
    // Cálculo final
    const custoTotalObra = areaTotal * custoBase * fatorEspessura * fatorAcabamento * fatorReforco +
                          custosFrete + custosHospedagem + custosLocacaoEquipamento + 
                          custosLocacaoVeiculo + custosMaterial + custosPassagem + 
                          custosExtra + custoEquipamentos;
    
    return custoTotalObra;
  }
  
  function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  
  function calcularPrecoVenda(): number {
    const markup = 1 + (lucroDesejado / 100);
    return custoTotal / parseFloat(data.areaTotal) * markup;
  }
  
  function calcularLucroTotal(): number {
    const areaTotal = parseFloat(data.areaTotal) || 0;
    return (precoVendaM2 * areaTotal) - custoTotal;
  }
  
  function calcularLucroPercentual(): number {
    const lucroTotal = calcularLucroTotal();
    const receitaTotal = precoVendaM2 * parseFloat(data.areaTotal);
    return (lucroTotal / receitaTotal) * 100;
  }
  
  function handleLucroChange(value: number[]): void {
    const novoLucro = value[0];
    setLucroDesejado(novoLucro);
    
    // Recalcular preço de venda com base no novo lucro
    const markup = 1 + (novoLucro / 100);
    const novoPrecoVendaM2 = (custoTotal / parseFloat(data.areaTotal)) * markup;
    setPrecoVendaM2(novoPrecoVendaM2);
  }
  
  function handlePrecoVendaChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const novoPrecoVenda = parseFloat(e.target.value) || 0;
    setPrecoVendaM2(novoPrecoVenda);
    
    // Recalcular o lucro com base no novo preço
    const novaReceita = novoPrecoVenda * parseFloat(data.areaTotal);
    const novoLucro = ((novaReceita - custoTotal) / novaReceita) * 100;
    setLucroDesejado(novoLucro);
  }
  
  function exportarRelatorio(formato: string): void {
    console.log(`Exportando relatório em formato ${formato}...`);
    // Implementação real dependerá de bibliotecas específicas
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resultados da Simulação</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onNovaSimulacao} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Button 
            onClick={() => exportarRelatorio('pdf')}
            variant="outline" 
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da esquerda (2/3) */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Resumo dos dados da simulação */}
          <Card className="bg-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Detalhes da Obra</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nome da Obra</p>
                  <p className="font-medium">{data.nomeObra}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Área Total</p>
                  <p className="font-medium">{data.areaTotal} m²</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de Acabamento</p>
                  <p className="font-medium">
                    {data.tipoAcabamento === 'liso' ? 'Liso' : 
                     data.tipoAcabamento === 'polido' ? 'Polido' : 
                     data.tipoAcabamento === 'antiderrapante' ? 'Antiderrapante' : 
                     'Não especificado'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Espessura</p>
                  <p className="font-medium">{data.espessura} cm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reforço Estrutural</p>
                  <p className="font-medium">{data.reforcoEstrutural ? 'Sim' : 'Não'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Previsão de Início</p>
                  <p className="font-medium">{data.previsaoInicio}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Resultados Financeiros */}
          <Card>
            <CardHeader>
              <CardTitle>Resultados Financeiros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Coins className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-600">Custo Total</h4>
                  </div>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(custoTotal)}</p>
                  <p className="text-xs text-gray-500 mt-1">Custo total estimado da obra</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-600">Preço de Venda</h4>
                  </div>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(precoVendaM2)} <span className="text-sm font-normal">/m²</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Valor de venda por metro quadrado</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <div className="bg-purple-100 p-2 rounded-full mr-3">
                      <Percent className="h-5 w-5 text-purple-600" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-600">Lucro Estimado</h4>
                  </div>
                  <div className="flex items-center">
                    <p className="text-xl font-bold text-purple-600">
                      {formatCurrency(calcularLucroTotal())}
                    </p>
                    <span className="ml-2 text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      {calcularLucroPercentual().toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Lucro total estimado</p>
                </div>
              </div>
              
              {/* Ajustes Rápidos */}
              <div className="mt-8 p-4 border rounded-lg">
                <h3 className="text-base font-medium mb-4">Ajustes Rápidos</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="lucroDesejado">Lucro Desejado (%)</Label>
                      <span className="text-sm font-medium">{lucroDesejado.toFixed(1)}%</span>
                    </div>
                    <Slider
                      id="lucroDesejado"
                      min={5}
                      max={50}
                      step={0.5}
                      value={[lucroDesejado]}
                      onValueChange={handleLucroChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="precoVenda">Preço de Venda (R$/m²)</Label>
                    <Input
                      id="precoVenda"
                      type="number"
                      min={0}
                      step={0.01}
                      value={precoVendaM2}
                      onChange={handlePrecoVendaChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 justify-end gap-2">
              <Button variant="outline" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Adicionar Novo Cenário
              </Button>
              <Button variant="outline" className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                Recalcular
              </Button>
            </CardFooter>
          </Card>
          
          {/* Gráfico de Distribuição */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Custos</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Gráfico de distribuição dos custos</p>
                <p className="text-sm text-gray-400 mt-1">
                  (Em uma implementação real, este seria um gráfico interativo)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Coluna da direita (1/3) */}
        <div className="col-span-1 space-y-6">
          {/* Resumo e Informações complementares */}
          <Card className="bg-[#fafcff] border-[#e0e9ff]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#007EA3]">Resumo da Simulação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Receita Total</h4>
                  <p className="text-xl font-bold text-[#007EA3]">
                    {formatCurrency(precoVendaM2 * parseFloat(data.areaTotal))}
                  </p>
                </div>
                
                <div className="border-b pb-3">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Custo por m²</h4>
                  <p className="text-xl font-bold text-[#007EA3]">
                    {formatCurrency(custoTotal / parseFloat(data.areaTotal))}
                  </p>
                </div>
                
                <div className="border-b pb-3">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Comissão ({data.comissao}%)</h4>
                  <p className="text-xl font-bold text-[#007EA3]">
                    {formatCurrency((precoVendaM2 * parseFloat(data.areaTotal)) * (parseFloat(data.comissao) / 100))}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Lucro Líquido (após comissão)</h4>
                  <p className="text-xl font-bold text-[#007EA3]">
                    {formatCurrency(calcularLucroTotal() - ((precoVendaM2 * parseFloat(data.areaTotal)) * (parseFloat(data.comissao) / 100)))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Informações adicionais */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="text-gray-600">
                  Este cálculo de simulação considera diversos fatores para determinar o custo
                  e preço ideal para a obra.
                </p>
                <p className="text-gray-600">
                  O sistema utiliza as seguintes informações para definir o custo por metro quadrado:
                </p>
                <ul className="text-gray-600 space-y-1 pl-5 list-disc">
                  <li>Custo Fixo</li>
                  <li>Equipe</li>
                  <li>Equipamentos</li>
                  <li>Insumos</li>
                  <li>Ferramentas</li>
                  <li>Veículos</li>
                  <li>Impostos</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          {/* Opções de relatório */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Gerar Relatório</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-gray-700" 
                  onClick={() => exportarRelatorio('pdf')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar como PDF
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-gray-700" 
                  onClick={() => exportarRelatorio('print')}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir Relatório
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-gray-700" 
                  onClick={() => exportarRelatorio('email')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar por E-mail
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
