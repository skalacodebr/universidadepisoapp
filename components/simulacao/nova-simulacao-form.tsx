"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, ArrowLeft, TestTube } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"

interface NovaSimulacaoFormProps {
  onSubmit: (data: SimulacaoFormData) => void
  disabled?: boolean
}

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

interface EquipePreparacao {
  id: number
  nome: string
  qtd_pessoas: number
}

interface Equipamento {
  id: number
  nome: string
  valor_dia: number
  user_id: string
}

interface EquipamentoSelecionado {
  id: number
  nome: string
  valor_dia: number
  quantidade: number
  selecionado: boolean
}

interface TipoReforcoEstrutural {
  id: number
  nome: string
}

interface TipoAcabamento {
  id: number
  nome: string
  area500: number
  area1000: number
  area1500: number
  area2000mais: number
}

interface SimulacaoFormData {
  nomeObra: string
  construtora: string
  endereco: string
  nomeContato: string
  telefoneContato: string
  reforcoEstrutural: string
  areaTotal: string
  areaPorDia: string
  previsaoInicio: Date | null
  tipoAcabamento: string
  espessura: string
  distanciaObra: string
  lancamentoConcreto: string
  prazoObra: string
  inicioHora: string
  equipePreparacao: string
  prazoPreparacao: string
  equipeConcretagem: string
  prazoConcretagem: string
  equipeAcabamento: string
  prazoAcabamento: string
  prazoFinalizacao: string
  equipamentosSelecionados: Array<{
    id: number
    nome: string
    valor_dia: number
    quantidade: number
    selecionado: boolean
  }>
  frete: string
  hospedagem: string
  locacaoEquipamento: string
  locacaoVeiculo: string
  material: string
  passagem: string
  extra: string
  comissao: string
  precoVenda: string
  lucroDesejado: string
}

export function NovaSimulacaoForm({ onSubmit, disabled }: NovaSimulacaoFormProps) {
  const { user, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState<SimulacaoFormData>({
    nomeObra: "",
    construtora: "",
    endereco: "",
    nomeContato: "",
    telefoneContato: "",
    reforcoEstrutural: "",
    areaTotal: "",
    areaPorDia: "",
    previsaoInicio: null,
    tipoAcabamento: "",
    espessura: "",
    distanciaObra: "",
    lancamentoConcreto: "",
    prazoObra: "",
    inicioHora: "08:00",
    equipePreparacao: "",
    prazoPreparacao: "",
    equipeConcretagem: "",
    prazoConcretagem: "",
    equipeAcabamento: "",
    prazoAcabamento: "",
    prazoFinalizacao: "",
    equipamentosSelecionados: [],
    frete: "",
    hospedagem: "",
    locacaoEquipamento: "",
    locacaoVeiculo: "",
    material: "",
    passagem: "",
    extra: "",
    comissao: "0",
    precoVenda: "",
    lucroDesejado: "",
  })  

  const [activeTab, setActiveTab] = useState("informacoes-gerais")

  // Estados para dados do banco
  const [equipesConcretagem, setEquipesConcretagem] = useState<EquipeConcretagem[]>([])
  const [equipesAcabamento, setEquipesAcabamento] = useState<EquipeAcabamento[]>([])
  const [equipesPreparacao, setEquipesPreparacao] = useState<EquipePreparacao[]>([])
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [loadingEquipes, setLoadingEquipes] = useState(true)
  const [loadingEquipamentos, setLoadingEquipamentos] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tiposReforcoEstrutural, setTiposReforcoEstrutural] = useState<TipoReforcoEstrutural[]>([])
  const [loadingTiposReforco, setLoadingTiposReforco] = useState(true)
  const [tiposAcabamento, setTiposAcabamento] = useState<TipoAcabamento[]>([])
  const [loadingTiposAcabamento, setLoadingTiposAcabamento] = useState(true)

  // Buscar equipes do banco de dados
  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        setLoadingEquipes(true)

        // Verificar se o usuário está autenticado antes de fazer as queries
        if (!isAuthenticated || !user) {
          console.log("Usuário não autenticado, pulando queries")
          setLoadingEquipes(false)
          return
        }

        console.log("Usuário autenticado:", user.id, "Nome:", user.nome)

        // Buscar equipes de concretagem - ordenar por ID
        const { data: concretagemData, error: concretagemError } = await supabase
          .from("equipes_concretagem")
          .select("id, nome, qtd_pessoas")
          .order("id")

        if (concretagemError) {
          console.error("Erro ao buscar equipes de concretagem:", concretagemError)
        } else {
          console.log("Equipes concretagem encontradas:", concretagemData?.length)
          setEquipesConcretagem(concretagemData || [])
        }

        // Buscar equipes de acabamento - ordenar por ID
        const { data: acabamentoData, error: acabamentoError } = await supabase
          .from("equipes_acabamento")
          .select("id, nome, qtd_pessoas")
          .order("id")

        if (acabamentoError) {
          console.error("Erro ao buscar equipes de acabamento:", acabamentoError)
        } else {
          console.log("Equipes acabamento encontradas:", acabamentoData?.length)
          setEquipesAcabamento(acabamentoData || [])
        }

        // Buscar equipes de preparação - ordenar por ID
        const { data: preparacaoData, error: preparacaoError } = await supabase
          .from("equipes_preparacao")
          .select("id, nome, qtd_pessoas")
          .order("id")

        if (preparacaoError) {
          console.error("Erro ao buscar equipes de preparação:", preparacaoError)
        } else {
          console.log("Equipes preparação encontradas:", preparacaoData?.length)
          setEquipesPreparacao(preparacaoData || [])
        }

        console.log("Estados finais:", {
          concretagem: concretagemData?.length || 0,
          acabamento: acabamentoData?.length || 0,
          preparacao: preparacaoData?.length || 0,
        })
      } catch (error) {
        console.error("Erro geral ao buscar equipes:", error)
      } finally {
        setLoadingEquipes(false)
      }
    }

    fetchEquipes()
  }, [isAuthenticated, user])

  // Buscar equipamentos do banco de dados
  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        setLoadingEquipamentos(true)

        if (!isAuthenticated || !user) {
          console.log("DEBUG - Auth:", { isAuthenticated, userId: user?.id })
          console.log("Usuário não autenticado, pulando query de equipamentos")
          setLoadingEquipamentos(false)
          return
        }

        console.log("DEBUG - Auth:", { isAuthenticated, userId: user?.id })
        console.log("Buscando equipamentos...")

        // Buscar equipamentos (padrão + do usuário)
        const { data: equipamentosData, error: equipamentosError } = await supabase
          .from("equipamentos")
          .select("id, nome, valor_dia, user_id")
          .in('user_id', ['0', user.id])
          .order("nome")

        if (equipamentosError) {
          console.error("Erro ao buscar equipamentos:", equipamentosError.message)
          console.error("Detalhes do erro:", equipamentosError)
        } else {
          console.log("DEBUG - Resposta:", equipamentosData)
          console.log("Equipamentos encontrados:", equipamentosData?.length)
          setEquipamentos(equipamentosData || [])

          // Inicializar equipamentos no formData
          const equipamentosIniciais: EquipamentoSelecionado[] = (equipamentosData || []).map((eq) => ({
            id: eq.id,
            nome: eq.nome,
            valor_dia: eq.valor_dia,
            quantidade: 1,
            selecionado: false,
          }))

          setFormData(prev => ({ 
            ...prev,
            equipamentosSelecionados: equipamentosIniciais
          }))
        }
      } catch (error) {
        console.error("Erro geral ao buscar equipamentos:", error)
      } finally {
        setLoadingEquipamentos(false)
      }
    }

    fetchEquipamentos()
  }, [isAuthenticated, user])

  // Buscar tipos de reforço estrutural
  useEffect(() => {
    const fetchTiposReforco = async () => {
      try {
        setLoadingTiposReforco(true)

        if (!isAuthenticated || !user) {
          console.log("Usuário não autenticado, pulando query de tipos de reforço")
          setLoadingTiposReforco(false)
          return
        }

        const { data: tiposReforcoData, error: tiposReforcoError } = await supabase
          .from("tipo_reforco_estrutural")
          .select("id, nome")
          .order("id")

        if (tiposReforcoError) {
          console.error("Erro ao buscar tipos de reforço estrutural:", tiposReforcoError)
        } else {
          console.log("Tipos de reforço estrutural encontrados:", tiposReforcoData?.length)
          setTiposReforcoEstrutural(tiposReforcoData || [])
        }
      } catch (error) {
        console.error("Erro geral ao buscar tipos de reforço estrutural:", error)
      } finally {
        setLoadingTiposReforco(false)
      }
    }

    fetchTiposReforco()
  }, [isAuthenticated, user])

  // Buscar tipos de acabamento
  useEffect(() => {
    const fetchTiposAcabamento = async () => {
      try {
        setLoadingTiposAcabamento(true)

        if (!isAuthenticated || !user) {
          console.log("Usuário não autenticado, pulando query de tipos de acabamento")
          setLoadingTiposAcabamento(false)
          return
        }

        const { data: tiposAcabamentoData, error: tiposAcabamentoError } = await supabase
          .from("tipo_acabamento")
          .select("id, nome, area500, area1000, area1500, area2000mais")
          .order("id")

        if (tiposAcabamentoError) {
          console.error("Erro ao buscar tipos de acabamento:", tiposAcabamentoError)
        } else {
          console.log("Tipos de acabamento encontrados:", tiposAcabamentoData?.length)
          setTiposAcabamento(tiposAcabamentoData || [])
        }
      } catch (error) {
        console.error("Erro geral ao buscar tipos de acabamento:", error)
      } finally {
        setLoadingTiposAcabamento(false)
      }
    }

    fetchTiposAcabamento()
  }, [isAuthenticated, user])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEquipamentoChange = (equipamentoId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      equipamentosSelecionados: prev.equipamentosSelecionados.map((eq) => 
        eq.id === equipamentoId ? { ...eq, selecionado: checked } : eq
      ),
    }))
  }

  const handleQuantidadeChange = (equipamentoId: number, quantidade: number) => {
    setFormData((prev) => ({
      ...prev,
      equipamentosSelecionados: prev.equipamentosSelecionados.map((eq) =>
        eq.id === equipamentoId ? { ...eq, quantidade: Math.max(1, quantidade) } : eq
      ),
    }))
  }

  const preencherDadosTeste = () => {
    // Data de amanhã para teste
    const amanha = new Date()
    amanha.setDate(amanha.getDate() + 1)

    // Selecionar alguns equipamentos aleatoriamente
    const equipamentosComTeste = formData.equipamentosSelecionados.map((eq, index) => ({
      ...eq,
      selecionado: index < 3, // Seleciona os primeiros 3 equipamentos
      quantidade: Math.floor(Math.random() * 3) + 1, // Quantidade entre 1 e 3,
      valor_dia: eq.valor_dia // Mantém o valor_dia original
    }))

    setFormData({
      nomeObra: "Obra Teste - Shopping Center",
      construtora: "Construtora ABC Ltda",
      endereco: "Rua das Flores, 123 - Centro - São Paulo/SP",
      nomeContato: "João Silva",
      telefoneContato: "(11) 99999-9999",
      reforcoEstrutural: tiposReforcoEstrutural.length > 0 ? String(tiposReforcoEstrutural[0].id) : "",
      areaTotal: "1500",
      areaPorDia: "200",
      previsaoInicio: amanha,
      tipoAcabamento: tiposAcabamento.length > 0 ? String(tiposAcabamento[0].id) : "",
      espessura: "15",
      distanciaObra: "25",
      lancamentoConcreto: "75",
      prazoObra: "8",
      inicioHora: "07:00",
      equipePreparacao: equipesConcretagem.length > 0 ? String(equipesConcretagem[0].id) : "",
      prazoPreparacao: "3",
      equipeConcretagem: equipesConcretagem.length > 0 ? String(equipesConcretagem[0].id) : "",
      prazoConcretagem: "5",
      equipeAcabamento: equipesAcabamento.length > 0 ? String(equipesAcabamento[0].id) : "",
      prazoAcabamento: "7",
      prazoFinalizacao: "2",
      equipamentosSelecionados: equipamentosComTeste,
      frete: "2500",
      hospedagem: "1800",
      locacaoEquipamento: "3200",
      locacaoVeiculo: "1500",
      material: "5000",
      passagem: "800",
      extra: "1200",
      comissao: "8",
      precoVenda: "85",
      lucroDesejado: "25",
    })

    console.log("Dados de teste preenchidos!")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (disabled) return
    onSubmit(formData)
  }  

  const handleSaveRascunho = () => {
    // Lógica para salvar como rascunho
    alert("Rascunho salvo com sucesso!")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Botão de teste - só aparece em desenvolvimento */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={preencherDadosTeste}
          className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
        >
          <TestTube className="h-4 w-4 mr-2" />
          Preencher Dados de Teste
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-2">
          <TabsTrigger value="informacoes-gerais">Informações Gerais</TabsTrigger>
          <TabsTrigger value="equipes-prazos">Equipes e Prazos</TabsTrigger>
          <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
          <TabsTrigger value="custos-adicionais">Custos Adicionais</TabsTrigger>
        </TabsList>

        <TabsContent value="informacoes-gerais" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomeObra">Nome da Obra *</Label>
              <Input
                id="nomeObra"
                value={formData.nomeObra}
                onChange={(e) => handleChange("nomeObra", e.target.value)}
                placeholder="Nome da obra"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="construtora">Construtora</Label>
              <Input
                id="construtora"
                value={formData.construtora}
                onChange={(e) => handleChange("construtora", e.target.value)}
                placeholder="Nome da construtora"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço da Obra</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleChange("endereco", e.target.value)}
                placeholder="Endereço da obra"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomeContato">Nome do Contato</Label>
                <Input
                  id="nomeContato"
                  value={formData.nomeContato}
                  onChange={(e) => handleChange("nomeContato", e.target.value)}
                  placeholder="Nome do contato responsável"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefoneContato">Telefone do Contato</Label>
                <Input
                  id="telefoneContato"
                  value={formData.telefoneContato}
                  onChange={(e) => handleChange("telefoneContato", e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reforcoEstrutural">Reforço Estrutural *</Label>
              <Select
                value={formData.reforcoEstrutural}
                onValueChange={(value) => handleChange("reforcoEstrutural", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {loadingTiposReforco ? (
                    <SelectItem value="loading" disabled>
                      Carregando tipos de reforço...
                    </SelectItem>
                  ) : tiposReforcoEstrutural.length > 0 ? (
                    tiposReforcoEstrutural.map((tipo) => (
                      <SelectItem key={tipo.id} value={String(tipo.id)}>
                        {tipo.nome}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>
                      Nenhum tipo de reforço encontrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="areaTotal">Área Total (m²) *</Label>
              <Input
                id="areaTotal"
                type="number"
                value={formData.areaTotal}
                onChange={(e) => handleChange("areaTotal", e.target.value)}
                placeholder="Área total em m²"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="areaPorDia">Área por dia (m²) *</Label>
              <Input
                id="areaPorDia"
                type="number"
                value={formData.areaPorDia}
                onChange={(e) => handleChange("areaPorDia", e.target.value)}
                placeholder="Área executada por dia"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="previsaoInicio">Previsão de Início *</Label>
              <Input
                id="previsaoInicio"
                type="date"
                value={formData.previsaoInicio ? format(formData.previsaoInicio, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null
                  handleChange("previsaoInicio", date)
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipoAcabamento">Tipo de Acabamento *</Label>
              <Select
                value={formData.tipoAcabamento}
                onValueChange={(value) => handleChange("tipoAcabamento", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {loadingTiposAcabamento ? (
                    <SelectItem value="loading" disabled>
                      Carregando tipos de acabamento...
                    </SelectItem>
                  ) : tiposAcabamento.length > 0 ? (
                    tiposAcabamento.map((tipo) => (
                      <SelectItem key={tipo.id} value={String(tipo.id)}>
                        {tipo.nome}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>
                      Nenhum tipo de acabamento encontrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="espessura">Espessura (cm) *</Label>
              <Input
                id="espessura"
                type="number"
                value={formData.espessura}
                onChange={(e) => handleChange("espessura", e.target.value)}
                placeholder="Espessura em centímetros"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distanciaObra">Distância até a obra (km) *</Label>
              <Input
                id="distanciaObra"
                type="number"
                value={formData.distanciaObra}
                onChange={(e) => handleChange("distanciaObra", e.target.value)}
                placeholder="Distância em quilômetros"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lancamentoConcreto">Lançamento do concreto (m³) *</Label>
              <Input
                id="lancamentoConcreto"
                type="number"
                value={formData.lancamentoConcreto}
                onChange={(e) => handleChange("lancamentoConcreto", e.target.value)}
                placeholder="Volume em metros cúbicos"
                required
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="equipes-prazos" className="space-y-4">
          <h3 className="text-lg font-medium">Informações sobre Concretagem e Acabamento</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inicioHora">Início da Concretagem (hora) *</Label>
              <Input
                id="inicioHora"
                type="time"
                value={formData.inicioHora}
                onChange={(e) => handleChange("inicioHora", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipeConcretagem">Equipe de Concretagem *</Label>
              <Select
                value={formData.equipeConcretagem}
                onValueChange={(value) => handleChange("equipeConcretagem", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingEquipes ? "Carregando..." : "Selecione uma equipe"} />
                </SelectTrigger>
                <SelectContent>
                  {loadingEquipes ? (
                    <SelectItem value="loading" disabled>
                      Carregando equipes...
                    </SelectItem>
                  ) : equipesConcretagem.length > 0 ? (
                    equipesConcretagem.map((equipe) => (
                      <SelectItem key={equipe.id} value={String(equipe.id)}>
                        {equipe.qtd_pessoas} pessoas
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>
                      Nenhuma equipe encontrada
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipeAcabamento">Equipe de Acabamento *</Label>
              <Select
                value={formData.equipeAcabamento}
                onValueChange={(value) => handleChange("equipeAcabamento", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingEquipes ? "Carregando..." : "Selecione uma equipe"} />
                </SelectTrigger>
                <SelectContent>
                  {loadingEquipes ? (
                    <SelectItem value="loading" disabled>
                      Carregando equipes...
                    </SelectItem>
                  ) : equipesAcabamento.length > 0 ? (
                    equipesAcabamento.map((equipe) => (
                      <SelectItem key={equipe.id} value={String(equipe.id)}>
                        {equipe.qtd_pessoas} pessoas
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>
                      Nenhuma equipe encontrada
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prazoConcretagem">Prazo de concretagem (dias)</Label>
              <Input
                id="prazoConcretagem"
                type="number"
                value={formData.prazoConcretagem}
                onChange={(e) => handleChange("prazoConcretagem", e.target.value)}
                placeholder="Dias para concretagem"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prazoAcabamento">Prazo de acabamento (dias)</Label>
              <Input
                id="prazoAcabamento"
                type="number"
                value={formData.prazoAcabamento}
                onChange={(e) => handleChange("prazoAcabamento", e.target.value)}
                placeholder="Dias para acabamento"
              />
            </div>

            <div className="col-span-2">
              <h3 className="text-lg font-medium mt-4 mb-2">Preparação e Finalização da Obra</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipePreparacao">Equipe de preparação da obra</Label>
              <Select
                value={formData.equipePreparacao}
                onValueChange={(value) => handleChange("equipePreparacao", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingEquipes ? "Carregando..." : "Selecione uma equipe"} />
                </SelectTrigger>
                <SelectContent>
                  {loadingEquipes ? (
                    <SelectItem value="loading" disabled>
                      Carregando equipes...
                    </SelectItem>
                  ) : equipesPreparacao.length > 0 ? (
                    equipesPreparacao.map((equipe) => (
                      <SelectItem key={equipe.id} value={String(equipe.id)}>
                        {equipe.qtd_pessoas} pessoas
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>
                      Nenhuma equipe encontrada
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prazoPreparacao">Prazo de preparação da obra (dias)</Label>
              <Input
                id="prazoPreparacao"
                type="number"
                value={formData.prazoPreparacao}
                onChange={(e) => handleChange("prazoPreparacao", e.target.value)}
                placeholder="Dias para preparação"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prazoFinalizacao">Prazo de finalização da obra (dias)</Label>
              <Input
                id="prazoFinalizacao"
                type="number"
                value={formData.prazoFinalizacao}
                onChange={(e) => handleChange("prazoFinalizacao", e.target.value)}
                placeholder="Dias para finalização"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="equipamentos" className="space-y-4">
          <h3 className="text-lg font-medium">Equipamentos</h3>
          <p className="text-sm text-gray-500 mb-4">
            Selecione os equipamentos necessários para a obra e defina a quantidade de cada um.
          </p>

          {loadingEquipamentos ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando equipamentos...</p>
            </div>
          ) : formData.equipamentosSelecionados.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {formData.equipamentosSelecionados.map((equipamento) => (
                  <div key={equipamento.id} className="flex flex-col space-y-2 p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`equipamento-${equipamento.id}`}
                        checked={equipamento.selecionado}
                        onCheckedChange={(checked) => handleEquipamentoChange(equipamento.id, checked as boolean)}
                      />
                      <Label htmlFor={`equipamento-${equipamento.id}`} className="flex-1 cursor-pointer text-sm">
                        {equipamento.nome} - R$ {equipamento.valor_dia}/dia
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`quantidade-${equipamento.id}`} className="text-sm">
                        Qtd:
                      </Label>
                      <Input
                        id={`quantidade-${equipamento.id}`}
                        type="number"
                        min="1"
                        value={equipamento.quantidade}
                        onChange={(e) => handleQuantidadeChange(equipamento.id, Number.parseInt(e.target.value) || 1)}
                        disabled={!equipamento.selecionado}
                        className="w-16 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Equipamentos Selecionados:</h4>
                {formData.equipamentosSelecionados.filter((eq) => eq.selecionado).length > 0 ? (
                  <ul className="text-sm text-gray-600 space-y-1">
                    {formData.equipamentosSelecionados
                      .filter((eq) => eq.selecionado)
                      .map((eq) => (
                        <li key={eq.id}>
                          • {eq.nome} - {eq.quantidade} un. x R$ {eq.valor_dia}/dia
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Nenhum equipamento selecionado</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum equipamento encontrado no banco de dados.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="custos-adicionais" className="space-y-4">
          <h3 className="text-lg font-medium">Custos Diversos</h3>
          <p className="text-sm text-gray-500 mb-4">
            Estes campos são custos que não são previamente definidos e somam ao custo total da obra.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frete">Frete (R$)</Label>
              <Input
                id="frete"
                type="number"
                value={formData.frete}
                onChange={(e) => handleChange("frete", e.target.value)}
                placeholder="Valor do frete"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hospedagem">Hospedagem (R$)</Label>
              <Input
                id="hospedagem"
                type="number"
                value={formData.hospedagem}
                onChange={(e) => handleChange("hospedagem", e.target.value)}
                placeholder="Valor da hospedagem"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locacaoEquipamento">Locação de Equipamento (R$)</Label>
              <Input
                id="locacaoEquipamento"
                type="number"
                value={formData.locacaoEquipamento}
                onChange={(e) => handleChange("locacaoEquipamento", e.target.value)}
                placeholder="Valor da locação de equipamento"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locacaoVeiculo">Locação de Veículo (R$)</Label>
              <Input
                id="locacaoVeiculo"
                type="number"
                value={formData.locacaoVeiculo}
                onChange={(e) => handleChange("locacaoVeiculo", e.target.value)}
                placeholder="Valor da locação de veículo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">Material (R$)</Label>
              <Input
                id="material"
                type="number"
                value={formData.material}
                onChange={(e) => handleChange("material", e.target.value)}
                placeholder="Valor do material"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passagem">Passagem (R$)</Label>
              <Input
                id="passagem"
                type="number"
                value={formData.passagem}
                onChange={(e) => handleChange("passagem", e.target.value)}
                placeholder="Valor da passagem"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extra">Extra (R$)</Label>
              <Input
                id="extra"
                type="number"
                value={formData.extra}
                onChange={(e) => handleChange("extra", e.target.value)}
                placeholder="Valor extra"
              />
            </div>

            <div className="col-span-2">
              <h3 className="text-lg font-medium mt-4 mb-2">Comissão e Valor Final</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comissao">Valor da comissão em % sobre o preço de venda</Label>
              <Input
                id="comissao"
                type="number"
                value={formData.comissao}
                onChange={(e) => handleChange("comissao", e.target.value)}
                placeholder="Percentual de comissão"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precoVenda">Se o preço de venda por M² for:</Label>
              <Input
                id="precoVenda"
                type="number"
                value={formData.precoVenda}
                onChange={(e) => handleChange("precoVenda", e.target.value)}
                placeholder="Preço por m²"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lucroDesejado">Lucro Desejado (%)</Label>
              <Input
                id="lucroDesejado"
                type="number"
                value={formData.lucroDesejado}
                onChange={(e) => handleChange("lucroDesejado", e.target.value)}
                placeholder="Percentual de lucro desejado"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => setActiveTab("informacoes-gerais")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="space-x-2">
          <Button type="button" variant="outline" onClick={handleSaveRascunho}>
            <Save className="h-4 w-4 mr-2" />
            Salvar como Rascunho
          </Button>
          <Button type="submit" disabled={disabled}>Gerar Simulação</Button>
        </div>
      </div>
    </form>
  )
}
