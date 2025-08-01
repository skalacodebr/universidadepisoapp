"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, MoreHorizontal, FileText, AlertTriangle, Trash2, Eye, Download } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
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
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

// Tipos para os relatórios
interface Relatorio {
  id: string
  tipo: string
  data: string
  obra: string
}

// Dados de exemplo para os relatórios
const relatoriosIniciais: Relatorio[] = [
  {
    id: "1",
    tipo: "Orçado X Realizado",
    data: "04/02/25",
    obra: "Todas",
  },
  {
    id: "2",
    tipo: "Lucro/Prejuízo",
    data: "04/02/25",
    obra: "Obra 1",
  },
]

// Chave para armazenar no localStorage
const STORAGE_KEY = "universidade-piso-relatorios"

export default function Relatorios() {
  const router = useRouter()

  // Estados para os filtros
  const [tipoRelatorio, setTipoRelatorio] = useState("todos")
  const [periodo, setPeriodo] = useState("todos")
  const [obra, setObra] = useState("todos")
  const [mensagemErro, setMensagemErro] = useState("")

  // Estado para armazenar os relatórios (iniciais + gerados)
  const [relatorios, setRelatorios] = useState<Relatorio[]>([])

  // Estado para controlar a exibição do modal de exclusão
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [relatorioParaExcluir, setRelatorioParaExcluir] = useState<Relatorio | null>(null)

  // Carregar relatórios do localStorage na inicialização
  useEffect(() => {
    // Verificar se estamos no navegador (client-side)
    if (typeof window !== "undefined") {
      const savedRelatorios = localStorage.getItem(STORAGE_KEY)

      if (savedRelatorios) {
        try {
          // Tentar carregar os relatórios salvos
          const parsedRelatorios = JSON.parse(savedRelatorios) as Relatorio[]
          setRelatorios(parsedRelatorios)
        } catch (error) {
          console.error("Erro ao carregar relatórios do localStorage:", error)
          // Em caso de erro, usar os relatórios iniciais
          setRelatorios(relatoriosIniciais)
        }
      } else {
        // Se não houver relatórios salvos, usar os iniciais
        setRelatorios(relatoriosIniciais)
        // E salvar os iniciais no localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(relatoriosIniciais))
      }
    }
  }, [])

  // Estados para paginação
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10
  const totalItens = relatorios.length
  const totalPaginas = Math.ceil(totalItens / itensPorPagina)

  // Calcular índices para exibição dos itens da página atual
  const indiceInicial = (paginaAtual - 1) * itensPorPagina
  const indiceFinal = Math.min(indiceInicial + itensPorPagina, totalItens)
  const relatoriosPaginados = relatorios.slice(indiceInicial, indiceFinal)

  // Função para mudar de página
  const mudarPagina = (novaPagina: number) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina)
    }
  }

  // Função para formatar a data atual
  const formatarDataAtual = () => {
    const data = new Date()
    const dia = String(data.getDate()).padStart(2, "0")
    const mes = String(data.getMonth() + 1).padStart(2, "0")
    const ano = String(data.getFullYear()).slice(-2)
    return `${dia}/${mes}/${ano}`
  }

  // Função para salvar relatórios no localStorage
  const salvarRelatorios = (novosRelatorios: Relatorio[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(novosRelatorios))
    }
  }

  // Função para gerar relatório
  const gerarRelatorio = () => {
    console.log("Gerando relatório com os filtros:", { tipoRelatorio, periodo, obra })

    // Limpar mensagem de erro anterior
    setMensagemErro("")

    // Verificar se um tipo específico foi selecionado
    if (tipoRelatorio === "orcado-realizado" || tipoRelatorio === "lucro-prejuizo") {
      // Criar um novo relatório
      const novoRelatorio: Relatorio = {
        id: Date.now().toString(), // ID único baseado no timestamp
        tipo: tipoRelatorio === "orcado-realizado" ? "Orçado X Realizado" : "Lucro/Prejuízo",
        data: formatarDataAtual(),
        obra: obra === "todos" ? "Todas" : obra === "obra1" ? "Obra 1" : obra === "obra2" ? "Obra 2" : "Obra 3",
      }

      // Adicionar o novo relatório à lista e atualizar o estado
      const novosRelatorios = [novoRelatorio, ...relatorios]
      setRelatorios(novosRelatorios)

      // Salvar no localStorage
      salvarRelatorios(novosRelatorios)

      // Redirecionar para a página do relatório específico
      if (tipoRelatorio === "orcado-realizado") {
        router.push("/relatorios/orcado-realizado")
      } else if (tipoRelatorio === "lucro-prejuizo") {
        router.push("/relatorios/lucro-prejuizo")
      }
    } else {
      // Se "todos" estiver selecionado, mostrar mensagem de erro na interface
      setMensagemErro("Por favor, selecione um tipo específico de relatório")
    }
  }

  // Função para abrir o modal de confirmação de exclusão
  const confirmarExclusao = (id: string) => {
    const relatorio = relatorios.find((r) => r.id === id)
    if (relatorio) {
      setRelatorioParaExcluir(relatorio)
      setModalExcluirAberto(true)
    }
  }

  // Função para excluir um relatório após confirmação
  const excluirRelatorio = () => {
    if (relatorioParaExcluir) {
      try {
        // Filtrar o relatório a ser excluído
        const novosRelatorios = relatorios.filter((relatorio) => relatorio.id !== relatorioParaExcluir.id)
        
        // Atualizar o estado com os relatórios restantes
        setRelatorios(novosRelatorios)
        
        // Salvar no localStorage
        salvarRelatorios(novosRelatorios)
        
        // Exibir mensagem de sucesso
        const mensagem = document.createElement('div');
        mensagem.className = "fixed bottom-4 right-4 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded shadow-md z-50 flex items-center";
        mensagem.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Relatório "${relatorioParaExcluir.tipo}" excluído com sucesso!
        `;
        document.body.appendChild(mensagem);
        
        // Remover a mensagem após 3 segundos
        setTimeout(() => {
          if (document.body.contains(mensagem)) {
            document.body.removeChild(mensagem);
          }
        }, 3000);
        
      } catch (error) {
        console.error("Erro ao excluir relatório:", error);
        alert("Ocorreu um erro ao excluir o relatório. Por favor, tente novamente.");
      } finally {
        // Fechar o modal
        setModalExcluirAberto(false);
        // Limpar o relatório selecionado
        setRelatorioParaExcluir(null);
      }
    }
  }

  // Função para visualizar um relatório específico
  const visualizarRelatorio = (tipo: string) => {
    if (tipo === "Orçado X Realizado") {
      router.push("/relatorios/orcado-realizado")
    } else if (tipo === "Lucro/Prejuízo") {
      router.push("/relatorios/lucro-prejuizo")
    } else {
      console.error(`Tipo de relatório não suportado: ${tipo}`)
      alert(`Tipo de relatório não suportado: ${tipo}`)
    }
  }

  // Função para exportar um relatório
  const exportarRelatorio = (id: string, tipo: string) => {
    // Primeiro, encontrar o relatório correspondente
    const relatorio = relatorios.find((r) => r.id === id)
    
    if (!relatorio) {
      console.error(`Relatório não encontrado: ${id}`)
      alert("Relatório não encontrado.")
      return
    }
    
    // Redirecionar para a página adequada e iniciar a exportação
    if (tipo === "Orçado X Realizado") {
      // Armazenar o ID do relatório para exportação no localStorage
      localStorage.setItem("relatorio-para-exportar", id)
      router.push("/relatorios/orcado-realizado?exportar=true")
    } else if (tipo === "Lucro/Prejuízo") {
      // Armazenar o ID do relatório para exportação no localStorage
      localStorage.setItem("relatorio-para-exportar", id)
      router.push("/relatorios/lucro-prejuizo?exportar=true")
    } else {
      console.error(`Exportação não suportada para o tipo: ${tipo}`)
      alert(`Exportação não suportada para este tipo de relatório: ${tipo}`)
    }
  }

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50 pl-64">
        <Header />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Relatórios</h1>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="md:flex-1 space-y-2">
                <p className="text-sm text-gray-500 font-medium">Tipo</p>
                <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="orcado-realizado">Orçado X Realizado</SelectItem>
                    <SelectItem value="lucro-prejuizo">Lucro/Prejuízo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:flex-1 space-y-2">
                <p className="text-sm text-gray-500 font-medium">Período</p>
                <Select value={periodo} onValueChange={setPeriodo}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ultimo-mes">Último mês</SelectItem>
                    <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
                    <SelectItem value="ultimo-ano">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:flex-1 space-y-2">
                <p className="text-sm text-gray-500 font-medium">Obra</p>
                <Select value={obra} onValueChange={setObra}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="obra1">Obra 1</SelectItem>
                    <SelectItem value="obra2">Obra 2</SelectItem>
                    <SelectItem value="obra3">Obra 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={gerarRelatorio}
                  className="bg-[#1e2a4a] hover:bg-[#15203a] text-white h-10 w-[170px]"
                >
                  Gerar relatório
                </Button>
              </div>
            </div>

            {mensagemErro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {mensagemErro}
              </div>
            )}

            <h2 className="text-xl font-bold text-gray-800 mb-4">Relatórios gerados</h2>

            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo de relatório
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Obra
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {relatoriosPaginados.length > 0 ? (
                      relatoriosPaginados.map((relatorio, index) => (
                        <tr key={relatorio.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-[#007EA3]" />
                              {relatorio.tipo}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{relatorio.data}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{relatorio.obra}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            <div className="flex justify-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => visualizarRelatorio(relatorio.tipo)}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Visualizar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => exportarRelatorio(relatorio.id, relatorio.tipo)}
                                    className="cursor-pointer"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Exportar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => confirmarExclusao(relatorio.id)}
                                    className="cursor-pointer text-red-500 hover:text-red-700 focus:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                          Nenhum relatório gerado ainda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Paginação - Agora fora do Card */}
            {totalPaginas > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm text-gray-500">
                <div className="text-gray-500 mb-4 sm:mb-0">
                  Mostrando {indiceInicial + 1}-{indiceFinal < 10 ? `0${indiceFinal}` : indiceFinal} de{" "}
                  {totalItens < 10 ? `0${totalItens}` : totalItens}
                </div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 mr-2"
                    disabled={paginaAtual === 1}
                    onClick={() => mudarPagina(paginaAtual - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                      <Button
                        key={pagina}
                        variant={pagina === paginaAtual ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 ${pagina === paginaAtual ? "bg-[#007EA3] text-white" : "text-gray-700"}`}
                        onClick={() => mudarPagina(pagina)}
                      >
                        {pagina}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 ml-2"
                    disabled={paginaAtual === totalPaginas}
                    onClick={() => mudarPagina(paginaAtual + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={modalExcluirAberto} onOpenChange={setModalExcluirAberto}>
        <AlertDialogContent className="max-w-[450px]">
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold text-gray-800 text-center">
                Confirmar exclusão
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2 text-gray-600 text-center">
                Tem certeza que deseja excluir este relatório?
              </AlertDialogDescription>
            </AlertDialogHeader>

            {relatorioParaExcluir && (
              <div className="my-6 w-full bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Tipo:</span>
                    <span className="text-sm font-semibold text-gray-700">{relatorioParaExcluir.tipo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Data:</span>
                    <span className="text-sm text-gray-700">{relatorioParaExcluir.data}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Obra:</span>
                    <span className="text-sm text-gray-700">{relatorioParaExcluir.obra}</span>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-sm text-red-600 font-medium mb-6 text-center">
              Esta ação não pode ser desfeita.
            </p>

            <AlertDialogFooter className="w-full flex justify-between gap-3">
              <AlertDialogCancel className="border border-gray-300 font-medium flex-1">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={excluirRelatorio}
                className="bg-red-600 hover:bg-red-700 text-white font-medium flex-1"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
