import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface FormularioStep3Props {
  formData: any;
  updateFormData: (data: any) => void;
}

export function SimulacaoFormStep3({ formData, updateFormData }: FormularioStep3Props) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateFormData({ ...formData, [name]: value });
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    updateFormData({ ...formData, [name]: checked });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <h3 className="text-lg font-medium">Custos Diretos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="custoCimentoM3">
              Custo de Cimento (R$/m³) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="custoCimentoM3"
              name="custoCimentoM3"
              type="number"
              value={formData.custoCimentoM3 || ""}
              onChange={handleInputChange}
              placeholder="Ex: 350,00"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="custoMaoDeObra">
              Custo de Mão de Obra (R$) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="custoMaoDeObra"
              name="custoMaoDeObra"
              type="number"
              value={formData.custoMaoDeObra || ""}
              onChange={handleInputChange}
              placeholder="Ex: 5000,00"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="custoTransporte">
              Custo de Transporte (R$)
            </Label>
            <Input
              id="custoTransporte"
              name="custoTransporte"
              type="number"
              value={formData.custoTransporte || ""}
              onChange={handleInputChange}
              placeholder="Ex: 1200,00"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="custoHospedagem">
              Custo de Hospedagem (R$)
            </Label>
            <Input
              id="custoHospedagem"
              name="custoHospedagem"
              type="number"
              value={formData.custoHospedagem || ""}
              onChange={handleInputChange}
              placeholder="Ex: 800,00"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-5">
        <h3 className="text-lg font-medium">Custos Indiretos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="custoAdministrativo">
              Custo Administrativo (R$)
            </Label>
            <Input
              id="custoAdministrativo"
              name="custoAdministrativo"
              type="number"
              value={formData.custoAdministrativo || ""}
              onChange={handleInputChange}
              placeholder="Ex: 2500,00"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="custosAdicionais">
              Custos Adicionais (R$)
            </Label>
            <Input
              id="custosAdicionais"
              name="custosAdicionais"
              type="number"
              value={formData.custosAdicionais || ""}
              onChange={handleInputChange}
              placeholder="Ex: 1000,00"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="incluirBDI">Incluir BDI (Benefícios e Despesas Indiretas)</Label>
              <Switch
                id="incluirBDI"
                checked={formData.incluirBDI || false}
                onCheckedChange={(checked) => handleSwitchChange("incluirBDI", checked)}
              />
            </div>
            <p className="text-sm text-gray-500">
              {formData.incluirBDI ? "Sim" : "Não"}
            </p>
          </div>
          
          {formData.incluirBDI && (
            <div className="space-y-3">
              <Label htmlFor="percentualBDI">
                Percentual BDI (%)
              </Label>
              <Input
                id="percentualBDI"
                name="percentualBDI"
                type="number"
                value={formData.percentualBDI || ""}
                onChange={handleInputChange}
                placeholder="Ex: 15"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-5">
        <h3 className="text-lg font-medium">Comissão e Preço Final</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="percentualComissao">
              Percentual de Comissão (%)
            </Label>
            <Input
              id="percentualComissao"
              name="percentualComissao"
              type="number"
              value={formData.percentualComissao || ""}
              onChange={handleInputChange}
              placeholder="Ex: 5"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="percentualLucro">
              Percentual de Lucro Desejado (%) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="percentualLucro"
              name="percentualLucro"
              type="number"
              value={formData.percentualLucro || ""}
              onChange={handleInputChange}
              placeholder="Ex: 20"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="precoFinalObra">
              Preço Final da Obra (R$)
            </Label>
            <Input
              id="precoFinalObra"
              name="precoFinalObra"
              type="number"
              value={formData.precoFinalObra || ""}
              onChange={handleInputChange}
              placeholder="Valor calculado automaticamente"
              disabled
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="precoM3">
              Preço por m³ (R$)
            </Label>
            <Input
              id="precoM3"
              name="precoM3"
              type="number"
              value={formData.precoM3 || ""}
              onChange={handleInputChange}
              placeholder="Valor calculado automaticamente"
              disabled
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-5">
        <h3 className="text-lg font-medium">Observações</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes || ""}
              onChange={handleInputChange}
              placeholder="Adicione observações ou detalhes importantes sobre a simulação..."
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}