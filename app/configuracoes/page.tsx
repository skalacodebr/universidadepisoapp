"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PerfilTab } from "@/components/configuracoes/perfil-tab"
import { ObrasTab } from "@/components/configuracoes/obras-tab"
import { FinanceiroTab } from "@/components/configuracoes/financeiro-tab"
import { AppTab } from "@/components/configuracoes/app-tab"
import { DispositivosModal } from "@/components/configuracoes/dispositivos-modal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Configuracoes() {
  const { user } = useAuth()
  const [activeMenu, setActiveMenu] = useState("configuracoes")
  const [activeTab, setActiveTab] = useState("perfil")
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)

  // Estados para configurações de perfil
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  // Estados para configurações de obras
  const [novaCategoria, setNovaCategoria] = useState("")
  const [categorias, setCategorias] = useState([
    { id: 1, nome: "Residenciais", ativo: true },
    { id: 2, nome: "Comerciais", ativo: true },
    { id: 3, nome: "Industriais", ativo: true },
  ])

  // Estados para configurações financeiras
  const [regimeTributario, setRegimeTributario] = useState("simples")
  const [lucroMinimo, setLucroMinimo] = useState("15")
  const [alertaLucro, setAlertaLucro] = useState("10")

  // Estados para configurações de app
  const [permissoesDespesas, setPermissoesDespesas] = useState({
    combustivel: true,
    refeicao: true,
    hospedagem: true,
    materiais: false,
    ferramentas: false,
  })
  const [notificacoesPush, setNotificacoesPush] = useState(true)
  const [novaDespesa, setNovaDespesa] = useState("")
  const [novaCategoriaFinanceira, setNovaCategoriaFinanceira] = useState("")
  const [categoriasFinanceiras, setCategoriasFinanceiras] = useState([
    { id: 1, nome: "Equipamentos", ativo: true },
    { id: 2, nome: "Insumos", ativo: true },
    { id: 3, nome: "Mão de Obra", ativo: true },
  ])
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState(false)

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
      return user.email.split("@")[0]
    }
    return "Usuário"
  }

  // Adicionar nova categoria de obra
  const adicionarCategoria = () => {
    if (novaCategoria.trim()) {
      setCategorias([...categorias, { id: categorias.length + 1, nome: novaCategoria, ativo: true }])
      setNovaCategoria("")
    }
  }

  // Alternar estado ativo de uma categoria
  const toggleCategoriaAtiva = (id: number) => {
    setCategorias(categorias.map((cat) => (cat.id === id ? { ...cat, ativo: !cat.ativo } : cat)))
  }

  // Adicionar nova categoria de despesa
  const adicionarNovaDespesa = () => {
    if (novaDespesa.trim()) {
      // Adiciona a nova categoria ao estado de permissões com valor inicial false
      setPermissoesDespesas({
        ...permissoesDespesas,
        [novaDespesa.toLowerCase().replace(/\s+/g, "-")]: false,
      })
      // Limpa o campo de input
      setNovaDespesa("")
    }
  }

  // Adicionar nova categoria financeira
  const adicionarCategoriaFinanceira = () => {
    if (novaCategoriaFinanceira.trim()) {
      setCategoriasFinanceiras([
        ...categoriasFinanceiras,
        { id: categoriasFinanceiras.length + 1, nome: novaCategoriaFinanceira, ativo: true },
      ])
      setNovaCategoriaFinanceira("")
    }
  }

  // Salvar todas as configurações
  const salvarConfiguracoes = () => {
    // Aqui implementaria a lógica para salvar as configurações no banco de dados
    alert("Todas as configurações foram salvas com sucesso!")
  }

  // Salvar configurações de perfil
  const salvarConfiguracoesPerfil = () => {
    // Aqui implementaria a lógica para salvar apenas as configurações de perfil
    alert("Configurações de perfil salvas com sucesso!")
  }

  // Salvar configurações de obras
  const salvarConfiguracoesObras = () => {
    // Aqui implementaria a lógica para salvar apenas as configurações de obras
    alert("Configurações de obras salvas com sucesso!")
  }

  // Salvar configurações financeiras
  const salvarConfiguracoesFinanceiro = () => {
    // Aqui implementaria a lógica para salvar apenas as configurações financeiras
    alert("Configurações financeiras salvas com sucesso!")
  }

  // Salvar configurações de app
  const salvarConfiguracoesApp = () => {
    // Aqui implementaria a lógica para salvar apenas as configurações de app
    alert("Configurações de app salvas com sucesso!")
  }

  // Restaurar configurações padrão
  const restaurarPadroes = () => {
    // Aqui implementaria a lógica para restaurar os valores padrão
    setEmailNotifications(true)
    setSmsNotifications(false)
    setRegimeTributario("simples")
    setLucroMinimo("15")
    setAlertaLucro("10")
    setPermissoesDespesas({
      combustivel: true,
      refeicao: true,
      hospedagem: true,
      materiais: false,
      ferramentas: false,
    })
    setNotificacoesPush(true)
    setCategorias([
      { id: 1, nome: "Residenciais", ativo: true },
      { id: 2, nome: "Comerciais", ativo: true },
      { id: 3, nome: "Industriais", ativo: true },
    ])
    setIsRestoreModalOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}

        {/* Configurações Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">Configurações</h1>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsRestoreModalOpen(true)} className="flex items-center">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restaurar Padrões
                </Button>
              </div>
            </div>

            <Tabs defaultValue="perfil" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-6 w-full justify-start border-b pb-0 bg-transparent">
                <TabsTrigger
                  value="perfil"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#007EA3] data-[state=active]:text-[#007EA3] rounded-none data-[state=active]:shadow-none"
                >
                  Meu Perfil
                </TabsTrigger>
                <TabsTrigger
                  value="obras"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#007EA3] data-[state=active]:text-[#007EA3] rounded-none data-[state=active]:shadow-none"
                >
                  Configurações de Obras
                </TabsTrigger>
                <TabsTrigger
                  value="financeiro"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#007EA3] data-[state=active]:text-[#007EA3] rounded-none data-[state=active]:shadow-none"
                >
                  Configurações de Financeiro
                </TabsTrigger>
                <TabsTrigger
                  value="app"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#007EA3] data-[state=active]:text-[#007EA3] rounded-none data-[state=active]:shadow-none"
                >
                  Configurações App
                </TabsTrigger>
              </TabsList>

              {/* Meu Perfil */}
              <TabsContent value="perfil">
                <PerfilTab
                  emailNotifications={emailNotifications}
                  setEmailNotifications={setEmailNotifications}
                  smsNotifications={smsNotifications}
                  setSmsNotifications={setSmsNotifications}
                  salvarConfiguracoesPerfil={salvarConfiguracoesPerfil}
                />
              </TabsContent>

              {/* Configurações de Obras */}
              <TabsContent value="obras">
                <ObrasTab
                  novaCategoria={novaCategoria}
                  setNovaCategoria={setNovaCategoria}
                  categorias={categorias}
                  toggleCategoriaAtiva={toggleCategoriaAtiva}
                  adicionarCategoria={adicionarCategoria}
                  salvarConfiguracoesObras={salvarConfiguracoesObras}
                />
              </TabsContent>

              {/* Configurações de Financeiro */}
              <TabsContent value="financeiro">
                <FinanceiroTab
                  regimeTributario={regimeTributario}
                  setRegimeTributario={setRegimeTributario}
                  lucroMinimo={lucroMinimo}
                  setLucroMinimo={setLucroMinimo}
                  alertaLucro={alertaLucro}
                  setAlertaLucro={setAlertaLucro}
                  novaCategoriaFinanceira={novaCategoriaFinanceira}
                  setNovaCategoriaFinanceira={setNovaCategoriaFinanceira}
                  categoriasFinanceiras={categoriasFinanceiras}
                  setCategoriasFinanceiras={setCategoriasFinanceiras}
                  adicionarCategoriaFinanceira={adicionarCategoriaFinanceira}
                  salvarConfiguracoesFinanceiro={salvarConfiguracoesFinanceiro}
                />
              </TabsContent>

              {/* Configurações App */}
              <TabsContent value="app">
                <AppTab
                  permissoesDespesas={permissoesDespesas}
                  setPermissoesDespesas={setPermissoesDespesas}
                  novaDespesa={novaDespesa}
                  setNovaDespesa={setNovaDespesa}
                  notificacoesPush={notificacoesPush}
                  setNotificacoesPush={setNotificacoesPush}
                  adicionarNovaDespesa={adicionarNovaDespesa}
                  salvarConfiguracoesApp={salvarConfiguracoesApp}
                  abrirModalDispositivos={() => setIsDevicesModalOpen(true)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Modal de Dispositivos Conectados */}
      <DispositivosModal isOpen={isDevicesModalOpen} onOpenChange={setIsDevicesModalOpen} />

      {/* Modal de Restaurar Padrões */}
      <Dialog open={isRestoreModalOpen} onOpenChange={setIsRestoreModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl">Restaurar Configurações Padrão</DialogTitle>
            <DialogDescription className="text-base pt-2">
              Tem certeza que deseja restaurar todas as configurações para os valores padrão? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 pt-2 border-t">
            <Button variant="outline" onClick={() => setIsRestoreModalOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#007EA3] hover:bg-[#006a8a]" onClick={restaurarPadroes}>
              Confirmar Restauração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
