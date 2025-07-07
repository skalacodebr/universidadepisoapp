"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Building, Factory, Home, Store } from "lucide-react"

interface Categoria {
  id: number
  nome: string
  ativo: boolean
}

interface ObrasTabProps {
  novaCategoria: string
  setNovaCategoria: (value: string) => void
  categorias: Categoria[]
  toggleCategoriaAtiva: (id: number) => void
  adicionarCategoria: () => void
  salvarConfiguracoesObras: () => void
}

export function ObrasTab({
  novaCategoria,
  setNovaCategoria,
  categorias,
  toggleCategoriaAtiva,
  adicionarCategoria,
  salvarConfiguracoesObras,
}: ObrasTabProps) {
  // Função para renderizar o ícone correto para cada categoria
  const renderIconeCategoria = (nome: string) => {
    switch (nome) {
      case "Residenciais":
        return <Home className="h-5 w-5 text-[#007EA3]" />
      case "Comerciais":
        return <Store className="h-5 w-5 text-[#007EA3]" />
      case "Industriais":
        return <Factory className="h-5 w-5 text-[#007EA3]" />
      default:
        return <Building className="h-5 w-5 text-[#007EA3]" />
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipos de Obras */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Tipos de obras</CardTitle>
            <CardDescription className="text-base">Crie e gerencie categorias de obras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Nova categoria de obra"
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                />
                <Button onClick={adicionarCategoria} className="bg-[#007EA3] hover:bg-[#006a8a]">
                  Adicionar
                </Button>
              </div>

              <div className="space-y-2">
                {categorias.map((categoria) => (
                  <div key={categoria.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      {renderIconeCategoria(categoria.nome)}
                      <span className="text-sm font-medium">{categoria.nome}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={categoria.ativo ? "default" : "outline"}
                        className={categoria.ativo ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                      >
                        {categoria.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                      <Switch
                        checked={categoria.ativo}
                        onCheckedChange={() => toggleCategoriaAtiva(categoria.id)}
                        className="data-[state=checked]:bg-[#007EA3] h-5 scale-75 [&>span]:h-3 [&>span]:w-3 [&>span[data-state=checked]]:translate-x-[170%]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parâmetros Padrão */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Parâmetros padrão</CardTitle>
            <CardDescription className="text-base">Configure os parâmetros padrão para simulações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area-minima">Área Mínima (m²)</Label>
                  <Input id="area-minima" type="number" defaultValue="50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area-maxima">Área Máxima (m²)</Label>
                  <Input id="area-maxima" type="number" defaultValue="10000" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxa-lancamento">Taxa Padrão de Lançamento de Concreto (m³/hora)</Label>
                <Input id="taxa-lancamento" type="number" defaultValue="5" />
              </div>

              <div className="space-y-2">
                <Label>Tipos de Fundação</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                    <Checkbox
                      id="fundacao-solo"
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#007EA3] focus:ring-[#007EA3] data-[state=checked]:bg-[#007EA3] data-[state=checked]:border-[#007EA3] transition-colors"
                      defaultChecked
                    />
                    <Label
                      htmlFor="fundacao-solo"
                      className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#007EA3] transition-colors"
                    >
                      Sobre solo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                    <Checkbox
                      id="fundacao-laje"
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#007EA3] focus:ring-[#007EA3] data-[state=checked]:bg-[#007EA3] data-[state=checked]:border-[#007EA3] transition-colors"
                      defaultChecked
                    />
                    <Label
                      htmlFor="fundacao-laje"
                      className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#007EA3] transition-colors"
                    >
                      Sobre laje
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reforço Estrutural</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                    <Checkbox
                      id="tela-simples"
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#007EA3] focus:ring-[#007EA3] data-[state=checked]:bg-[#007EA3] data-[state=checked]:border-[#007EA3] transition-colors"
                      defaultChecked
                    />
                    <Label
                      htmlFor="tela-simples"
                      className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#007EA3] transition-colors"
                    >
                      Tela simples
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                    <Checkbox
                      id="tela-dupla"
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#007EA3] focus:ring-[#007EA3] data-[state=checked]:bg-[#007EA3] data-[state=checked]:border-[#007EA3] transition-colors"
                      defaultChecked
                    />
                    <Label
                      htmlFor="tela-dupla"
                      className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#007EA3] transition-colors"
                    >
                      Tela Dupla
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                    <Checkbox
                      id="fibra-aco"
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#007EA3] focus:ring-[#007EA3] data-[state=checked]:bg-[#007EA3] data-[state=checked]:border-[#007EA3] transition-colors"
                      defaultChecked
                    />
                    <Label
                      htmlFor="fibra-aco"
                      className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#007EA3] transition-colors"
                    >
                      Fibra de aço
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                    <Checkbox
                      id="macrofibra"
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#007EA3] focus:ring-[#007EA3] data-[state=checked]:bg-[#007EA3] data-[state=checked]:border-[#007EA3] transition-colors"
                      defaultChecked
                    />
                    <Label
                      htmlFor="macrofibra"
                      className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#007EA3] transition-colors"
                    >
                      Macrofibra estrutural
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                    <Checkbox
                      id="protendido"
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#007EA3] focus:ring-[#007EA3] data-[state=checked]:bg-[#007EA3] data-[state=checked]:border-[#007EA3] transition-colors"
                      defaultChecked
                    />
                    <Label
                      htmlFor="protendido"
                      className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#007EA3] transition-colors"
                    >
                      Protendido
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                    <Checkbox
                      id="concreto-simples"
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#007EA3] focus:ring-[#007EA3] data-[state=checked]:bg-[#007EA3] data-[state=checked]:border-[#007EA3] transition-colors"
                      defaultChecked
                    />
                    <Label
                      htmlFor="concreto-simples"
                      className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#007EA3] transition-colors"
                    >
                      Concreto Simples
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipos de Acabamento</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                    <Checkbox
                      id="liso-vitreo"
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#007EA3] focus:ring-[#007EA3] data-[state=checked]:bg-[#007EA3] data-[state=checked]:border-[#007EA3] transition-colors"
                      defaultChecked
                    />
                    <Label
                      htmlFor="liso-vitreo"
                      className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#007EA3] transition-colors"
                    >
                      Liso Vítreo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                    <Checkbox
                      id="camurcado"
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#007EA3] focus:ring-[#007EA3] data-[state=checked]:bg-[#007EA3] data-[state=checked]:border-[#007EA3] transition-colors"
                      defaultChecked
                    />
                    <Label
                      htmlFor="camurcado"
                      className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#007EA3] transition-colors"
                    >
                      Camurçado
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                    <Checkbox
                      id="vassourado"
                      className="h-4 w-4 rounded-sm border-gray-300 text-[#007EA3] focus:ring-[#007EA3] data-[state=checked]:bg-[#007EA3] data-[state=checked]:border-[#007EA3] transition-colors"
                      defaultChecked
                    />
                    <Label
                      htmlFor="vassourado"
                      className="text-sm font-medium text-gray-700 cursor-pointer hover:text-[#007EA3] transition-colors"
                    >
                      Vassourado
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={salvarConfiguracoesObras} className="bg-[#007EA3] hover:bg-[#006a8a]">
          Salvar alterações
        </Button>
      </div>
    </>
  )
}
