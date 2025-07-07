import React, { useState, FormEvent, ChangeEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, Calculator, ArrowLeft, CheckCircle } from "lucide-react"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface Equipamento {
  id: number;
  nome: string;
  quantidade: number;
}

export interface FormDataType {
  nomeObra: string;
  construtora: string;
  enderecoObra: string;
  contatoObra: string;
  reforcoEstrutural: boolean;
  areaTotal: string;
  areaPorDia: string;
  previsaoInicio: string;
  tipoAcabamento: string;
  espessura: string;
  distanciaObra: string;
  lancamentoConcreto: string;
  
  inicioConcretagem: string;
  equipeConcretagem: string;
  equipeAcabamento: string;
  
  equipePreparacao: string;
  prazoPreparacao: string;
  equipeFinalizacao: string;
  prazoFinalizacao: string;
  
  equipamentos: Equipamento[];
  
  custosFrete: string;
  custosHospedagem: string;
  custosLocacaoEquipamento: string;
  custosLocacaoVeiculo: string;
  custosMaterial: string;
  custosPassagem: string;
  custosExtra: string;
  
  comissao: string;
  precoVendaM2: string;
  lucroDesejado: string;
}

interface SimulacaoFormProps {
  onSubmit: (data: FormDataType) => void;
}

export function SimulacaoForm({ onSubmit }: SimulacaoFormProps) {
  const [formData, setFormData] = useState<FormDataType>({
    // Informações Básicas
    nomeObra: "",
    construtora: "",
    enderecoObra: "",
    contatoObra: "",
    reforcoEstrutural: false,
    areaTotal: "",
    areaPorDia: "",
    previsaoInicio: "",
    tipoAcabamento: "",
    espessura: "",
    distanciaObra: "",
    lancamentoConcreto: "",
    
    // Concretagem e Acabamento
    inicioConcretagem: "",
    equipeConcretagem: "padrao",
    equipeAcabamento: "padrao",
    
    // Preparação e Finalização
    equipePreparacao: "",
    prazoPreparacao: "",
    equipeFinalizacao: "",
    prazoFinalizacao: "",
    
    // Equipamentos
    equipamentos: [
      { id: 1, nome: "Betoneira", quantidade: 0 },
      { id: 2, nome: "Régua Vibratória", quantidade: 0 },
      { id: 3, nome: "Acabadora de Piso", quantidade: 0 },
      { id: 4, nome: "Alisadora de Piso", quantidade: 0 },
      { id: 5, nome: "Serra de Corte", quantidade: 0 }
    ],
    
    // Custos Diversos
    custosFrete: "",
    custosHospedagem: "",
    custosLocacaoEquipamento: "",
    custosLocacaoVeiculo: "",
    custosMaterial: "",
    custosPassagem: "",
    custosExtra: "",
    
    // Comissão e Valor Final
    comissao: "10",
    precoVendaM2: "",
    lucroDesejado: "25"
  })
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  const handleEquipamentoChange = (id: number, quantidade: number) => {
    setFormData(prev => ({
      ...prev,
      equipamentos: prev.equipamentos.map(item => 
        item.id === id ? { ...item, quantidade } : item
      )
    }))
  }
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    // Validar dados essenciais
    if (!formData.nomeObra || !formData.areaTotal) {
      console.error("Dados obrigatórios não preenchidos");
      return;
    }
    
    // Clone profundo dos dados para evitar problemas de referência
    const dadosParaSubmeter = JSON.parse(JSON.stringify(formData));
    
    // Garantir que valores numéricos são válidos
    dadosParaSubmeter.areaTotal = dadosParaSubmeter.areaTotal || "0";
    dadosParaSubmeter.precoVendaM2 = dadosParaSubmeter.precoVendaM2 || "0";
    dadosParaSubmeter.lucroDesejado = dadosParaSubmeter.lucroDesejado || "20";
    
    console.log("Submetendo dados do formulário:", dadosParaSubmeter);
    onSubmit(dadosParaSubmeter);
  }
  
  const handleSaveAsDraft = () => {
    // Lógica para salvar como rascunho
    console.log("Rascunho salvo:", formData)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações Básicas da Obra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="nomeObra">
                Nome da obra <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nomeObra"
                name="nomeObra"
                value={formData.nomeObra}
                onChange={handleInputChange}
                placeholder="Ex: Condomínio Parque das Árvores"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="construtora">Construtora</Label>
              <Input
                id="construtora"
                name="construtora"
                value={formData.construtora}
                onChange={handleInputChange}
                placeholder="Nome da construtora"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="enderecoObra">Endereço da obra</Label>
              <Input
                id="enderecoObra"
                name="enderecoObra"
                value={formData.enderecoObra}
                onChange={handleInputChange}
                placeholder="Endereço completo"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="contatoObra">Contato da obra</Label>
              <Input
                id="contatoObra"
                name="contatoObra"
                value={formData.contatoObra}
                onChange={handleInputChange}
                placeholder="Nome e telefone"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="reforcoEstrutural">Reforço Estrutural</Label>
                <Switch
                  id="reforcoEstrutural"
                  checked={formData.reforcoEstrutural}
                  onCheckedChange={(checked) => handleSwitchChange("reforcoEstrutural", checked)}
                />
              </div>
              <p className="text-sm text-gray-500">
                {formData.reforcoEstrutural ? "Sim" : "Não"}
              </p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="areaTotal">
                Área Total (m²) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="areaTotal"
                name="areaTotal"
                type="number"
                value={formData.areaTotal}
                onChange={handleInputChange}
                placeholder="Ex: 1500"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="areaPorDia">
                Área por dia (m²) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="areaPorDia"
                name="areaPorDia"
                type="number"
                value={formData.areaPorDia}
                onChange={handleInputChange}
                placeholder="Ex: 300"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="previsaoInicio">
                Previsão de Início <span className="text-red-500">*</span>
              </Label>
              <Input
                id="previsaoInicio"
                name="previsaoInicio"
                type="date"
                value={formData.previsaoInicio}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="tipoAcabamento">
                Tipo de Acabamento <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.tipoAcabamento} 
                onValueChange={(value) => handleSelectChange("tipoAcabamento", value)}
              >
                <SelectTrigger id="tipoAcabamento">
                  <SelectValue placeholder="Selecione o tipo de acabamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="liso">Liso</SelectItem>
                  <SelectItem value="polido">Polido</SelectItem>
                  <SelectItem value="antiderrapante">Antiderrapante</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="espessura">
                Espessura (cm) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="espessura"
                name="espessura"
                type="number"
                value={formData.espessura}
                onChange={handleInputChange}
                placeholder="Ex: 10"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="distanciaObra">
                Distância até a obra <span className="text-red-500">*</span>
              </Label>
              <Input
                id="distanciaObra"
                name="distanciaObra"
                value={formData.distanciaObra}
                onChange={handleInputChange}
                placeholder="Ex: 20km"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="lancamentoConcreto">
                Lançamento do concreto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lancamentoConcreto"
                name="lancamentoConcreto"
                value={formData.lancamentoConcreto}
                onChange={handleInputChange}
                placeholder="Ex: 15m³/h"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="mb-6">
        <AccordionItem value="concretagem">
          <AccordionTrigger>
            <h3 className="text-base font-medium">Concretagem e Acabamento</h3>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-3">
                <Label htmlFor="inicioConcretagem">
                  Início da Concretagem (hora) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="inicioConcretagem"
                  name="inicioConcretagem"
                  type="time"
                  value={formData.inicioConcretagem}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="equipeConcretagem">
                  Equipe de Concretagem <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.equipeConcretagem} 
                  onValueChange={(value) => handleSelectChange("equipeConcretagem", value)}
                >
                  <SelectTrigger id="equipeConcretagem">
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="padrao">Padrão (5 pessoas)</SelectItem>
                    <SelectItem value="reduzida">Reduzida (3 pessoas)</SelectItem>
                    <SelectItem value="ampliada">Ampliada (7 pessoas)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="equipeAcabamento">
                  Equipe de Acabamento <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.equipeAcabamento} 
                  onValueChange={(value) => handleSelectChange("equipeAcabamento", value)}
                >
                  <SelectTrigger id="equipeAcabamento">
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="padrao">Padrão (4 pessoas)</SelectItem>
                    <SelectItem value="reduzida">Reduzida (2 pessoas)</SelectItem>
                    <SelectItem value="ampliada">Ampliada (6 pessoas)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="preparacao">
          <AccordionTrigger>
            <h3 className="text-base font-medium">Preparação e Finalização da Obra</h3>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-3">
                <Label htmlFor="equipePreparacao">Equipe de preparação da obra</Label>
                <Input
                  id="equipePreparacao"
                  name="equipePreparacao"
                  value={formData.equipePreparacao}
                  onChange={handleInputChange}
                  placeholder="Ex: 3 pessoas"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="prazoPreparacao">Prazo de preparação da obra</Label>
                <Input
                  id="prazoPreparacao"
                  name="prazoPreparacao"
                  value={formData.prazoPreparacao}
                  onChange={handleInputChange}
                  placeholder="Ex: 2 dias"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="equipeFinalizacao">Equipe de finalização da obra</Label>
                <Input
                  id="equipeFinalizacao"
                  name="equipeFinalizacao"
                  value={formData.equipeFinalizacao}
                  onChange={handleInputChange}
                  placeholder="Ex: 3 pessoas"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="prazoFinalizacao">Prazo de finalização da obra</Label>
                <Input
                  id="prazoFinalizacao"
                  name="prazoFinalizacao"
                  value={formData.prazoFinalizacao}
                  onChange={handleInputChange}
                  placeholder="Ex: 1 dia"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="equipamentos">
          <AccordionTrigger>
            <h3 className="text-base font-medium">Equipamentos</h3>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-500 mb-4">
                Selecione os equipamentos necessários e suas quantidades
              </p>
              
              {formData.equipamentos.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <Label htmlFor={`equipamento-${item.id}`}>{item.nome}</Label>
                  <div className="w-24">
                    <Input
                      id={`equipamento-${item.id}`}
                      type="number"
                      min="0"
                      value={item.quantidade}
                      onChange={(e) => handleEquipamentoChange(item.id, parseInt(e.target.value))}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="custos">
          <AccordionTrigger>
            <h3 className="text-base font-medium">Custos Diversos</h3>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-3">
                <Label htmlFor="custosFrete">Frete</Label>
                <Input
                  id="custosFrete"
                  name="custosFrete"
                  value={formData.custosFrete}
                  onChange={handleInputChange}
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="custosHospedagem">Hospedagem</Label>
                <Input
                  id="custosHospedagem"
                  name="custosHospedagem"
                  value={formData.custosHospedagem}
                  onChange={handleInputChange}
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="custosLocacaoEquipamento">Locação de Equipamento</Label>
                <Input
                  id="custosLocacaoEquipamento"
                  name="custosLocacaoEquipamento"
                  value={formData.custosLocacaoEquipamento}
                  onChange={handleInputChange}
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="custosLocacaoVeiculo">Locação de Veículo</Label>
                <Input
                  id="custosLocacaoVeiculo"
                  name="custosLocacaoVeiculo"
                  value={formData.custosLocacaoVeiculo}
                  onChange={handleInputChange}
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="custosMaterial">Material</Label>
                <Input
                  id="custosMaterial"
                  name="custosMaterial"
                  value={formData.custosMaterial}
                  onChange={handleInputChange}
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="custosPassagem">Passagem</Label>
                <Input
                  id="custosPassagem"
                  name="custosPassagem"
                  value={formData.custosPassagem}
                  onChange={handleInputChange}
                  placeholder="R$ 0,00"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="custosExtra">Extra</Label>
                <Input
                  id="custosExtra"
                  name="custosExtra"
                  value={formData.custosExtra}
                  onChange={handleInputChange}
                  placeholder="R$ 0,00"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Comissão e Valor Final</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label htmlFor="comissao">
                Comissão (%)
              </Label>
              <Input
                id="comissao"
                name="comissao"
                type="number"
                value={formData.comissao}
                onChange={handleInputChange}
                placeholder="Ex: 10"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="precoVendaM2">
                Preço de venda por m² <span className="text-red-500">*</span>
              </Label>
              <Input
                id="precoVendaM2"
                name="precoVendaM2"
                value={formData.precoVendaM2}
                onChange={handleInputChange}
                placeholder="R$ 0,00"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="lucroDesejado">
                Lucro Desejado (%) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lucroDesejado"
                name="lucroDesejado"
                type="number"
                value={formData.lucroDesejado}
                onChange={handleInputChange}
                placeholder="Ex: 25"
                required
              />
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              O sistema utiliza as seguintes informações para cálculo de custo por metro quadrado:
            </p>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                Custo Fixo
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                Equipe
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                Equipamentos
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                Insumos
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                Ferramentas
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                Veículos
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                Impostos
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-8">
        <Button type="button" variant="outline" className="flex gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleSaveAsDraft}
            className="flex gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar como Rascunho
          </Button>
          
          <Button type="submit" className="bg-[#007EA3] hover:bg-[#006a8a] flex gap-2">
            <Calculator className="h-4 w-4" />
            Gerar Simulação
          </Button>
        </div>
      </div>
    </form>
  )
}
