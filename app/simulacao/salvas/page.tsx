"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableCellActions, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Copy, Eye, MoreHorizontal, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/popover"

export default function SimulacoesSalvas() {
  const router = useRouter()
  const [filtro, setFiltro] = useState("")
  const [periodo, setPeriodo] = useState("todos")
  const [obra, setObra] = useState("todas")

  // Dados simulados para demonstração
  const simulacoes = [
    {
      id: "1",
      nome: "Residencial Parque das Flores",
      data: "15/04/2023",
      status: "Finalizada",
      obra: "Residencial",
      valor: 38250.0,
    },
    {
      id: "2",
      nome: "Edifício Comercial Centro",
      data: "28/05/2023",
      status: "Rascunho",
      obra: "Comercial",
      valor: 52800.0,
    },
    {
      id: "3",
      nome: "Condomínio Vista Mar",
      data: "10/06/2023",
      status: "Finalizada",
      obra: "Residencial",
      valor: 67500.0,
    },
    {
      id: "4",
      nome: "Galpão Industrial",
      data: "22/06/2023",
      status: "Finalizada",
      obra: "Industrial",
      valor: 98750.0,
    },
    {
      id: "5",
      nome: "Escola Municipal",
      data: "05/07/2023",
      status: "Rascunho",
      obra: "Institucional",
      valor: 45200.0,
    },
  ]

  // Filtragem das simulações
  const simulacoesFiltradas = simulacoes.filter((simulacao) => {
    const matchFiltro = simulacao.nome.toLowerCase().includes(filtro.toLowerCase())
    const matchPeriodo =
      periodo === "todos"
        ? true
        : periodo === "ultimos30"
          ? new Date(simulacao.data) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          : periodo === "ultimos90"
            ? new Date(simulacao.data) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
            : true
    const matchObra = obra === "todas" ? true : simulacao.obra === obra

    return matchFiltro && matchPeriodo && matchObra
  })

  const handleExcluir = (id) => {
    // Implementar lógica para excluir simulação
    console.log(`Excluir simulação ${id}`)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/simulacao">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Simulações Salvas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre suas simulações por diferentes critérios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nome..."
                  className="pl-8"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  <SelectItem value="ultimos30">Últimos 30 dias</SelectItem>
                  <SelectItem value="ultimos90">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={obra} onValueChange={setObra}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as obras</SelectItem>
                  <SelectItem value="Residencial">Residencial</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Institucional">Institucional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Simulações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Obra</TableHead>
                <TableHead>Data da Simulação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {simulacoesFiltradas.map((simulacao) => (
                <TableRow key={simulacao.id}>
                  <TableCell>{simulacao.nome}</TableCell>
                  <TableCell>{simulacao.data}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        simulacao.status === "Finalizada"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {simulacao.status}
                    </span>
                  </TableCell>
                  <TableCell>{simulacao.obra}</TableCell>
                  <TableCell className="text-right">
                    {simulacao.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </TableCell>
                  <TableCellActions
                    items={
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/simulacao/resultados/${simulacao.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExcluir(simulacao.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    }
                  />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
