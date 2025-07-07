"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EtapaCondicoesAvaliacoesProps {
  formData: any
  handleNestedInputChange: (parent: string, field: string, value: string) => void
  handleCheckboxChange: (parent: string, field: string, checked: boolean) => void
}

export function EtapaCondicoesAvaliacoes({
  formData,
  handleNestedInputChange,
  handleCheckboxChange,
}: EtapaCondicoesAvaliacoesProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Condição do Tempo</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Manhã</Label>
              <Select
                value={formData.condicaoTempo.manha}
                onValueChange={(value) => handleNestedInputChange("condicaoTempo", "manha", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ensolarado">Ensolarado</SelectItem>
                  <SelectItem value="nublado">Nublado</SelectItem>
                  <SelectItem value="chuvoso">Chuvoso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tarde</Label>
              <Select
                value={formData.condicaoTempo.tarde}
                onValueChange={(value) => handleNestedInputChange("condicaoTempo", "tarde", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ensolarado">Ensolarado</SelectItem>
                  <SelectItem value="nublado">Nublado</SelectItem>
                  <SelectItem value="chuvoso">Chuvoso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Noite</Label>
              <Select
                value={formData.condicaoTempo.noite}
                onValueChange={(value) => handleNestedInputChange("condicaoTempo", "noite", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="limpo">Céu limpo</SelectItem>
                  <SelectItem value="nublado">Nublado</SelectItem>
                  <SelectItem value="chuvoso">Chuvoso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <h3 className="text-lg font-medium mt-8 mb-4">Ocorrência na Obra</h3>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="atraso-concreto"
                checked={formData.ocorrencias.atrasoConcreto}
                onCheckedChange={(checked) => handleCheckboxChange("ocorrencias", "atrasoConcreto", checked as boolean)}
              />
              <label htmlFor="atraso-concreto" className="text-sm">
                Atraso do concreto
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="falta-aco"
                checked={formData.ocorrencias.faltaAcoLiberar}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("ocorrencias", "faltaAcoLiberar", checked as boolean)
                }
              />
              <label htmlFor="falta-aco" className="text-sm">
                Falta de aço liberado
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pega-diferenciada"
                checked={formData.ocorrencias.pegaDiferenciadaConcreto}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("ocorrencias", "pegaDiferenciadaConcreto", checked as boolean)
                }
              />
              <label htmlFor="pega-diferenciada" className="text-sm">
                Pega diferenciada no concreto
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="espessura-maior-menor"
                checked={formData.ocorrencias.espessuraMaiorMenor}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("ocorrencias", "espessuraMaiorMenor", checked as boolean)
                }
              />
              <label htmlFor="espessura-maior-menor" className="text-sm">
                Espessura maior/menor na sub-base
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="quebras-equipamentos"
                checked={formData.ocorrencias.quebrasEquipamentos}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("ocorrencias", "quebrasEquipamentos", checked as boolean)
                }
              />
              <label htmlFor="quebras-equipamentos" className="text-sm">
                Quebras de equipamentos
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="area-sem-cobertura"
                checked={formData.ocorrencias.areaSemCobertura}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("ocorrencias", "areaSemCobertura", checked as boolean)
                }
              />
              <label htmlFor="area-sem-cobertura" className="text-sm">
                Área sem cobertura
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="outro"
                checked={formData.ocorrencias.outro}
                onCheckedChange={(checked) => handleCheckboxChange("ocorrencias", "outro", checked as boolean)}
              />
              <label htmlFor="outro" className="text-sm">
                Outro
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="nenhuma-ocorrencia"
                checked={formData.ocorrencias.nenhumaOcorrencia}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("ocorrencias", "nenhumaOcorrencia", checked as boolean)
                }
              />
              <label htmlFor="nenhuma-ocorrencia" className="text-sm">
                Nenhuma ocorrência
              </label>
            </div>
          </div>

          <h3 className="text-lg font-medium mt-8 mb-4">Avaliação dos trabalhos</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Junta PIV / Pega diferenciada</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Manchamento Superficial</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Alinhamento do corte das juntas</h3>
          <div className="space-y-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione de 1 a 5" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Profundidade do corte das juntas</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Esborcinamento do corte das juntas</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Qualidade do acabamento superficial</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Qualidade do acabamento no pé de parede/pilar</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Planicidade e Nivelamento</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Organização e Limpeza</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Posicionamento da armadura</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Posicionamento dos reforços</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fissura na superfície</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <Button type="button" className="w-full bg-blue-100 text-blue-800 hover:bg-blue-200">
              Anexar imagens
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Você está offline? Seu registro será salvo
              <br />
              quando conectar a uma rede.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
