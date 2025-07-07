"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X, CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

export interface DiarioObraData {
  informacoesPrincipais: {
    data: string
    responsavelObra: string
    obra: string
    telefoneResponsavel: string
    cliente: string
    emailResponsavel: string
    construtora: string
    concreteira: string
    enderecoObra: string
  }
  informacoesObra: {
    areaTotal: string
    prazoExecucao: string
    reforcoEstrutural: string
    espessuraPiso: string
    lancamentoConcreto: string
    tipoAcabamento: string
    tipoCura: string
  }
  concretagem: {
    inicioConcretagem: {
      data: string
      hora: string
    }
    inicioAcabamento: {
      data: string
      hora: string
    }
    terminoConcretagem: {
      data: string
      hora: string
    }
    terminoAcabamento: {
      data: string
      hora: string
    }
    producaoAcumulada: string
    volumeConcreteTeorioco: string
    volumeConcreteReal: string
    juntasSerradas: string
    producaoDia: string
    juntasEncontro: string
  }
  equipe: Array<{
    nome: string
    selecionado: boolean
    entrada: string
    saida: string
  }>
  equipamentos: Array<{
    nome: string
    selecionado: boolean
    quantidade: string
  }>
  condicaoTempo: {
    manha: string
    tarde: string
    noite: string
  }
  ocorrencias: {
    atrasoConcreto: boolean
    faltaAreaLiberada: boolean
    pegaDiferenciada: boolean
    espessuraSubBase: boolean
    quebraEquipamentos: boolean
    areaSemCobertura: boolean
    outro: boolean
    nenhumaOcorrencia: boolean
  }
  avaliacoes: {
    juntasFrias: string
    manchamentoSuperficial: string
    alinhamentoCorte: string
    profundidadeCorte: string
    esborcinamentoCorte: string
    qualidadeAcabamentoSuperficial: string
    qualidadeAcabamentoPeParede: string
    planicidadeNivelamento: string
    organizacaoLimpeza: string
    posicionamentoArmadura: string
    posicionamentoReforcos: string
    fissurasSuperficie: string
  }
}

interface NovoDiarioModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (diario: DiarioObraData) => void
}

export function NovoDiarioModal({ isOpen, onClose, onSave }: NovoDiarioModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Estado para armazenar os dados do diário
  const [diarioData, setDiarioData] = useState<DiarioObraData>({
    informacoesPrincipais: {
      data: format(new Date(), "dd/MM/yyyy"),
      responsavelObra: "",
      obra: "Obra Exemplo",
      telefoneResponsavel: "",
      cliente: "Cliente Exemplo",
      emailResponsavel: "",
      construtora: "Construtora Exemplo",
      concreteira: "",
      enderecoObra: "Endereço da Obra Exemplo",
    },
    informacoesObra: {
      areaTotal: "",
      prazoExecucao: "",
      reforcoEstrutural: "",
      espessuraPiso: "",
      lancamentoConcreto: "",
      tipoAcabamento: "",
      tipoCura: "",
    },
    concretagem: {
      inicioConcretagem: {
        data: "",
        hora: "",
      },
      inicioAcabamento: {
        data: "",
        hora: "",
      },
      terminoConcretagem: {
        data: "",
        hora: "",
      },
      terminoAcabamento: {
        data: "",
        hora: "",
      },
      producaoAcumulada: "",
      volumeConcreteTeorioco: "",
      volumeConcreteReal: "",
      juntasSerradas: "",
      producaoDia: "",
      juntasEncontro: "",
    },
    equipe: [
      { nome: "Funcionário 1", selecionado: false, entrada: "", saida: "" },
      { nome: "Funcionário 2", selecionado: false, entrada: "", saida: "" },
      { nome: "Funcionário 3", selecionado: false, entrada: "", saida: "" },
      { nome: "Funcionário 4", selecionado: false, entrada: "", saida: "" },
    ],
    equipamentos: [
      { nome: "Equipamento 1", selecionado: false, quantidade: "" },
      { nome: "Equipamento 2", selecionado: false, quantidade: "" },
      { nome: "Equipamento 3", selecionado: false, quantidade: "" },
    ],
    condicaoTempo: {
      manha: "",
      tarde: "",
      noite: "",
    },
    ocorrencias: {
      atrasoConcreto: false,
      faltaAreaLiberada: false,
      pegaDiferenciada: false,
      espessuraSubBase: false,
      quebraEquipamentos: false,
      areaSemCobertura: false,
      outro: false,
      nenhumaOcorrencia: false,
    },
    avaliacoes: {
      juntasFrias: "",
      manchamentoSuperficial: "",
      alinhamentoCorte: "",
      profundidadeCorte: "",
      esborcinamentoCorte: "",
      qualidadeAcabamentoSuperficial: "",
      qualidadeAcabamentoPeParede: "",
      planicidadeNivelamento: "",
      organizacaoLimpeza: "",
      posicionamentoArmadura: "",
      posicionamentoReforcos: "",
      fissurasSuperficie: "",
    },
  })

  // Avançar para o próximo passo
  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  // Voltar para o passo anterior
  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  // Salvar o diário
  const handleSave = () => {
    onSave(diarioData)
    onClose()
  }

  // Atualizar os dados do diário
  const updateDiarioData = (section: keyof DiarioObraData, field: string, value: any) => {
    setDiarioData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  // Atualizar campos aninhados
  const updateNestedField = (section: keyof DiarioObraData, parent: string, field: string, value: any) => {
    setDiarioData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...prev[section][parent],
          [field]: value,
        },
      },
    }))
  }

  // Atualizar equipe
  const updateEquipe = (index: number, field: string, value: any) => {
    const newEquipe = [...diarioData.equipe]
    newEquipe[index] = { ...newEquipe[index], [field]: value }
    setDiarioData((prev) => ({
      ...prev,
      equipe: newEquipe,
    }))
  }

  // Atualizar equipamentos
  const updateEquipamento = (index: number, field: string, value: any) => {
    const newEquipamentos = [...diarioData.equipamentos]
    newEquipamentos[index] = { ...newEquipamentos[index], [field]: value }
    setDiarioData((prev) => ({
      ...prev,
      equipamentos: newEquipamentos,
    }))
  }

  // Função para lidar com a seleção de data
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      updateDiarioData("informacoesPrincipais", "data", format(date, "dd/MM/yyyy"))
    }
    setCalendarOpen(false)
  }

  // Renderizar o conteúdo do modal baseado no passo atual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl font-semibold">Novo diário de obra</DialogTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="mt-6">
              <h3 className="text-base font-medium mb-4">Informações Principais</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">
                    Data <span className="text-xs text-gray-500">(Preenchimento automático)</span>
                  </Label>
                  <Popover
                    open={calendarOpen}
                    onOpenChange={(open) => {
                      setCalendarOpen(open)
                      // Informar ao modal que o calendário está aberto
                      if (typeof window !== "undefined") {
                        window.hasOpenCalendar = open
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          setCalendarOpen(true)
                        }}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start" onClick={(e) => e.stopPropagation()}>
                      <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Outros campos do passo 1 */}
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button onClick={nextStep} className="bg-[#0096b2] hover:bg-[#007a91]">
                Continuar
              </Button>
            </div>
          </>
        )
      // Outros casos para os demais passos
      default:
        return null
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Só permite fechar o modal se o calendário não estiver aberto
        if (!calendarOpen) {
          onClose()
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => {
          // Previne o fechamento do modal quando clicar fora, se o calendário estiver aberto
          if (calendarOpen) {
            e.preventDefault()
          }
        }}
      >
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  )
}
