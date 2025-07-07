"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, AlertTriangle, Save } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Obra {
  id: number
  nome: string
  cidade: string
  inicio: string
  termino: string
  construtora: string
  status: string
  // Campos adicionais para endereço completo
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  estado?: string
  // Campos adicionais para informações extras
  area?: string
  observacoes?: string
}

export default function Obras() {
  const router = useRouter()
  const [obras, setObras] = useState<Obra[]>([
    {
      id: 1,
      nome: "Condomínio Residencial Parque das Árvores",
      cidade: "São Paulo",
      inicio: "01/01/24",
      termino: "01/06/24",
      construtora: "Construtora Silva",
      status: "Ativas",
    },
    {
      id: 2,
      nome: "Edifício Comercial Centro Empresarial",
      cidade: "Rio de Janeiro",
      inicio: "15/02/24",
      termino: "15/08/24",
      construtora: "Construtora Oliveira",
      status: "Ativas",
    },
    {
      id: 3,
      nome: "Shopping Center Plaza",
      cidade: "Belo Horizonte",
      inicio: "10/03/24",
      termino: "10/12/24",
      construtora: "Construtora Santos",
      status: "Ativas",
    },
    {
      id: 4,
      nome: "Hospital Regional",
      cidade: "Curitiba",
      inicio: "05/04/24",
      termino: "05/10/25",
      construtora: "Construtora Pereira",
      status: "Ativas",
    },
    {
      id: 5,
      nome: "Escola Municipal",
      cidade: "Porto Alegre",
      inicio: "20/05/24",
      termino: "20/12/24",
      construtora: "Construtora Costa",
      status: "Ativas",
    },
    {
      id: 6,
      nome: "Residencial Jardim das Flores",
      cidade: "Salvador",
      inicio: "15/06/24",
      termino: "15/03/25",
      construtora: "Construtora Almeida",
      status: "Ativas",
    },
  ])
  const [currentPage, setCurrentPage] = useState(1)
  const [editingObra, setEditingObra] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeletingObra, setIsDeletingObra] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const itemsPerPage = 6
  const totalItems = obras.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Vamos atualizar a função renderStatusBadge para garantir que todos os badges tenham o mesmo tamanho e estilo
  // e também ajustar o estilo da tabela para ficar mais parecido com a imagem

  // Modifique a função renderStatusBadge para:
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Orçamento":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 w-full px-4 py-1 flex justify-center">
            Orçamento
          </Badge>
        )
      case "Ativas":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 w-full px-4 py-1 flex justify-center">
            Ativas
          </Badge>
        )
      case "Finalizadas":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 w-full px-4 py-1 flex justify-center">
            Finalizadas
          </Badge>
        )
      case "Paralisadas":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 w-full px-4 py-1 flex justify-center">
            Paralisadas
          </Badge>
        )
      default:
        return <Badge className="w-full px-4 py-1 flex justify-center">{status}</Badge>
    }
  }

  // Função para mudar de página
  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  // Função para gerar os números de página
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Se o total de páginas for menor que o máximo a mostrar, exibe todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Caso contrário, exibe um subconjunto com a página atual no centro
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

      // Ajusta se estiver próximo do início ou fim
      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Adiciona "..." se necessário
      if (startPage > 1) {
        pageNumbers.unshift("ellipsis-start")
        pageNumbers.unshift(1)
      }

      if (endPage < totalPages) {
        pageNumbers.push("ellipsis-end")
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, obras.length)
    return obras.slice(startIndex, endIndex)
  }

  // Calcular o intervalo de itens exibidos
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems)

  // Function to handle editing an obra
  const handleEdit = (obra: Obra) => {
    // Garantir que todos os campos existam, mesmo que vazios
    setEditingObra({
      ...obra,
      cep: obra.cep || "",
      logradouro: obra.logradouro || "",
      numero: obra.numero || "",
      complemento: obra.complemento || "",
      bairro: obra.bairro || "",
      estado: obra.estado || "",
      area: obra.area || "",
      observacoes: obra.observacoes || "",
    })
    setIsEditDialogOpen(true)
  }

  // Function to save edited obra
  const saveEditedObra = () => {
    // Atualiza o estado das obras com as alterações feitas
    const updatedObras = obras.map((obra) => (obra.id === editingObra.id ? editingObra : obra))
    setObras(updatedObras)
    setIsEditDialogOpen(false)
    setEditingObra(null)
  }

  // Function to handle deleting an obra
  const handleDelete = (id: number) => {
    const obraToDelete = obras.find((obra) => obra.id === id)
    setIsDeletingObra(id)
    setEditingObra(obraToDelete) // Armazenar a obra que está sendo excluída para mostrar detalhes no modal
    setIsDeleteDialogOpen(true)
  }

  // Function to confirm deletion
  const confirmDelete = () => {
    setObras(obras.filter((obra) => obra.id !== isDeletingObra))
    setIsDeleteDialogOpen(false)
    setIsDeletingObra(null)
    setEditingObra(null)

    // If we deleted all items on the current page and it's not the first page,
    // go to the previous page
    const remainingItems = obras.filter((obra) => obra.id !== isDeletingObra).length
    const newTotalPages = Math.ceil(remainingItems / itemsPerPage)
    if (currentPage > newTotalPages && currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Obras</h1>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <Select defaultValue="todos">
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="orcamento">Orçamento</SelectItem>
                <SelectItem value="ativas">Ativas</SelectItem>
                <SelectItem value="finalizadas">Finalizadas</SelectItem>
                <SelectItem value="paralisadas">Paralisadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Cidade</p>
            <Select defaultValue="todos">
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="sao-paulo">São Paulo</SelectItem>
                <SelectItem value="rio-de-janeiro">Rio de Janeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Período</p>
            <Select defaultValue="todos">
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="mes-atual">Mês Atual</SelectItem>
                <SelectItem value="ultimo-mes">Último Mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Construtora</p>
            <Select defaultValue="todos">
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="construtora-a">Construtora A</SelectItem>
                <SelectItem value="construtora-b">Construtora B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Card className="border rounded-lg shadow-sm overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                    Nome da Obra
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                    Cidade
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                    Início
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                    Previsão de término
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                    Construtora
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 border-b border-gray-200 w-32">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-700 border-b border-gray-200 w-20">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageItems().map((obra, index) => (
                  <tr key={obra.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                      {obra.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                      {obra.cidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                      {obra.inicio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                      {obra.termino}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">
                      {obra.construtora}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm border-b border-gray-200">
                      <div className="w-28 mx-auto">{renderStatusBadge(obra.status)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/obras/${obra.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(obra)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(obra.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm">
          <div className="text-gray-500 mb-4 sm:mb-0">
            Mostrando {startItem}-{endItem} de {totalItems}
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 mr-2"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-1">
              {getPageNumbers().map((page, index) => {
                if (page === "ellipsis-start" || page === "ellipsis-end") {
                  return (
                    <div key={`ellipsis-${index}`} className="px-2">
                      ...
                    </div>
                  )
                }

                return (
                  <Button
                    key={`page-${page}`}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 p-0 ${currentPage === page ? "bg-[#007EA3] text-white" : "text-gray-700"}`}
                    onClick={() => changePage(page as number)}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 ml-2"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Dialog - Versão melhorada com elementos bem alinhados */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[550px] w-full max-h-[90vh] p-0 overflow-hidden flex flex-col">
          <div className="flex flex-col h-full">
            <DialogHeader className="p-6 border-b text-center">
              <DialogTitle className="text-2xl font-semibold text-gray-800">Editar Informações Gerais</DialogTitle>
              <DialogDescription className="text-gray-500 mt-1">
                Atualize as informações da obra conforme necessário
              </DialogDescription>
            </DialogHeader>

            {editingObra && (
              <div
                className="flex-1 overflow-y-auto p-6 scrollbar-hide"
                style={{
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                  WebkitOverflowScrolling: "touch",
                  maxHeight: "calc(90vh - 180px)", // Altura máxima considerando o header e footer
                }}
              >
                <div className="max-w-[450px] mx-auto">
                  <div className="bg-white rounded-lg">
                    <div className="space-y-6">
                      {/* Informações Básicas */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="text-md font-medium text-gray-700 mb-4">Informações Básicas</h3>
                        <div className="space-y-4">
                          {/* Nome da Obra */}
                          <div>
                            <Label htmlFor="nome" className="text-sm font-medium">
                              Nome da Obra <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="nome"
                              value={editingObra.nome}
                              onChange={(e) => setEditingObra({ ...editingObra, nome: e.target.value })}
                              className="mt-1"
                              placeholder="Digite o nome da obra"
                            />
                          </div>

                          {/* Construtora */}
                          <div>
                            <Label htmlFor="construtora" className="text-sm font-medium">
                              Construtora <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="construtora"
                              value={editingObra.construtora}
                              onChange={(e) => setEditingObra({ ...editingObra, construtora: e.target.value })}
                              className="mt-1"
                              placeholder="Digite o nome da construtora"
                            />
                          </div>

                          {/* Status */}
                          <div>
                            <Label htmlFor="status" className="text-sm font-medium">
                              Status <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={editingObra.status}
                              onValueChange={(value) => setEditingObra({ ...editingObra, status: value })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Orçamento">Orçamento</SelectItem>
                                <SelectItem value="Ativas">Ativas</SelectItem>
                                <SelectItem value="Finalizadas">Finalizadas</SelectItem>
                                <SelectItem value="Paralisadas">Paralisadas</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Endereço Completo */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="text-md font-medium text-gray-700 mb-4">Endereço da Obra</h3>
                        <div className="space-y-4">
                          {/* CEP */}
                          <div>
                            <Label htmlFor="cep" className="text-sm font-medium">
                              CEP
                            </Label>
                            <Input
                              id="cep"
                              mask="cep"
                              value={editingObra.cep || ""}
                              onChange={(e) => setEditingObra({ ...editingObra, cep: e.target.value })}
                              className="mt-1"
                              placeholder="00000-000"
                            />
                          </div>

                          {/* Logradouro */}
                          <div>
                            <Label htmlFor="logradouro" className="text-sm font-medium">
                              Logradouro
                            </Label>
                            <Input
                              id="logradouro"
                              value={editingObra.logradouro || ""}
                              onChange={(e) => setEditingObra({ ...editingObra, logradouro: e.target.value })}
                              className="mt-1"
                              placeholder="Rua, Avenida, etc."
                            />
                          </div>

                          {/* Número */}
                          <div>
                            <Label htmlFor="numero" className="text-sm font-medium">
                              Número
                            </Label>
                            <Input
                              id="numero"
                              value={editingObra.numero || ""}
                              onChange={(e) => setEditingObra({ ...editingObra, numero: e.target.value })}
                              className="mt-1"
                              placeholder="Número"
                            />
                          </div>

                          {/* Complemento */}
                          <div>
                            <Label htmlFor="complemento" className="text-sm font-medium">
                              Complemento
                            </Label>
                            <Input
                              id="complemento"
                              value={editingObra.complemento || ""}
                              onChange={(e) => setEditingObra({ ...editingObra, complemento: e.target.value })}
                              className="mt-1"
                              placeholder="Apto, Sala, etc."
                            />
                          </div>

                          {/* Bairro */}
                          <div>
                            <Label htmlFor="bairro" className="text-sm font-medium">
                              Bairro
                            </Label>
                            <Input
                              id="bairro"
                              value={editingObra.bairro || ""}
                              onChange={(e) => setEditingObra({ ...editingObra, bairro: e.target.value })}
                              className="mt-1"
                              placeholder="Bairro"
                            />
                          </div>

                          {/* Cidade */}
                          <div>
                            <Label htmlFor="cidade" className="text-sm font-medium">
                              Cidade <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="cidade"
                              value={editingObra.cidade}
                              onChange={(e) => setEditingObra({ ...editingObra, cidade: e.target.value })}
                              className="mt-1"
                              placeholder="Cidade"
                            />
                          </div>

                          {/* Estado */}
                          <div>
                            <Label htmlFor="estado" className="text-sm font-medium">
                              Estado
                            </Label>
                            <Select
                              value={editingObra.estado || ""}
                              onValueChange={(value) => setEditingObra({ ...editingObra, estado: value })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Selecione o estado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AC">Acre</SelectItem>
                                <SelectItem value="AL">Alagoas</SelectItem>
                                <SelectItem value="AP">Amapá</SelectItem>
                                <SelectItem value="AM">Amazonas</SelectItem>
                                <SelectItem value="BA">Bahia</SelectItem>
                                <SelectItem value="CE">Ceará</SelectItem>
                                <SelectItem value="DF">Distrito Federal</SelectItem>
                                <SelectItem value="ES">Espírito Santo</SelectItem>
                                <SelectItem value="GO">Goiás</SelectItem>
                                <SelectItem value="MA">Maranhão</SelectItem>
                                <SelectItem value="MT">Mato Grosso</SelectItem>
                                <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                                <SelectItem value="MG">Minas Gerais</SelectItem>
                                <SelectItem value="PA">Pará</SelectItem>
                                <SelectItem value="PB">Paraíba</SelectItem>
                                <SelectItem value="PR">Paraná</SelectItem>
                                <SelectItem value="PE">Pernambuco</SelectItem>
                                <SelectItem value="PI">Piauí</SelectItem>
                                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                                <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                                <SelectItem value="RO">Rondônia</SelectItem>
                                <SelectItem value="RR">Roraima</SelectItem>
                                <SelectItem value="SC">Santa Catarina</SelectItem>
                                <SelectItem value="SP">São Paulo</SelectItem>
                                <SelectItem value="SE">Sergipe</SelectItem>
                                <SelectItem value="TO">Tocantins</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Datas e Prazos */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="text-md font-medium text-gray-700 mb-4">Datas e Prazos</h3>
                        <div className="space-y-4">
                          {/* Data de Início */}
                          <div>
                            <Label htmlFor="inicio" className="text-sm font-medium">
                              Data de Início <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="inicio"
                              mask="data"
                              value={editingObra.inicio}
                              onChange={(e) => setEditingObra({ ...editingObra, inicio: e.target.value })}
                              className="mt-1"
                              placeholder="DD/MM/AAAA"
                            />
                          </div>

                          {/* Previsão de Término */}
                          <div>
                            <Label htmlFor="termino" className="text-sm font-medium">
                              Previsão de Término <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="termino"
                              mask="data"
                              value={editingObra.termino}
                              onChange={(e) => setEditingObra({ ...editingObra, termino: e.target.value })}
                              className="mt-1"
                              placeholder="DD/MM/AAAA"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Informações Adicionais */}
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h3 className="text-md font-medium text-gray-700 mb-4">Informações Adicionais</h3>
                        <div className="space-y-4">
                          {/* Área Total */}
                          <div>
                            <Label htmlFor="area" className="text-sm font-medium">
                              Área Total (m²)
                            </Label>
                            <Input
                              id="area"
                              mask="numero"
                              value={editingObra.area || ""}
                              onChange={(e) => setEditingObra({ ...editingObra, area: e.target.value })}
                              className="mt-1"
                              placeholder="0,00"
                            />
                          </div>

                          {/* Observações */}
                          <div>
                            <Label htmlFor="observacoes" className="text-sm font-medium">
                              Observações
                            </Label>
                            <textarea
                              id="observacoes"
                              value={editingObra.observacoes || ""}
                              onChange={(e) => setEditingObra({ ...editingObra, observacoes: e.target.value })}
                              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                              placeholder="Observações adicionais sobre a obra"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="p-6 border-t bg-gray-50 sticky bottom-0 w-full">
              <div className="flex justify-center w-full">
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={saveEditedObra} className="bg-[#202F51] hover:bg-[#2a3b68] gap-2">
                    <Save className="h-4 w-4" />
                    Salvar alterações
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog - Versão melhorada */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[450px]">
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>

            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold text-gray-800 text-center">
                Confirmar exclusão
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-gray-600 text-center">
                Tem certeza que deseja excluir esta obra?
              </AlertDialogDescription>
            </AlertDialogHeader>

            {editingObra && (
              <div className="my-6 w-full bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Nome:</span>
                    <span className="text-sm font-semibold text-gray-700">{editingObra.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Cidade:</span>
                    <span className="text-sm text-gray-700">{editingObra.cidade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Construtora:</span>
                    <span className="text-sm text-gray-700">{editingObra.construtora}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className="text-sm text-gray-700">{editingObra.status}</span>
                  </div>
                </div>
              </div>
            )}

            <p className="text-sm text-red-600 font-medium mb-6 text-center">Esta ação não pode ser desfeita.</p>

            <AlertDialogFooter className="w-full flex justify-between gap-3">
              <AlertDialogCancel className="border border-gray-300 font-medium flex-1">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-medium flex-1"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
