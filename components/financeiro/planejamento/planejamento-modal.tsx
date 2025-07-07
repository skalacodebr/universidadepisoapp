"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, HelpCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface PlanejamentoModalProps {
  isOpen: boolean
  onClose: () => void
  planejamentoParaEditar?: {
    id: number
    nome: string
    periodo: string
    receitaPlanejada: number
    despesaPlanejada: number
  }
}

interface Categoria {
  id: string
  nome: string
  valor: string
  tipo: "receita" | "despesa"
}

export default function PlanejamentoModal({ isOpen, onClose, planejamentoParaEditar }: PlanejamentoModalProps) {
  const [nome, setNome] = useState(planejamentoParaEditar?.nome || "")
  const [periodo, setPeriodo] = useState(planejamentoParaEditar?.periodo || "")
  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: "1", nome: "", valor: "", tipo: "receita" },
    { id: "2", nome: "", valor: "", tipo: "despesa" },
  ])

  const [totalReceitas, setTotalReceitas] = useState(0)
  const [totalDespesas, setTotalDespesas] = useState(0)

  useEffect(() => {
    // Calcular totais quando as categorias mudarem
    const receitaTotal = categorias
      .filter((cat) => cat.tipo === "receita")
      .reduce((sum, cat) => sum + (Number.parseFloat(cat.valor) || 0), 0)

    const despesaTotal = categorias
      .filter((cat) => cat.tipo === "despesa")
      .reduce((sum, cat) => sum + (Number.parseFloat(cat.valor) || 0), 0)

    setTotalReceitas(receitaTotal)
    setTotalDespesas(despesaTotal)
  }, [categorias])

  const handleAddCategoria = (tipo: "receita" | "despesa") => {
    setCategorias([...categorias, { id: Date.now().toString(), nome: "", valor: "", tipo }])
  }

  const handleRemoveCategoria = (id: string) => {
    setCategorias(categorias.filter((cat) => cat.id !== id))
  }

  const handleCategoriaChange = (id: string, field: "nome" | "valor", value: string) => {
    setCategorias(categorias.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Aqui você implementaria a lógica para salvar o planejamento
    console.log({
      nome,
      periodo,
      receitaPlanejada: totalReceitas,
      despesaPlanejada: totalDespesas,
      categorias,
    })

    // Fechar o modal e resetar o formulário
    onClose()
    if (!planejamentoParaEditar) {
      setNome("")
      setPeriodo("")
      setCategorias([
        { id: "1", nome: "", valor: "", tipo: "receita" },
        { id: "2", nome: "", valor: "", tipo: "despesa" },
      ])
    }
  }

  const saldo = totalReceitas - totalDespesas

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {planejamentoParaEditar ? "Editar Planejamento" : "Criar Planejamento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Informações Básicas */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-base">
                    Nome do Planejamento
                  </Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Planejamento Q1 2023"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periodo" className="text-base">
                    Período
                  </Label>
                  <Select value={periodo} onValueChange={setPeriodo} required>
                    <SelectTrigger id="periodo" className="text-base">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1trim2023">1º Trimestre 2023</SelectItem>
                      <SelectItem value="2trim2023">2º Trimestre 2023</SelectItem>
                      <SelectItem value="3trim2023">3º Trimestre 2023</SelectItem>
                      <SelectItem value="4trim2023">4º Trimestre 2023</SelectItem>
                      <SelectItem value="anual2023">Anual 2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Resumo Financeiro</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-md border border-gray-200">
                  <p className="text-sm text-gray-500">Receitas</p>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(totalReceitas)}</p>
                </div>
                <div className="bg-white p-3 rounded-md border border-gray-200">
                  <p className="text-sm text-gray-500">Despesas</p>
                  <p className="text-lg font-semibold text-red-600">{formatCurrency(totalDespesas)}</p>
                </div>
                <div className="bg-white p-3 rounded-md border border-gray-200">
                  <p className="text-sm text-gray-500">Saldo</p>
                  <p className={`text-lg font-semibold ${saldo >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(saldo)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Receitas Planejadas */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">Receitas Planejadas</h3>
                    <div
                      className="ml-2 text-gray-400 cursor-help"
                      title="Adicione todas as fontes de receita previstas para o período"
                    >
                      <HelpCircle size={16} />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddCategoria("receita")}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Categoria
                  </Button>
                </div>

                {categorias.filter((cat) => cat.tipo === "receita").length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                    Nenhuma categoria de receita adicionada
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categorias
                      .filter((cat) => cat.tipo === "receita")
                      .map((categoria) => (
                        <div key={categoria.id} className="flex items-end gap-3 bg-gray-50 p-3 rounded-md">
                          <div className="flex-1 space-y-2">
                            <Label htmlFor={`receita-nome-${categoria.id}`} className="text-sm">
                              Categoria
                            </Label>
                            <Input
                              id={`receita-nome-${categoria.id}`}
                              placeholder="Ex: Vendas, Serviços"
                              value={categoria.nome}
                              onChange={(e) => handleCategoriaChange(categoria.id, "nome", e.target.value)}
                              required
                            />
                          </div>
                          <div className="w-1/3 space-y-2">
                            <Label htmlFor={`receita-valor-${categoria.id}`} className="text-sm">
                              Valor (R$)
                            </Label>
                            <Input
                              id={`receita-valor-${categoria.id}`}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0,00"
                              value={categoria.valor}
                              onChange={(e) => handleCategoriaChange(categoria.id, "valor", e.target.value)}
                              required
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCategoria(categoria.id)}
                            className="mb-0.5"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Despesas Planejadas */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">Despesas Planejadas</h3>
                    <div
                      className="ml-2 text-gray-400 cursor-help"
                      title="Adicione todas as categorias de despesa previstas para o período"
                    >
                      <HelpCircle size={16} />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddCategoria("despesa")}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Categoria
                  </Button>
                </div>

                {categorias.filter((cat) => cat.tipo === "despesa").length === 0 ? (
                  <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                    Nenhuma categoria de despesa adicionada
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categorias
                      .filter((cat) => cat.tipo === "despesa")
                      .map((categoria) => (
                        <div key={categoria.id} className="flex items-end gap-3 bg-gray-50 p-3 rounded-md">
                          <div className="flex-1 space-y-2">
                            <Label htmlFor={`despesa-nome-${categoria.id}`} className="text-sm">
                              Categoria
                            </Label>
                            <Input
                              id={`despesa-nome-${categoria.id}`}
                              placeholder="Ex: Materiais, Mão de obra"
                              value={categoria.nome}
                              onChange={(e) => handleCategoriaChange(categoria.id, "nome", e.target.value)}
                              required
                            />
                          </div>
                          <div className="w-1/3 space-y-2">
                            <Label htmlFor={`despesa-valor-${categoria.id}`} className="text-sm">
                              Valor (R$)
                            </Label>
                            <Input
                              id={`despesa-valor-${categoria.id}`}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0,00"
                              value={categoria.valor}
                              onChange={(e) => handleCategoriaChange(categoria.id, "valor", e.target.value)}
                              required
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCategoria(categoria.id)}
                            className="mb-0.5"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#007EA3] hover:bg-[#006d8f]">
              Salvar Planejamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
