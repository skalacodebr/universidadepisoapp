"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EtapaDetalhesExecucaoProps {
  formData: any
  handleNestedInputChange: (parent: string, field: string, value: string) => void
  handleEquipeChange: (index: number, field: string, value: string) => void
  handleEquipamentosChange: (index: number, field: string, value: string) => void
}

export function EtapaDetalhesExecucao({
  formData,
  handleNestedInputChange,
  handleEquipeChange,
  handleEquipamentosChange,
}: EtapaDetalhesExecucaoProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Início da Concretagem</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={formData.inicioConcretagem.data}
              onChange={(e) => handleNestedInputChange("inicioConcretagem", "data", e.target.value)}
              placeholder="Data"
            />
            <Select
              value={formData.inicioConcretagem.hora}
              onValueChange={(value) => handleNestedInputChange("inicioConcretagem", "hora", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hora" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }).map((_, i) => (
                  <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                    {`${i.toString().padStart(2, "0")}:00`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>
            Produção Acumulada <span className="text-xs text-gray-500">(o sistema calcula)</span>
          </Label>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a Produção do Dia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Opção 1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Início do Acabamento</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={formData.inicioAcabamento.data}
              onChange={(e) => handleNestedInputChange("inicioAcabamento", "data", e.target.value)}
              placeholder="Data"
            />
            <Select
              value={formData.inicioAcabamento.hora}
              onValueChange={(value) => handleNestedInputChange("inicioAcabamento", "hora", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hora" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }).map((_, i) => (
                  <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                    {`${i.toString().padStart(2, "0")}:00`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>
            Volume de Concreto Teórico <span className="text-xs text-gray-500">(o sistema calcula)</span>
          </Label>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a Produção do Dia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Opção 1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Término da Concretagem</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={formData.terminoConcretagem.data}
              onChange={(e) => handleNestedInputChange("terminoConcretagem", "data", e.target.value)}
              placeholder="Data"
            />
            <Select
              value={formData.terminoConcretagem.hora}
              onValueChange={(value) => handleNestedInputChange("terminoConcretagem", "hora", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hora" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }).map((_, i) => (
                  <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                    {`${i.toString().padStart(2, "0")}:00`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Volume de Concreto Real</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Volume de Concreto Real" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Opção 1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Término do Acabamento</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={formData.terminoAcabamento.data}
              onChange={(e) => handleNestedInputChange("terminoAcabamento", "data", e.target.value)}
              placeholder="Data"
            />
            <Select
              value={formData.terminoAcabamento.hora}
              onValueChange={(value) => handleNestedInputChange("terminoAcabamento", "hora", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Hora" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }).map((_, i) => (
                  <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                    {`${i.toString().padStart(2, "0")}:00`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Juntas Serradas</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sim">Sim</SelectItem>
              <SelectItem value="nao">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Produção do Dia</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a Produção do Dia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Opção 1</SelectItem>
              <SelectItem value="option2">Opção 2</SelectItem>
              <SelectItem value="option3">Opção 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Juntas de Encontro</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sim">Sim</SelectItem>
              <SelectItem value="nao">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Equipe</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-2 font-medium">Nome do funcionário</div>
              <div className="font-medium">Entrada</div>
              <div className="font-medium">Saída</div>
            </div>

            {formData.equipe.map((membro: any, index: number) => (
              <div key={index} className="grid grid-cols-4 gap-2 items-center">
                <div className="col-span-2">
                  <Input
                    value={membro.nome}
                    onChange={(e) => handleEquipeChange(index, "nome", e.target.value)}
                    placeholder="Nome do funcionário"
                  />
                </div>
                <div>
                  <Select
                    value={membro.horaEntrada}
                    onValueChange={(value) => handleEquipeChange(index, "horaEntrada", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                          {`${i.toString().padStart(2, "0")}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={membro.horaSaida}
                    onValueChange={(value) => handleEquipeChange(index, "horaSaida", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                          {`${i.toString().padStart(2, "0")}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Equipamentos</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-3 font-medium">Nome do equipamento</div>
              <div className="font-medium">Quantidade</div>
            </div>

            {formData.equipamentos.map((equipamento: any, index: number) => (
              <div key={index} className="grid grid-cols-4 gap-2 items-center">
                <div className="col-span-3">
                  <Input
                    value={equipamento.nome}
                    onChange={(e) => handleEquipamentosChange(index, "nome", e.target.value)}
                    placeholder="Nome do equipamento"
                  />
                </div>
                <div>
                  <Select
                    value={equipamento.quantidade}
                    onValueChange={(value) => handleEquipamentosChange(index, "quantidade", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Qtd" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
