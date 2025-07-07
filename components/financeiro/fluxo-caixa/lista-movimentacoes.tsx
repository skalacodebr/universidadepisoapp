"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// Adicionar a importação do ícone Trash2 que está sendo usado no modal
import { Edit2, Trash2, ArrowUp, ArrowDown, MoreHorizontal } from "lucide-react"
import MovimentacaoModal from "./movimentacao-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Movimentacao {
  id: number
  data: string
  tipo: string
  valor: number
  descricao: string
}

interface ListaMovimentacoesProps {
  movimentacoes: Movimentacao[]
  onExcluirMovimentacao?: (id: number) => void
}

export default function ListaMovimentacoes({ movimentacoes, onExcluirMovimentacao }: ListaMovimentacoesProps) {
  const [periodo, setPeriodo] = useState("7dias")
  const [tipo, setTipo] = useState("todas")
  const [movimentacaoParaEditar, setMovimentacaoParaEditar] = useState<Movimentacao | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [movimentacaoParaExcluir, setMovimentacaoParaExcluir] = useState<number | null>(null)

  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return data.toLocaleDateString("pt-BR")
  }

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const handleEditarMovimentacao = (movimentacao: Movimentacao) => {
    setMovimentacaoParaEditar(movimentacao)
    setIsModalOpen(true)
  }

  const handleExcluirMovimentacao = (id: number) => {
    setMovimentacaoParaExcluir(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmarExclusao = () => {
    if (movimentacaoParaExcluir && onExcluirMovimentacao) {
      onExcluirMovimentacao(movimentacaoParaExcluir)
      setIsDeleteDialogOpen(false)
      setMovimentacaoParaExcluir(null)
    }
  }

  return (
    <Card className="shadow-sm border-0 mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-lg font-medium">Lista de Movimentações</h3>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="mesAtual">Mês Atual</SelectItem>
                <SelectItem value="personalizado">Período Personalizado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="entradas">Entradas</SelectItem>
                <SelectItem value="saidas">Saídas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[12%] px-4">Data</TableHead>
                <TableHead className="w-[15%] px-4">Tipo</TableHead>
                <TableHead className="w-[18%] px-4">Valor</TableHead>
                <TableHead className="w-[40%] px-4">Descrição</TableHead>
                <TableHead className="w-[15%] px-4 text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimentacoes.map((movimentacao) => (
                <TableRow key={movimentacao.id}>
                  <TableCell className="px-4">{formatarData(movimentacao.data)}</TableCell>
                  <TableCell className="px-4">
                    <div className="flex items-center">
                      {movimentacao.tipo === "entrada" ? (
                        <ArrowUp className="mr-2 h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="mr-2 h-4 w-4 text-red-500" />
                      )}
                      {movimentacao.tipo === "entrada" ? "Entrada" : "Saída"}
                    </div>
                  </TableCell>
                  <TableCell className={`px-4 ${movimentacao.tipo === "entrada" ? "text-green-600" : "text-red-600"}`}>
                    {formatarValor(movimentacao.valor)}
                  </TableCell>
                  <TableCell className="px-4 truncate">{movimentacao.descricao}</TableCell>
                  <TableCell className="px-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex items-center justify-center">
                          <MoreHorizontal className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="flex items-center cursor-pointer"
                          onClick={() => handleEditarMovimentacao(movimentacao)}
                        >
                          <Edit2 className="mr-2 h-4 w-4 text-blue-500" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center text-red-600 cursor-pointer"
                          onClick={() => handleExcluirMovimentacao(movimentacao.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {isModalOpen && (
        <MovimentacaoModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setMovimentacaoParaEditar(null)
          }}
          movimentacaoParaEditar={movimentacaoParaEditar || undefined}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-semibold text-red-600 flex items-center">
              <Trash2 className="h-5 w-5 mr-2" /> Confirmar exclusão
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Tem certeza que deseja excluir esta movimentação?
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 bg-red-50 border-y border-red-100 my-2">
            <p className="text-sm text-red-800">
              Esta ação não pode ser desfeita. A movimentação será permanentemente removida do sistema.
            </p>
          </div>

          <DialogFooter className="p-6 pt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="px-4 py-2 h-10">
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmarExclusao}
              className="px-4 py-2 h-10 bg-red-600 hover:bg-red-700"
            >
              Sim, excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
