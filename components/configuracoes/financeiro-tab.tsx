"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, DollarSign, Package, Percent, Truck, Users } from "lucide-react"

interface CategoriaFinanceira {
  id: number
  nome: string
  ativo: boolean
}

interface FinanceiroTabProps {
  regimeTributario: string
  setRegimeTributario: (value: string) => void
  lucroMinimo: string
  setLucroMinimo: (value: string) => void
  alertaLucro: string
  setAlertaLucro: (value: string) => void
  novaCategoriaFinanceira: string
  setNovaCategoriaFinanceira: (value: string) => void
  categoriasFinanceiras: CategoriaFinanceira[]
  setCategoriasFinanceiras: (categorias: CategoriaFinanceira[]) => void
  adicionarCategoriaFinanceira: () => void
  salvarConfiguracoesFinanceiro: () => void
}

export function FinanceiroTab({
  regimeTributario,
  setRegimeTributario,
  lucroMinimo,
  setLucroMinimo,
  alertaLucro,
  setAlertaLucro,
  novaCategoriaFinanceira,
  setNovaCategoriaFinanceira,
  categoriasFinanceiras,
  setCategoriasFinanceiras,
  adicionarCategoriaFinanceira,
  salvarConfiguracoesFinanceiro,
}: FinanceiroTabProps) {
  // Função para renderizar o ícone correto para cada categoria financeira
  const renderIconeCategoria = (nome: string) => {
    switch (nome) {
      case "Equipamentos":
        return <Package className="h-4 w-4 text-[#007EA3] mr-2" />
      case "Insumos":
        return <Truck className="h-4 w-4 text-[#007EA3] mr-2" />
      case "Mão de Obra":
        return <Users className="h-4 w-4 text-[#007EA3] mr-2" />
      default:
        return <DollarSign className="h-4 w-4 text-[#007EA3] mr-2" />
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Impostos */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Impostos</CardTitle>
            <CardDescription className="text-base">Configure regimes tributários e taxas aplicáveis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="regime-tributario">Regime Tributário Padrão</Label>
                <Select value={regimeTributario} onValueChange={setRegimeTributario}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o regime tributário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simples">Simples Nacional</SelectItem>
                    <SelectItem value="lucro-presumido">Lucro Presumido</SelectItem>
                    <SelectItem value="lucro-real">Lucro Real</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Taxas de Imposto Aplicáveis</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ICMS</span>
                    <Input type="number" defaultValue="18" className="w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ISS</span>
                    <Input type="number" defaultValue="5" className="w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">PIS</span>
                    <Input type="number" defaultValue="0.65" className="w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">COFINS</span>
                    <Input type="number" defaultValue="3" className="w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">IRPJ</span>
                    <Input type="number" defaultValue="15" className="w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CSLL</span>
                    <Input type="number" defaultValue="9" className="w-20" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parâmetros de Lucro e Categorização de Custos */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Parâmetros de lucro</CardTitle>
              <CardDescription className="text-base">Configure parâmetros de lucro e alertas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="lucro-minimo">Lucro Mínimo Sugerido (%)</Label>
                  <div className="flex items-center">
                    <Input
                      id="lucro-minimo"
                      type="number"
                      value={lucroMinimo}
                      onChange={(e) => setLucroMinimo(e.target.value)}
                      className="mr-2"
                    />
                    <Percent className="h-4 w-4 text-gray-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alerta-lucro">Alerta para Lucro Abaixo de (%)</Label>
                  <div className="flex items-center">
                    <Input
                      id="alerta-lucro"
                      type="number"
                      value={alertaLucro}
                      onChange={(e) => setAlertaLucro(e.target.value)}
                      className="mr-2"
                    />
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Categorização de Custos</CardTitle>
              <CardDescription className="text-base">Personalize categorias de custos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Nova categoria de custo"
                    value={novaCategoriaFinanceira}
                    onChange={(e) => setNovaCategoriaFinanceira(e.target.value)}
                  />
                  <Button className="bg-[#007EA3] hover:bg-[#006a8a]" onClick={adicionarCategoriaFinanceira}>
                    Adicionar
                  </Button>
                </div>

                <div className="space-y-2">
                  {categoriasFinanceiras.map((categoria) => (
                    <div key={categoria.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        {renderIconeCategoria(categoria.nome)}
                        <span className="text-sm">{categoria.nome}</span>
                      </div>
                      <Switch
                        checked={categoria.ativo}
                        onCheckedChange={() => {
                          setCategoriasFinanceiras(
                            categoriasFinanceiras.map((cat) =>
                              cat.id === categoria.id ? { ...cat, ativo: !cat.ativo } : cat,
                            ),
                          )
                        }}
                        className="data-[state=checked]:bg-[#007EA3] h-5 scale-75 [&>span]:h-3 [&>span]:w-3 [&>span[data-state=checked]]:translate-x-[170%]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={salvarConfiguracoesFinanceiro} className="bg-[#007EA3] hover:bg-[#006a8a]">
          Salvar alterações
        </Button>
      </div>
    </>
  )
}
