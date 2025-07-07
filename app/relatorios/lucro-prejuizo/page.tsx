"use client"

import { useState, useRef, useEffect } from "react"
import {
  ChevronLeft,
  Download,
  Filter,
  Calendar,
  ChevronDown,
  DollarSign,
  ArrowDownCircle,
  TrendingUp,
  PercentCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import jsPDF from "jspdf"
import { ChartCard } from "@/components/ui/chart-card"

// Interface para relatórios
interface Relatorio {
  id: string
  tipo: string
  data: string
  obra: string
}

// Dados de exemplo para o relatório
const dadosLucroPrejuizo = [
  { obra: "Residencial Vila Nova", receita: 250000, despesa: 180000, lucro: 70000, margem: 28 },
  { obra: "Comercial Centro Empresarial", receita: 420000, despesa: 350000, lucro: 70000, margem: 16.67 },
  { obra: "Reforma Apartamento 302", receita: 85000, despesa: 62000, lucro: 23000, margem: 27.06 },
  { obra: "Condomínio Jardim das Flores", receita: 320000, despesa: 290000, lucro: 30000, margem: 9.38 },
  { obra: "Residencial Parque das Árvores", receita: 180000, despesa: 195000, lucro: -15000, margem: -8.33 },
]

// Dados para o gráfico de barras
const dadosGrafico = {
  labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
  datasets: [
    {
      label: "Receita",
      data: [120000, 150000, 180000, 220000, 250000, 280000],
      backgroundColor: "#4CAF50",
    },
    {
      label: "Despesa",
      data: [100000, 120000, 160000, 180000, 210000, 230000],
      backgroundColor: "#F44336",
    },
    {
      label: "Lucro",
      data: [20000, 30000, 20000, 40000, 40000, 50000],
      backgroundColor: "#2196F3",
    },
  ],
}

export default function RelatorioPrejuizoLucro() {
  const router = useRouter()
  const [periodoSelecionado, setPeriodoSelecionado] = useState<string>("ultimo-trimestre")
  const [obraSelecionada, setObraSelecionada] = useState<string>("todas")
  const [dataInicio, setDataInicio] = useState<Date | undefined>(new Date(2025, 0, 1)) // 1 de Janeiro de 2025
  const [dataFim, setDataFim] = useState<Date | undefined>(new Date(2025, 5, 30)) // 30 de Junho de 2025
  const [visualizacao, setVisualizacao] = useState<string>("mensal")
  const [activeTab, setActiveTab] = useState("grafico")
  const relatorioRef = useRef<HTMLDivElement>(null)
  const [relatorios, setRelatorios] = useState<Relatorio[]>([])

  // Verificar se há um parâmetro de URL para exportar
  useEffect(() => {
    // Verificar se estamos no navegador
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const deveExportar = params.get("exportar") === "true";
      
      // Verificar se devemos exportar automaticamente
      if (deveExportar) {
        // Pequeno atraso para garantir que a página esteja totalmente carregada
        const timer = setTimeout(() => {
          exportarRelatorio();
          
          // Limpar o parâmetro da URL após a exportação
          router.replace("/relatorios/lucro-prejuizo", { scroll: false });
          
          // Limpar o ID do relatório armazenado
          localStorage.removeItem("relatorio-para-exportar");
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Função para voltar à página anterior
  const voltarParaRelatorios = () => {
    router.push("/relatorios")
  }

  // Função para exportar o relatório em PDF
  const exportarRelatorio = async () => {
    try {
      // Criar o PDF com orientação paisagem para melhor visualização dos dados
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      const contentWidth = pageWidth - 2 * margin

      // Função auxiliar para adicionar texto com quebra de linha
      const addWrappedText = (text, x, y, maxWidth, lineHeight) => {
        const lines = pdf.splitTextToSize(text, maxWidth)
        pdf.text(lines, x, y)
        return y + lineHeight * lines.length
      }

      // Adicionar cabeçalho
      pdf.setFillColor(30, 42, 74) // Cor corporativa
      pdf.rect(0, 0, pageWidth, 25, "F")

      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(18)
      pdf.setFont("helvetica", "bold")
      pdf.text("Universidade do Piso", margin, 12)

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "normal")
      pdf.text("Relatório de Lucro/Prejuízo", pageWidth - margin, 12, { align: "right" })

      // Adicionar informações do relatório
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(11)
      let yPos = 35

      pdf.setFont("helvetica", "bold")
      pdf.text("Informações do Relatório", margin, yPos)
      yPos += 7

      pdf.setFont("helvetica", "normal")
      pdf.text(`Período: ${formatarPeriodo()}`, margin, yPos)
      yPos += 6

      pdf.text(`Obra: ${obraSelecionada === "todas" ? "Todas as obras" : obraSelecionada}`, margin, yPos)
      yPos += 6

      pdf.text(`Visualização: ${visualizacao.charAt(0).toUpperCase() + visualizacao.slice(1)}`, margin, yPos)
      yPos += 6

      pdf.text(`Data de geração: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, margin, yPos)
      yPos += 12

      // Adicionar resumo financeiro
      pdf.setFillColor(245, 247, 250)
      pdf.rect(margin, yPos, contentWidth, 30, "F")

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text("Resumo Financeiro", margin + 5, yPos + 8)

      const colWidth = contentWidth / 4

      // Títulos das colunas
      pdf.setFontSize(10)
      pdf.text("Receita Total", margin + 5, yPos + 16)
      pdf.text("Despesa Total", margin + 5 + colWidth, yPos + 16)
      pdf.text("Lucro/Prejuízo", margin + 5 + colWidth * 2, yPos + 16)
      pdf.text("Margem de Lucro", margin + 5 + colWidth * 3, yPos + 16)

      // Valores
      pdf.setFont("helvetica", "normal")
      pdf.text(formatarMoeda(totais.receita), margin + 5, yPos + 24)
      pdf.text(formatarMoeda(totais.despesa), margin + 5 + colWidth, yPos + 24)

      // Colorir o lucro/prejuízo de acordo com o valor
      if (totais.lucro >= 0) {
        pdf.setTextColor(0, 128, 0) // Verde para lucro
      } else {
        pdf.setTextColor(220, 0, 0) // Vermelho para prejuízo
      }
      pdf.text(formatarMoeda(totais.lucro), margin + 5 + colWidth * 2, yPos + 24)

      // Colorir a margem de acordo com o valor
      if (margemTotal >= 0) {
        pdf.setTextColor(0, 128, 0) // Verde para margem positiva
      } else {
        pdf.setTextColor(220, 0, 0) // Vermelho para margem negativa
      }
      pdf.text(formatarPercentual(margemTotal), margin + 5 + colWidth * 3, yPos + 24)

      // Resetar cor do texto
      pdf.setTextColor(0, 0, 0)
      yPos += 40

      // Adicionar tabela detalhada
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text("Detalhamento por Obra", margin, yPos)
      yPos += 10

      // Definir larguras das colunas
      const tableColWidths = [
        contentWidth * 0.35, // Obra
        contentWidth * 0.15, // Receita
        contentWidth * 0.15, // Despesa
        contentWidth * 0.15, // Lucro/Prejuízo
        contentWidth * 0.15, // Margem
      ]

      // Cabeçalho da tabela
      pdf.setFillColor(240, 240, 240)
      pdf.rect(margin, yPos, contentWidth, 8, "F")

      pdf.setFontSize(10)
      let xPos = margin + 3
      pdf.text("Obra", xPos, yPos + 5)
      xPos += tableColWidths[0]

      pdf.text("Receita", xPos, yPos + 5)
      xPos += tableColWidths[1]

      pdf.text("Despesa", xPos, yPos + 5)
      xPos += tableColWidths[2]

      pdf.text("Lucro/Prejuízo", xPos, yPos + 5)
      xPos += tableColWidths[3]

      pdf.text("Margem", xPos, yPos + 5)

      yPos += 8

      // Dados da tabela
      pdf.setFont("helvetica", "normal")

      // Verificar se precisamos adicionar uma nova página para a tabela
      if (yPos + (dadosLucroPrejuizo.length + 1) * 8 > pageHeight - margin) {
        pdf.addPage()
        yPos = margin + 10

        // Repetir cabeçalho da tabela na nova página
        pdf.setFillColor(240, 240, 240)
        pdf.rect(margin, yPos, contentWidth, 8, "F")

        pdf.setFontSize(10)
        pdf.setFont("helvetica", "bold")

        xPos = margin + 3
        pdf.text("Obra", xPos, yPos + 5)
        xPos += tableColWidths[0]

        pdf.text("Receita", xPos, yPos + 5)
        xPos += tableColWidths[1]

        pdf.text("Despesa", xPos, yPos + 5)
        xPos += tableColWidths[2]

        pdf.text("Lucro/Prejuízo", xPos, yPos + 5)
        xPos += tableColWidths[3]

        pdf.text("Margem", xPos, yPos + 5)

        yPos += 8
        pdf.setFont("helvetica", "normal")
      }

      // Alternar cores das linhas para melhor legibilidade
      let isAlternate = false

      dadosLucroPrejuizo.forEach((item) => {
        if (isAlternate) {
          pdf.setFillColor(248, 248, 248)
          pdf.rect(margin, yPos, contentWidth, 8, "F")
        }
        isAlternate = !isAlternate

        xPos = margin + 3
        pdf.text(item.obra, xPos, yPos + 5)
        xPos += tableColWidths[0]

        pdf.text(formatarMoeda(item.receita), xPos, yPos + 5, { align: "left" })
        xPos += tableColWidths[1]

        pdf.text(formatarMoeda(item.despesa), xPos, yPos + 5, { align: "left" })
        xPos += tableColWidths[2]

        // Colorir o lucro/prejuízo de acordo com o valor
        if (item.lucro >= 0) {
          pdf.setTextColor(0, 128, 0) // Verde para lucro
        } else {
          pdf.setTextColor(220, 0, 0) // Vermelho para prejuízo
        }
        pdf.text(formatarMoeda(item.lucro), xPos, yPos + 5, { align: "left" })
        xPos += tableColWidths[3]

        // Colorir a margem de acordo com o valor
        if (item.margem >= 0) {
          pdf.setTextColor(0, 128, 0) // Verde para margem positiva
        } else {
          pdf.setTextColor(220, 0, 0) // Vermelho para margem negativa
        }
        pdf.text(formatarPercentual(item.margem), xPos, yPos + 5, { align: "left" })

        // Resetar cor do texto
        pdf.setTextColor(0, 0, 0)

        yPos += 8

        // Verificar se precisamos adicionar uma nova página
        if (yPos > pageHeight - margin && dadosLucroPrejuizo.indexOf(item) < dadosLucroPrejuizo.length - 1) {
          pdf.addPage()
          yPos = margin + 10
          isAlternate = false
        }
      })

      // Adicionar linha de total
      pdf.setFillColor(220, 220, 220)
      pdf.rect(margin, yPos, contentWidth, 8, "F")

      pdf.setFont("helvetica", "bold")
      xPos = margin + 3
      pdf.text("Total", xPos, yPos + 5)
      xPos += tableColWidths[0]

      pdf.text(formatarMoeda(totais.receita), xPos, yPos + 5, { align: "left" })
      xPos += tableColWidths[1]

      pdf.text(formatarMoeda(totais.despesa), xPos, yPos + 5, { align: "left" })
      xPos += tableColWidths[2]

      // Colorir o lucro/prejuízo total de acordo com o valor
      if (totais.lucro >= 0) {
        pdf.setTextColor(0, 128, 0) // Verde para lucro
      } else {
        pdf.setTextColor(220, 0, 0) // Vermelho para prejuízo
      }
      pdf.text(formatarMoeda(totais.lucro), xPos, yPos + 5, { align: "left" })
      xPos += tableColWidths[3]

      // Colorir a margem total de acordo com o valor
      if (margemTotal >= 0) {
        pdf.setTextColor(0, 128, 0) // Verde para margem positiva
      } else {
        pdf.setTextColor(220, 0, 0) // Vermelho para margem negativa
      }
      pdf.text(formatarPercentual(margemTotal), xPos, yPos + 5, { align: "left" })

      // Resetar cor do texto
      pdf.setTextColor(0, 0, 0)

      // Adicionar nova página para análise e conclusões
      pdf.addPage()
      yPos = margin

      // Título da seção de análise
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Análise de Desempenho", margin, yPos)
      yPos += 10

      // Adicionar análise textual
      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")

      let analiseTexto = ""
      if (totais.lucro > 0) {
        analiseTexto = `No período analisado, as operações apresentaram um resultado positivo com lucro total de ${formatarMoeda(totais.lucro)}, representando uma margem de ${formatarPercentual(margemTotal)} sobre a receita total de ${formatarMoeda(totais.receita)}.`
      } else {
        analiseTexto = `No período analisado, as operações apresentaram um resultado negativo com prejuízo total de ${formatarMoeda(Math.abs(totais.lucro))}, representando uma margem negativa de ${formatarPercentual(Math.abs(margemTotal))} sobre a receita total de ${formatarMoeda(totais.receita)}.`
      }

      yPos = addWrappedText(analiseTexto, margin, yPos, contentWidth, 6)
      yPos += 8

      // Adicionar análise por obra
      const obrasLucrativas = dadosLucroPrejuizo.filter((item) => item.lucro > 0)
      const obrasPrejuizo = dadosLucroPrejuizo.filter((item) => item.lucro < 0)

      if (obrasLucrativas.length > 0) {
        const obraMaisLucrativa = obrasLucrativas.reduce((prev, current) =>
          prev.lucro > current.lucro ? prev : current,
        )

        const textoLucrativas = `A obra mais lucrativa foi "${obraMaisLucrativa.obra}" com lucro de ${formatarMoeda(obraMaisLucrativa.lucro)} e margem de ${formatarPercentual(obraMaisLucrativa.margem)}.`
        yPos = addWrappedText(textoLucrativas, margin, yPos, contentWidth, 6)
        yPos += 8
      }

      if (obrasPrejuizo.length > 0) {
        const obraMaisPrejuizo = obrasPrejuizo.reduce((prev, current) => (prev.lucro < current.lucro ? prev : current))

        const textoPrejuizo = `A obra com maior prejuízo foi "${obraMaisPrejuizo.obra}" com prejuízo de ${formatarMoeda(Math.abs(obraMaisPrejuizo.lucro))} e margem negativa de ${formatarPercentual(Math.abs(obraMaisPrejuizo.margem))}.`
        yPos = addWrappedText(textoPrejuizo, margin, yPos, contentWidth, 6)
        yPos += 8
      }

      // Adicionar recomendações
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Recomendações", margin, yPos)
      yPos += 10

      pdf.setFontSize(11)
      pdf.setFont("helvetica", "normal")

      let recomendacoes = ""
      if (totais.lucro > 0) {
        recomendacoes = "Com base nos resultados positivos, recomenda-se:"
        yPos = addWrappedText(recomendacoes, margin, yPos, contentWidth, 6)
        yPos += 6

        const recomendacoesPositivas = [
          "Manter as estratégias de gestão financeira que têm se mostrado eficazes.",
          "Analisar as obras mais lucrativas para replicar suas práticas em projetos futuros.",
          "Considerar a expansão em segmentos que demonstraram melhor desempenho.",
        ]

        recomendacoesPositivas.forEach((rec) => {
          yPos = addWrappedText(`• ${rec}`, margin + 5, yPos, contentWidth - 5, 6)
          yPos += 6
        })
      } else {
        recomendacoes = "Com base nos resultados negativos, recomenda-se:"
        yPos = addWrappedText(recomendacoes, margin, yPos, contentWidth, 6)
        yPos += 6

        const recomendacoesNegativas = [
          "Revisar a estrutura de custos das obras com prejuízo para identificar oportunidades de redução.",
          "Reavaliar a precificação dos serviços para garantir margens adequadas.",
          "Implementar controles financeiros mais rigorosos para monitorar despesas em tempo real.",
        ]

        recomendacoesNegativas.forEach((rec) => {
          yPos = addWrappedText(`• ${rec}`, margin + 5, yPos, contentWidth - 5, 6)
          yPos += 6
        })
      }

      // Adicionar rodapé em todas as páginas
      const totalPages = pdf.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)

        // Linha separadora do rodapé
        pdf.setDrawColor(200, 200, 200)
        pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15)

        // Texto do rodapé
        pdf.setFontSize(8)
        pdf.setTextColor(100, 100, 100)
        pdf.text(
          `Universidade do Piso - Relatório gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
          margin,
          pageHeight - 10,
        )
        pdf.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: "right" })
      }

      // Salvar o PDF
      pdf.save(`Relatorio_Lucro_Prejuizo_${format(new Date(), "dd-MM-yyyy_HH-mm", { locale: ptBR })}.pdf`)
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error)
      alert("Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.")
    }
  }

  // Função para formatar valores monetários
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  // Função para formatar percentuais
  const formatarPercentual = (valor: number) => {
    return valor.toFixed(2) + "%"
  }

  // Função para formatar o período selecionado
  const formatarPeriodo = () => {
    if (dataInicio && dataFim) {
      return `${format(dataInicio, "dd/MM/yyyy", { locale: ptBR })} - ${format(dataFim, "dd/MM/yyyy", {
        locale: ptBR,
      })}`
    }
    return "Selecionar período"
  }

  // Calcular totais
  const totais = dadosLucroPrejuizo.reduce(
    (acc, item) => {
      acc.receita += item.receita
      acc.despesa += item.despesa
      acc.lucro += item.lucro
      return acc
    },
    { receita: 0, despesa: 0, lucro: 0 },
  )

  const margemTotal = (totais.lucro / totais.receita) * 100

  // Função para alternar entre as abas
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto" ref={relatorioRef}>
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Button variant="ghost" size="sm" onClick={voltarParaRelatorios} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Lucro/Prejuízo</h1>
          </div>
          <Button onClick={exportarRelatorio} className="bg-[#1e2a4a] hover:bg-[#15203a] text-white">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <CardTitle className="text-lg font-medium">Filtros</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatarPeriodo()}
                      <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="grid grid-cols-2 gap-2 p-2">
                      <div>
                        <p className="text-sm font-medium mb-1">De:</p>
                        <CalendarComponent mode="single" selected={dataInicio} onSelect={setDataInicio} locale={ptBR} />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Até:</p>
                        <CalendarComponent mode="single" selected={dataFim} onSelect={setDataFim} locale={ptBR} />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Obra</label>
                <Select value={obraSelecionada} onValueChange={setObraSelecionada}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas as obras" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as obras</SelectItem>
                    <SelectItem value="residencial-vila-nova">Residencial Vila Nova</SelectItem>
                    <SelectItem value="comercial-centro">Comercial Centro Empresarial</SelectItem>
                    <SelectItem value="reforma-apto">Reforma Apartamento 302</SelectItem>
                    <SelectItem value="condominio-jardim">Condomínio Jardim das Flores</SelectItem>
                    <SelectItem value="residencial-parque">Residencial Parque das Árvores</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visualização</label>
                <Select value={visualizacao} onValueChange={setVisualizacao}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Mensal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardContent className="p-0">
              <div className="flex items-start p-6">
                <div className="bg-blue-100 p-4 rounded-full mr-4">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500 mb-1">Receita Total</div>
                  <div className="text-3xl font-bold text-gray-900">{formatarMoeda(totais.receita)}</div>
                  <div className="text-xs text-gray-500 mt-2">Valor total recebido no período selecionado</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardContent className="p-0">
              <div className="flex items-start p-6">
                <div className="bg-red-100 p-4 rounded-full mr-4">
                  <ArrowDownCircle className="h-8 w-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500 mb-1">Despesa Total</div>
                  <div className="text-3xl font-bold text-gray-900">{formatarMoeda(totais.despesa)}</div>
                  <div className="text-xs text-gray-500 mt-2">Valor total gasto no período selecionado</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardContent className="p-0">
              <div className="flex items-start p-6">
                <div className="bg-green-100 p-4 rounded-full mr-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500 mb-1">Lucro/Prejuízo</div>
                  <div className={`text-3xl font-bold ${totais.lucro >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatarMoeda(totais.lucro)}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {totais.lucro >= 0 ? "Lucro obtido" : "Prejuízo registrado"} no período
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardContent className="p-0">
              <div className="flex items-start p-6">
                <div className="bg-purple-100 p-4 rounded-full mr-4">
                  <PercentCircle className="h-8 w-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500 mb-1">Margem de Lucro</div>
                  <div className={`text-3xl font-bold ${margemTotal >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatarPercentual(margemTotal)}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Percentual de lucro sobre a receita total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos e Tabelas */}
        <div className="mb-8">
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardHeader className="border-b pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">
                  {activeTab === "grafico" ? "Evolução de Receitas, Despesas e Lucro" : "Detalhamento por Obra"}
                </CardTitle>
                <div className="flex bg-gray-100 rounded-md p-1">
                  <button
                    onClick={() => handleTabChange("grafico")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "grafico" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Gráfico
                  </button>
                  <button
                    onClick={() => handleTabChange("tabela")}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeTab === "tabela" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Tabela
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {activeTab === "grafico" ? (
                <div className="h-80 w-full">
                  <ChartCard
                    type="bar"
                    data={{
                      labels: dadosGrafico.labels,
                      datasets: [
                        {
                          label: "Receita",
                          data: dadosGrafico.datasets[0].data,
                          backgroundColor: "#4CAF50",
                          borderColor: "#4CAF50",
                          borderWidth: 1,
                        },
                        {
                          label: "Despesa",
                          data: dadosGrafico.datasets[1].data,
                          backgroundColor: "#F44336",
                          borderColor: "#F44336",
                          borderWidth: 1,
                        },
                        {
                          label: "Lucro",
                          data: dadosGrafico.datasets[2].data,
                          backgroundColor: "#2196F3",
                          borderColor: "#2196F3",
                          borderWidth: 1,
                        },
                      ],
                    }}
                    height={300}
                    options={{
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              let label = context.dataset.label || ""
                              if (label) {
                                label += ": "
                              }
                              if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(context.parsed.y)
                              }
                              return label
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Obra
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Receita
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Despesa
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lucro/Prejuízo
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Margem
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosLucroPrejuizo.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.obra}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatarMoeda(item.receita)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {formatarMoeda(item.despesa)}
                          </td>
                          <td
                            className={`px-4 py-4 whitespace-nowrap text-sm font-medium text-right ${
                              item.lucro >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {formatarMoeda(item.lucro)}
                          </td>
                          <td
                            className={`px-4 py-4 whitespace-nowrap text-sm font-medium text-right ${
                              item.margem >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {formatarPercentual(item.margem)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-medium">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Total</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                          {formatarMoeda(totais.receita)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                          {formatarMoeda(totais.despesa)}
                        </td>
                        <td
                          className={`px-4 py-4 whitespace-nowrap text-sm font-bold text-right ${
                            totais.lucro >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatarMoeda(totais.lucro)}
                        </td>
                        <td
                          className={`px-4 py-4 whitespace-nowrap text-sm font-bold text-right ${
                            margemTotal >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatarPercentual(margemTotal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
