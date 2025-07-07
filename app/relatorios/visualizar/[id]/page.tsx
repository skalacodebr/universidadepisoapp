"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Download, Printer } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter, useParams } from "next/navigation"

// Dados de exemplo para os relatórios
const relatorios = [
  {
    id: "1",
    nome: "Relatório Financeiro Q1",
    tipo: "Orçado X Realizado",
    data: "04/02/25",
    periodo: "Jan/2025 - Mar/2025",
    obra: "Todas",
    conteudo:
      "Este é um relatório detalhado sobre o orçado versus realizado para todas as obras no primeiro trimestre de 2025.",
  },
  {
    id: "2",
    nome: "Análise de Lucro Obra 1",
    tipo: "Lucro/Prejuízo",
    data: "04/02/25",
    periodo: "Jan/2025 - Mar/2025",
    obra: "Obra 1",
    conteudo: "Este relatório analisa o lucro e prejuízo da Obra 1 durante o primeiro trimestre de 2025.",
  },
  {
    id: "3",
    nome: "Desempenho Trimestral",
    tipo: "Desempenho",
    data: "01/02/25",
    periodo: "Jan/2025 - Mar/2025",
    obra: "Todas",
    conteudo: "Análise de desempenho de todas as obras durante o primeiro trimestre de 2025.",
  },
  {
    id: "4",
    nome: "Análise de Custos",
    tipo: "Financeiro",
    data: "28/01/25",
    periodo: "Jan/2025",
    obra: "Obra 2",
    conteudo: "Detalhamento dos custos da Obra 2 durante janeiro de 2025.",
  },
]

export default function VisualizarRelatorio() {
  const { user } = useAuth()
  const [activeMenu, setActiveMenu] = useState("relatorios")
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  // Encontrar o relatório pelo ID
  const relatorio = relatorios.find((r) => r.id === id) || relatorios[0]

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

  // Voltar para a lista de relatórios
  const voltarParaRelatorios = () => {
    router.push("/relatorios")
  }

  // Exportar relatório
  const exportarRelatorio = () => {
    console.log("Exportando relatório:", id)
    // Implementação da exportação
  }

  // Imprimir relatório
  const imprimirRelatorio = () => {
    // Criar uma nova janela para impressão
    const printWindow = window.open("", "_blank")

    if (!printWindow) {
      alert("Por favor, permita pop-ups para imprimir o relatório")
      return
    }

    // Adicionar estilos específicos para impressão
    const printStyles = `
      <style>
        @page {
          size: A4;
          margin: 2cm;
        }
        body {
          font-family: 'Roboto', Arial, sans-serif;
          color: #333;
          line-height: 1.5;
        }
        .print-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 2px solid #ddd;
        }
        .print-logo {
          max-width: 150px;
          margin-bottom: 10px;
        }
        .print-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .print-subtitle {
          font-size: 16px;
          color: #666;
          margin-bottom: 20px;
        }
        .print-info {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-bottom: 30px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        .print-info-item {
          margin-bottom: 10px;
        }
        .print-info-label {
          font-weight: bold;
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
        }
        .print-info-value {
          font-size: 14px;
        }
        .print-content {
          margin-bottom: 30px;
        }
        .print-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .print-table th {
          background-color: #f2f2f2;
          text-align: left;
          padding: 10px;
          font-weight: bold;
          border: 1px solid #ddd;
        }
        .print-table td {
          padding: 10px;
          border: 1px solid #ddd;
        }
        .print-footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
        .print-analysis {
          margin-top: 20px;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 5px;
        }
        .print-analysis-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .positive {
          color: #10b981;
        }
        .negative {
          color: #ef4444;
        }
      </style>
    `

    // Formatar a data atual
    const dataAtual = new Date().toLocaleDateString("pt-BR")
    const horaAtual = new Date().toLocaleTimeString("pt-BR")

    // Construir o conteúdo HTML do relatório
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${relatorio.nome} - Universidade do Piso</title>
        ${printStyles}
      </head>
      <body>
        <div class="print-header">
          <img src="/logo-universidade-piso.png" alt="Logo Universidade do Piso" class="print-logo" />
          <div class="print-title">${relatorio.nome}</div>
          <div class="print-subtitle">Universidade do Piso - Sistema de Gestão</div>
        </div>
        
        <div class="print-info">
          <div class="print-info-item">
            <div class="print-info-label">Tipo de Relatório</div>
            <div class="print-info-value">${relatorio.tipo}</div>
          </div>
          <div class="print-info-item">
            <div class="print-info-label">Data de Geração</div>
            <div class="print-info-value">${relatorio.data}</div>
          </div>
          <div class="print-info-item">
            <div class="print-info-label">Período</div>
            <div class="print-info-value">${relatorio.periodo}</div>
          </div>
          <div class="print-info-item">
            <div class="print-info-label">Obra</div>
            <div class="print-info-value">${relatorio.obra}</div>
          </div>
        </div>
        
        <div class="print-content">
          <h2>Conteúdo do Relatório</h2>
          <p>${relatorio.conteudo}</p>
          
          <table class="print-table">
            <thead>
              <tr>
                <th>Mês</th>
                <th>Orçado</th>
                <th>Realizado</th>
                <th>Diferença</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Janeiro</td>
                <td>R$ 120.000,00</td>
                <td>R$ 115.000,00</td>
                <td class="positive">-R$ 5.000,00</td>
              </tr>
              <tr>
                <td>Fevereiro</td>
                <td>R$ 150.000,00</td>
                <td>R$ 155.000,00</td>
                <td class="negative">+R$ 5.000,00</td>
              </tr>
              <tr>
                <td>Março</td>
                <td>R$ 180.000,00</td>
                <td>R$ 175.000,00</td>
                <td class="positive">-R$ 5.000,00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>R$ 450.000,00</strong></td>
                <td><strong>R$ 445.000,00</strong></td>
                <td class="positive"><strong>-R$ 5.000,00</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <div class="print-analysis">
            <div class="print-analysis-title">Análise</div>
            <p>
              O relatório mostra que houve uma economia total de R$ 5.000,00 em relação ao orçamento previsto para
              o trimestre. Em janeiro e março, os gastos foram menores que o orçado, enquanto em fevereiro houve
              um gasto acima do previsto.
            </p>
          </div>
        </div>
        
        <div class="print-footer">
          <p>Relatório gerado em ${dataAtual} às ${horaAtual} | Universidade do Piso - Sistema de Gestão</p>
          <p>Usuário: ${getUserDisplayName()}</p>
        </div>
      </body>
      </html>
    `

    // Escrever o conteúdo na nova janela
    printWindow.document.open()
    printWindow.document.write(printContent)
    printWindow.document.close()

    // Esperar que o conteúdo seja carregado antes de imprimir
    printWindow.onload = () => {
      printWindow.print()
      // Opcional: fechar a janela após a impressão
      // printWindow.onafterprint = function() {
      //   printWindow.close();
      // };
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 font-roboto">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}

        {/* Relatório Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Button variant="outline" size="sm" className="mr-4" onClick={voltarParaRelatorios}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <h1 className="text-2xl font-semibold text-gray-800">{relatorio.nome}</h1>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex items-center" onClick={exportarRelatorio}>
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm" className="flex items-center" onClick={imprimirRelatorio}>
                  <Printer className="h-4 w-4 mr-1" />
                  Imprimir
                </Button>
              </div>
            </div>

            {/* Informações do Relatório */}
            <Card className="p-6 bg-white rounded-lg shadow-sm mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
                  <p className="mt-1 text-sm text-gray-900">{relatorio.tipo}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Data de Geração</h3>
                  <p className="mt-1 text-sm text-gray-900">{relatorio.data}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Período</h3>
                  <p className="mt-1 text-sm text-gray-900">{relatorio.periodo}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Obra</h3>
                  <p className="mt-1 text-sm text-gray-900">{relatorio.obra}</p>
                </div>
              </div>
            </Card>

            {/* Conteúdo do Relatório */}
            <Card className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Conteúdo do Relatório</h2>

              {/* Aqui você colocaria o conteúdo real do relatório */}
              <div className="prose max-w-none">
                <p>{relatorio.conteudo}</p>

                {/* Exemplo de gráfico ou tabela */}
                <div className="mt-8 border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mês
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Orçado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Realizado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Diferença
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Janeiro</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ 120.000,00</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ 115.000,00</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">-R$ 5.000,00</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Fevereiro</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ 150.000,00</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ 155.000,00</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">+R$ 5.000,00</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Março</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ 180.000,00</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ 175.000,00</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">-R$ 5.000,00</td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </td>
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">R$ 450.000,00</td>
                        <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">R$ 445.000,00</td>
                        <td className="px-6 py-3 text-left text-xs font-medium text-green-600">-R$ 5.000,00</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Análise</h3>
                  <p>
                    O relatório mostra que houve uma economia total de R$ 5.000,00 em relação ao orçamento previsto para
                    o trimestre. Em janeiro e março, os gastos foram menores que o orçado, enquanto em fevereiro houve
                    um gasto acima do previsto.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
