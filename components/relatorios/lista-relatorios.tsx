"use client"

import { useState } from "react"
import { Eye, FileText, Download, Search, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Tipos para os relatórios
interface Relatorio {
  id: string
  nome: string
  tipo: string
  periodo: string
  dataCriacao: string
  obra: string
}

// Dados de exemplo para os relatórios
const relatoriosIniciais: Relatorio[] = [
  {
    id: "1",
    nome: "Relatório Financeiro Q1",
    tipo: "Orçado vs. Realizado",
    periodo: "Jan/2025 - Mar/2025",
    dataCriacao: "15/01/2025",
    obra: "Residencial Vila Nova",
  },
  {
    id: "2",
    nome: "Análise de Lucro Trimestral",
    tipo: "Lucro/Prejuízo",
    periodo: "Jan/2025 - Mar/2025",
    dataCriacao: "20/01/2025",
    obra: "Comercial Centro Empresarial",
  },
  {
    id: "3",
    nome: "Fluxo de Caixa Mensal",
    tipo: "Fluxo de Caixa",
    periodo: "Fev/2025",
    dataCriacao: "05/02/2025",
    obra: "Reforma Apartamento 302",
  },
  {
    id: "4",
    nome: "Desempenho de Equipe",
    tipo: "Desempenho",
    periodo: "Jan/2025 - Fev/2025",
    dataCriacao: "10/02/2025",
    obra: "Condomínio Jardim das Flores",
  },
  {
    id: "5",
    nome: "Relatório de Gastos",
    tipo: "Orçado vs. Realizado",
    periodo: "Mar/2025",
    dataCriacao: "02/03/2025",
    obra: "Residencial Vila Nova",
  },
  {
    id: "6",
    nome: "Análise de Rentabilidade",
    tipo: "Lucro/Prejuízo",
    periodo: "Jan/2025 - Mar/2025",
    dataCriacao: "12/03/2025",
    obra: "Comercial Centro Empresarial",
  },
]

interface ListaRelatoriosProps {
  filtros: {
    tipo: string
    periodo: { de: Date | undefined; ate: Date | undefined }
    obra: string
  }
}

export function ListaRelatorios({ filtros }: ListaRelatoriosProps) {
  const [relatorios] = useState<Relatorio[]>(relatoriosIniciais)
  const [busca, setBusca] = useState("")

  // Função para filtrar os relatórios
  const relatoriosFiltrados = relatorios.filter((relatorio) => {
    // Filtro por busca
    const matchBusca =
      relatorio.nome.toLowerCase().includes(busca.toLowerCase()) ||
      relatorio.tipo.toLowerCase().includes(busca.toLowerCase()) ||
      relatorio.obra.toLowerCase().includes(busca.toLowerCase())

    // Filtro por tipo
    const matchTipo = filtros.tipo === "todos" || relatorio.tipo.toLowerCase().includes(filtros.tipo.replace("-", " "))

    // Filtro por obra
    const matchObra = filtros.obra === "todas" || relatorio.obra.toLowerCase().includes(filtros.obra.replace("-", " "))

    // Retorna apenas os relatórios que correspondem a todos os filtros
    return matchBusca && matchTipo && matchObra
  })

  // Função para visualizar um relatório
  const visualizarRelatorio = (id: string) => {
    console.log(`Visualizando relatório ${id}`)
    // Aqui você pode implementar a navegação para a página de visualização do relatório
  }

  // Função para exportar um relatório
  const exportarRelatorio = (id: string) => {
    console.log(`Exportando relatório ${id}`)
    // Aqui você pode implementar a lógica para exportar o relatório
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold mb-2 md:mb-0">Lista de Relatórios</h2>
        <div className="w-full md:w-64">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar relatórios..."
              className="pl-8"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Relatório</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Obra</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relatoriosFiltrados.length > 0 ? (
              relatoriosFiltrados.map((relatorio) => (
                <TableRow key={relatorio.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-[#007EA3]" />
                      {relatorio.nome}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        relatorio.tipo === "Orçado vs. Realizado"
                          ? "default"
                          : relatorio.tipo === "Lucro/Prejuízo"
                            ? "secondary"
                            : relatorio.tipo === "Fluxo de Caixa"
                              ? "outline"
                              : "destructive"
                      }
                      className={
                        relatorio.tipo === "Orçado vs. Realizado"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          : relatorio.tipo === "Lucro/Prejuízo"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : relatorio.tipo === "Fluxo de Caixa"
                              ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                              : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                      }
                    >
                      {relatorio.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>{relatorio.periodo}</TableCell>
                  <TableCell>{relatorio.obra}</TableCell>
                  <TableCell>{relatorio.dataCriacao}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => visualizarRelatorio(relatorio.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => exportarRelatorio(relatorio.id)}>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Nenhum relatório encontrado com os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
