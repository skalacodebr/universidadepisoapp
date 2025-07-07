"use client"

import type React from "react"

// app/financeiro/fluxo-caixa/lista-movimentacoes.tsx

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Movimentacao } from "@/types/movimentacao"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"

interface ListaMovimentacoesProps {
  movimentacoes: Movimentacao[]
  onEdit: (id: string) => void
  onExcluirMovimentacao: (id: string) => void
}

const ListaMovimentacoes: React.FC<ListaMovimentacoesProps> = ({ movimentacoes, onEdit, onExcluirMovimentacao }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead className="text-center">Tipo</TableHead>
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movimentacoes.map((movimentacao) => (
          <TableRow key={movimentacao.id}>
            <TableCell>{movimentacao.data}</TableCell>
            <TableCell>{movimentacao.descricao}</TableCell>
            <TableCell>{movimentacao.valor}</TableCell>
            <TableCell>{movimentacao.categoria}</TableCell>
            <TableCell className="text-center">{movimentacao.tipo}</TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(movimentacao.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer"
                      onClick={() => onExcluirMovimentacao(movimentacao.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ListaMovimentacoes
