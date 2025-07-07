"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Bell, Check, Trash2, AlertCircle, Info, CheckCircle, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Dados de exemplo para as notificações
const notificacoesData = [
  {
    id: 1,
    tipo: "alerta",
    titulo: "Atraso na entrega de material",
    mensagem: "A entrega de concreto para a obra 'Residencial Parque das Árvores' está atrasada.",
    data: "Hoje, 10:30",
    lida: false,
    obra: "Residencial Parque das Árvores",
  },
  {
    id: 2,
    tipo: "info",
    titulo: "Nova obra cadastrada",
    mensagem: "A obra 'Edifício Comercial Centro' foi cadastrada com sucesso.",
    data: "Hoje, 09:15",
    lida: false,
    obra: "Edifício Comercial Centro",
  },
  {
    id: 3,
    tipo: "sucesso",
    titulo: "Orçamento aprovado",
    mensagem: "O orçamento para a obra 'Condomínio Vista Mar' foi aprovado pelo cliente.",
    data: "Ontem, 16:45",
    lida: false,
    obra: "Condomínio Vista Mar",
  },
  {
    id: 4,
    tipo: "info",
    titulo: "Atualização de sistema",
    mensagem: "O sistema foi atualizado para a versão 2.5. Confira as novidades!",
    data: "Ontem, 14:20",
    lida: true,
  },
  {
    id: 5,
    tipo: "alerta",
    titulo: "Prazo de execução próximo do fim",
    mensagem: "A obra 'Residencial Parque das Árvores' está com o prazo de execução próximo do fim.",
    data: "23/01/2025, 11:30",
    lida: true,
    obra: "Residencial Parque das Árvores",
  },
  {
    id: 6,
    tipo: "sucesso",
    titulo: "Diário de obra atualizado",
    mensagem: "O diário da obra 'Edifício Comercial Centro' foi atualizado com sucesso.",
    data: "22/01/2025, 09:45",
    lida: true,
    obra: "Edifício Comercial Centro",
  },
]

export default function Notificacoes() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("todas")
  const [notificacoes, setNotificacoes] = useState(notificacoesData)

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

  // Marcar notificação como lida
  const marcarComoLida = (id: number) => {
    setNotificacoes(
      notificacoes.map((notificacao) => (notificacao.id === id ? { ...notificacao, lida: true } : notificacao)),
    )
  }

  // Marcar todas como lidas
  const marcarTodasComoLidas = () => {
    setNotificacoes(notificacoes.map((notificacao) => ({ ...notificacao, lida: true })))
  }

  // Excluir notificação
  const excluirNotificacao = (id: number) => {
    setNotificacoes(notificacoes.filter((notificacao) => notificacao.id !== id))
  }

  // Filtrar notificações com base na aba ativa
  const getNotificacoesFiltradas = () => {
    switch (activeTab) {
      case "nao-lidas":
        return notificacoes.filter((notificacao) => !notificacao.lida)
      case "lidas":
        return notificacoes.filter((notificacao) => notificacao.lida)
      default:
        return notificacoes
    }
  }

  // Renderizar ícone com base no tipo de notificação
  const renderIconeNotificacao = (tipo: string) => {
    switch (tipo) {
      case "alerta":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "sucesso":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const notificacoesFiltradas = getNotificacoesFiltradas()
  const notificacoesNaoLidas = notificacoes.filter((notificacao) => !notificacao.lida).length

  return (
    <main className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Notificações</h1>
        <Card className="border-0 shadow-sm overflow-hidden">
          <Tabs defaultValue="todas" className="w-full" onValueChange={setActiveTab}>
            <div className="border-b px-4">
              <TabsList className="bg-transparent h-14">
                <TabsTrigger
                  value="todas"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#007EA3] data-[state=active]:text-[#007EA3] rounded-none data-[state=active]:shadow-none"
                >
                  Todas
                </TabsTrigger>
                <TabsTrigger
                  value="nao-lidas"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#007EA3] data-[state=active]:text-[#007EA3] rounded-none data-[state=active]:shadow-none"
                >
                  Não lidas
                  {notificacoesNaoLidas > 0 && <Badge className="ml-2 bg-[#007EA3]">{notificacoesNaoLidas}</Badge>}
                </TabsTrigger>
                <TabsTrigger
                  value="lidas"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#007EA3] data-[state=active]:text-[#007EA3] rounded-none data-[state=active]:shadow-none"
                >
                  Lidas
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="todas" className="m-0">
              <div className="divide-y">
                {notificacoesFiltradas.length > 0 ? (
                  notificacoesFiltradas.map((notificacao) => (
                    <div
                      key={notificacao.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${!notificacao.lida ? "bg-blue-50" : ""}`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">{renderIconeNotificacao(notificacao.tipo)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-medium">{notificacao.titulo}</h3>
                              <p className="text-sm text-gray-600 mt-1">{notificacao.mensagem}</p>
                              {notificacao.obra && (
                                <div className="mt-2">
                                  <Badge variant="outline" className="text-xs bg-gray-50">
                                    {notificacao.obra}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="flex flex-col items-end">
                                <div className="flex items-center text-xs text-gray-500 mb-2">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {notificacao.data}
                                </div>
                                <div className="flex space-x-1">
                                  {!notificacao.lida && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0"
                                      onClick={() => marcarComoLida(notificacao.id)}
                                    >
                                      <Check className="h-4 w-4 text-green-500" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => excluirNotificacao(notificacao.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-500">Nenhuma notificação encontrada</h3>
                    <p className="text-sm text-gray-400 mt-1">Não há notificações para exibir nesta categoria.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="nao-lidas" className="m-0">
              <div className="divide-y">
                {notificacoesFiltradas.length > 0 ? (
                  notificacoesFiltradas.map((notificacao) => (
                    <div key={notificacao.id} className="p-4 bg-blue-50 hover:bg-blue-100 transition-colors">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">{renderIconeNotificacao(notificacao.tipo)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-medium">{notificacao.titulo}</h3>
                              <p className="text-sm text-gray-600 mt-1">{notificacao.mensagem}</p>
                              {notificacao.obra && (
                                <div className="mt-2">
                                  <Badge variant="outline" className="text-xs bg-gray-50">
                                    {notificacao.obra}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="flex flex-col items-end">
                                <div className="flex items-center text-xs text-gray-500 mb-2">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {notificacao.data}
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => marcarComoLida(notificacao.id)}
                                  >
                                    <Check className="h-4 w-4 text-green-500" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => excluirNotificacao(notificacao.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-500">Nenhuma notificação não lida</h3>
                    <p className="text-sm text-gray-400 mt-1">Você está em dia com suas notificações!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="lidas" className="m-0">
              <div className="divide-y">
                {notificacoesFiltradas.length > 0 ? (
                  notificacoesFiltradas.map((notificacao) => (
                    <div key={notificacao.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">{renderIconeNotificacao(notificacao.tipo)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-medium text-gray-600">{notificacao.titulo}</h3>
                              <p className="text-sm text-gray-500 mt-1">{notificacao.mensagem}</p>
                              {notificacao.obra && (
                                <div className="mt-2">
                                  <Badge variant="outline" className="text-xs bg-gray-50">
                                    {notificacao.obra}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="flex flex-col items-end">
                                <div className="flex items-center text-xs text-gray-500 mb-2">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {notificacao.data}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => excluirNotificacao(notificacao.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-500">Nenhuma notificação lida</h3>
                    <p className="text-sm text-gray-400 mt-1">Você não tem notificações lidas para exibir.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  )
}
