"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Settings, Users, PenToolIcon as Tool, Truck } from "lucide-react"

export function ConfiguracoesSimulacao() {
  const [activeTab, setActiveTab] = useState("parametros")

  const handleSalvar = () => {
    alert("Configurações salvas com sucesso!")
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4">
          <TabsTrigger value="parametros" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Parâmetros Gerais
          </TabsTrigger>
          <TabsTrigger value="equipes" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Equipes
          </TabsTrigger>
          <TabsTrigger value="equipamentos" className="flex items-center gap-2">
            <Tool className="h-4 w-4" />
            Equipamentos
          </TabsTrigger>
          <TabsTrigger value="insumos" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Insumos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="parametros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros Gerais</CardTitle>
              <CardDescription>Configure os parâmetros gerais utilizados nas simulações de preço.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="margemLucro">Margem de Lucro Padrão (%)</Label>
                  <Input id="margemLucro" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comissao">Comissão Padrão (%)</Label>
                  <Input id="comissao" type="number" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custoFixo">Custo Fixo Padrão (R$)</Label>
                  <Input id="custoFixo" type="number" defaultValue="1000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impostos">Impostos (%)</Label>
                  <Input id="impostos" type="number" defaultValue="15" />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="modelos">Modelos de Trabalho</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Modelo Básico</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">Equipe reduzida, prazo estendido</p>
                      <div className="mt-2 text-sm">
                        <div className="flex justify-between">
                          <span>Equipe:</span>
                          <span>2-3 pessoas</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Custo:</span>
                          <span>Baixo</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Modelo Padrão</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">Equipe média, prazo normal</p>
                      <div className="mt-2 text-sm">
                        <div className="flex justify-between">
                          <span>Equipe:</span>
                          <span>4-5 pessoas</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Custo:</span>
                          <span>Médio</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Modelo Premium</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">Equipe completa, prazo reduzido</p>
                      <div className="mt-2 text-sm">
                        <div className="flex justify-between">
                          <span>Equipe:</span>
                          <span>6+ pessoas</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Custo:</span>
                          <span>Alto</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Equipes</CardTitle>
              <CardDescription>Configure os custos e composições das equipes de trabalho.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-md font-medium">Equipe de Preparação</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prepEquipe2">2 pessoas (R$/dia)</Label>
                    <Input id="prepEquipe2" type="number" defaultValue="600" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prepEquipe3">3 pessoas (R$/dia)</Label>
                    <Input id="prepEquipe3" type="number" defaultValue="900" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prepEquipe4">4 pessoas (R$/dia)</Label>
                    <Input id="prepEquipe4" type="number" defaultValue="1200" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <h3 className="text-md font-medium">Equipe de Concretagem</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="concEquipe3">3 pessoas (R$/dia)</Label>
                    <Input id="concEquipe3" type="number" defaultValue="900" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="concEquipe4">4 pessoas (R$/dia)</Label>
                    <Input id="concEquipe4" type="number" defaultValue="1200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="concEquipe5">5 pessoas (R$/dia)</Label>
                    <Input id="concEquipe5" type="number" defaultValue="1500" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <h3 className="text-md font-medium">Equipe de Acabamento</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="acabEquipe4">4 pessoas (R$/dia)</Label>
                    <Input id="acabEquipe4" type="number" defaultValue="1200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="acabEquipe5">5 pessoas (R$/dia)</Label>
                    <Input id="acabEquipe5" type="number" defaultValue="1500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="acabEquipe6">6 pessoas (R$/dia)</Label>
                    <Input id="acabEquipe6" type="number" defaultValue="1800" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipamentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Equipamentos</CardTitle>
              <CardDescription>Configure os custos e durabilidade dos equipamentos utilizados.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* O custo por dia pode ser calculado automaticamente (Custo ÷ Durabilidade), mas também pode ser editado manualmente */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-4 grid grid-cols-4 gap-4 bg-gray-50 p-2 rounded-md">
                    <div className="font-medium">Equipamento</div>
                    <div className="font-medium">Custo (R$)</div>
                    <div className="font-medium">Durabilidade (dias)</div>
                    <div className="font-medium">Custo por Dia (R$)</div>
                  </div>

                  <div>Régua Vibratória</div>
                  <div>
                    <Input type="number" defaultValue="5000" />
                  </div>
                  <div>
                    <Input type="number" defaultValue="500" />
                  </div>
                  <div>
                    <Input type="number" defaultValue="10" />
                  </div>

                  <div>Acabadora de Superfície</div>
                  <div>
                    <Input type="number" defaultValue="3500" />
                  </div>
                  <div>
                    <Input type="number" defaultValue="400" />
                  </div>
                  <div>
                    <Input type="number" defaultValue="8.75" />
                  </div>

                  <div>Cortadora de Piso</div>
                  <div>
                    <Input type="number" defaultValue="2800" />
                  </div>
                  <div>
                    <Input type="number" defaultValue="350" />
                  </div>
                  <div>
                    <Input type="number" defaultValue="8" />
                  </div>

                  <div>Desempenadeira Mecânica</div>
                  <div>
                    <Input type="number" defaultValue="4200" />
                  </div>
                  <div>
                    <Input type="number" defaultValue="450" />
                  </div>
                  <div>
                    <Input type="number" defaultValue="9.33" />
                  </div>

                  <div>Bomba de Concreto</div>
                  <div>
                    <Input type="number" defaultValue="15000" />
                  </div>
                  <div>
                    <Input type="number" defaultValue="1000" />
                  </div>
                  <div>
                    <Input type="number" defaultValue="15" />
                  </div>

                  <div>Betoneira</div>
                  <div>
                    <Input type="number" defaultValue="3000" />
                  </div>
                  <div>
                    <Input type="number" defaultValue="800" />
                  </div>
                  <div>
                    <Input type="number" defaultValue="3.75" />
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    Adicionar Equipamento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insumos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Insumos</CardTitle>
              <CardDescription>Configure os custos dos insumos utilizados nas obras.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 bg-gray-50 p-2 rounded-md">
                  <div className="font-medium">Insumo</div>
                  <div className="font-medium">Unidade</div>
                  <div className="font-medium">Custo (R$)</div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>Cimento</div>
                  <div>Saco 50kg</div>
                  <div>
                    <Input type="number" defaultValue="35" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>Areia</div>
                  <div>m³</div>
                  <div>
                    <Input type="number" defaultValue="120" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>Brita</div>
                  <div>m³</div>
                  <div>
                    <Input type="number" defaultValue="110" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>Aditivo</div>
                  <div>Litro</div>
                  <div>
                    <Input type="number" defaultValue="25" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>Fibra</div>
                  <div>kg</div>
                  <div>
                    <Input type="number" defaultValue="18" />
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    Adicionar Insumo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSalvar}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}
