"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from "react"

interface EtapaInformacoesPrincipaisProps {
  formData: any
  handleInputChange: (field: string, value: string) => void
}

export function EtapaInformacoesPrincipais({ formData, handleInputChange }: EtapaInformacoesPrincipaisProps) {
  useEffect(() => {
    // Se o campo de data estiver vazio, preenche com a data atual
    if (!formData.data) {
      const hoje = new Date()
      const dia = String(hoje.getDate()).padStart(2, "0")
      const mes = String(hoje.getMonth() + 1).padStart(2, "0")
      const ano = hoje.getFullYear()
      const dataFormatada = `${dia}/${mes}/${ano}`

      handleInputChange("data", dataFormatada)
    }
  }, [])

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Informações Principais</h3>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>
            Data <span className="text-xs text-gray-500">(Preenchimento automático)</span>
          </Label>
          <Input
            value={formData.data}
            onChange={(e) => handleInputChange("data", e.target.value)}
            placeholder="DD/MM/AAAA"
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label>Responsável pela Obra</Label>
          <Input
            value={formData.responsavel}
            onChange={(e) => handleInputChange("responsavel", e.target.value)}
            placeholder="Digite o nome do Responsável pela Obra"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Obra <span className="text-xs text-gray-500">(Preenchimento automático)</span>
          </Label>
          <Input
            value={formData.obra}
            onChange={(e) => handleInputChange("obra", e.target.value)}
            placeholder="Nome da Obra"
          />
        </div>

        <div className="space-y-2">
          <Label>Telefone do Responsável</Label>
          <Input
            value={formData.telefoneResponsavel}
            onChange={(e) => handleInputChange("telefoneResponsavel", e.target.value)}
            placeholder="Digite o telefone do Responsável pela Obra"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Cliente <span className="text-xs text-gray-500">(Preenchimento automático)</span>
          </Label>
          <Input
            value={formData.cliente}
            onChange={(e) => handleInputChange("cliente", e.target.value)}
            placeholder="Nome do cliente"
          />
        </div>

        <div className="space-y-2">
          <Label>E-mail do Responsável</Label>
          <Input
            value={formData.emailResponsavel}
            onChange={(e) => handleInputChange("emailResponsavel", e.target.value)}
            placeholder="Digite o e-mail do Responsável pela Obra"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Construtora <span className="text-xs text-gray-500">(Preenchimento automático)</span>
          </Label>
          <Input
            value={formData.construtora}
            onChange={(e) => handleInputChange("construtora", e.target.value)}
            placeholder="Nome da construtora"
          />
        </div>

        <div className="space-y-2">
          <Label>Concreteira</Label>
          <Input
            value={formData.concreteira}
            onChange={(e) => handleInputChange("concreteira", e.target.value)}
            placeholder="Digite o nome da Concreteira"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Endereço da Obra{" "}
            <span className="text-xs text-gray-500">(Preenchimento automático com geolocalização)</span>
          </Label>
          <Input
            value={formData.endereco}
            onChange={(e) => handleInputChange("endereco", e.target.value)}
            placeholder="Endereço da obra"
          />
        </div>

        <div className="space-y-2">
          <Label>Contato da Concreteira</Label>
          <Input
            value={formData.contatoConcreteira}
            onChange={(e) => handleInputChange("contatoConcreteira", e.target.value)}
            placeholder="Digite o contato da Concreteira"
          />
        </div>
      </div>

      <h3 className="text-lg font-medium mt-8">Informações da Obra</h3>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Área Total da Obra</Label>
          <Input
            value={formData.areaTotal}
            onChange={(e) => handleInputChange("areaTotal", e.target.value)}
            placeholder="m²"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Lançamento do Concreto <span className="text-xs text-gray-500">(o sistema calcula)</span>
          </Label>
          <Input
            value={formData.lancamentoConcreto}
            onChange={(e) => handleInputChange("lancamentoConcreto", e.target.value)}
            placeholder="m³/hora"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label>Prazo de Execução</Label>
          <Input
            value={formData.prazoExecucao}
            onChange={(e) => handleInputChange("prazoExecucao", e.target.value)}
            placeholder="Quantidade de dias"
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Acabamento</Label>
          <Select value={formData.tipoAcabamento} onValueChange={(value) => handleInputChange("tipoAcabamento", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de acabamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="polido">Polido</SelectItem>
              <SelectItem value="liso">Liso</SelectItem>
              <SelectItem value="rugoso">Rugoso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Reforço Estrutural</Label>
          <Select
            value={formData.reforcoEstrutural}
            onValueChange={(value) => handleInputChange("reforcoEstrutural", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de reforço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fibra">Fibra</SelectItem>
              <SelectItem value="tela">Tela</SelectItem>
              <SelectItem value="armadura">Armadura</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tipo de Cura</Label>
          <Select value={formData.tipoCura} onValueChange={(value) => handleInputChange("tipoCura", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de acabamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quimica">Química</SelectItem>
              <SelectItem value="umida">Úmida</SelectItem>
              <SelectItem value="mista">Mista</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Espessura do Piso</Label>
          <Select value={formData.espessuraPiso} onValueChange={(value) => handleInputChange("espessuraPiso", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Cm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 cm</SelectItem>
              <SelectItem value="12">12 cm</SelectItem>
              <SelectItem value="15">15 cm</SelectItem>
              <SelectItem value="18">18 cm</SelectItem>
              <SelectItem value="20">20 cm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
