"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Search, Plus, Edit, Trash2, Shield, MoreHorizontal } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// Vamos atualizar a página de usuários para melhorar a experiência com o modal de cadastro

// Atualizar o import do Dialog para incluir o DialogTrigger
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CadastroUsuarioForm } from "@/components/usuarios/cadastro-usuario-form"
import { ConfigurarPermissoesForm } from "@/components/usuarios/configurar-permissoes-form"
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

export default function Usuarios() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [cargoFilter, setCargoFilter] = useState("todos")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [isPermissoesDialogOpen, setIsPermissoesDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: "João Silva",
      cpf: "123.456.789-00",
      cargo: "Engenheiro Civil",
      status: "Ativo",
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      cpf: "987.654.321-00",
      cargo: "Gerente de Projetos",
      status: "Ativo",
    },
    {
      id: 3,
      nome: "Pedro Santos",
      cpf: "456.789.123-00",
      cargo: "Técnico de Obras",
      status: "Ativo",
    },
    {
      id: 4,
      nome: "Ana Souza",
      cpf: "789.123.456-00",
      cargo: "Analista Financeiro",
      status: "Inativo",
    },
    {
      id: 5,
      nome: "Carlos Ferreira",
      cpf: "321.654.987-00",
      cargo: "Supervisor de Obras",
      status: "Ativo",
    },
    {
      id: 6,
      nome: "Juliana Costa",
      cpf: "654.987.321-00",
      cargo: "Assistente Administrativo",
      status: "Inativo",
    },
  ])

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [userToChangeStatus, setUserToChangeStatus] = useState<any>(null)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<any>(null)

  // Função para adicionar um novo usuário
  const adicionarUsuario = (novoUsuario: any) => {
    // Gerar um ID único para o novo usuário
    const id = usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1

    // Adicionar o novo usuário à lista com status padrão "Ativo"
    setUsuarios([
      ...usuarios,
      {
        ...novoUsuario,
        id,
        status: "Ativo",
      },
    ])
  }

  // Função para alternar o status do usuário
  const toggleUserStatus = (user: any) => {
    setUserToChangeStatus(user)
    setIsStatusDialogOpen(true)
  }

  // Função para confirmar a alteração de status
  const confirmStatusChange = () => {
    if (!userToChangeStatus) return

    const newStatus = userToChangeStatus.status === "Ativo" ? "Inativo" : "Ativo"

    // Atualiza o usuário na lista
    setUsuarios(usuarios.map((u) => (u.id === userToChangeStatus.id ? { ...u, status: newStatus } : u)))

    setIsStatusDialogOpen(false)
    setUserToChangeStatus(null)
  }

  // Função para abrir o modal de exclusão
  const openDeleteDialog = (user: any) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  // Função para confirmar a exclusão do usuário
  const confirmDelete = () => {
    if (!userToDelete) return

    // Remove o usuário da lista
    setUsuarios(usuarios.filter((u) => u.id !== userToDelete.id))

    setIsDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  // Filtrar usuários com base nos filtros e termo de busca
  const filteredUsuarios = usuarios.filter((usuario) => {
    // Filtro de status
    if (statusFilter !== "todos" && usuario.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false
    }

    // Filtro de cargo
    if (cargoFilter !== "todos" && usuario.cargo !== cargoFilter) {
      return false
    }

    // Filtro de busca (nome ou CPF)
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase()
      return (
        usuario.nome.toLowerCase().includes(searchTermLower) ||
        usuario.cpf.includes(searchTerm) ||
        usuario.cargo.toLowerCase().includes(searchTermLower)
      )
    }

    return true
  })

  // Adicionar estados e constantes para paginação logo após a declaração dos outros estados
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const totalItems = filteredUsuarios.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Abrir modal de adicionar usuário
  // Atualizar a função openAddUserDialog para usar o estado do modal
  const openAddUserDialog = () => {
    setSelectedUser(null)
    setIsAddUserDialogOpen(true)
  }

  // Abrir modal de editar usuário
  const openEditUserDialog = (user: any) => {
    setSelectedUser(user)
    setIsAddUserDialogOpen(true)
  }

  // Abrir modal de configurar permissões
  const openPermissoesDialog = (user: any) => {
    setSelectedUser(user)
    setIsPermissoesDialogOpen(true)
  }

  // Adicionar estas funções para controlar a paginação antes do return
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

  // Adicionar função para obter os itens da página atual
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, filteredUsuarios.length)
    return filteredUsuarios.slice(startIndex, endIndex)
  }

  // Função para renderizar o badge de status com a cor correta
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Ativo":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
      case "Inativo":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Inativo</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Calcular o intervalo de itens exibidos
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems)

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Gestão de Usuários</h1>
          <Button className="bg-[#1e2a4a] hover:bg-[#15203a] text-white" onClick={openAddUserDialog}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Usuário
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, CPF ou cargo"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={cargoFilter} onValueChange={setCargoFilter}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Filtrar por cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os cargos</SelectItem>
                <SelectItem value="Engenheiro Civil">Engenheiro Civil</SelectItem>
                <SelectItem value="Gerente de Projetos">Gerente de Projetos</SelectItem>
                <SelectItem value="Técnico de Obras">Técnico de Obras</SelectItem>
                <SelectItem value="Analista Financeiro">Analista Financeiro</SelectItem>
                <SelectItem value="Supervisor de Obras">Supervisor de Obras</SelectItem>
                <SelectItem value="Assistente Administrativo">Assistente Administrativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome Completo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo/Função
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentPageItems().map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.cpf}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.cargo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{renderStatusBadge(usuario.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => openEditUserDialog(usuario)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => openPermissoesDialog(usuario)}>
                              <Shield className="h-4 w-4 mr-2" />
                              Permissões
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              onClick={() => openDeleteDialog(usuario)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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

        {/* Modal de Adicionar/Editar Usuário */}
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden shadow-xl rounded-xl border-0">
            <div className="bg-white rounded-xl">
              <CadastroUsuarioForm
                usuario={selectedUser}
                onClose={() => setIsAddUserDialogOpen(false)}
                isEditing={!!selectedUser}
                onSave={(dadosUsuario) => {
                  if (selectedUser) {
                    // Atualizar usuário existente
                    setUsuarios(usuarios.map((u) => (u.id === selectedUser.id ? { ...u, ...dadosUsuario } : u)))
                  } else {
                    // Adicionar novo usuário
                    adicionarUsuario(dadosUsuario)
                  }
                  setIsAddUserDialogOpen(false)
                }}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Configurar Permissões */}
        <Dialog open={isPermissoesDialogOpen} onOpenChange={setIsPermissoesDialogOpen}>
          <DialogContent className="sm:max-w-[900px] p-6 overflow-hidden">
            <ConfigurarPermissoesForm usuario={selectedUser} onClose={() => setIsPermissoesDialogOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* Diálogo de confirmação para alteração de status */}
        <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {userToChangeStatus?.status === "Ativo" ? "Desativar Usuário" : "Ativar Usuário"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {userToChangeStatus?.status === "Ativo"
                  ? `Tem certeza que deseja desativar o usuário ${userToChangeStatus?.nome}? Usuários inativos não poderão acessar o sistema.`
                  : `Tem certeza que deseja ativar o usuário ${userToChangeStatus?.nome}? Usuários ativos têm acesso ao sistema.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmStatusChange}
                className={
                  userToChangeStatus?.status === "Ativo"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Diálogo de confirmação para exclusão */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="max-w-[450px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center text-xl font-bold text-gray-800">
                Confirmar Exclusão
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-gray-600 mt-3">
                Tem certeza que deseja excluir o usuário <span className="font-semibold">{userToDelete?.nome}</span>?
                <p className="mt-2 text-red-600">Esta ação não poderá ser desfeita.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
              <AlertDialogCancel className="w-full sm:w-auto border-gray-300">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
              >
                Confirmar Exclusão
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  )
}
