"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Save } from "lucide-react"
import Link from "next/link"

export default function ConfiguracoesSimulacao() {
  const [activeTab, setActiveTab] = useState("equipamentos")
  const [equipamentos, setEquipamentos] = useState([
    { id: 1, nome: "Régua Vibratória", custo: 5000, durabilidade: 500, custoDia: 10 },
    { id: 2, nome: "Acabadora de Superfície", custo: 3500, durabilidade: 400, custoDia: 8.75 },
    { id: 3, nome: "Alisador de Piso", custo: 2800, durabilidade: 350, custoDia: 8 },
    { id: 4, nome: "Cortadora de Piso", custo: 4200, durabilidade: 420, custoDia: 10 },
  ])

  const adicionarEquipamento = () => {
    const novoId = equipamentos.length > 0 ? Math.max(...equipamentos.map((e) => e.id)) + 1 : 1
    setEquipamentos([...equipamentos, { id: novoId, nome: "Novo Equipamento", custo: 0, durabilidade: 0, custoDia: 0 }])
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/simulacao">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Configurações do Sistema</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
          <TabsTrigger value="equipes">Equipes</TabsTrigger>
          <TabsTrigger value="parametros">Parâmetros Gerais</TabsTrigger>
        </TabsList>

        <TabsContent value="equipamentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Equipamentos</CardTitle>
              <CardDescription>Gerencie os equipamentos utilizados nas simulações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 bg-gray-50 p-2 rounded-md">
                  <div className="font-medium">Equipamento</div>
                  <div className="font-medium">Custo (R$)</div>
                  <div className="font-medium">Durabilidade (dias)</div>
                  <div className="font-medium">Custo por Dia (R$)</div>
                </div>
                <div className="space-y-4">
                  {equipamentos.map((equipamento) => (
                    <div key={equipamento.id} className="grid grid-cols-4 gap-4 items-center">
                      <div>
                        <Input
                          type="text"
                          value={equipamento.nome}
                          onChange={(e) => {
                            const novosEquipamentos = equipamentos.map((eq) =>
                              eq.id === equipamento.id ? { ...eq, nome: e.target.value } : eq,
                            )
                            setEquipamentos(novosEquipamentos)
                          }}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          value={equipamento.custo}
                          onChange={(e) => {
                            const novosEquipamentos = equipamentos.map((eq) =>
                              eq.id === equipamento.id ? { ...eq, custo: Number(e.target.value) } : eq,
                            )
                            setEquipamentos(novosEquipamentos)
                          }}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          value={equipamento.durabilidade}
                          onChange={(e) => {
                            const novosEquipamentos = equipamentos.map((eq) =>
                              eq.id === equipamento.id ? { ...eq, durabilidade: Number(e.target.value) } : eq,
                            )
                            setEquipamentos(novosEquipamentos)
                          }}
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          value={equipamento.custoDia}
                          onChange={(e) => {
                            const novosEquipamentos = equipamentos.map((eq) =>
                              eq.id === equipamento.id ? { ...eq, custoDia: Number(e.target.value) } : eq,
                            )
                            setEquipamentos(novosEquipamentos)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button className="w-[60%]" onClick={adicionarEquipamento}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Equipamento
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#007EA3]">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Equipes</CardTitle>
              <CardDescription>Defina os modelos de equipes disponíveis para simulação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border p-4 rounded-md space-y-4">
                  <h3 className="font-medium">Equipe de Concretagem</h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="equipePadrao">Equipe Padrão</Label>
                        <Input id="equipePadrao" defaultValue="4" type="number" />
                        <p className="text-xs text-muted-foreground">Número de pessoas</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="equipeReduzida">Equipe Reduzida</Label>
                        <Input id="equipeReduzida" defaultValue="2" type="number" />
                        <p className="text-xs text-muted-foreground">Número de pessoas</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="equipeAmpliada">Equipe Ampliada</Label>
                        <Input id="equipeAmpliada" defaultValue="6" type="number" />
                        <p className="text-xs text-muted-foreground">Número de pessoas</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custoDiarioConcretagem">Custo Diário por Pessoa (R$)</Label>
                      <Input id="custoDiarioConcretagem" defaultValue="250" type="number" />
                    </div>
                  </div>
                </div>

                <div className="border p-4 rounded-md space-y-4">
                  <h3 className="font-medium">Equipe de Acabamento</h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="equipePadraoAcab">Equipe Padrão</Label>
                        <Input id="equipePadraoAcab" defaultValue="4" type="number" />
                        <p className="text-xs text-muted-foreground">Número de pessoas</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="equipeReduzidaAcab">Equipe Reduzida</Label>
                        <Input id="equipeReduzidaAcab" defaultValue="2" type="number" />
                        <p className="text-xs text-muted-foreground">Número de pessoas</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="equipeAmpliadaAcab">Equipe Ampliada</Label>
                        <Input id="equipeAmpliadaAcab" defaultValue="6" type="number" />
                        <p className="text-xs text-muted-foreground">Número de pessoas</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="custoDiarioAcabamento">Custo Diário por Pessoa (R$)</Label>
                      <Input id="custoDiarioAcabamento" defaultValue="280" type="number" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#007EA3]">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parametros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros Gerais</CardTitle>
              <CardDescription>Configure os parâmetros gerais utilizados nas simulações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border p-4 rounded-md space-y-4">
                  <h3 className="font-medium">Parâmetros Financeiros</h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="margemLucroMinima">Margem de Lucro Mínima (%)</Label>
                        <Input id="margemLucroMinima" defaultValue="15" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="margemLucroRecomendada">Margem de Lucro Recomendada (%)</Label>
                        <Input id="margemLucroRecomendada" defaultValue="25" type="number" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="comissaoPadrao">Comissão Padrão (%)</Label>
                        <Input id="comissaoPadrao" defaultValue="5" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="impostosPadrao">Impostos Padrão (%)</Label>
                        <Input id="impostosPadrao" defaultValue="12.5" type="number" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border p-4 rounded-md space-y-4">
                  <h3 className="font-medium">Parâmetros Operacionais</h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="distanciaMaxima">Distância Máxima Recomendada (km)</Label>
                        <Input id="distanciaMaxima" defaultValue="100" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="custoKm">Custo por Km (R$)</Label>
                        <Input id="custoKm" defaultValue="2.50" type="number" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#007EA3]">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
