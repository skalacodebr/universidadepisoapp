"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, ArrowRight, ChevronLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface EquipeConcretagem {
  id: number
  nome: string
  qtd_pessoas: number
}

interface EquipeAcabamento {
  id: number
  nome: string
  qtd_pessoas: number
}

interface SimulacaoFormStep2Props {
  onNext: () => void
  onPrevious: () => void
  formData: any
  updateFormData: (data: any) => void
}

export function SimulacaoFormStep2({ onNext, onPrevious, formData, updateFormData }: SimulacaoFormStep2Props) {
  const [equipamentos, setEquipamentos] = useState<{ nome: string; quantidade: number }[]>([])
  const [novoEquipamento, setNovoEquipamento] = useState({ nome: "", quantidade: 1 })
  const [equipamentosDisponiveis, setEquipamentosDisponiveis] = useState<{ id: number; nome: string }[]>([])
  const [equipesConcretagem, setEquipesConcretagem] = useState<EquipeConcretagem[]>([])
  const [equipesAcabamento, setEquipesAcabamento] = useState<EquipeAcabamento[]>([])
  const [equipePreparacaoOptions, setEquipePreparacaoOptions] = useState<
    { id: number; nome: string; qtd_pessoas: number }[]
  >([])
  const [equipeFinalizacaoOptions, setEquipeFinalizacaoOptions] = useState<
    { id: number; nome: string; qtd_pessoas: number }[]
  >([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  // Buscar dados do banco de dados
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true)

        // Buscar equipes de concretagem
        const { data: concretagemData, error: concretagemError } = await supabase
          .from("equipes_concretagem")
          .select("id, nome, qtd_pessoas")
          .order("nome")

        if (concretagemError) {
          console.error("Erro ao buscar equipes de concretagem:", concretagemError)
        } else {
          setEquipesConcretagem(concretagemData || [])
        }

        // Buscar equipes de acabamento
        const { data: acabamentoData, error: acabamentoError } = await supabase
          .from("equipes_acabamento")
          .select("id, nome, qtd_pessoas")
          .order("nome")

        if (acabamentoError) {
          console.error("Erro ao buscar equipes de acabamento:", acabamentoError)
        } else {
          setEquipesAcabamento(acabamentoData || [])
        }

        // Buscar equipamentos disponíveis
        const { data: equipamentosData, error: equipamentosError } = await supabase
          .from("equipamentos")
          .select("id, nome")
          .order("nome")

        if (equipamentosError) {
          console.error("Erro ao buscar equipamentos:", equipamentosError)
        } else {
          setEquipamentosDisponiveis(equipamentosData || [])
        }

        // Buscar equipes de preparação
        const { data: preparacaoData, error: preparacaoError } = await supabase
          .from("equipes_preparacao")
          .select("id, nome, qtd_pessoas")
          .order("nome")

        if (preparacaoError) {
          console.error("Erro ao buscar equipes de preparação:", preparacaoError)
        } else {
          setEquipePreparacaoOptions(preparacaoData || [])
        }

        // Buscar equipes de finalização
        const { data: finalizacaoData, error: finalizacaoError } = await supabase
          .from("equipes_finalizacao")
          .select("id, nome, qtd_pessoas")
          .order("nome")

        if (finalizacaoError) {
          console.error("Erro ao buscar equipes de finalização:", finalizacaoError)
        } else {
          setEquipeFinalizacaoOptions(finalizacaoData || [])
        }

        setEquipamentos([])
      } catch (error) {
        console.error("Erro geral ao buscar opções:", error)
      } finally {
        setLoadingOptions(false)
      }
    }

    fetchOptions()
  }, [])

  // Função para adicionar um novo equipamento
  const adicionarEquipamento = () => {
    if (novoEquipamento.nome.trim()) {
      setEquipamentos([...equipamentos, { ...novoEquipamento }])
      setNovoEquipamento({ nome: "", quantidade: 1 })
    }
  }

  const handleNext = () => {
    // Salvar dados do step 2
    updateFormData({
      equipamentos,
      // Outros campos do formulário podem ser adicionados aqui
    })
    onNext()
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center">
          <div className="bg-gray-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            ✓
          </div>
          <div className="h-1 w-12 bg-[#007EA3]"></div>
        </div>
        <div className="flex items-center">
          <div className="bg-[#007EA3] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            2
          </div>
          <div className="h-1 w-12 bg-gray-200"></div>
        </div>
        <div className="flex items-center">
          <div className="bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
            3
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-md font-semibold border-b pb-2">Informações sobre Concretagem e Acabamento</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 pr-1">
            <label className="text-sm font-medium">Data da Concretagem*</label>
            <Input
              className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none w-full"
              type="date"
              value={formData?.inicioConcretagem || ""}
              onChange={(e) => updateFormData({ inicioConcretagem: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hora de Início*</label>
            <Input
              className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none w-full"
              type="time"
              value={formData?.horaInicio || ""}
              onChange={(e) => updateFormData({ horaInicio: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Equipe de Concretagem*</label>
          <Select
            value={formData?.equipeConcretagem || ""}
            onValueChange={(value) => updateFormData({ equipeConcretagem: value })}
          >
            <SelectTrigger className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none w-full">
              <SelectValue placeholder={loadingOptions ? "Carregando..." : "Selecione uma equipe"} />
            </SelectTrigger>
            <SelectContent>
              {loadingOptions ? (
                <SelectItem value="" disabled>
                  Carregando equipes...
                </SelectItem>
              ) : equipesConcretagem.length > 0 ? (
                equipesConcretagem.map((equipe) => (
                  <SelectItem key={equipe.id} value={String(equipe.id)}>
                    {equipe.nome} (Até {equipe.qtd_pessoas} pessoas)
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Nenhuma equipe encontrada
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Equipe de Acabamento*</label>
          <Select
            value={formData?.equipeAcabamento || ""}
            onValueChange={(value) => updateFormData({ equipeAcabamento: value })}
          >
            <SelectTrigger className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none w-full">
              <SelectValue placeholder={loadingOptions ? "Carregando..." : "Selecione uma equipe"} />
            </SelectTrigger>
            <SelectContent>
              {loadingOptions ? (
                <SelectItem value="" disabled>
                  Carregando equipes...
                </SelectItem>
              ) : equipesAcabamento.length > 0 ? (
                equipesAcabamento.map((equipe) => (
                  <SelectItem key={equipe.id} value={String(equipe.id)}>
                    {equipe.nome} (Até {equipe.qtd_pessoas} pessoas)
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Nenhuma equipe encontrada
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <h3 className="text-md font-semibold border-b pb-2">Preparação e Finalização da Obra</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 pr-1">
            <label className="text-sm font-medium">Equipe de preparação da obra</label>
            <Select
              value={formData?.equipePreparacao || ""}
              onValueChange={(value) => updateFormData({ equipePreparacao: value })}
            >
              <SelectTrigger className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none w-full">
                <SelectValue placeholder={loadingOptions ? "Carregando..." : "Selecione uma equipe"} />
              </SelectTrigger>
              <SelectContent>
                {loadingOptions ? (
                  <SelectItem value="" disabled>
                    Carregando equipes...
                  </SelectItem>
                ) : equipePreparacaoOptions.length > 0 ? (
                  equipePreparacaoOptions.map((equipe) => (
                    <SelectItem key={equipe.id} value={String(equipe.id)}>
                      {equipe.nome} (Até {equipe.qtd_pessoas} pessoas)
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    Nenhuma equipe encontrada
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 pl-1">
            <label className="text-sm font-medium">Prazo de preparação da obra</label>
            <div className="relative">
              <Input
                className="pr-12 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none w-full"
                type="number"
                placeholder="Ex: 2"
                value={formData?.prazoPreparacao || ""}
                onChange={(e) => updateFormData({ prazoPreparacao: e.target.value })}
              />
              <span className="absolute right-3 top-2.5 text-sm text-gray-500">dias</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 pr-1">
            <label className="text-sm font-medium">Equipe de finalização da obra</label>
            <Select
              value={formData?.equipeFinalizacao || ""}
              onValueChange={(value) => updateFormData({ equipeFinalizacao: value })}
            >
              <SelectTrigger className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none w-full">
                <SelectValue placeholder={loadingOptions ? "Carregando..." : "Selecione uma equipe"} />
              </SelectTrigger>
              <SelectContent>
                {loadingOptions ? (
                  <SelectItem value="" disabled>
                    Carregando equipes...
                  </SelectItem>
                ) : equipeFinalizacaoOptions.length > 0 ? (
                  equipeFinalizacaoOptions.map((equipe) => (
                    <SelectItem key={equipe.id} value={String(equipe.id)}>
                      {equipe.nome} (Até {equipe.qtd_pessoas} pessoas)
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    Nenhuma equipe encontrada
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 pl-1">
            <label className="text-sm font-medium">Prazo de finalização da obra</label>
            <div className="relative">
              <Input
                className="pr-12 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none w-full"
                type="number"
                placeholder="Ex: 1"
                value={formData?.prazoFinalizacao || ""}
                onChange={(e) => updateFormData({ prazoFinalizacao: e.target.value })}
              />
              <span className="absolute right-3 top-2.5 text-sm text-gray-500">dias</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-8">
        <h3 className="text-md font-semibold border-b pb-2">Equipamentos</h3>

        <div className="space-y-4 bg-gray-50 p-4 rounded">
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-4">
              <label className="text-sm font-medium">Equipamento</label>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Quantidade</label>
            </div>
          </div>

          {equipamentos.map((equipamento, index) => (
            <div key={index} className="grid grid-cols-6 gap-2">
              <div className="col-span-4">
                <p className="text-sm">{equipamento.nome}</p>
              </div>
              <div className="col-span-2">
                <Input
                  className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none w-full"
                  type="number"
                  value={equipamento.quantidade}
                  onChange={(e) => {
                    const newEquipamentos = [...equipamentos]
                    newEquipamentos[index].quantidade = Number.parseInt(e.target.value) || 1
                    setEquipamentos(newEquipamentos)
                  }}
                  min={1}
                />
              </div>
            </div>
          ))}

          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-6 gap-2 mb-3">
              <div className="col-span-4">
                <Select
                  value={novoEquipamento.nome}
                  onValueChange={(value) => setNovoEquipamento({ ...novoEquipamento, nome: value })}
                >
                  <SelectTrigger className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none w-full">
                    <SelectValue placeholder="Selecione um equipamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingOptions ? (
                      <SelectItem value="" disabled>
                        Carregando equipamentos...
                      </SelectItem>
                    ) : equipamentosDisponiveis.length > 0 ? (
                      equipamentosDisponiveis.map((equip) => (
                        <SelectItem key={equip.id} value={equip.nome}>
                          {equip.nome}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        Nenhum equipamento encontrado
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Input
                  className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none w-full"
                  type="number"
                  placeholder="Qtd"
                  value={novoEquipamento.quantidade}
                  onChange={(e) =>
                    setNovoEquipamento({
                      ...novoEquipamento,
                      quantidade: Number.parseInt(e.target.value) || 1,
                    })
                  }
                  min={1}
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
              onClick={adicionarEquipamento}
              disabled={!novoEquipamento.nome.trim()}
            >
              <PlusCircle className="h-4 w-4 text-[#007EA3]" />
              <span className="text-sm">Adicionar equipamento</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Button
          onClick={handleNext}
          className="bg-[#007EA3] hover:bg-[#006a8a] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
