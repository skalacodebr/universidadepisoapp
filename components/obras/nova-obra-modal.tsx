"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EtapaInformacoesPrincipais } from "./etapas/etapa-informacoes-principais"
import { EtapaDetalhesExecucao } from "./etapas/etapa-detalhes-execucao"
import { EtapaCondicoesAvaliacoes } from "./etapas/etapa-condicoes-avaliacoes"

interface NovaObraModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (obraData: any) => void
}

export function NovaObraModal({ isOpen, onClose, onSave }: NovaObraModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Etapa 1 - Informações Principais
    data: "",
    obra: "",
    cliente: "",
    construtora: "",
    endereco: "",
    responsavel: "",
    telefoneResponsavel: "",
    emailResponsavel: "",
    concreteira: "",
    contatoConcreteira: "",
    areaTotal: "",
    prazoExecucao: "",
    reforcoEstrutural: "",
    espessuraPiso: "",
    lancamentoConcreto: "",
    tipoAcabamento: "",
    tipoCura: "",

    // Etapa 2 - Detalhes de Execução
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
    producaoDia: "",
    producaoAcumulada: "",
    volumeConcretoTeorico: "",
    volumeConcretoReal: "",
    juntasSerradas: "",
    juntasEncontro: "",
    equipe: [
      { nome: "", horaEntrada: "", horaSaida: "" },
      { nome: "", horaEntrada: "", horaSaida: "" },
      { nome: "", horaEntrada: "", horaSaida: "" },
      { nome: "", horaEntrada: "", horaSaida: "" },
    ],
    equipamentos: [
      { nome: "", quantidade: "" },
      { nome: "", quantidade: "" },
      { nome: "", quantidade: "" },
      { nome: "", quantidade: "" },
    ],

    // Etapa 3 - Condições e Avaliações
    condicaoTempo: {
      manha: "",
      tarde: "",
      noite: "",
    },
    ocorrencias: {
      atrasoConcreto: false,
      faltaAcoLiberar: false,
      pegaDiferenciadaConcreto: false,
      espessuraMaiorMenor: false,
      quebrasEquipamentos: false,
      areaSemCobertura: false,
      outro: false,
      nenhumaOcorrencia: false,
    },
    alinhamentoCorteJuntas: "",
    profundidadeCorteJuntas: "",
    esborcinamentoCorteJuntas: "",
    qualidadeAcabamentoSuperficial: "",
    qualidadeAcabamentoPe: "",
    planicidadeNivelamento: "",
    organizacaoLimpeza: "",
    posicionamentoArmadura: "",
    posicionamentoReforcos: "",
    fissuraSuperficie: "",
    juntaPisoFogoDiferenciada: "",
    manchamentoSuperficial: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleCheckboxChange = (parent: string, field: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: checked,
      },
    }))
  }

  const handleEquipeChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newEquipe = [...prev.equipe]
      newEquipe[index] = { ...newEquipe[index], [field]: value }
      return { ...prev, equipe: newEquipe }
    })
  }

  const handleEquipamentosChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newEquipamentos = [...prev.equipamentos]
      newEquipamentos[index] = { ...newEquipamentos[index], [field]: value }
      return { ...prev, equipamentos: newEquipamentos }
    })
  }

  const handleContinue = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSave = () => {
    // Transformar os dados do formulário em um objeto de obra para salvar
    const novaObra = {
      id: Math.floor(Math.random() * 1000) + 7, // ID aleatório para exemplo
      nome: formData.obra,
      cidade: formData.endereco.split(",").pop()?.trim() || "Cidade",
      inicio: formData.inicioConcretagem.data || "01/01/24",
      termino: formData.prazoExecucao ? `+${formData.prazoExecucao} dias` : "01/02/24",
      construtora: formData.construtora,
      status: "Ativas",
    }

    onSave(novaObra)
    onClose()
    setStep(1) // Resetar para a primeira etapa
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Novo diário de obra</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && <EtapaInformacoesPrincipais formData={formData} handleInputChange={handleInputChange} />}

          {step === 2 && (
            <EtapaDetalhesExecucao
              formData={formData}
              handleNestedInputChange={handleNestedInputChange}
              handleEquipeChange={handleEquipeChange}
              handleEquipamentosChange={handleEquipamentosChange}
            />
          )}

          {step === 3 && (
            <EtapaCondicoesAvaliacoes
              formData={formData}
              handleNestedInputChange={handleNestedInputChange}
              handleCheckboxChange={handleCheckboxChange}
            />
          )}
        </div>

        <div className="p-6 border-t flex justify-end gap-2">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handleBack}>
              Voltar
            </Button>
          )}

          {step < 3 ? (
            <Button type="button" onClick={handleContinue} className="bg-[#0097B2] hover:bg-[#007d93] text-white">
              Continuar
            </Button>
          ) : (
            <Button type="button" onClick={handleSave} className="bg-[#0097B2] hover:bg-[#007d93] text-white">
              Salvar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
