"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Calendar,
  BookOpen,
  Receipt,
  Check,
  Building,
  User,
  Mail,
  Phone,
  CalendarIcon,
  MapPinIcon,
  Hash,
  X,
  Ruler,
  Clock,
  Construction,
  Layers,
  Droplet,
  DollarSign,
  Percent,
  BarChartIcon as ChartBar,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { supabase } from "@/lib/supabase"

// Tipos e interfaces
interface DiarioObra {
  data: string
  hora: string
  ocorrencia: string
}

interface DespesaObra {
  data: string
  valor: string
  categoria: string
  descricao: string
}

interface Endereco {
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

interface Obra {
  id: number
  nome: string
  construtora: string
  endereco: string
  enderecoCompleto?: Endereco
  cliente: string
  responsavel: string
  emailResponsavel: string
  telefoneResponsavel: string
  inicio: string
  termino: string
  concreteira: string
  contatoConcreteira: string
  // Informações da obra
  areaTotal: string
  prazoExecucao: string
  reforcoEstrutural: string
  espessuraPiso: string
  lancamentoConcreto: string
  tipoAcabamento: string
  tipoCura: string
  // Financeiro
  lucroTotal: string
  precoVendaM2: string
  comissao: string
  // Diários e Despesas
  diarios: DiarioObra[]
  despesas: DespesaObra[]
}

// Lista de estados brasileiros
const estadosBrasileiros = [
  { valor: "AC", nome: "Acre" },
  { valor: "AL", nome: "Alagoas" },
  { valor: "AP", nome: "Amapá" },
  { valor: "AM", nome: "Amazonas" },
  { valor: "BA", nome: "Bahia" },
  { valor: "CE", nome: "Ceará" },
  { valor: "DF", nome: "Distrito Federal" },
  { valor: "ES", nome: "Espírito Santo" },
  { valor: "GO", nome: "Goiás" },
  { valor: "MA", nome: "Maranhão" },
  { valor: "MT", nome: "Mato Grosso" },
  { valor: "MS", nome: "Mato Grosso do Sul" },
  { valor: "MG", nome: "Minas Gerais" },
  { valor: "PA", nome: "Pará" },
  { valor: "PB", nome: "Paraíba" },
  { valor: "PR", nome: "Paraná" },
  { valor: "PE", nome: "Pernambuco" },
  { valor: "PI", nome: "Piauí" },
  { valor: "RJ", nome: "Rio de Janeiro" },
  { valor: "RN", nome: "Rio Grande do Norte" },
  { valor: "RS", nome: "Rio Grande do Sul" },
  { valor: "RO", nome: "Rondônia" },
  { valor: "RR", nome: "Roraima" },
  { valor: "SC", nome: "Santa Catarina" },
  { valor: "SP", nome: "São Paulo" },
  { valor: "SE", nome: "Sergipe" },
  { valor: "TO", nome: "Tocantins" },
]

// Componente para cada seção com título e botão de editar
interface SecaoProps {
  titulo: string
  onEdit?: () => void
  children: React.ReactNode
}

function Secao({ titulo, onEdit, children }: SecaoProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">{titulo}</h3>
        {onEdit && (
          <Button variant="link" className="text-[#007EA3] p-0 hover:text-[#006a8a]" onClick={onEdit}>
            Editar
          </Button>
        )}
      </div>
      {children}
    </div>
  )
}

// Componente para cada campo de informação
interface CampoInfoProps {
  label: string
  valor: string
}

function CampoInfo({ label, valor }: CampoInfoProps) {
  return (
    <div className="mb-3">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{valor}</p>
    </div>
  )
}

// Componente para registros de diário e despesas
interface CardRegistroProps {
  titulo: string
  data: string
  info1?: string
  info2?: string
  info3?: string
  icone: React.ReactNode
}

function CardRegistro({ titulo, data, info1, info2, info3, icone }: CardRegistroProps) {
  return (
    <div className="p-3 bg-gray-50 rounded-md border mb-3">
      <div className="flex items-start">
        <div className="bg-white p-2 rounded-md border mr-3">{icone}</div>
        <div className="flex-1">
          <p className="text-sm font-medium">{data}</p>
          {info1 && <p className="text-sm">{info1}</p>}
          {info2 && <p className="text-sm text-gray-500">{info2}</p>}
          {info3 && <p className="text-sm text-gray-500">{info3}</p>}
        </div>
      </div>
    </div>
  )
}

export default function DetalheObra() {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  const [obra, setObra] = useState<Obra | null>(null)
  const [loading, setLoading] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editInfoObraModalOpen, setEditInfoObraModalOpen] = useState(false)
  const [formData, setFormData] = useState<Obra | null>(null)
  const [infoObraFormData, setInfoObraFormData] = useState<Obra | null>(null)
  const [saving, setSaving] = useState(false)
  const [savingInfoObra, setSavingInfoObra] = useState(false)
  const [tiposReforcoEstrutural, setTiposReforcoEstrutural] = useState<Array<{ id: number; nome: string }>>([])

  useEffect(() => {
    // Fetch structural reinforcement types
    const fetchTiposReforco = async () => {
      try {
        const { data, error } = await supabase.from("tipo_reforco_estrutural").select("id, nome").order("nome")

        if (error) {
          console.error("Erro ao buscar tipos de reforço:", error)
          // Fallback data if database fails
          setTiposReforcoEstrutural([
            { id: 1, nome: "Não necessário" },
            { id: 2, nome: "Fibra de aço" },
            { id: 3, nome: "Tela soldada" },
            { id: 4, nome: "Armadura convencional" },
          ])
        } else if (data) {
          setTiposReforcoEstrutural(data)
        }
      } catch (error) {
        console.error("Erro na conexão com o banco:", error)
        // Fallback data
        setTiposReforcoEstrutural([
          { id: 1, nome: "Não necessário" },
          { id: 2, nome: "Fibra de aço" },
          { id: 3, nome: "Tela soldada" },
          { id: 4, nome: "Armadura convencional" },
        ])
      }
    }

    fetchTiposReforco()

    // Simulando uma chamada de API para a obra
    setTimeout(() => {
      const mockObra: Obra = {
        id: Number(id),
        nome: "Condomínio Residencial Parque das Árvores",
        construtora: "Construtora ABC",
        endereco: "Av. Principal, 1000, São Paulo, SP",
        enderecoCompleto: {
          cep: "01310-100",
          rua: "Av. Principal",
          numero: "1000",
          complemento: "",
          bairro: "Centro",
          cidade: "São Paulo",
          estado: "SP",
        },
        cliente: "Incorporadora XYZ",
        responsavel: "Eng. João Silva",
        emailResponsavel: "joao.silva@exemplo.com",
        telefoneResponsavel: "(11) 98765-4321",
        inicio: "01/01/2023",
        termino: "01/06/2023",
        concreteira: "Concreteira Forte",
        contatoConcreteira: "(11) 91234-5678",
        // Informações da obra
        areaTotal: "80",
        prazoExecucao: "120",
        reforcoEstrutural: "2", // Using ID 2 (Fibra de aço) as example
        espessuraPiso: "8",
        lancamentoConcreto: "15",
        tipoAcabamento: "Acabamento Polido",
        tipoCura: "Cura química com membrana",
        // Financeiro
        lucroTotal: "R$ 150.000",
        precoVendaM2: "R$ 15.000",
        comissao: "15%",
        // Diários e Despesas
        diarios: [
          {
            data: "Dia 24 de novembro de 2025",
            hora: "10:00h - 11:00h",
            ocorrencia: "Atraso do concreto",
          },
          {
            data: "Dia 23 de novembro de 2025",
            hora: "10:00h - 11:00h",
            ocorrencia: "Atraso do concreto",
          },
          {
            data: "Dia 22 de novembro de 2025",
            hora: "10:00h - 11:00h",
            ocorrencia: "Atraso do concreto",
          },
        ],
        despesas: [
          {
            data: "Dia 24 de novembro de 2025",
            valor: "R$ 80,00",
            categoria: "Alimentação",
            descricao: "Descrição da despesa",
          },
          {
            data: "Dia 24 de novembro de 2025",
            valor: "R$ 80,00",
            categoria: "Alimentação",
            descricao: "Descrição da despesa",
          },
          {
            data: "Dia 24 de novembro de 2025",
            valor: "R$ 80,00",
            categoria: "Alimentação",
            descricao: "Descrição da despesa",
          },
        ],
      }

      // Verificar se há despesas salvas no localStorage
      try {
        const despesasStorage = localStorage.getItem(`despesas_obra_${id}`)
        if (despesasStorage) {
          const despesasSalvas = JSON.parse(despesasStorage)
          mockObra.despesas = despesasSalvas
        }
      } catch (error) {
        console.error("Erro ao carregar despesas do localStorage:", error)
      }

      setObra(mockObra)
      setFormData(mockObra)
      setInfoObraFormData(mockObra)
      setLoading(false)
    }, 1000)
  }, [id])

  // Função para consultar CEP
  const buscarCep = async (cep: string) => {
    if (!cep || cep.length !== 8) return

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

      if (!response.ok) {
        throw new Error("Erro ao buscar CEP")
      }

      const data = await response.json()

      if (data.erro) {
        throw new Error("CEP não encontrado")
      }

      if (formData && formData.enderecoCompleto) {
        setFormData({
          ...formData,
          enderecoCompleto: {
            ...formData.enderecoCompleto!,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          },
        })
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
    }
  }

  // Handlers for Informações Gerais modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      if (parent === "enderecoCompleto" && formData) {
        setFormData({
          ...formData,
          enderecoCompleto: {
            ...formData.enderecoCompleto!,
            [child]: value,
          },
        })

        // Se for o CEP, buscar informações quando tiver 8 dígitos
        if (child === "cep" && value.length === 8) {
          buscarCep(value)
        }
      }
    } else if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name.includes(".") && formData) {
      const [parent, child] = name.split(".")
      if (parent === "enderecoCompleto") {
        setFormData({
          ...formData,
          enderecoCompleto: {
            ...formData.enderecoCompleto!,
            [child]: value,
          },
        })
      }
    }
  }

  // Handlers for Informações da Obra modal
  const handleInfoObraInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (infoObraFormData) {
      const { name, value } = e.target
      setInfoObraFormData({
        ...infoObraFormData,
        [name]: value,
      })
    }
  }

  const handleInfoObraSelectChange = (name: string, value: string) => {
    if (infoObraFormData) {
      setInfoObraFormData({
        ...infoObraFormData,
        [name]: value,
      })
    }
  }

  const handleOpenEditModal = () => {
    setFormData(obra)
    setEditModalOpen(true)
  }

  const handleOpenEditInfoObraModal = () => {
    setInfoObraFormData(obra)
    setEditInfoObraModalOpen(true)
  }

  const handleSaveChanges = async () => {
    if (formData) {
      setSaving(true)

      try {
        // Simulando uma chamada à API
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Atualizar o endereço formatado
        const enderecoFormatado = formData.enderecoCompleto
          ? `${formData.enderecoCompleto.rua}, ${formData.enderecoCompleto.numero}${formData.enderecoCompleto.complemento ? ", " + formData.enderecoCompleto.complemento : ""}, ${formData.enderecoCompleto.cidade}, ${formData.enderecoCompleto.estado}`
          : formData.endereco

        setObra({
          ...formData,
          endereco: enderecoFormatado,
        })

        setEditModalOpen(false)

        // Mostrar notificação de sucesso
        toast({
          title: "Alterações salvas com sucesso!",
          description: "Os detalhes da obra foram atualizados.",
          className: "bg-green-50 border-green-200",
        })
      } catch (error) {
        console.error("Erro ao salvar alterações:", error)
        toast({
          title: "Erro ao salvar alterações",
          description: "Ocorreu um erro. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setSaving(false)
      }
    }
  }

  const handleSaveInfoObraChanges = async () => {
    if (infoObraFormData) {
      setSavingInfoObra(true)

      try {
        // Simulando uma chamada à API
        await new Promise((resolve) => setTimeout(resolve, 800))

        setObra({
          ...obra!,
          areaTotal: infoObraFormData.areaTotal,
          prazoExecucao: infoObraFormData.prazoExecucao,
          reforcoEstrutural: infoObraFormData.reforcoEstrutural,
          espessuraPiso: infoObraFormData.espessuraPiso,
          lancamentoConcreto: infoObraFormData.lancamentoConcreto,
          tipoAcabamento: infoObraFormData.tipoAcabamento,
          tipoCura: infoObraFormData.tipoCura,
        })

        setEditInfoObraModalOpen(false)

        // Mostrar notificação de sucesso
        toast({
          title: "Informações técnicas atualizadas!",
          description: "Os dados técnicos da obra foram atualizados com sucesso.",
          className: "bg-green-50 border-green-200",
        })
      } catch (error) {
        console.error("Erro ao salvar informações da obra:", error)
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um erro. Tente novamente mais tarde.",
          variant: "destructive",
        })
      } finally {
        setSavingInfoObra(false)
      }
    }
  }

  // Helper function to get structural reinforcement name by ID
  const getReforcoEstruturalNome = (id: string) => {
    if (tiposReforcoEstrutural.length === 0) {
      return "Carregando..."
    }
    const tipo = tiposReforcoEstrutural.find((t) => t.id.toString() === id)
    return tipo?.nome || "Não informado"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!obra) {
    return <div>Obra não encontrada</div>
  }

  return (
    <div className="container mx-auto py-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6">Detalhes da obra</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna principal (esquerda) - 2/3 da largura */}
        <div className="md:col-span-2 space-y-6">
          {/* Informações Gerais */}
          <Card>
            <CardContent className="pt-6">
              <Secao titulo="Informações Gerais" onEdit={handleOpenEditModal}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CampoInfo label="Construtora" valor={obra.construtora} />
                  <CampoInfo label="Endereço da Obra" valor={obra.endereco} />
                  <CampoInfo label="Cliente" valor={obra.cliente} />
                  <CampoInfo label="Responsável pela Obra" valor={obra.responsavel} />
                  <CampoInfo label="E-mail do Responsável" valor={obra.emailResponsavel} />
                  <CampoInfo label="Contato do Responsável" valor={obra.telefoneResponsavel} />
                  <CampoInfo label="Data de início" valor={obra.inicio} />
                  <CampoInfo label="Previsão de término" valor={obra.termino} />
                  <CampoInfo label="Concreteira" valor={obra.concreteira} />
                  <CampoInfo label="Contato da Concreteira" valor={obra.contatoConcreteira} />
                </div>
              </Secao>
            </CardContent>
          </Card>

          {/* Informações da Obra */}
          <Card>
            <CardContent className="pt-6">
              <Secao titulo="Informações da Obra" onEdit={handleOpenEditInfoObraModal}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CampoInfo label="Área Total da Obra" valor={`${obra.areaTotal}m²`} />
                  <CampoInfo label="Prazo de Execução" valor={`${obra.prazoExecucao} dias`} />
                  <CampoInfo label="Reforço Estrutural" valor={getReforcoEstruturalNome(obra.reforcoEstrutural)} />
                  <CampoInfo label="Espessura do Piso" valor={`${obra.espessuraPiso}cm`} />
                  <CampoInfo label="Lançamento do concreto (m³/hora)" valor={`${obra.lancamentoConcreto} m³/h`} />
                  <CampoInfo label="Tipo de Acabamento" valor={obra.tipoAcabamento} />
                  <CampoInfo label="Tipo de Cura" valor={obra.tipoCura} />
                </div>
              </Secao>
            </CardContent>
          </Card>

          {/* Financeiro */}
          <Card>
            <CardContent className="pt-6">
              <Secao titulo="Financeiro">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-600">Lucro Total</h4>
                      </div>
                      <p className="text-xl font-bold text-green-600">{obra.lucroTotal}</p>
                      <p className="text-xs text-gray-500 mt-1">Valor líquido após despesas</p>
                    </div>

                    <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Ruler className="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-600">Preço/m²</h4>
                      </div>
                      <p className="text-xl font-bold text-blue-600">{obra.precoVendaM2}</p>
                      <p className="text-xs text-gray-500 mt-1">Valor de venda por metro quadrado</p>
                    </div>

                    <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <Percent className="h-5 w-5 text-purple-600" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-600">Comissão</h4>
                      </div>
                      <p className="text-xl font-bold text-purple-600">{obra.comissao}</p>
                      <p className="text-xs text-gray-500 mt-1">Percentual de comissão sobre vendas</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600 flex items-center">
                        <ChartBar className="h-4 w-4 mr-1 text-gray-500" />
                        <span>Margem de lucro estimada:</span>
                      </div>
                      <span className="font-medium text-gray-800">22%</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        <span>Última atualização:</span>
                      </div>
                      <span className="font-medium text-gray-800">10/04/2024</span>
                    </div>
                  </div>
                </div>
              </Secao>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card>
            <CardContent className="pt-6">
              <Secao titulo="Localização">
                <div className="w-full h-[300px] bg-gray-200 rounded-md overflow-hidden relative">
                  {/* Placeholder para mapa - Em produção substituir por componente real de mapa */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md shadow-md text-center">
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-gray-600">{obra.endereco}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Ministério do Trabalho, Anexo B, Conasems - Conselho, Agência Banco do Brasil, Via S2
                      </p>
                    </div>
                  </div>
                </div>
              </Secao>
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral (direita) - 1/3 da largura */}
        <div className="space-y-6">
          {/* Diário de Obra */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-medium">Diário de Obra</h3>
                </div>
                <Button
                  variant="link"
                  className="text-black p-0 hover:text-gray-700"
                  onClick={() => router.push(`/obras/${id}/diario`)}
                >
                  Ver tudo
                </Button>
              </div>

              {obra.diarios.map((diario, index) => (
                <CardRegistro
                  key={index}
                  titulo="Diário"
                  data={diario.data}
                  info1={diario.hora}
                  info2={`Ocorrências: ${diario.ocorrencia}`}
                  icone={<Calendar className="h-5 w-5 text-[#007EA3]" />}
                />
              ))}
            </CardContent>
          </Card>

          {/* Registro de despesa */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <Receipt className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-medium">Registro de despesa</h3>
                </div>
                <Button
                  variant="link"
                  className="text-black p-0 hover:text-gray-700"
                  onClick={() => router.push(`/obras/${id}/despesas`)}
                >
                  Ver tudo
                </Button>
              </div>

              {obra.despesas.map((despesa, index) => (
                <CardRegistro
                  key={index}
                  titulo="Despesa"
                  data={despesa.data}
                  info1={despesa.valor}
                  info2={despesa.categoria}
                  info3={`Descrição: ${despesa.descricao}`}
                  icone={<Receipt className="h-5 w-5 text-[#007EA3]" />}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Edição - Informações Gerais */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto p-6">
          <div className="absolute right-4 top-4">
            <DialogClose asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full" aria-label="Fechar">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogHeader className="pb-6 border-b mb-2">
            <DialogTitle className="text-xl font-bold text-[#007EA3]">Editar Detalhes da Obra</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-8 py-4 px-1">
            {/* Dados básicos */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-semibold mb-5 flex items-center text-[#007EA3]">
                <Building className="h-5 w-5 mr-2" />
                Dados da Obra
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="space-y-2">
                  <Label htmlFor="construtora" className="text-gray-700">
                    Nome da Construtora
                  </Label>
                  <Input
                    id="construtora"
                    name="construtora"
                    value={formData?.construtora || ""}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cliente" className="text-gray-700">
                    Cliente
                  </Label>
                  <Input
                    id="cliente"
                    name="cliente"
                    value={formData?.cliente || ""}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsavel" className="text-gray-700">
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-500" />
                      Responsável pela Obra
                    </span>
                  </Label>
                  <Input
                    id="responsavel"
                    name="responsavel"
                    value={formData?.responsavel || ""}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailResponsavel" className="text-gray-700">
                    <span className="flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-gray-500" />
                      E-mail do Responsável
                    </span>
                  </Label>
                  <Input
                    id="emailResponsavel"
                    name="emailResponsavel"
                    type="email"
                    value={formData?.emailResponsavel || ""}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefoneResponsavel" className="text-gray-700">
                    <span className="flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-gray-500" />
                      Contato do Responsável
                    </span>
                  </Label>
                  <Input
                    id="telefoneResponsavel"
                    name="telefoneResponsavel"
                    value={formData?.telefoneResponsavel || ""}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="concreteira" className="text-gray-700">
                    Concreteira
                  </Label>
                  <Input
                    id="concreteira"
                    name="concreteira"
                    value={formData?.concreteira || ""}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contatoConcreteira" className="text-gray-700">
                    Contato da Concreteira
                  </Label>
                  <Input
                    id="contatoConcreteira"
                    name="contatoConcreteira"
                    value={formData?.contatoConcreteira || ""}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inicio" className="text-gray-700">
                    <span className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                      Data de Início
                    </span>
                  </Label>
                  <Input
                    id="inicio"
                    name="inicio"
                    value={formData?.inicio || ""}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="termino" className="text-gray-700">
                    <span className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                      Previsão de Término
                    </span>
                  </Label>
                  <Input
                    id="termino"
                    name="termino"
                    value={formData?.termino || ""}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="text-lg font-semibold mb-5 flex items-center text-[#007EA3]">
                <MapPin className="h-5 w-5 mr-2" />
                Endereço da Obra
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5">
                <div className="space-y-2 md:col-span-4">
                  <Label htmlFor="enderecoCompleto.cep" className="text-gray-700">
                    <span className="flex items-center">
                      <Hash className="h-4 w-4 mr-1 text-gray-500" />
                      CEP <span className="text-red-500 ml-1">*</span>
                    </span>
                  </Label>
                  <Input
                    id="enderecoCompleto.cep"
                    name="enderecoCompleto.cep"
                    value={formData?.enderecoCompleto?.cep || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                    placeholder="Somente números"
                  />
                  <p className="text-xs text-gray-500 mt-1">Digite o CEP para preenchimento automático</p>
                </div>

                <div className="space-y-2 md:col-span-8">
                  <Label htmlFor="enderecoCompleto.rua" className="text-gray-700">
                    <span className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1 text-gray-500" />
                      Rua
                    </span>
                  </Label>
                  <Input
                    id="enderecoCompleto.rua"
                    name="enderecoCompleto.rua"
                    value={formData?.enderecoCompleto?.rua || ""}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="enderecoCompleto.numero" className="text-gray-700">
                    Número
                  </Label>
                  <Input
                    id="enderecoCompleto.numero"
                    name="enderecoCompleto.numero"
                    value={formData?.enderecoCompleto?.numero || ""}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                </div>

                <div className="space-y-2 md:col-span-9">
                  <Label htmlFor="enderecoCompleto.complemento" className="text-gray-700">
                    Complemento
                  </Label>
                  <Input
                    id="enderecoCompleto.complemento"
                    name="enderecoCompleto.complemento"
                    value={formData?.enderecoCompleto?.complemento || ""}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                    placeholder="Opcional"
                  />
                </div>

                <div className="space-y-2 md:col-span-4">
                  <Label htmlFor="enderecoCompleto.bairro" className="text-gray-700">
                    Bairro
                  </Label>
                  <Input
                    id="enderecoCompleto.bairro"
                    name="enderecoCompleto.bairro"
                    value={formData?.enderecoCompleto?.bairro || ""}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                </div>

                <div className="space-y-2 md:col-span-5">
                  <Label htmlFor="enderecoCompleto.cidade" className="text-gray-700">
                    Cidade
                  </Label>
                  <Input
                    id="enderecoCompleto.cidade"
                    name="enderecoCompleto.cidade"
                    value={formData?.enderecoCompleto?.cidade || ""}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  />
                </div>

                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="enderecoCompleto.estado" className="text-gray-700">
                    Estado
                  </Label>
                  <Select
                    value={formData?.enderecoCompleto?.estado || ""}
                    onValueChange={(value) => handleSelectChange("enderecoCompleto.estado", value)}
                  >
                    <SelectTrigger
                      id="enderecoCompleto.estado"
                      className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                    >
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {estadosBrasileiros.map((estado) => (
                        <SelectItem key={estado.valor} value={estado.valor}>
                          {estado.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold mb-5 flex items-center text-[#007EA3]">
              <Construction className="h-5 w-5 mr-2" />
              Informações Adicionais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              {/* Reforço Estrutural in Informações Gerais modal */}
              <div className="space-y-2">
                <Label htmlFor="reforcoEstrutural" className="text-gray-700">
                  <span className="flex items-center">
                    <Construction className="h-4 w-4 mr-1 text-gray-500" />
                    Reforço Estrutural
                  </span>
                </Label>
                <Select
                  value={formData?.reforcoEstrutural || ""}
                  onValueChange={(value) => {
                    if (formData) {
                      setFormData({
                        ...formData,
                        reforcoEstrutural: value,
                      })
                    }
                  }}
                >
                  <SelectTrigger
                    id="reforcoEstrutural"
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  >
                    <SelectValue placeholder="Selecione o tipo de reforço" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposReforcoEstrutural.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 gap-2 border-t mt-4">
            <Button
              variant="outline"
              onClick={() => setEditModalOpen(false)}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#007EA3] hover:bg-[#006a8a] text-white min-w-[120px] flex items-center justify-center"
              onClick={handleSaveChanges}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição - Informações da Obra */}
      <Dialog open={editInfoObraModalOpen} onOpenChange={setEditInfoObraModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto p-6">
          <div className="absolute right-4 top-4">
            <DialogClose asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full" aria-label="Fechar">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogHeader className="pb-6 border-b mb-2">
            <DialogTitle className="text-xl font-bold text-[#007EA3]">Editar Informações Técnicas da Obra</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-8 py-4 px-1">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                {/* Área Total */}
                <div className="space-y-2">
                  <Label htmlFor="areaTotal" className="text-gray-700">
                    <span className="flex items-center">
                      <Ruler className="h-4 w-4 mr-1 text-gray-500" />
                      Área Total da Obra (m²)
                    </span>
                  </Label>
                  <Input
                    id="areaTotal"
                    name="areaTotal"
                    value={infoObraFormData?.areaTotal || ""}
                    onChange={handleInfoObraInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                    type="number"
                  />
                </div>

                {/* Prazo de Execução */}
                <div className="space-y-2">
                  <Label htmlFor="prazoExecucao" className="text-gray-700">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      Prazo de Execução (dias)
                    </span>
                  </Label>
                  <Input
                    id="prazoExecucao"
                    name="prazoExecucao"
                    value={infoObraFormData?.prazoExecucao || ""}
                    onChange={handleInfoObraInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                    type="number"
                  />
                </div>

                {/* Espessura do Piso */}
                <div className="space-y-2">
                  <Label htmlFor="espessuraPiso" className="text-gray-700">
                    <span className="flex items-center">
                      <Layers className="h-4 w-4 mr-1 text-gray-500" />
                      Espessura do Piso (cm)
                    </span>
                  </Label>
                  <Input
                    id="espessuraPiso"
                    name="espessuraPiso"
                    value={infoObraFormData?.espessuraPiso || ""}
                    onChange={handleInfoObraInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                    type="number"
                  />
                </div>

                {/* Lançamento de Concreto */}
                <div className="space-y-2">
                  <Label htmlFor="lancamentoConcreto" className="text-gray-700">
                    <span className="flex items-center">
                      <Droplet className="h-4 w-4 mr-1 text-gray-500" />
                      Lançamento de Concreto (m³/h)
                    </span>
                  </Label>
                  <Input
                    id="lancamentoConcreto"
                    name="lancamentoConcreto"
                    value={infoObraFormData?.lancamentoConcreto || ""}
                    onChange={handleInfoObraInputChange}
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                    type="number"
                  />
                </div>
              </div>

              {/* Reforço Estrutural */}
              <div className="mt-6 space-y-3">
                <Label htmlFor="reforcoEstrutural" className="text-gray-700">
                  <span className="flex items-center">
                    <Construction className="h-4 w-4 mr-1 text-gray-500" />
                    Reforço Estrutural
                  </span>
                </Label>
                <Select
                  value={infoObraFormData?.reforcoEstrutural || ""}
                  onValueChange={(value) => handleInfoObraSelectChange("reforcoEstrutural", value)}
                >
                  <SelectTrigger
                    id="reforcoEstrutural"
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  >
                    <SelectValue placeholder="Selecione o tipo de reforço" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposReforcoEstrutural.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de Acabamento */}
              <div className="mt-6 space-y-3">
                <Label htmlFor="tipoAcabamento" className="text-gray-700">
                  Tipo de Acabamento
                </Label>
                <Select
                  value={infoObraFormData?.tipoAcabamento || ""}
                  onValueChange={(value) => handleInfoObraSelectChange("tipoAcabamento", value)}
                >
                  <SelectTrigger
                    id="tipoAcabamento"
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  >
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Acabamento Polido">Acabamento Polido</SelectItem>
                    <SelectItem value="Acabamento Liso">Acabamento Liso</SelectItem>
                    <SelectItem value="Acabamento Rústico">Acabamento Rústico</SelectItem>
                    <SelectItem value="Acabamento Antiderrapante">Acabamento Antiderrapante</SelectItem>
                    <SelectItem value="Acabamento Usinado">Acabamento Usinado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de Cura */}
              <div className="mt-6 space-y-3">
                <Label htmlFor="tipoCura" className="text-gray-700">
                  Tipo de Cura
                </Label>
                <Select
                  value={infoObraFormData?.tipoCura || ""}
                  onValueChange={(value) => handleInfoObraSelectChange("tipoCura", value)}
                >
                  <SelectTrigger
                    id="tipoCura"
                    className="w-full border-gray-300 focus:border-[#007EA3] focus:ring-[#007EA3]"
                  >
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cura química com membrana">Cura química com membrana</SelectItem>
                    <SelectItem value="Cura úmida">Cura úmida</SelectItem>
                    <SelectItem value="Cura por aspersão">Cura por aspersão</SelectItem>
                    <SelectItem value="Cura por imersão">Cura por imersão</SelectItem>
                    <SelectItem value="Cura por manta geotêxtil">Cura por manta geotêxtil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-6 gap-2 border-t mt-4">
            <Button
              variant="outline"
              onClick={() => setEditInfoObraModalOpen(false)}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#007EA3] hover:bg-[#006a8a] text-white min-w-[120px] flex items-center justify-center"
              onClick={handleSaveInfoObraChanges}
              disabled={savingInfoObra}
            >
              {savingInfoObra ? (
                <>
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
