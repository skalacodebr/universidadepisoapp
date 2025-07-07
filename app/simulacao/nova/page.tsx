"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
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
import type { SimulacaoFormData } from "@/lib/simulacao-calculator"
import { processarSimulacao } from "@/lib/simulacao-calculator"

const supabase = getSupabaseClient();

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
  const { user } = useAuth()
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
    inicioHora: "",
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
    comissao: "",
    precoVenda: "",
    lucroDesejado: ""
  })

  const [equipesConcretagem, setEquipesConcretagem] = useState<EquipeConcretagem[]>([])
  const [equipesAcabamento, setEquipesAcabamento] = useState<EquipeAcabamento[]>([])
  const [equipesPreparacao, setEquipesPreparacao] = useState<EquipePreparacao[]>([])
  const [loadingEquipes, setLoadingEquipes] = useState(true)
  const [equipamentos, setEquipamentos] = useState<Array<{ id: number; nome: string }>>([])
  const [loadingEquipamentos, setLoadingEquipamentos] = useState(true)

  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        setLoadingEquipes(true)

        if (!user) {
          console.log("Usuário não autenticado, pulando queries")
          setLoadingEquipes(false)
          return
        }

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
      } catch (error) {
        console.error("Erro geral ao buscar equipes:", error)
      } finally {
        setLoadingEquipes(false)
      }
    }

    fetchEquipes()
  }, [user])

  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        setLoadingEquipamentos(true)

        if (!user) {
          console.log("Usuário não autenticado, pulando query de equipamentos")
          setLoadingEquipamentos(false)
          return
        }

        const { data: equipamentosData, error: equipamentosError } = await supabase
          .from("equipamentos")
          .select("id, nome, user_id")
          .or(`user_id.eq.0,user_id.eq.${user.id}`)
          .order("nome")

        if (equipamentosError) {
          console.error("Erro ao buscar equipamentos:", equipamentosError)
        } else {
          console.log("Equipamentos encontrados:", equipamentosData?.length)
          setEquipamentos(equipamentosData || [])
        }
      } catch (error) {
        console.error("Erro geral ao buscar equipamentos:", error)
      } finally {
        setLoadingEquipamentos(false)
      }
    }

    fetchEquipamentos()
  }, [user])

  const handleChange = (field: keyof SimulacaoFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleEquipamentoChange = (equipamentoId: number, quantidade: number) => {
    const existingEquipamento = formData.equipamentosSelecionados.find(eq => eq.id === equipamentoId)
    
    if (quantidade > 0) {
      if (existingEquipamento) {
        setFormData(prev => ({
          ...prev,
          equipamentosSelecionados: prev.equipamentosSelecionados.map(eq =>
            eq.id === equipamentoId ? { ...eq, quantidade } : eq
          )
        }))
      } else {
        const equipamento = equipamentos.find(eq => eq.id === equipamentoId)
        if (equipamento) {
          setFormData(prev => ({
            ...prev,
            equipamentosSelecionados: [
              ...prev.equipamentosSelecionados,
              { id: equipamentoId, nome: equipamento.nome, quantidade, selecionado: true }
            ]
          }))
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        equipamentosSelecionados: prev.equipamentosSelecionados.filter(eq => eq.id !== equipamentoId)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      await processarSimulacao(formData, user.id)
      router.push('/simulacao')
    } catch (error) {
      console.error('Erro ao processar simulação:', error)
    }
  }

  const handleSaveRascunho = () => {
    // Implementar lógica de salvar rascunho
    alert("Rascunho salvo!")
  }

  const prazoCalculado = useMemo(() => {
    if (!formData.areaTotal || !formData.areaPorDia) return ""
    const area = parseFloat(formData.areaTotal)
    const areaDia = parseFloat(formData.areaPorDia)
    if (isNaN(area) || isNaN(areaDia) || areaDia === 0) return ""
    return Math.ceil(area / areaDia).toString()
  }, [formData.areaTotal, formData.areaPorDia])

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Nova Simulação</h1>
            <p className="text-sm text-gray-500 mt-1">Preencha os dados para gerar uma nova simulação</p>
          </div>
          <Link href="/simulacao" className="text-gray-500 hover:text-gray-700">
            Voltar para simulações
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Gerais */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6">Informações Gerais</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nomeObra">Nome da Obra *</Label>
                <Input
                  id="nomeObra"
                  value={formData.nomeObra}
                  onChange={(e) => handleChange("nomeObra", e.target.value)}
                  placeholder="Nome da obra"
                  required
                />
              </div>
              <div>
                <Label htmlFor="construtora">Construtora</Label>
                <Input
                  id="construtora"
                  value={formData.construtora}
                  onChange={(e) => handleChange("construtora", e.target.value)}
                  placeholder="Nome da construtora"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleChange("endereco", e.target.value)}
                  placeholder="Endereço da obra"
                />
              </div>
              <div>
                <Label htmlFor="nomeContato">Nome do Contato</Label>
                <Input
                  id="nomeContato"
                  value={formData.nomeContato}
                  onChange={(e) => handleChange("nomeContato", e.target.value)}
                  placeholder="Nome do contato"
                />
              </div>
              <div>
                <Label htmlFor="telefoneContato">Telefone do Contato</Label>
                <Input
                  id="telefoneContato"
                  value={formData.telefoneContato}
                  onChange={(e) => handleChange("telefoneContato", e.target.value)}
                  placeholder="Telefone do contato"
                />
              </div>
            </div>
          </div>

          {/* Detalhes da Obra */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6">Detalhes da Obra</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reforcoEstrutural">Reforço Estrutural *</Label>
                <Select
                  value={formData.reforcoEstrutural}
                  onValueChange={(value) => handleChange("reforcoEstrutural", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tipoAcabamento">Tipo de Acabamento *</Label>
                <Select
                  value={formData.tipoAcabamento}
                  onValueChange={(value) => handleChange("tipoAcabamento", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="liso">Liso</SelectItem>
                    <SelectItem value="polido">Polido</SelectItem>
                    <SelectItem value="antiderrapante">Antiderrapante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="areaTotal">Área Total (m²) *</Label>
                <Input
                  id="areaTotal"
                  type="number"
                  value={formData.areaTotal}
                  onChange={(e) => handleChange("areaTotal", e.target.value)}
                  placeholder="Área total"
                  required
                />
              </div>
              <div>
                <Label htmlFor="areaPorDia">Área por Dia (m²) *</Label>
                <Input
                  id="areaPorDia"
                  type="number"
                  value={formData.areaPorDia}
                  onChange={(e) => handleChange("areaPorDia", e.target.value)}
                  placeholder="Área por dia"
                  required
                />
              </div>
              <div>
                <Label htmlFor="espessura">Espessura (cm) *</Label>
                <Input
                  id="espessura"
                  type="number"
                  value={formData.espessura}
                  onChange={(e) => handleChange("espessura", e.target.value)}
                  placeholder="Espessura"
                  required
                />
              </div>
              <div>
                <Label htmlFor="distanciaObra">Distância da Obra (km) *</Label>
                <Input
                  id="distanciaObra"
                  type="number"
                  value={formData.distanciaObra}
                  onChange={(e) => handleChange("distanciaObra", e.target.value)}
                  placeholder="Distância da obra"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lancamentoConcreto">Lançamento de Concreto *</Label>
                <Select
                  value={formData.lancamentoConcreto}
                  onValueChange={(value) => handleChange("lancamentoConcreto", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bomba">Bomba</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="prazoObra">Prazo da Obra (dias) *</Label>
                <Input
                  id="prazoObra"
                  type="number"
                  value={formData.prazoObra}
                  onChange={(e) => handleChange("prazoObra", e.target.value)}
                  placeholder="Prazo da obra"
                  required
                />
              </div>
              <div>
                <Label htmlFor="previsaoInicio">Previsão de Início *</Label>
                <Input
                  id="previsaoInicio"
                  type="date"
                  value={formData.previsaoInicio ? new Date(formData.previsaoInicio).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleChange("previsaoInicio", new Date(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Equipes e Prazos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6">Equipes e Prazos</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inicioHora">Horário de Início *</Label>
                <Input
                  id="inicioHora"
                  type="time"
                  value={formData.inicioHora}
                  onChange={(e) => handleChange("inicioHora", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="equipePreparacao">Equipe de Preparação *</Label>
                <Select
                  value={formData.equipePreparacao}
                  onValueChange={(value) => handleChange("equipePreparacao", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingEquipes ? "Carregando..." : "Selecione uma equipe"} />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingEquipes ? (
                      <SelectItem value="" disabled>
                        Carregando equipes...
                      </SelectItem>
                    ) : equipesPreparacao.length > 0 ? (
                      equipesPreparacao.map((equipe) => (
                        <SelectItem key={equipe.id} value={String(equipe.id)}>
                          {equipe.nome} ({equipe.qtd_pessoas} pessoas)
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
              <div>
                <Label htmlFor="prazoPreparacao">Prazo de Preparação (dias) *</Label>
                <Input
                  id="prazoPreparacao"
                  type="number"
                  value={formData.prazoPreparacao}
                  onChange={(e) => handleChange("prazoPreparacao", e.target.value)}
                  placeholder="Prazo de preparação"
                  required
                />
              </div>
              <div>
                <Label htmlFor="equipeConcretagem">Equipe de Concretagem *</Label>
                <Select
                  value={formData.equipeConcretagem}
                  onValueChange={(value) => handleChange("equipeConcretagem", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingEquipes ? "Carregando..." : "Selecione uma equipe"} />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingEquipes ? (
                      <SelectItem value="" disabled>
                        Carregando equipes...
                      </SelectItem>
                    ) : equipesConcretagem.length > 0 ? (
                      equipesConcretagem.map((equipe) => (
                        <SelectItem key={equipe.id} value={String(equipe.id)}>
                          {equipe.nome} ({equipe.qtd_pessoas} pessoas)
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
              <div>
                <Label htmlFor="prazoConcretagem">Prazo de Concretagem (dias) *</Label>
                <Input
                  id="prazoConcretagem"
                  type="number"
                  value={formData.prazoConcretagem}
                  onChange={(e) => handleChange("prazoConcretagem", e.target.value)}
                  placeholder="Prazo de concretagem"
                  required
                />
              </div>
              <div>
                <Label htmlFor="equipeAcabamento">Equipe de Acabamento *</Label>
                <Select
                  value={formData.equipeAcabamento}
                  onValueChange={(value) => handleChange("equipeAcabamento", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingEquipes ? "Carregando..." : "Selecione uma equipe"} />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingEquipes ? (
                      <SelectItem value="" disabled>
                        Carregando equipes...
                      </SelectItem>
                    ) : equipesAcabamento.length > 0 ? (
                      equipesAcabamento.map((equipe) => (
                        <SelectItem key={equipe.id} value={String(equipe.id)}>
                          {equipe.nome} ({equipe.qtd_pessoas} pessoas)
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
              <div>
                <Label htmlFor="prazoAcabamento">Prazo de Acabamento (dias) *</Label>
                <Input
                  id="prazoAcabamento"
                  type="number"
                  value={formData.prazoAcabamento}
                  onChange={(e) => handleChange("prazoAcabamento", e.target.value)}
                  placeholder="Prazo de acabamento"
                  required
                />
              </div>
              <div>
                <Label htmlFor="prazoFinalizacao">Prazo de Finalização (dias) *</Label>
                <Input
                  id="prazoFinalizacao"
                  type="number"
                  value={formData.prazoFinalizacao}
                  onChange={(e) => handleChange("prazoFinalizacao", e.target.value)}
                  placeholder="Prazo de finalização"
                  required
                />
              </div>
            </div>
          </div>

          {/* Equipamentos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6">Equipamentos</h2>
            <p className="text-sm text-gray-500 mb-4">
              Selecione os equipamentos necessários para a obra e defina a quantidade de cada um.
            </p>
            {loadingEquipamentos ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando equipamentos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {equipamentos.map((equipamento) => (
                  <div key={equipamento.id} className="space-y-2">
                    <Label htmlFor={`equipamento-${equipamento.id}`}>{equipamento.nome}</Label>
                    <Input
                      id={`equipamento-${equipamento.id}`}
                      type="number"
                      min="0"
                      value={formData.equipamentosSelecionados.find(eq => eq.id === equipamento.id)?.quantidade || ""}
                      onChange={(e) => {
                        const quantidade = parseInt(e.target.value) || 0
                        if (quantidade > 0) {
                          const equipamentoExistente = formData.equipamentosSelecionados.find(eq => eq.id === equipamento.id)
                          if (equipamentoExistente) {
                            setFormData(prev => ({
                              ...prev,
                              equipamentosSelecionados: prev.equipamentosSelecionados.map(eq =>
                                eq.id === equipamento.id ? { ...eq, quantidade } : eq
                              )
                            }))
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              equipamentosSelecionados: [
                                ...prev.equipamentosSelecionados,
                                { id: equipamento.id, nome: equipamento.nome, quantidade, selecionado: true }
                              ]
                            }))
                          }
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            equipamentosSelecionados: prev.equipamentosSelecionados.filter(eq => eq.id !== equipamento.id)
                          }))
                        }
                      }}
                      placeholder="Quantidade"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custos Diversos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6">Custos Diversos</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frete">Frete (R$)</Label>
                <Input
                  id="frete"
                  type="number"
                  value={formData.frete}
                  onChange={(e) => handleChange("frete", e.target.value)}
                  placeholder="Valor do frete"
                />
              </div>
              <div>
                <Label htmlFor="hospedagem">Hospedagem (R$)</Label>
                <Input
                  id="hospedagem"
                  type="number"
                  value={formData.hospedagem}
                  onChange={(e) => handleChange("hospedagem", e.target.value)}
                  placeholder="Valor da hospedagem"
                />
              </div>
              <div>
                <Label htmlFor="locacaoEquipamento">Locação de Equipamento (R$)</Label>
                <Input
                  id="locacaoEquipamento"
                  type="number"
                  value={formData.locacaoEquipamento}
                  onChange={(e) => handleChange("locacaoEquipamento", e.target.value)}
                  placeholder="Valor da locação de equipamento"
                />
              </div>
              <div>
                <Label htmlFor="locacaoVeiculo">Locação de Veículo (R$)</Label>
                <Input
                  id="locacaoVeiculo"
                  type="number"
                  value={formData.locacaoVeiculo}
                  onChange={(e) => handleChange("locacaoVeiculo", e.target.value)}
                  placeholder="Valor da locação de veículo"
                />
              </div>
              <div>
                <Label htmlFor="material">Material (R$)</Label>
                <Input
                  id="material"
                  type="number"
                  value={formData.material}
                  onChange={(e) => handleChange("material", e.target.value)}
                  placeholder="Valor do material"
                />
              </div>
              <div>
                <Label htmlFor="passagem">Passagem (R$)</Label>
                <Input
                  id="passagem"
                  type="number"
                  value={formData.passagem}
                  onChange={(e) => handleChange("passagem", e.target.value)}
                  placeholder="Valor da passagem"
                />
              </div>
              <div>
                <Label htmlFor="extra">Extra (R$)</Label>
                <Input
                  id="extra"
                  type="number"
                  value={formData.extra}
                  onChange={(e) => handleChange("extra", e.target.value)}
                  placeholder="Valor extra"
                />
              </div>
            </div>
          </div>

          {/* Comissão e Lucro */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-6">Comissão e Lucro</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="comissao">Comissão (%)</Label>
                <Input
                  id="comissao"
                  type="number"
                  value={formData.comissao}
                  onChange={(e) => handleChange("comissao", e.target.value)}
                  placeholder="Percentual de comissão"
                />
              </div>
              <div>
                <Label htmlFor="precoVenda">Preço de Venda (R$/m²)</Label>
                <Input
                  id="precoVenda"
                  type="number"
                  value={formData.precoVenda}
                  onChange={(e) => handleChange("precoVenda", e.target.value)}
                  placeholder="Preço de venda por m²"
                />
              </div>
              <div>
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
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={handleSaveRascunho}>
              Salvar Rascunho
            </Button>
            <Button type="submit">
              Processar Simulação
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
