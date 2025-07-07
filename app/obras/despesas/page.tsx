"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Dados de exemplo para as despesas
const despesasData = [
  {
    id: 1,
    data: "04/02/25",
    valor: "R$150,00",
    cadastradoPor: "Ronaldo Silva",
    tipo: "Alimentação",
  },
  {
    id: 2,
    data: "04/02/25",
    valor: "R$150,00",
    cadastradoPor: "Ronaldo Silva",
    tipo: "Hospedagem",
  },
  {
    id: 3,
    data: "04/02/25",
    valor: "R$150,00",
    cadastradoPor: "Ronaldo Silva",
    tipo: "Combustível",
  },
  {
    id: 4,
    data: "04/02/25",
    valor: "R$150,00",
    cadastradoPor: "Ronaldo Silva",
    tipo: "Ferramenta",
  },
  {
    id: 5,
    data: "04/02/25",
    valor: "R$150,00",
    cadastradoPor: "Ronaldo Silva",
    tipo: "Peças",
  },
  {
    id: 6,
    data: "04/02/25",
    valor: "R$150,00",
    cadastradoPor: "Ronaldo Silva",
    tipo: "Materiais",
  },
]

export default function RegistroDespesas() {
  const { user } = useAuth()
  const [activeMenu, setActiveMenu] = useState("obras")
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Função para obter a inicial do nome do usuário
  const getUserInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase()
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  // Função para obter o nome de exibição do usuário
  const getUserDisplayName = () => {
    if (user?.displayName) {
      return user.displayName
    } else if (user?.email) {
      // Se não tiver nome, usa a parte antes do @ do email
      return user.email.split("@")[0]
    }
    return "Usuário"
  }

  // Navegar para a página de perfil
  const goToProfile = () => {
    router.push("/perfil")
  }

  // Navegar para outras páginas
  const navigateTo = (page: string) => {
    router.push(`/${page}`)
  }

  // Abrir o modal de nova despesa
  const openNewDespesaDialog = () => {
    setIsDialogOpen(true)
  }

  // Fechar o modal
  const closeDialog = () => {
    setIsDialogOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}

        {/* Registro de Despesas Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">Registro de despesa</h1>
              <Button className="bg-[#1e2a4a] hover:bg-[#15203a] text-white" onClick={openNewDespesaDialog}>
                Novo registro
              </Button>
            </div>

            {/* Filters */}
            <div className="mb-6">
              <div className="w-64">
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
            </div>

            {/* Table */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cadastrado por
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo de despesa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {despesasData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.data}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.valor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.cadastradoPor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tipo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full">
                                <span className="sr-only">Abrir menu</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                              <DropdownMenuItem>Editar</DropdownMenuItem>
                              <DropdownMenuItem>Excluir</DropdownMenuItem>
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
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <div>Mostrando 1-09 de 78</div>
              <div className="flex space-x-1">
                <button className="p-2 rounded-md hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button className="p-2 rounded-md hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal para nova despesa */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold">Novo registro de despesa</DialogTitle>
              <Button variant="ghost" size="icon" onClick={closeDialog}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo-despesa">Tipo de despesa</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione tipo de despesa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alimentacao">Alimentação</SelectItem>
                  <SelectItem value="hospedagem">Hospedagem</SelectItem>
                  <SelectItem value="combustivel">Combustível</SelectItem>
                  <SelectItem value="ferramenta">Ferramenta</SelectItem>
                  <SelectItem value="pecas">Peças</SelectItem>
                  <SelectItem value="materiais">Materiais</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição da despesa</Label>
              <Textarea id="descricao" placeholder="Descreva a despesa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input id="valor" placeholder="Digite o valor da despesa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a data da despesa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="ontem">Ontem</SelectItem>
                  <SelectItem value="outro">Outra data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Anexar imagem
              </Button>
              <p className="text-xs text-center text-gray-500 mt-2">
                Você está offline. Seu registro será salvo quando conectar a uma rede.
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={closeDialog} className="bg-[#0096b2] hover:bg-[#007a91]">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
