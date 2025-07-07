"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, FileText, Edit } from "lucide-react"

interface Categoria {
  nome: string
  valorPlanejado: number
  valorRealizado: number
}

interface Planejamento {
  id: number
  nome: string
  periodo: string
  receitaPlanejada: number
  despesaPlanejada: number
  margemLucro: number
  categorias: Categoria[]
}

interface DetalhesPlanejamentoProps {
  planejamento: Planejamento
  onVoltar: () => void
}

export default function DetalhesPlanejamento({ planejamento, onVoltar }: DetalhesPlanejamentoProps) {
  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  const calcularDiferenca = (planejado: number, realizado: number) => {
    const diferenca = realizado - planejado
    const percentual = (diferenca / planejado) * 100

    return {
      valor: diferenca,
      percentual: percentual,
      positiva: diferenca >= 0,
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onVoltar} className="h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-semibold">{planejamento.nome}</h2>
      </div>

      <Card className="shadow-sm border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="space-y-1 mb-4 md:mb-0">
              <h3 className="text-lg font-medium">Resumo</h3>
              <p className="text-gray-500">Período: {planejamento.periodo}</p>
            </div>

            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-sm text-gray-500">Receita Total</p>
                <p className="text-xl font-semibold text-green-600">{formatarValor(planejamento.receitaPlanejada)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Despesa Total</p>
                <p className="text-xl font-semibold text-red-600">{formatarValor(planejamento.despesaPlanejada)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Margem de Lucro</p>
                <p className="text-xl font-semibold text-blue-600">{planejamento.margemLucro.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-4">Tabela de Categorias</h3>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor Planejado</TableHead>
                  <TableHead>Valor Realizado</TableHead>
                  <TableHead>Diferença</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {planejamento.categorias.map((categoria, index) => {
                  const diferenca = calcularDiferenca(categoria.valorPlanejado, categoria.valorRealizado)

                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{categoria.nome}</TableCell>
                      <TableCell>{formatarValor(categoria.valorPlanejado)}</TableCell>
                      <TableCell>{formatarValor(categoria.valorRealizado)}</TableCell>
                      <TableCell className={diferenca.positiva ? "text-green-600" : "text-red-600"}>
                        {formatarValor(diferenca.valor)} ({diferenca.percentual.toFixed(1)}%)
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Exportar para PDF
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
