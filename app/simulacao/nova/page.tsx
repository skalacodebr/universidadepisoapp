"use client"

import React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, TestTube } from "lucide-react"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { useEffect } from "react"
import type { SimulacaoFormData } from "@/lib/simulacao-calculator"
import { processarSimulacao, salvarSimulacao } from "@/lib/simulacao-calculator"


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
}

interface EquipamentoSelecionado {
  id: number
  nome: string
  quantidade: number
  selecionado: boolean
}

export default function NovaSimulacaoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  // Use authenticated Supabase client (includes custom token when user is logged in)
  const supabase = getSupabaseClient()
  const refazerId = searchParams.get('refazer')
  const [formData, setFormData] = useState({
    nomeObra: "",
    construtora: "",
    endereco: "",
    nomeContato: "",
    telefoneContato: "",
    reforcoEstrutural: "nao",
    areaTotal: "",
    areaPorDia: "",
    previsaoInicio: null as Date | null,
    tipoAcabamento: "padrao",
    espessura: "",
    distanciaObra: "",
    lancamentoConcreto: "",
    prazoObra: "",
    inicioHora: "",
    equipePreparacao: "",
    prazoPreparacao: "",
    equipeConcretagem: "",
    prazoConcretagem: "",
    equipeAcabamento: "",
    prazoAcabamento: "",
    equipeFinalizacao: "",
    prazoFinalizacao: "",
    equipamentos: [] as EquipamentoSelecionado[],
    frete: "",
    hospedagem: "",
    locacaoEquipamento: "",
    locacaoVeiculo: "",
    material: "",
    passagem: "",
    extra: "",
    comissao: "5",
    precoVenda: "",
    lucroDesejado: "",
  })

  const [activeTab, setActiveTab] = useState("informacoes-gerais")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para dados do banco
  const [equipesConcretagem, setEquipesConcretagem] = useState<EquipeConcretagem[]>([])
  const [equipesAcabamento, setEquipesAcabamento] = useState<EquipeAcabamento[]>([])
  const [equipesPreparacao, setEquipesPreparacao] = useState<EquipePreparacao[]>([])
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [loadingEquipes, setLoadingEquipes] = useState(true)
  const [loadingEquipamentos, setLoadingEquipamentos] = useState(true)
  const [reforcoOptions, setReforcoOptions] = useState<{ id: number; nome: string }[]>([])
  const [loadingReforco, setLoadingReforco] = useState(true)
  const [acabamentoOptions, setAcabamentoOptions] = useState<{ id: number; nome: string }[]>([]);
  const [loadingAcabamento, setLoadingAcabamento] = useState(true);

  // Atualizar prazoObra quando areaTotal ou areaPorDia mudarem
  useEffect(() => {
    if (formData.areaTotal !== "" && formData.areaPorDia !== "" &&
        !isNaN(Number(formData.areaTotal)) && !isNaN(Number(formData.areaPorDia))) {
      const prazo = String(Math.ceil(Number(formData.areaTotal) / Number(formData.areaPorDia)));
      setFormData(prev => ({ ...prev, prazoObra: prazo }));
    }
  }, [formData.areaTotal, formData.areaPorDia]);

  const prazoCalculado =
  formData.areaTotal !== "" &&
  formData.areaPorDia !== "" &&
  !isNaN(Number(formData.areaTotal)) &&
  !isNaN(Number(formData.areaPorDia))
    ? String(Math.ceil(Number(formData.areaTotal) / Number(formData.areaPorDia)))
    : "";
  
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

        // Verificar se o usuário está autenticado antes de fazer as queries
        if (!isAuthenticated || !user) {
          console.log("Usuário não autenticado, pulando query de equipamentos")
          setLoadingEquipamentos(false)
          return
        }

        console.log("Buscando equipamentos...")

        // Buscar equipamentos
        const { data: equipamentosData, error: equipamentosError } = await supabase
          .from("equipamentos")
          .select("id, nome")
          .order("nome")

        if (equipamentosError) {
          console.error("Erro ao buscar equipamentos:", equipamentosError)
        } else {
          console.log("Equipamentos encontrados:", equipamentosData?.length)
          setEquipamentos(equipamentosData || [])

          // Inicializar equipamentos no formData
          const equipamentosIniciais: EquipamentoSelecionado[] = (equipamentosData || []).map((eq) => ({
            id: eq.id,
            nome: eq.nome,
            quantidade: 1,
            selecionado: false,
          }))

          setFormData((prev) => ({ ...prev, equipamentos: equipamentosIniciais }))
        }
      } catch (error) {
        console.error("Erro geral ao buscar equipamentos:", error)
      } finally {
        setLoadingEquipamentos(false)
      }
    }

    fetchEquipamentos()
  }, [isAuthenticated, user])

  // Buscar reforço estrutural do banco de dados
  useEffect(() => {
    const fetchReforco = async () => {
      try {
        setLoadingReforco(true);
        if (!isAuthenticated || !user) {
          setLoadingReforco(false);
          return;
        }

        const { data: reforcoData, error: reforcoError } = await supabase
          .from("tipo_reforco_estrutural")
          .select("id, nome")      // tabela tem colunas id e nome
          .order("nome", { ascending: true });

        if (reforcoError) {
          console.error("Erro ao buscar reforço estrutural:", reforcoError);
        } else {
          setReforcoOptions(reforcoData || []);
        }
      } catch (error) {
        console.error("Erro geral ao buscar reforço estrutural:", error);
      } finally {
        setLoadingReforco(false);
      }
    };

    const fetchAcabamento = async () => {
      try {
        setLoadingAcabamento(true);
        if (!isAuthenticated || !user) {
          setLoadingAcabamento(false);
          return;
        }

        const { data: acabamentoData, error: acabamentoError } = await supabase
          .from("tipo_acabamento")
          .select("id, nome")      // tabela tem colunas id e nome
          .order("nome", { ascending: true });

        if (acabamentoError) {
          console.error("Erro ao buscar tipo de acabamento:", acabamentoError);
        } else {
          setAcabamentoOptions(acabamentoData || []);
        }
      } catch (error) {
        console.error("Erro geral ao buscar tipo de acabamento:", error);
      } finally {
        setLoadingAcabamento(false);
      }
    };

    // Chama ambas as queries em paralelo
    fetchReforco();
    fetchAcabamento();
  }, [isAuthenticated, user]);

  // Carregar dados da simulação para refazer
  useEffect(() => {
    const carregarSimulacaoParaRefazer = async () => {
      if (!refazerId || !isAuthenticated || !user) return;
      
      // Aguardar os dados necessários serem carregados
      if (loadingReforco || loadingAcabamento || loadingEquipamentos) {
        console.log('=== AGUARDANDO DADOS SEREM CARREGADOS ===', {
          loadingReforco,
          loadingAcabamento, 
          loadingEquipamentos,
          reforcoOptionsLength: reforcoOptions.length,
          acabamentoOptionsLength: acabamentoOptions.length,
          equipamentosLength: equipamentos.length
        });
        return;
      }

      try {
        const { data: obra, error } = await supabase
          .from('obras')
          .select('*')
          .eq('id', refazerId)
          .eq('simulacao', true)
          .single();

        if (error) {
          console.error('Erro ao carregar simulação:', error);
          return;
        }

        if (obra) {
          console.log('=== DEBUG CARREGAMENTO COMPLETO ===', {
            prazo_concretagem: obra.prazo_concretagem,
            prazo_acabamento: obra.prazo_acabamento,
            prazo_preparacao_obra: obra.prazo_preparacao_obra,
            prazo_finalizacao_obra: obra.prazo_finalizacao_obra,
            tipo_reforco_estrutural_id: obra.tipo_reforco_estrutural_id,
            tipo_acabamento_id: obra.tipo_acabamento_id,
            equipes_preparacao_id: obra.equipes_preparacao_id,
            equipes_concretagem_id: obra.equipes_concretagem_id,
            equipes_acabamento_id: obra.equipes_acabamento_id
          });

          // Preencher o formulário com os dados da simulação
          setFormData(prev => ({
            ...prev,
            nomeObra: obra.nome || '',
            construtora: obra.construtora || '',
            endereco: obra.endereco || '',
            nomeContato: obra.nome_contato || '',
            telefoneContato: obra.telefone_responsavel || '',
            reforcoEstrutural: (() => {
              const reforcoId = obra.tipo_reforco_estrutural_id?.toString() || '';
              console.log('=== DEBUG REFORÇO ESTRUTURAL ===', {
                tipo_reforco_estrutural_id_original: obra.tipo_reforco_estrutural_id,
                reforcoId_string: reforcoId,
                reforcoOptions_available: reforcoOptions.length > 0,
                reforcoOptions: reforcoOptions
              });
              return reforcoId;
            })(),
            areaTotal: obra.area_total_metros_quadrados?.toString() || '',
            areaPorDia: obra.area_por_dia?.toString() || '',
            previsaoInicio: obra.data_inicio ? new Date(obra.data_inicio) : null,
            tipoAcabamento: obra.tipo_acabamento_id?.toString() || '',
            espessura: obra.espessura_piso?.toString() || '',
            distanciaObra: obra.distancia_obra?.toString() || '',
            lancamentoConcreto: obra.lancamento_concreto?.toString() || '',
            prazoObra: obra.prazo_obra?.toString() || '',
            inicioHora: obra.horas_inicio_concretagem || '',
            equipePreparacao: obra.equipes_preparacao_id?.toString() || '',
            prazoPreparacao: obra.prazo_preparacao_obra?.toString() || '',
            equipeConcretagem: obra.equipes_concretagem_id?.toString() || '',
            prazoConcretagem: obra.prazo_concretagem?.toString() || obra.prazo_obra?.toString() || '',
            equipeAcabamento: obra.equipes_acabamento_id?.toString() || '',
            prazoAcabamento: obra.prazo_acabamento?.toString() || obra.prazo_obra?.toString() || '',
            equipeFinalizacao: obra.equipes_finalizacao_id?.toString() || '',
            prazoFinalizacao: obra.prazo_finalizacao_obra?.toString() || '',
            frete: obra.valor_frete?.toString() || '',
            hospedagem: obra.valor_hospedagem?.toString() || '',
            locacaoEquipamento: obra.valor_locacao_equipamento?.toString() || '',
            locacaoVeiculo: obra.valor_locacao_veiculos?.toString() || '',
            material: obra.valor_material?.toString() || '',
            passagem: obra.valor_passagem?.toString() || '',
            extra: obra.valor_extra?.toString() || '',
            comissao: obra.percentual_comissao?.toString() || '',
            precoVenda: obra.preco_venda_metro_quadrado?.toString() || '',
            lucroDesejado: obra.percentual_lucro_desejado?.toString() || ''
          }));

          // Carregar equipamentos selecionados se existirem
          console.log('=== DEBUG CARREGAMENTO EQUIPAMENTOS ===', {
            obra_equipamentos_selecionados: obra.equipamentos_selecionados,
            tipo: typeof obra.equipamentos_selecionados
          });
          
          if (obra.equipamentos_selecionados) {
            try {
              const equipamentosSelecionados = typeof obra.equipamentos_selecionados === 'string' 
                ? JSON.parse(obra.equipamentos_selecionados) 
                : obra.equipamentos_selecionados;
              
              console.log('=== EQUIPAMENTOS PARSEADOS ===', equipamentosSelecionados);
              
              if (Array.isArray(equipamentosSelecionados)) {
                setFormData(prev => ({
                  ...prev,
                  equipamentos: prev.equipamentos.map(eq => ({
                    ...eq,
                    selecionado: equipamentosSelecionados.some(sel => sel.id === eq.id)
                  }))
                }));
              }
            } catch (e) {
              console.error('Erro ao processar equipamentos:', e);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar simulação para refazer:', error);
      }
    };

    carregarSimulacaoParaRefazer();
  }, [refazerId, isAuthenticated, user, supabase, reforcoOptions, acabamentoOptions, equipamentos, loadingReforco, loadingAcabamento, loadingEquipamentos]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEquipamentoChange = (equipamentoId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      equipamentos: prev.equipamentos.map((eq) => (eq.id === equipamentoId ? { ...eq, selecionado: checked } : eq)),
    }))
  }

  const handleQuantidadeChange = (equipamentoId: number, quantidade: number) => {
    setFormData((prev) => ({
      ...prev,
      equipamentos: prev.equipamentos.map((eq) =>
        eq.id === equipamentoId ? { ...eq, quantidade: Math.max(1, quantidade) } : eq,
      ),
    }))
  }

  const preencherDadosTeste = () => {
    // Data de amanhã para teste
    const amanha = new Date()
    amanha.setDate(amanha.getDate() + 1)

    // Selecionar alguns equipamentos aleatoriamente
    const equipamentosComTeste = formData.equipamentos.map((eq, index) => ({
      ...eq,
      selecionado: index < 3, // Seleciona os primeiros 3 equipamentos
      quantidade: Math.floor(Math.random() * 3) + 1, // Quantidade entre 1 e 3
    }))

    setFormData({
      nomeObra: "Obra Teste - Shopping Center",
      construtora: "Construtora ABC Ltda",
      endereco: "Rua das Flores, 123 - Centro - São Paulo/SP",
      nomeContato: "João Silva",
      telefoneContato: "(11) 99999-9999",
      reforcoEstrutural: "sim",
      areaTotal: "1500",
      areaPorDia: "200",
      previsaoInicio: amanha,
      tipoAcabamento: "premium",
      espessura: "15",
      distanciaObra: "25",
      lancamentoConcreto: "400",
      prazoObra: prazoCalculado,
      inicioHora: "07:00",
      equipePreparacao: equipesConcretagem.length > 0 ? String(equipesConcretagem[0].id) : "",
      prazoPreparacao: "3",
      equipeConcretagem: equipesConcretagem.length > 0 ? String(equipesConcretagem[0].id) : "",
      prazoConcretagem: "5",
      equipeAcabamento: equipesAcabamento.length > 0 ? String(equipesAcabamento[0].id) : "",
      prazoAcabamento: "7",
      equipeFinalizacao: equipesPreparacao.length > 0 ? String(equipesPreparacao[0].id) : "",
      prazoFinalizacao: "2",
      equipamentos: equipamentosComTeste,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Verificar se o usuário está autenticado
      if (!user) {
        console.error("Usuário não autenticado")
        alert("Erro: Usuário não autenticado. Por favor, faça login novamente.")
        router.push("/login")
        return
      }

      // Validar dados obrigatórios
      if (!formData.nomeObra || !formData.areaTotal || !formData.areaPorDia) {
        alert("Por favor, preencha todos os campos obrigatórios: Nome da Obra, Área Total e Área por Dia")
        return
      }

      // Filtrar apenas equipamentos selecionados para envio
      const equipamentosSelecionados = formData.equipamentos.filter((eq) => eq.selecionado)

      const dadosParaEnvio: SimulacaoFormData = {
        ...formData,
        equipamentosSelecionados,
      }

      console.log("Submetendo simulação com dados:", JSON.stringify(dadosParaEnvio, null, 2))
      console.log("ID do usuário:", user.id, "Tipo:", typeof user.id)

      // Verificar token de autenticação
      const token = localStorage.getItem("custom_token") || sessionStorage.getItem("custom_token")
      if (!token) {
        console.error("Token de autenticação não encontrado")
        alert("Erro: Sessão inválida. Por favor, faça login novamente.")
        router.push("/login")
        return
      }

      // Chamar a função processarSimulacao para salvar no banco
      console.log("Chamando processarSimulacao...")
      let resultado
      try {
        resultado = await processarSimulacao(dadosParaEnvio, user.id.toString())
        console.log("Retorno do processarSimulacao:", JSON.stringify(resultado, null, 2))
        
        // Verificar se o resultado é válido
        if (!resultado) {
          throw new Error("Resultado da simulação é nulo ou indefinido")
        }

        // Tentar salvar a simulação
        try {
          await salvarSimulacao(user.id, dadosParaEnvio, resultado, [])
          alert("Simulação criada com sucesso!")
          router.push("/simulacao")
        } catch (saveError: any) {
          console.error("Erro ao salvar simulação:", saveError)
          
          // Tratar erros específicos do salvamento
          if (saveError.message?.includes("permissão")) {
            alert("Erro de permissão ao salvar. Por favor, verifique se você tem acesso para criar simulações.")
          } else if (saveError.message?.includes("duplicidade")) {
            alert("Esta obra já existe no sistema. Por favor, use um nome diferente.")
          } else {
            alert(`Erro ao salvar simulação: ${saveError.message}`)
          }
        }
        
      } catch (processError: any) {
        console.error("Erro ao processar simulação:", processError)
        
        // Tratar erros específicos do processamento
        if (processError.message?.includes("não autenticado") || processError.message?.includes("sessão expirada")) {
          alert("Sua sessão expirou. Por favor, faça login novamente.")
          router.push("/login")
          return
        }
        
        // Erro genérico do processamento
        alert(`Erro ao processar simulação: ${processError?.message || 'Erro desconhecido'}`)
      }
    } catch (error: any) {
      console.error("Erro geral ao criar simulação:", error)
      alert(`Erro ao criar simulação: ${error?.message || 'Erro desconhecido'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveRascunho = () => {
    // Lógica para salvar como rascunho
    alert("Rascunho salvo com sucesso!")
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/simulacao">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Nova Simulação</h1>
        </div>
      </div>

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
            {/* ─── BLOCO PRINCIPAL: grid de 2 colunas ─── */}
            <div className="grid grid-cols-2 gap-4">
              {/* ─── Nome da Obra ─── */}
              <div className="space-y-2">
                <Label htmlFor="nomeObra">Nome da Obra *</Label>
                <Input
                  id="nomeObra"
                  value={formData.nomeObra}
                  onChange={(e) => handleChange("nomeObra", e.target.value)}
                  placeholder="Digite o nome da obra"
                  required
                />
              </div>

              {/* ─── Construtora ─── */}
              <div className="space-y-2">
                <Label htmlFor="construtora">Construtora</Label>
                <Input
                  id="construtora"
                  value={formData.construtora}
                  onChange={(e) => handleChange("construtora", e.target.value)}
                  placeholder="Digite o nome da construtora"
                />
              </div>

              {/* ─── Endereço da Obra ─── */}
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço da Obra</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleChange("endereco", e.target.value)}
                  placeholder="Digite o endereço da obra"
                />
              </div>

              {/* ─── Contato (Nome + Telefone) ─── */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomeContato">Nome do Contato</Label>
                  <Input
                    id="nomeContato"
                    value={formData.nomeContato}
                    onChange={(e) => handleChange("nomeContato", e.target.value)}
                    placeholder="Digite o nome do contato"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefoneContato">Telefone do Contato</Label>
                  <Input
                    id="telefoneContato"
                    value={formData.telefoneContato}
                    onChange={(e) => handleChange("telefoneContato", e.target.value)}
                    placeholder="(XX) XXXXX-XXXX"
                  />
                </div>
              </div>

              {/* ─── Reforço Estrutural ─── */}
              <div className="space-y-2">
                <Label htmlFor="reforcoEstrutural">Reforço Estrutural</Label>
                {loadingReforco ? (
                  <p>Carregando opções...</p>
                ) : (
                  <Select
                    value={formData.reforcoEstrutural}
                    onValueChange={(value) => handleChange("reforcoEstrutural", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {reforcoOptions.map((opcao) => (
                        <SelectItem key={opcao.id} value={String(opcao.id)}>
                          {opcao.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* ─── Área Total ─── */}
              <div className="space-y-2">
                <Label htmlFor="areaTotal">Área Total (m²) *</Label>
                <Input
                  id="areaTotal"
                  type="number"
                  value={formData.areaTotal}
                  onChange={(e) => handleChange("areaTotal", e.target.value)}
                  placeholder="Digite a área total em m²"
                  required
                />
              </div>

              {/* ─── Área por dia ─── */}
              <div className="space-y-2">
                <Label htmlFor="areaPorDia">Área por dia (m²) *</Label>
                <Input
                  id="areaPorDia"
                  type="number"
                  value={formData.areaPorDia}
                  onChange={(e) => handleChange("areaPorDia", e.target.value)}
                  placeholder="Digite a área diária em m²"
                  required
                />
              </div>

              {/* ─── Previsão de Início ─── */}
              <div className="space-y-2">
                <Label htmlFor="previsaoInicio">Previsão de Início *</Label>
                <Input
                  id="previsaoInicio"
                  type="date"
                  value={formData.previsaoInicio ? format(formData.previsaoInicio, "yyyy-MM-dd") : ""}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    handleChange("previsaoInicio", date);
                  }}
                  required
                />
              </div>

              {/* ─── Tipo de Acabamento ─── */}
              <div className="space-y-2">
                <Label htmlFor="tipoAcabamento">Tipo de Acabamento *</Label>
                {loadingAcabamento ? (
                  <p>Carregando opções de acabamento...</p>
                ) : (
                  <Select
                    value={formData.tipoAcabamento}
                    onValueChange={(v) => handleChange("tipoAcabamento", v)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {acabamentoOptions.map((opcao) => (
                        <SelectItem key={opcao.id} value={String(opcao.id)}>
                          {opcao.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* ─── Espessura ─── */}
              <div className="space-y-2">
                <Label htmlFor="espessura">Espessura (cm) *</Label>
                <Input
                  id="espessura"
                  type="number"
                  value={formData.espessura}
                  onChange={(e) => handleChange("espessura", e.target.value)}
                  placeholder="Digite a espessura em cm"
                  required
                />
              </div>

              {/*
                ─── NOVO BLOCO DE 3 COLUNAS (col-span-2) ───
                Este bloco precisa "ultrapassar" as duas colunas do grid-pai.
                Por isso usamos `col-span-2` aqui para que ele ocupe as duas colunas
                e, dentro, tenhamos grid-cols-3 para os três campos.
              */}
              <div className="grid grid-cols-3 gap-4 col-span-2">
                {/* Distância até a obra */}
                <div className="space-y-2">
                  <Label htmlFor="distanciaObra">Distância até a obra (km) *</Label>
                  <Input
                    id="distanciaObra"
                    type="number"
                    value={formData.distanciaObra}
                    onChange={(e) => handleChange("distanciaObra", e.target.value)}
                    placeholder="Digite a distância em km"
                    required
                  />
                </div>

                {/* Lançamento do concreto */}
                <div className="space-y-2">
                  <Label htmlFor="lancamentoConcreto">Lançamento do concreto (m³) *</Label>
                  <Input
                    id="lancamentoConcreto"
                    type="number"
                    value={formData.lancamentoConcreto as number | string}
                    onChange={(e) => {
                      const valor = e.target.value === "" ? "" : Number(e.target.value);
                      handleChange("lancamentoConcreto", valor);
                    }}
                    placeholder="Digite a quantidade em m³"
                    required
                  />
                </div>

                {/* ─── Prazo da Obra (calculado automaticamente) ─── */}
                <div className="space-y-2">
                  <Label htmlFor="prazoObra">Prazo da Obra (dias)</Label>
                  <Input
                    id="prazoObra"
                    type="number"
                    value={prazoCalculado}
                    readOnly
                    placeholder="Será calculado automaticamente"
                  />
                </div>
              </div>
              {/* ──────────────────────────────────────────────────────────────────────────── */}
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

              {/*
                Os campos "Prazo de concretagem" e "Prazo de acabamento" foram removidos.
                A seguir, continuamos com o restante do grid normalmente.
              */}

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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipeFinalizacao">Equipe de finalização da obra</Label>
                <Select
                  value={formData.equipeFinalizacao}
                  onValueChange={(value) => handleChange("equipeFinalizacao", value)}
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
                <Label htmlFor="prazoFinalizacao">Prazo de finalização da obra (dias)</Label>
                <Input
                  id="prazoFinalizacao"
                  type="number"
                  value={formData.prazoFinalizacao}
                  onChange={(e) => handleChange("prazoFinalizacao", e.target.value)}
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
            ) : formData.equipamentos.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {formData.equipamentos.map((equipamento) => (
                    <div key={equipamento.id} className="flex flex-col space-y-2 p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`equipamento-${equipamento.id}`}
                          checked={equipamento.selecionado}
                          onCheckedChange={(checked) => handleEquipamentoChange(equipamento.id, checked as boolean)}
                        />
                        <Label htmlFor={`equipamento-${equipamento.id}`} className="flex-1 cursor-pointer text-sm">
                          {equipamento.nome}
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
                  {formData.equipamentos.filter((eq) => eq.selecionado).length > 0 ? (
                    <ul className="text-sm text-gray-600 space-y-1">
                      {formData.equipamentos
                        .filter((eq) => eq.selecionado)
                        .map((eq) => (
                          <li key={eq.id}>
                            • {eq.nome} - Quantidade: {eq.quantidade}
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospedagem">Hospedagem (R$)</Label>
                <Input
                  id="hospedagem"
                  type="number"
                  value={formData.hospedagem}
                  onChange={(e) => handleChange("hospedagem", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locacaoEquipamento">Locação de Equipamento (R$)</Label>
                <Input
                  id="locacaoEquipamento"
                  type="number"
                  value={formData.locacaoEquipamento}
                  onChange={(e) => handleChange("locacaoEquipamento", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locacaoVeiculo">Locação de Veículo (R$)</Label>
                <Input
                  id="locacaoVeiculo"
                  type="number"
                  value={formData.locacaoVeiculo}
                  onChange={(e) => handleChange("locacaoVeiculo", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material">Material (R$)</Label>
                <Input
                  id="material"
                  type="number"
                  value={formData.material}
                  onChange={(e) => handleChange("material", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passagem">Passagem (R$)</Label>
                <Input
                  id="passagem"
                  type="number"
                  value={formData.passagem}
                  onChange={(e) => handleChange("passagem", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extra">Extra (R$)</Label>
                <Input
                  id="extra"
                  type="number"
                  value={formData.extra}
                  onChange={(e) => handleChange("extra", e.target.value)}
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precoVenda">Se o preço de venda por M² for:</Label>
                <Input
                  id="precoVenda"
                  type="number"
                  value={formData.precoVenda}
                  onChange={(e) => handleChange("precoVenda", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lucroDesejado">Lucro Desejado (%)</Label>
                <Input
                  id="lucroDesejado"
                  type="number"
                  value={formData.lucroDesejado}
                  onChange={(e) => handleChange("lucroDesejado", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={handleSaveRascunho}>
              <Save className="h-4 w-4 mr-2" />
              Salvar como Rascunho
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processando..." : "Gerar Simulação"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}