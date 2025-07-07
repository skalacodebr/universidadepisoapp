"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit2, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Planejamento {
  id: number
  nome: string
  periodo: string
  receitaPlanejada: number
  despesaPlanejada: number
  margemLucro: number
}

interface ListaPlanejamentosProps {
  planejamentos: Planejamento[]
  onVerDetalhes: (id: number) => void
}

export default function ListaPlanejamentos({ planejamentos, onVerDetalhes }: ListaPlanejamentosProps) {
  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const handleExcluirPlanejamento = (id: number) => {
    // Aqui você implementaria a lógica para excluir o planejamento
    console.log(`Excluir planejamento ${id}`)
  }

  return (
    <Card className="shadow-sm border-0 mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-lg font-medium">Lista de Planejamentos</h3>

          <div className="w-full sm:w-auto">
            <Select defaultValue="todos">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os períodos</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Receita Planejada</TableHead>
                <TableHead>Despesa Planejada</TableHead>
                <TableHead>Margem de Lucro</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planejamentos.map((planejamento) => (
                <TableRow key={planejamento.id}>
                  <TableCell className="font-medium">{planejamento.nome}</TableCell>
                  <TableCell>{planejamento.periodo}</TableCell>
                  <TableCell className="text-green-600">{formatarValor(planejamento.receitaPlanejada)}</TableCell>
                  <TableCell className="text-red-600">{formatarValor(planejamento.despesaPlanejada)}</TableCell>
                  <TableCell>{planejamento.margemLucro.toFixed(1)}%</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer" onClick={() => onVerDetalhes(planejamento.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleExcluirPlanejamento(planejamento.id)}
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
        </div>
      </CardContent>
    </Card>
  )
}
