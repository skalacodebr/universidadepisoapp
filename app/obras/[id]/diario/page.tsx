"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  CalendarIcon, 
  Plus, 
  Search, 
  MoreVertical, 
  MoreHorizontal,
  Edit2, 
  Trash2, 
  FileText, 
  Eye, 
  Calendar,
  User,
  PercentIcon,
  Check,
  X,
  FileImage,
  Cloud,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowRight,
  MoveRight
} from "lucide-react"

interface DiarioObra {
  id: number
  data: string
  cadastradoPor: string
  percentualConcluido: number
  observacoes?: string
  atividadesDesenvolvidas?: string
  anexos: number
  hora?: string
  responsavel?: string
  materiaisUtilizados?: string
  servicosTerceirizados?: string
  equipamentos?: string
  imagens?: string[]
}

export default function DiarioObra() {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  
  // Função para formatar a data atual no formato DD/MM/AAAA
  const formatarDataAtual = () => {
    const hoje = new Date()
    const dia = hoje.getDate().toString().padStart(2, '0')
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0')
    const ano = hoje.getFullYear()
    return `${dia}/${mes}/${ano}`
  }
  
  // Função para formatar a data atual no formato AAAA-MM-DD (para inputs do tipo date)
  const formatarDataAtualInputDate = () => {
    const hoje = new Date()
    const dia = hoje.getDate().toString().padStart(2, '0')
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0')
    const ano = hoje.getFullYear()
    return `${ano}-${mes}-${dia}`
  }
  
  // Função para formatar a hora atual no formato HH:MM
  const formatarHoraAtual = () => {
    const agora = new Date()
    const horas = agora.getHours().toString().padStart(2, '0')
    const minutos = agora.getMinutes().toString().padStart(2, '0')
    return `${horas}:${minutos}`
  }
  
  // Estado para controle de dados
  const [loading, setLoading] = useState(true)
  const [registrosDiario, setRegistrosDiario] = useState<DiarioObra[]>([])
  const [filtroData, setFiltroData] = useState("")
  const [filtroCadastrador, setFiltroCadastrador] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [etapaRegistro, setEtapaRegistro] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [imagensPreview, setImagensPreview] = useState<string[]>([])
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [registroParaExcluir, setRegistroParaExcluir] = useState<DiarioObra | null>(null)
  const [dadosObra, setDadosObra] = useState({
    nome: "",
    construtora: "",
    endereco: "",
    cliente: "",
    responsavel: "",
    emailResponsavel: "",
    telefoneResponsavel: "",
    concreteira: "",
    contatoConcreteira: "",
    areaTotal: "",
    prazoExecucao: "",
    reforcoEstrutural: "",
    espessuraPiso: "",
    lancamentoConcreto: "",
    tipoAcabamento: "",
    tipoCura: ""
  })
  const [novoRegistro, setNovoRegistro] = useState({
    data: formatarDataAtualInputDate(),
    hora: formatarHoraAtual(),
    responsavel: "",
    telefoneResponsavel: "",
    emailResponsavel: "",
    concreteira: "",
    contatoConcreteira: "",
    atividadesDesenvolvidas: "",
    materiaisUtilizados: "",
    servicosTerceirizados: "",
    equipamentos: "",
    observacoes: "",
    percentualConcluido: "0",
    imagens: [],
    areaTotal: "",
    prazoExecucao: "",
    reforcoEstrutural: "",
    espessuraPiso: "",
    lancamentoConcreto: "",
    tipoAcabamento: "",
    tipoCura: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nomeObra, setNomeObra] = useState("")
  const [equipe, setEquipe] = useState([
    { id: 1, nome: "", entrada: "", saida: "" }
  ])
  const [equipamentos, setEquipamentos] = useState([
    { id: 1, nome: "", quantidade: "" }
  ])
  const [ocorrencias, setOcorrencias] = useState({
    atrasoConcreto: false,
    faltaAreaLiberada: false,
    pegaDiferenciada: false,
    espessuraSubBase: false,
    quebraEquipamentos: false,
    areaSemCobertura: false,
    outro: false,
    nenhumaOcorrencia: false
  })
  
  // Buscar dados da obra
  useEffect(() => {
    const fetchData = async () => {
      // Simulando uma chamada de API para obter dados
      setTimeout(() => {
        // Dados mock para exemplo
        const mockNomeObra = "Condomínio Residencial Parque das Árvores"
        const mockDadosObra = {
          nome: "Condomínio Residencial Parque das Árvores",
          construtora: "Construtora ABC",
          endereco: "Av. Principal, 1000, São Paulo, SP",
          cliente: "Incorporadora XYZ",
          responsavel: "Eng. João Silva",
          emailResponsavel: "joao.silva@exemplo.com",
          telefoneResponsavel: "(11) 98765-4321",
          concreteira: "Concreteira Forte",
          contatoConcreteira: "(11) 91234-5678",
          areaTotal: "80",
          prazoExecucao: "120",
          reforcoEstrutural: "Sim",
          espessuraPiso: "8",
          lancamentoConcreto: "15",
          tipoAcabamento: "Acabamento Polido",
          tipoCura: "Cura química com membrana"
        }
        
        const mockRegistros: DiarioObra[] = [
          {
            id: 1,
            data: "24/11/2025",
            cadastradoPor: "João Silva",
            percentualConcluido: 15,
            atividadesDesenvolvidas: "Início da fundação",
            anexos: 2
          },
          {
            id: 2,
            data: "23/11/2025",
            cadastradoPor: "Maria Santos",
            percentualConcluido: 12,
            atividadesDesenvolvidas: "Marcação do terreno",
            anexos: 1
          },
          {
            id: 3,
            data: "22/11/2025",
            cadastradoPor: "Carlos Ferreira",
            percentualConcluido: 10,
            atividadesDesenvolvidas: "Limpeza do terreno",
            anexos: 3
          },
          {
            id: 4,
            data: "21/11/2025",
            cadastradoPor: "Ana Oliveira",
            percentualConcluido: 8,
            atividadesDesenvolvidas: "Entrega de materiais",
            anexos: 0
          },
          {
            id: 5,
            data: "20/11/2025",
            cadastradoPor: "Ricardo Souza",
            percentualConcluido: 5,
            atividadesDesenvolvidas: "Medição inicial",
            anexos: 4
          },
          {
            id: 6,
            data: "19/11/2025",
            cadastradoPor: "Patrícia Lima",
            percentualConcluido: 3,
            atividadesDesenvolvidas: "Vistoria inicial",
            anexos: 2
          }
        ]
        
        setNomeObra(mockNomeObra)
        setDadosObra(mockDadosObra)
        setNovoRegistro(prev => ({
          ...prev,
          responsavel: mockDadosObra.responsavel,
          telefoneResponsavel: mockDadosObra.telefoneResponsavel,
          emailResponsavel: mockDadosObra.emailResponsavel,
          concreteira: mockDadosObra.concreteira,
          contatoConcreteira: mockDadosObra.contatoConcreteira,
          areaTotal: mockDadosObra.areaTotal,
          prazoExecucao: mockDadosObra.prazoExecucao,
          reforcoEstrutural: mockDadosObra.reforcoEstrutural,
          espessuraPiso: mockDadosObra.espessuraPiso,
          lancamentoConcreto: mockDadosObra.lancamentoConcreto,
          tipoAcabamento: mockDadosObra.tipoAcabamento,
          tipoCura: mockDadosObra.tipoCura
        }))
        setRegistrosDiario(mockRegistros)
        setLoading(false)
      }, 1000)
    }
    
    fetchData()
  }, [id])
  
  // Filtrar registros
  const registrosFiltrados = registrosDiario.filter((registro) => {
    const matchData = filtroData === "" || 
                      registro.data.toLowerCase().includes(filtroData.toLowerCase())
    
    const matchCadastrador = filtroCadastrador === "" || 
                            registro.cadastradoPor.toLowerCase().includes(filtroCadastrador.toLowerCase())
    
    return matchData && matchCadastrador
  })
  
  // Paginação
  const totalPages = Math.ceil(registrosFiltrados.length / itemsPerPage)
  
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return registrosFiltrados.slice(startIndex, endIndex)
  }
  
  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }
  
  // Manipulação do novo registro
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNovoRegistro(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNovoRegistro(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvancarEtapa = () => {
    if (etapaRegistro < 3) {
      setEtapaRegistro(prev => prev + 1)
    }
  }

  const handleVoltarEtapa = () => {
    if (etapaRegistro > 1) {
      setEtapaRegistro(prev => prev - 1)
    }
  }

  const handleAdicionarImagem = () => {
    // Simulação de adição de imagem - Vamos substituir isso por uma implementação real
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = 'image/*';
    inputFile.multiple = true;
    
    inputFile.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;
      
      // Converter arquivos para URLs e adicionar ao preview
      const novasImagens = [...imagensPreview];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = URL.createObjectURL(file);
        novasImagens.push(imageUrl);
      }
      
      setImagensPreview(novasImagens);
    };
    
    inputFile.click();
  }

  const handleRemoverImagem = (index: number) => {
    setImagensPreview(prev => prev.filter((_, i) => i !== index))
  }

  // Função para formatar a data do formato AAAA-MM-DD para DD/MM/AAAA
  const formatarDataParaPtBR = (data: string): string => {
    // Se a data estiver no formato AAAA-MM-DD
    if (data.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    }
    // Se a data já estiver no formato DD/MM/AAAA
    else if (data.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      return data;
    }
    // Retorna a data original em caso de formato não reconhecido
    return data;
  };

  const handleSubmit = async () => {
    if (!novoRegistro.data || !novoRegistro.hora || !novoRegistro.responsavel) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Formatando a data para o formato pt-BR
      const dataFormatada = formatarDataParaPtBR(novoRegistro.data);
      
      // Adicionando novo registro
      const novoId = Math.max(...registrosDiario.map(r => r.id), 0) + 1
      
      const novoItem: DiarioObra = {
        id: novoId,
        data: dataFormatada,
        hora: novoRegistro.hora,
        responsavel: novoRegistro.responsavel,
        cadastradoPor: "Usuário Atual", // Em um cenário real, seria o usuário logado
        percentualConcluido: parseInt(novoRegistro.percentualConcluido),
        atividadesDesenvolvidas: novoRegistro.atividadesDesenvolvidas,
        materiaisUtilizados: novoRegistro.materiaisUtilizados,
        servicosTerceirizados: novoRegistro.servicosTerceirizados,
        equipamentos: novoRegistro.equipamentos,
        anexos: imagensPreview.length,
        imagens: imagensPreview
      }
      
      setRegistrosDiario(prev => [novoItem, ...prev])
      setOpenDialog(false)
      
      // Resetar form
      setNovoRegistro({
        data: formatarDataAtualInputDate(),
        hora: formatarHoraAtual(),
        responsavel: "",
        telefoneResponsavel: "",
        emailResponsavel: "",
        concreteira: "",
        contatoConcreteira: "",
        atividadesDesenvolvidas: "",
        materiaisUtilizados: "",
        servicosTerceirizados: "",
        equipamentos: "",
        observacoes: "",
        percentualConcluido: "0",
        imagens: [],
        areaTotal: "",
        prazoExecucao: "",
        reforcoEstrutural: "",
        espessuraPiso: "",
        lancamentoConcreto: "",
        tipoAcabamento: "",
        tipoCura: ""
      })
      setEtapaRegistro(1)
      setImagensPreview([])
      
      toast({
        title: "Registro adicionado",
        description: "O registro foi adicionado com sucesso ao diário de obra.",
        className: "bg-green-50 border-green-200"
      })
    } catch (error) {
      console.error("Erro ao adicionar registro:", error)
      toast({
        title: "Erro ao adicionar",
        description: "Ocorreu um erro. Tente novamente mais tarde.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelar = () => {
    setNovoRegistro({
      data: formatarDataAtualInputDate(),
      hora: formatarHoraAtual(),
      responsavel: "",
      telefoneResponsavel: "",
      emailResponsavel: "",
      concreteira: "",
      contatoConcreteira: "",
      atividadesDesenvolvidas: "",
      materiaisUtilizados: "",
      servicosTerceirizados: "",
      equipamentos: "",
      observacoes: "",
      percentualConcluido: "0",
      imagens: [],
      areaTotal: "",
      prazoExecucao: "",
      reforcoEstrutural: "",
      espessuraPiso: "",
      lancamentoConcreto: "",
      tipoAcabamento: "",
      tipoCura: ""
    });
    setOpenDialog(false)
    setEtapaRegistro(1)
    setImagensPreview([])
  }
  
  const handleExcluir = async (id: number) => {
    // Encontra o registro a ser excluído
    const registro = registrosDiario.find(item => item.id === id);
    if (registro) {
      setRegistroParaExcluir(registro);
      setModalExcluirAberto(true);
    }
  }
  
  const confirmarExclusao = async () => {
    if (!registroParaExcluir) return;
    
    try {
      // Simulando uma chamada à API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Removendo o registro
      setRegistrosDiario(prev => prev.filter(item => item.id !== registroParaExcluir.id))
      
      toast({
        title: "Registro excluído",
        description: "O registro foi excluído com sucesso.",
        className: "bg-green-50 border-green-200"
      })
      
      // Fecha o modal e limpa o registro selecionado
      setModalExcluirAberto(false)
      setRegistroParaExcluir(null)
    } catch (error) {
      console.error("Erro ao excluir registro:", error)
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro. Tente novamente mais tarde.",
        variant: "destructive"
      })
    }
  }
  
  const voltar = () => {
    router.back()
  }
  
  // Adicionar funcionário à equipe
  const adicionarFuncionario = () => {
    const novoId = equipe.length > 0 ? Math.max(...equipe.map(item => item.id)) + 1 : 1
    setEquipe([...equipe, { id: novoId, nome: "", entrada: "", saida: "" }])
  }

  // Remover funcionário da equipe
  const removerFuncionario = (id: number) => {
    if (equipe.length === 1) return
    setEquipe(equipe.filter(item => item.id !== id))
  }

  // Atualizar dados do funcionário
  const atualizarFuncionario = (id: number, campo: string, valor: string) => {
    setEquipe(equipe.map(item => 
      item.id === id ? { ...item, [campo]: valor } : item
    ))
  }

  // Adicionar equipamento
  const adicionarEquipamento = () => {
    const novoId = equipamentos.length > 0 ? Math.max(...equipamentos.map(item => item.id)) + 1 : 1
    setEquipamentos([...equipamentos, { id: novoId, nome: "", quantidade: "" }])
  }

  // Remover equipamento
  const removerEquipamento = (id: number) => {
    if (equipamentos.length === 1) return
    setEquipamentos(equipamentos.filter(item => item.id !== id))
  }

  // Atualizar dados do equipamento
  const atualizarEquipamento = (id: number, campo: string, valor: string) => {
    setEquipamentos(equipamentos.map(item => 
      item.id === id ? { ...item, [campo]: valor } : item
    ))
  }
  
  // Função para atualizar ocorrências
  const handleOcorrenciaChange = (ocorrencia: string) => {
    if (ocorrencia === 'nenhumaOcorrencia' && !ocorrencias.nenhumaOcorrencia) {
      // Se selecionou "Nenhuma ocorrência", desmarca todas as outras
      setOcorrencias({
        atrasoConcreto: false,
        faltaAreaLiberada: false,
        pegaDiferenciada: false,
        espessuraSubBase: false,
        quebraEquipamentos: false,
        areaSemCobertura: false,
        outro: false,
        nenhumaOcorrencia: true
      })
    } else if (ocorrencia === 'nenhumaOcorrencia' && ocorrencias.nenhumaOcorrencia) {
      // Se desmarcou "Nenhuma ocorrência", deixa tudo desmarcado
      setOcorrencias({
        ...ocorrencias,
        nenhumaOcorrencia: false
      })
    } else {
      // Se marcou qualquer outra, desmarca "Nenhuma ocorrência"
      setOcorrencias({
        ...ocorrencias,
        [ocorrencia]: !ocorrencias[ocorrencia as keyof typeof ocorrencias],
        nenhumaOcorrencia: false
      })
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }
  
  const renderEtapa1 = () => (
    <>
      <DialogHeader className="pb-2 relative">
        <DialogTitle className="text-xl font-bold text-center text-[#007EA3]">Novo diário de obra</DialogTitle>
        <Button
          variant="ghost"
          className="absolute right-0 top-0 h-8 w-8 p-0 rounded-full"
          onClick={handleCancelar}
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogHeader>
      
      <div className="grid gap-5 py-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
          <h3 className="text-sm font-semibold mb-4 text-gray-600">INFORMAÇÕES GERAIS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data" className="text-gray-700">
                Data <span className="text-red-500">*</span>
              </Label>
              <Input
                id="data"
                name="data"
                type="date"
                value={novoRegistro.data}
                onChange={handleInputChange}
                className="w-full bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500">Preenchimento automático</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hora" className="text-gray-700">
                Hora <span className="text-red-500">*</span>
              </Label>
              <Input
                id="hora"
                name="hora"
                type="time"
                value={novoRegistro.hora}
                onChange={handleInputChange}
                className="w-full bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500">Preenchimento automático</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="nomeObra" className="text-gray-700">
                Nome da Obra
              </Label>
              <Input
                id="nomeObra"
                value={dadosObra.nome}
                className="w-full bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500">Preenchimento automático</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="construtora" className="text-gray-700">
                Construtora
              </Label>
              <Input
                id="construtora"
                value={dadosObra.construtora}
                className="w-full bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500">Preenchimento automático</p>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <Label htmlFor="endereco" className="text-gray-700">
              Endereço da Obra
            </Label>
            <Input
              id="endereco"
              value={dadosObra.endereco}
              className="w-full bg-gray-100"
              disabled
            />
            <p className="text-xs text-gray-500">Preenchimento automático</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="cliente" className="text-gray-700">
                Cliente
              </Label>
              <Input
                id="cliente"
                value={dadosObra.cliente}
                className="w-full bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500">Preenchimento automático</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="responsavel" className="text-gray-700">
                Responsável pela Obra <span className="text-red-500">*</span>
              </Label>
              <Input
                id="responsavel"
                name="responsavel"
                value={novoRegistro.responsavel}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="telefoneResponsavel" className="text-gray-700">
                Telefone do Responsável
              </Label>
              <Input
                id="telefoneResponsavel"
                name="telefoneResponsavel"
                value={novoRegistro.telefoneResponsavel}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emailResponsavel" className="text-gray-700">
                E-mail do Responsável
              </Label>
              <Input
                id="emailResponsavel"
                name="emailResponsavel"
                type="email"
                value={novoRegistro.emailResponsavel}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="concreteira" className="text-gray-700">
                Concreteira
              </Label>
              <Input
                id="concreteira"
                name="concreteira"
                value={novoRegistro.concreteira}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contatoConcreteira" className="text-gray-700">
                Contato da Concreteira
              </Label>
              <Input
                id="contatoConcreteira"
                name="contatoConcreteira"
                value={novoRegistro.contatoConcreteira}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
          <h3 className="text-sm font-semibold mb-4 text-gray-600">INFORMAÇÕES DA OBRA</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="areaTotal" className="text-gray-700">
                Área Total da Obra (m²)
              </Label>
              <Input
                id="areaTotal"
                name="areaTotal"
                type="number"
                value={novoRegistro.areaTotal}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prazoExecucao" className="text-gray-700">
                Prazo de Execução (dias)
              </Label>
              <Input
                id="prazoExecucao"
                name="prazoExecucao"
                type="number"
                value={novoRegistro.prazoExecucao}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="reforcoEstrutural" className="text-gray-700">
                Reforço Estrutural
              </Label>
              <Select 
                value={novoRegistro.reforcoEstrutural} 
                onValueChange={(value) => handleSelectChange("reforcoEstrutural", value)}
              >
                <SelectTrigger id="reforcoEstrutural" className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="espessuraPiso" className="text-gray-700">
                Espessura do Piso (cm)
              </Label>
              <Select 
                value={novoRegistro.espessuraPiso} 
                onValueChange={(value) => handleSelectChange("espessuraPiso", value)}
              >
                <SelectTrigger id="espessuraPiso" className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {[5, 6, 7, 8, 9, 10, 12, 15, 18, 20].map((valor) => (
                    <SelectItem key={valor} value={valor.toString()}>
                      {valor} cm
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="lancamentoConcreto" className="text-gray-700">
                Lançamento do Concreto (m³/h)
              </Label>
              <Input
                id="lancamentoConcreto"
                name="lancamentoConcreto"
                type="number"
                value={novoRegistro.lancamentoConcreto}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipoAcabamento" className="text-gray-700">
                Tipo de Acabamento
              </Label>
              <Select 
                value={novoRegistro.tipoAcabamento} 
                onValueChange={(value) => handleSelectChange("tipoAcabamento", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
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
            
            <div className="space-y-2">
              <Label htmlFor="tipoCura" className="text-gray-700">
                Tipo de Cura
              </Label>
              <Select 
                value={novoRegistro.tipoCura} 
                onValueChange={(value) => handleSelectChange("tipoCura", value)}
              >
                <SelectTrigger id="tipoCura" className="w-full">
                  <SelectValue placeholder="Selecione..." />
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
      </div>
      
      <DialogFooter>
        <Button 
          className="bg-[#007EA3] hover:bg-[#006a8a] text-white min-w-[120px] flex items-center justify-center" 
          onClick={handleAvancarEtapa}
        >
          Continuar
          <MoveRight className="h-4 w-4 ml-2" />
        </Button>
      </DialogFooter>
    </>
  )

  const renderEtapa2 = () => (
    <>
      <DialogHeader className="pb-2 relative">
        <DialogTitle className="text-xl font-bold text-center text-[#007EA3]">Novo diário de obra</DialogTitle>
        <Button
          variant="ghost"
          className="absolute right-0 top-0 h-8 w-8 p-0 rounded-full"
          onClick={handleCancelar}
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogHeader>
      
      <div className="grid gap-5 py-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
          <h3 className="text-sm font-semibold mb-4 text-gray-600">INFORMAÇÕES DA CONCRETAGEM</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inicioConcretagem" className="text-gray-700 mb-1 block">
                  Início da Concretagem
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      id="inicioConcretagemData"
                      name="inicioConcretagemData"
                      type="date"
                      placeholder="Data"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      id="inicioConcretagemHora"
                      name="inicioConcretagemHora"
                      type="time"
                      placeholder="Hora"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="inicioAcabamento" className="text-gray-700 mb-1 block">
                  Início do Acabamento
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      id="inicioAcabamentoData"
                      name="inicioAcabamentoData"
                      type="date"
                      placeholder="Data"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      id="inicioAcabamentoHora"
                      name="inicioAcabamentoHora"
                      type="time"
                      placeholder="Hora"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="terminoConcretagem" className="text-gray-700 mb-1 block">
                  Término da Concretagem
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      id="terminoConcretagemData"
                      name="terminoConcretagemData"
                      type="date"
                      placeholder="Data"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      id="terminoConcretagemHora"
                      name="terminoConcretagemHora"
                      type="time"
                      placeholder="Hora"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="terminoAcabamento" className="text-gray-700 mb-1 block">
                  Término do Acabamento
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      id="terminoAcabamentoData"
                      name="terminoAcabamentoData"
                      type="date"
                      placeholder="Data"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      id="terminoAcabamentoHora"
                      name="terminoAcabamentoHora"
                      type="time"
                      placeholder="Hora"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="producaoDia" className="text-gray-700">
                  Produção do Dia (m²)
                </Label>
                <Input
                  id="producaoDia"
                  name="producaoDia"
                  type="number"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label htmlFor="producaoAcumulada" className="text-gray-700">
                  Produção Acumulada (m²)
                </Label>
                <Input
                  id="producaoAcumulada"
                  name="producaoAcumulada"
                  type="number"
                  className="w-full bg-gray-100"
                  disabled
                />
                <p className="text-xs text-gray-500">Calculado pelo sistema</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="volumeConcreteTeorioco" className="text-gray-700">
                  Volume de Concreto Teórico (m³)
                </Label>
                <Input
                  id="volumeConcreteTeorioco"
                  name="volumeConcreteTeorioco"
                  type="number"
                  className="w-full bg-gray-100"
                  disabled
                />
                <p className="text-xs text-gray-500">Calculado pelo sistema</p>
              </div>
              
              <div>
                <Label htmlFor="volumeConcreteReal" className="text-gray-700">
                  Volume de Concreto Real (m³)
                </Label>
                <Select>
                  <SelectTrigger id="volumeConcreteReal" className="w-full">
                    <SelectValue placeholder="Selecione o volume..." />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((volume) => (
                      <SelectItem key={volume} value={volume.toString()}>
                        {volume} m³
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="juntasSerradas" className="text-gray-700">
                  Juntas Serradas
                </Label>
                <Select>
                  <SelectTrigger id="juntasSerradas" className="w-full">
                    <SelectValue placeholder="Selecione a opção..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                    <SelectItem value="parcial">Parcial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="juntasEncontro" className="text-gray-700">
                  Juntas de Encontro
                </Label>
                <Select>
                  <SelectTrigger id="juntasEncontro" className="w-full">
                    <SelectValue placeholder="Selecione a opção..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                    <SelectItem value="parcial">Parcial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-600">EQUIPE</h3>
            <Button 
              type="button" 
              onClick={adicionarFuncionario}
              variant="outline" 
              size="sm"
              className="h-8 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" /> Adicionar
            </Button>
          </div>
          
          {equipe.map((funcionario, index) => (
            <div key={funcionario.id} className="grid grid-cols-12 gap-3 mb-3 items-end">
              <div className="col-span-6">
                <Label htmlFor={`funcionario-${funcionario.id}-nome`} className="text-sm text-gray-700">
                  Nome
                </Label>
                <Input
                  id={`funcionario-${funcionario.id}-nome`}
                  value={funcionario.nome}
                  onChange={(e) => atualizarFuncionario(funcionario.id, 'nome', e.target.value)}
                  placeholder="Nome do funcionário"
                  className="w-full"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor={`funcionario-${funcionario.id}-entrada`} className="text-sm text-gray-700">
                  Entrada
                </Label>
                <Input
                  id={`funcionario-${funcionario.id}-entrada`}
                  type="time"
                  value={funcionario.entrada}
                  onChange={(e) => atualizarFuncionario(funcionario.id, 'entrada', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor={`funcionario-${funcionario.id}-saida`} className="text-sm text-gray-700">
                  Saída
                </Label>
                <Input
                  id={`funcionario-${funcionario.id}-saida`}
                  type="time"
                  value={funcionario.saida}
                  onChange={(e) => atualizarFuncionario(funcionario.id, 'saida', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="col-span-2 flex justify-end">
                {equipe.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removerFuncionario(funcionario.id)}
                    variant="ghost"
                    size="sm"
                    className="h-9 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-600">EQUIPAMENTOS</h3>
            <Button 
              type="button" 
              onClick={adicionarEquipamento}
              variant="outline" 
              size="sm"
              className="h-8 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" /> Adicionar
            </Button>
          </div>
          
          {equipamentos.map((equipamento, index) => (
            <div key={equipamento.id} className="grid grid-cols-12 gap-3 mb-3 items-end">
              <div className="col-span-8">
                <Label htmlFor={`equipamento-${equipamento.id}-nome`} className="text-sm text-gray-700">
                  Nome
                </Label>
                <Input
                  id={`equipamento-${equipamento.id}-nome`}
                  value={equipamento.nome}
                  onChange={(e) => atualizarEquipamento(equipamento.id, 'nome', e.target.value)}
                  placeholder="Nome do equipamento"
                  className="w-full"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor={`equipamento-${equipamento.id}-quantidade`} className="text-sm text-gray-700">
                  Quantidade
                </Label>
                <Input
                  id={`equipamento-${equipamento.id}-quantidade`}
                  type="number"
                  value={equipamento.quantidade}
                  onChange={(e) => atualizarEquipamento(equipamento.id, 'quantidade', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="col-span-2 flex justify-end">
                {equipamentos.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removerEquipamento(equipamento.id)}
                    variant="ghost"
                    size="sm"
                    className="h-9 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <DialogFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleVoltarEtapa}
          className="border-gray-300 hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Button 
          className="bg-[#007EA3] hover:bg-[#006a8a] text-white min-w-[120px] flex items-center justify-center" 
          onClick={handleAvancarEtapa}
        >
          Continuar
          <MoveRight className="h-4 w-4 ml-2" />
        </Button>
      </DialogFooter>
    </>
  )

  const renderEtapa3 = () => (
    <>
      <DialogHeader className="pb-2 relative">
        <DialogTitle className="text-xl font-bold text-center text-[#007EA3]">Novo diário de obra</DialogTitle>
        <Button
          variant="ghost"
          className="absolute right-0 top-0 h-8 w-8 p-0 rounded-full"
          onClick={handleCancelar}
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogHeader>
      
      <div className="grid gap-5 py-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
          <h3 className="text-sm font-semibold mb-4 text-gray-600">CONDIÇÃO DO TEMPO</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="condicaoTempoManha" className="text-gray-700">
                Manhã
              </Label>
              <Select name="condicaoTempoManha">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ensolarado">Ensolarado</SelectItem>
                  <SelectItem value="parcialmenteNublado">Parcialmente Nublado</SelectItem>
                  <SelectItem value="nublado">Nublado</SelectItem>
                  <SelectItem value="chuvaFraca">Chuva Fraca</SelectItem>
                  <SelectItem value="chuvaForte">Chuva Forte</SelectItem>
                  <SelectItem value="ventoso">Ventoso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="condicaoTempoTarde" className="text-gray-700">
                Tarde
              </Label>
              <Select name="condicaoTempoTarde">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ensolarado">Ensolarado</SelectItem>
                  <SelectItem value="parcialmenteNublado">Parcialmente Nublado</SelectItem>
                  <SelectItem value="nublado">Nublado</SelectItem>
                  <SelectItem value="chuvaFraca">Chuva Fraca</SelectItem>
                  <SelectItem value="chuvaForte">Chuva Forte</SelectItem>
                  <SelectItem value="ventoso">Ventoso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="condicaoTempoNoite" className="text-gray-700">
                Noite
              </Label>
              <Select name="condicaoTempoNoite">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="limpo">Céu Limpo</SelectItem>
                  <SelectItem value="parcialmenteNublado">Parcialmente Nublado</SelectItem>
                  <SelectItem value="nublado">Nublado</SelectItem>
                  <SelectItem value="chuvaFraca">Chuva Fraca</SelectItem>
                  <SelectItem value="chuvaForte">Chuva Forte</SelectItem>
                  <SelectItem value="ventoso">Ventoso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
          <h3 className="text-sm font-semibold mb-4 text-gray-600">OCORRÊNCIAS NA OBRA</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="atrasoConcreto" 
                className="h-4 w-4 rounded border-gray-300 text-[#007EA3] focus:ring-[#007EA3]"
                checked={ocorrencias.atrasoConcreto}
                onChange={() => handleOcorrenciaChange('atrasoConcreto')}
              />
              <Label htmlFor="atrasoConcreto" className="text-gray-700">
                Atraso do concreto
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="faltaAreaLiberada" 
                className="h-4 w-4 rounded border-gray-300 text-[#007EA3] focus:ring-[#007EA3]"
                checked={ocorrencias.faltaAreaLiberada}
                onChange={() => handleOcorrenciaChange('faltaAreaLiberada')}
              />
              <Label htmlFor="faltaAreaLiberada" className="text-gray-700">
                Falta de área liberada
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="pegaDiferenciada" 
                className="h-4 w-4 rounded border-gray-300 text-[#007EA3] focus:ring-[#007EA3]"
                checked={ocorrencias.pegaDiferenciada}
                onChange={() => handleOcorrenciaChange('pegaDiferenciada')}
              />
              <Label htmlFor="pegaDiferenciada" className="text-gray-700">
                Pega diferenciada no concreto
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="espessuraSubBase" 
                className="h-4 w-4 rounded border-gray-300 text-[#007EA3] focus:ring-[#007EA3]"
                checked={ocorrencias.espessuraSubBase}
                onChange={() => handleOcorrenciaChange('espessuraSubBase')}
              />
              <Label htmlFor="espessuraSubBase" className="text-gray-700">
                Espessura maior/menor na sub-base
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="quebraEquipamentos" 
                className="h-4 w-4 rounded border-gray-300 text-[#007EA3] focus:ring-[#007EA3]"
                checked={ocorrencias.quebraEquipamentos}
                onChange={() => handleOcorrenciaChange('quebraEquipamentos')}
              />
              <Label htmlFor="quebraEquipamentos" className="text-gray-700">
                Quebra de equipamentos
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="areaSemCobertura" 
                className="h-4 w-4 rounded border-gray-300 text-[#007EA3] focus:ring-[#007EA3]"
                checked={ocorrencias.areaSemCobertura}
                onChange={() => handleOcorrenciaChange('areaSemCobertura')}
              />
              <Label htmlFor="areaSemCobertura" className="text-gray-700">
                Área sem cobertura
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="outro" 
                className="h-4 w-4 rounded border-gray-300 text-[#007EA3] focus:ring-[#007EA3]"
                checked={ocorrencias.outro}
                onChange={() => handleOcorrenciaChange('outro')}
              />
              <Label htmlFor="outro" className="text-gray-700">
                Outro
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="nenhumaOcorrencia" 
                className="h-4 w-4 rounded border-gray-300 text-[#007EA3] focus:ring-[#007EA3]"
                checked={ocorrencias.nenhumaOcorrencia}
                onChange={() => handleOcorrenciaChange('nenhumaOcorrencia')}
              />
              <Label htmlFor="nenhumaOcorrencia" className="text-gray-700">
                Nenhuma ocorrência
              </Label>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
          <h3 className="text-sm font-semibold mb-4 text-gray-600">AVALIAÇÃO DOS TRABALHOS</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="juntasFrias" className="text-gray-700 block mb-2">
                Junta Fria / Pega diferenciada
              </Label>
              <Select name="juntasFrias">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Muito Ruim</SelectItem>
                  <SelectItem value="2">2 - Ruim</SelectItem>
                  <SelectItem value="3">3 - Regular</SelectItem>
                  <SelectItem value="4">4 - Bom</SelectItem>
                  <SelectItem value="5">5 - Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="manchamentoSuperficial" className="text-gray-700 block mb-2">
                Manchamento Superficial
              </Label>
              <Select name="manchamentoSuperficial">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Muito Ruim</SelectItem>
                  <SelectItem value="2">2 - Ruim</SelectItem>
                  <SelectItem value="3">3 - Regular</SelectItem>
                  <SelectItem value="4">4 - Bom</SelectItem>
                  <SelectItem value="5">5 - Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="alinhamentoCorte" className="text-gray-700 block mb-2">
                Alinhamento do corte das juntas
              </Label>
              <Select name="alinhamentoCorte">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Muito Ruim</SelectItem>
                  <SelectItem value="2">2 - Ruim</SelectItem>
                  <SelectItem value="3">3 - Regular</SelectItem>
                  <SelectItem value="4">4 - Bom</SelectItem>
                  <SelectItem value="5">5 - Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="profundidadeCorte" className="text-gray-700 block mb-2">
                Profundidade do corte das juntas
              </Label>
              <Select name="profundidadeCorte">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Muito Ruim</SelectItem>
                  <SelectItem value="2">2 - Ruim</SelectItem>
                  <SelectItem value="3">3 - Regular</SelectItem>
                  <SelectItem value="4">4 - Bom</SelectItem>
                  <SelectItem value="5">5 - Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="esborcinamentoCorte" className="text-gray-700 block mb-2">
                Esborcinamento do corte das juntas
              </Label>
              <Select name="esborcinamentoCorte">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Muito Ruim</SelectItem>
                  <SelectItem value="2">2 - Ruim</SelectItem>
                  <SelectItem value="3">3 - Regular</SelectItem>
                  <SelectItem value="4">4 - Bom</SelectItem>
                  <SelectItem value="5">5 - Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="qualidadeAcabamentoSuperficial" className="text-gray-700 block mb-2">
                Qualidade do acabamento superficial
              </Label>
              <Select name="qualidadeAcabamentoSuperficial">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Muito Ruim</SelectItem>
                  <SelectItem value="2">2 - Ruim</SelectItem>
                  <SelectItem value="3">3 - Regular</SelectItem>
                  <SelectItem value="4">4 - Bom</SelectItem>
                  <SelectItem value="5">5 - Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="qualidadeAcabamentoPeParede" className="text-gray-700 block mb-2">
                Qualidade do acabamento no pé de parede/pilar
              </Label>
              <Select name="qualidadeAcabamentoPeParede">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Muito Ruim</SelectItem>
                  <SelectItem value="2">2 - Ruim</SelectItem>
                  <SelectItem value="3">3 - Regular</SelectItem>
                  <SelectItem value="4">4 - Bom</SelectItem>
                  <SelectItem value="5">5 - Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="planicidadeNivelamento" className="text-gray-700 block mb-2">
                Planicidade e Nivelamento
              </Label>
              <Select name="planicidadeNivelamento">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Muito Ruim</SelectItem>
                  <SelectItem value="2">2 - Ruim</SelectItem>
                  <SelectItem value="3">3 - Regular</SelectItem>
                  <SelectItem value="4">4 - Bom</SelectItem>
                  <SelectItem value="5">5 - Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="organizacaoLimpeza" className="text-gray-700 block mb-2">
                Organização e Limpeza
              </Label>
              <Select name="organizacaoLimpeza">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Muito Ruim</SelectItem>
                  <SelectItem value="2">2 - Ruim</SelectItem>
                  <SelectItem value="3">3 - Regular</SelectItem>
                  <SelectItem value="4">4 - Bom</SelectItem>
                  <SelectItem value="5">5 - Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="posicionamentoArmadura" className="text-gray-700 block mb-2">
                Posicionamento da armadura
              </Label>
              <Select name="posicionamentoArmadura">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Muito Ruim</SelectItem>
                  <SelectItem value="2">2 - Ruim</SelectItem>
                  <SelectItem value="3">3 - Regular</SelectItem>
                  <SelectItem value="4">4 - Bom</SelectItem>
                  <SelectItem value="5">5 - Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="posicionamentoReforcos" className="text-gray-700 block mb-2">
                Posicionamento dos reforços
              </Label>
              <Select name="posicionamentoReforcos">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Muito Ruim</SelectItem>
                  <SelectItem value="2">2 - Ruim</SelectItem>
                  <SelectItem value="3">3 - Regular</SelectItem>
                  <SelectItem value="4">4 - Bom</SelectItem>
                  <SelectItem value="5">5 - Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="fibrasSuperficie" className="text-gray-700 block mb-2">
                Fibras na superfície
              </Label>
              <Select name="fibrasSuperficie">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione de 1 a 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Muito Ruim</SelectItem>
                  <SelectItem value="2">2 - Ruim</SelectItem>
                  <SelectItem value="3">3 - Regular</SelectItem>
                  <SelectItem value="4">4 - Bom</SelectItem>
                  <SelectItem value="5">5 - Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-700">
            Anexar Imagens
          </Label>
          <div 
            className="border-2 border-dashed border-gray-300 p-6 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
            onClick={handleAdicionarImagem}
          >
            <Plus className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              Clique para adicionar imagens do seu computador
            </p>
          </div>
          
          {imagensPreview.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {imagensPreview.map((img, index) => (
                <div key={index} className="relative h-32 rounded-md overflow-hidden border border-gray-200">
                  <img 
                    src={img} 
                    alt={`Imagem ${index + 1}`} 
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoverImagem(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                    title="Remover imagem"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <DialogFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleVoltarEtapa}
          className="border-gray-300 hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Button 
          className="bg-[#007EA3] hover:bg-[#006a8a] text-white min-w-[120px] flex items-center justify-center" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              Salvando...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Salvar
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  )
  
  return (
    <div className="container mx-auto py-6">
      <Toaster />
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4 p-0 hover:bg-transparent"
            onClick={voltar}
          >
            <ArrowRight className="h-6 w-6 rotate-180" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Diário de Obra</h1>
          </div>
        </div>
        
        <Button 
          onClick={() => {
            // Atualiza data e hora ao abrir o modal
            setNovoRegistro(prev => ({
              ...prev,
              data: formatarDataAtualInputDate(),
              hora: formatarHoraAtual()
            }))
            setOpenDialog(true)
            setEtapaRegistro(1)
          }}
          className="bg-[#007EA3] hover:bg-[#006a8a] text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Registro
        </Button>
      </div>
      
      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filtroData">Data</Label>
              <Input
                id="filtroData"
                placeholder="Filtrar por data..."
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filtroCadastrador">Cadastrado por</Label>
              <Input
                id="filtroCadastrador"
                placeholder="Filtrar por responsável..."
                value={filtroCadastrador}
                onChange={(e) => setFiltroCadastrador(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="filtroTipo">Tipo</Label>
              <Select defaultValue="todos">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="inicio">Início de etapa</SelectItem>
                  <SelectItem value="andamento">Em andamento</SelectItem>
                  <SelectItem value="conclusao">Conclusão</SelectItem>
                  <SelectItem value="problema">Problema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabela */}
      <Card className="border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                  Cadastrado por
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                  % Concluída
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                  Atividades Desenvolvidas
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                  Anexos
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 border-b border-gray-200 w-20">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPageItems().length > 0 ? (
                getCurrentPageItems().map((registro) => (
                  <tr key={registro.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {registro.data}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        {registro.cadastradoPor}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                      <div className="flex items-center">
                        <PercentIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <Badge className={`${
                          registro.percentualConcluido < 30 ? 'bg-red-100 text-red-800' :
                          registro.percentualConcluido < 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {registro.percentualConcluido}%
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200 max-w-xs truncate">
                      {registro.atividadesDesenvolvidas || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                      <div className="flex items-center">
                        <FileImage className="h-4 w-4 text-gray-400 mr-2" />
                        {registro.anexos}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full">
                            <MoreHorizontal className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            <span>Ver detalhes</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit2 className="h-4 w-4 mr-2" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-600" 
                            onClick={() => handleExcluir(registro.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500 border-b border-gray-200">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginação */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Mostrando <span className="font-medium">{Math.min(
                (currentPage - 1) * itemsPerPage + 1, 
                registrosFiltrados.length
              )}</span> a <span className="font-medium">{Math.min(
                currentPage * itemsPerPage, 
                registrosFiltrados.length
              )}</span> de <span className="font-medium">{registrosFiltrados.length}</span> registros
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => changePage(i + 1)}
                    className={currentPage === i + 1 ? "bg-[#007EA3] hover:bg-[#006a8a]" : ""}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      {/* Modal para Novo Registro */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          {etapaRegistro === 1 && renderEtapa1()}
          {etapaRegistro === 2 && renderEtapa2()}
          {etapaRegistro === 3 && renderEtapa3()}
        </DialogContent>
      </Dialog>
      
      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={modalExcluirAberto} onOpenChange={setModalExcluirAberto}>
        <DialogContent className="sm:max-w-[450px] p-6">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription className="text-base mt-2 text-gray-600">
              Tem certeza que deseja excluir este registro do diário de obra?
            </DialogDescription>
          </DialogHeader>
          
          {registroParaExcluir && (
            <div className="my-6 w-full bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Data:</span>
                  <span className="text-sm font-semibold text-gray-700">{registroParaExcluir.data}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Cadastrado por:</span>
                  <span className="text-sm text-gray-700">{registroParaExcluir.cadastradoPor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">% Concluída:</span>
                  <span className="text-sm text-gray-700">{registroParaExcluir.percentualConcluido}%</span>
                </div>
              </div>
            </div>
          )}
          
          <p className="text-sm text-red-600 font-medium mb-4 text-center">
            Esta ação não pode ser desfeita.
          </p>
          
          <DialogFooter className="flex justify-between gap-3">
            <Button variant="outline" onClick={() => setModalExcluirAberto(false)} className="border-gray-300">
              Cancelar
            </Button>
            <Button 
              onClick={confirmarExclusao} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
