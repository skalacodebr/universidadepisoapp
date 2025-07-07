"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Chart, registerables } from "chart.js"
import jsPDF from "jspdf"

Chart.register(...registerables)

// Dados de exemplo para o relatório
const dadosRelatorio = {
  categorias: [
    { nome: "Mão de Obra", orcado: 150000, realizado: 165000, diferenca: -15000, status: "Acima do orçamento" },
    { nome: "Equipamentos", orcado: 85000, realizado: 79000, diferenca: 6000, status: "Dentro do orçamento" },
    { nome: "Insumos", orcado: 220000, realizado: 235000, diferenca: -15000, status: "Acima do orçamento" },
    { nome: "Logística", orcado: 45000, realizado: 38000, diferenca: 7000, status: "Dentro do orçamento" },
    { nome: "Impostos", orcado: 30000, realizado: 32000, diferenca: -2000, status: "Acima do orçamento" },
  ],
  total: { orcado: 530000, realizado: 549000, diferenca: -19000, status: "Prejuízo" },
}

export default function OrcadoRealizado() {
  const router = useRouter()
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Estados para controlar a paginação
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(5)
  const [exportando, setExportando] = useState(false)

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
          exportarDados();
          
          // Limpar o parâmetro da URL após a exportação
          router.replace("/relatorios/orcado-realizado", { scroll: false });
          
          // Limpar o ID do relatório armazenado
          localStorage.removeItem("relatorio-para-exportar");
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Formatar valores monetários
  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    })
  }

  // Voltar para a página de relatórios
  const voltarParaRelatorios = () => {
    router.push("/relatorios")
  }

  // Função para carregar a logo
  const carregarLogo = () => {
    return new Promise<string>((resolve) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        // Criar um canvas para manipular a imagem
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        // Definir as dimensões do canvas
        canvas.width = img.width
        canvas.height = img.height

        // Desenhar a imagem no canvas
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          // Converter para base64
          const dataURL = canvas.toDataURL("image/png")
          resolve(dataURL)
        } else {
          // Fallback se o contexto não estiver disponível
          resolve("")
        }
      }

      img.onerror = () => {
        console.error("Erro ao carregar a logo")
        resolve("")
      }

      // URL da imagem fornecida
      img.src =
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-semfundo-j9028owJifdLNjGJAde2XlnPVCAr5G.png"
    })
  }

  // Exportar dados para PDF
  const exportarDados = async () => {
    try {
      // Mostrar feedback visual
      setExportando(true)

      // Carregar logo
      const logoBase64 = await carregarLogo()

      // Criar um novo documento PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Configurações de página
      const larguraPagina = pdf.internal.pageSize.getWidth()
      const alturaPagina = pdf.internal.pageSize.getHeight()
      const margemLateral = 15
      const larguraUtil = larguraPagina - margemLateral * 2

      // Cores e estilos
      const corPrimaria = [30, 42, 74]
      const corSecundaria = [0, 126, 163]
      const corTexto = [60, 60, 60]
      const corSubtitulo = [100, 100, 100]

      // Função para adicionar cabeçalho
      const adicionarCabecalho = (titulo) => {
        // Fundo do cabeçalho
        pdf.setFillColor(...corPrimaria)
        pdf.rect(0, 0, larguraPagina, 25, "F")

        // Adicionar logo
        if (logoBase64) {
          // Dimensões da logo (reduzidas)
          const logoLargura = 30
          const logoAltura = 12

          // Adicionar a imagem da logo
          pdf.addImage(logoBase64, "PNG", margemLateral, 6, logoLargura, logoAltura)
        } else {
          // Fallback se a logo não carregar
          pdf.setFillColor(255, 255, 255)
          pdf.roundedRect(margemLateral, 5, 40, 15, 2, 2, "F")
          pdf.setTextColor(...corPrimaria)
          pdf.setFontSize(10)
          pdf.setFont("helvetica", "bold")
          pdf.text("UNIVERSIDADE DO PISO", margemLateral + 20, 14, { align: "center" })
        }

        // Título do relatório
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bold")
        pdf.text(titulo, larguraPagina / 2, 16, { align: "center" })

        // Aumentar o espaçamento após o cabeçalho
        return 40 // Retorna a posição Y após o cabeçalho com mais espaço
      }

      // Função para adicionar rodapé
      const adicionarRodape = (numeroPagina, totalPaginas) => {
        pdf.setTextColor(...corSubtitulo)
        pdf.setFontSize(9)
        pdf.setFont("helvetica", "normal")
        pdf.text(`Página ${numeroPagina} de ${totalPaginas}`, larguraPagina / 2, alturaPagina - 10, { align: "center" })
        pdf.text("Universidade do Piso - Relatório Orçado vs Realizado", margemLateral, alturaPagina - 10)

        // Adicionar data e hora no rodapé
        const dataHora = new Date().toLocaleString("pt-BR")
        pdf.text(`Gerado em: ${dataHora}`, larguraPagina - margemLateral, alturaPagina - 10, { align: "right" })
      }

      // Função para adicionar título de seção
      const adicionarTituloSecao = (texto, posicaoY) => {
        pdf.setTextColor(...corPrimaria)
        pdf.setFontSize(14)
        pdf.setFont("helvetica", "bold")
        pdf.text(texto, margemLateral, posicaoY)

        // Calcular o comprimento do texto para a linha decorativa
        const comprimentoTexto = pdf.getStringUnitWidth(texto) * 14 * 0.352778 // Converter para mm

        // Linha decorativa sob o título com o mesmo comprimento do texto
        pdf.setDrawColor(...corSecundaria)
        pdf.setLineWidth(0.5)
        pdf.line(margemLateral, posicaoY + 1, margemLateral + comprimentoTexto, posicaoY + 1)

        return posicaoY + 8
      }

      // Função para adicionar subtítulo
      const adicionarSubtitulo = (texto, posicaoY) => {
        pdf.setTextColor(...corSubtitulo)
        pdf.setFontSize(11)
        pdf.setFont("helvetica", "italic")
        pdf.text(texto, margemLateral, posicaoY)
        return posicaoY + 6
      }

      // Função para adicionar texto normal
      const adicionarTexto = (texto, posicaoY) => {
        pdf.setTextColor(...corTexto)
        pdf.setFontSize(10)
        pdf.setFont("helvetica", "normal")
        pdf.text(texto, margemLateral, posicaoY)
        return posicaoY + 6
      }

      // Função para criar tabela
      const criarTabela = (dados, cabecalhos, posicaoY, largurasColunas) => {
        // Configurações da tabela
        const alturaLinha = 8
        const paddingCelula = 2
        const totalLinhas = dados.length

        // Desenhar cabeçalho da tabela
        pdf.setFillColor(240, 240, 240)
        pdf.rect(margemLateral, posicaoY - 6, larguraUtil, alturaLinha, "F")

        pdf.setDrawColor(200, 200, 200)
        pdf.setLineWidth(0.1)

        // Linhas horizontais do cabeçalho
        pdf.line(margemLateral, posicaoY - 6, margemLateral + larguraUtil, posicaoY - 6)
        pdf.line(margemLateral, posicaoY + 2, margemLateral + larguraUtil, posicaoY + 2)

        // Texto do cabeçalho
        pdf.setTextColor(80, 80, 80)
        pdf.setFontSize(9)
        pdf.setFont("helvetica", "bold")

        let posicaoX = margemLateral + paddingCelula
        cabecalhos.forEach((cabecalho, index) => {
          pdf.text(cabecalho, posicaoX, posicaoY - 1)
          posicaoX += largurasColunas[index]
        })

        // Desenhar linhas de dados
        pdf.setTextColor(...corTexto)
        pdf.setFontSize(9)
        pdf.setFont("helvetica", "normal")

        let posicaoYAtual = posicaoY + 2

        // Desenhar linhas de dados
        dados.forEach((linha, indexLinha) => {
          // Alternar cores de fundo para facilitar leitura
          if (indexLinha % 2 === 1) {
            pdf.setFillColor(248, 248, 248)
            pdf.rect(margemLateral, posicaoYAtual, larguraUtil, alturaLinha, "F")
          }

          // Linha horizontal
          pdf.line(margemLateral, posicaoYAtual + alturaLinha, margemLateral + larguraUtil, posicaoYAtual + alturaLinha)

          // Texto das células
          posicaoX = margemLateral + paddingCelula
          Object.values(linha).forEach((valor, index) => {
            // Alinhamento à direita para valores numéricos
            const alinhamento = typeof valor === "number" || valor.startsWith("R$") ? "right" : "left"
            const posX = alinhamento === "right" ? posicaoX + largurasColunas[index] - paddingCelula - 2 : posicaoX

            pdf.text(String(valor), posX, posicaoYAtual + 5, {
              align: alinhamento,
            })
            posicaoX += largurasColunas[index]
          })

          posicaoYAtual += alturaLinha
        })

        // Linha final da tabela
        pdf.line(margemLateral, posicaoYAtual, margemLateral + larguraUtil, posicaoYAtual)

        // Linhas verticais
        let linhaX = margemLateral
        pdf.line(linhaX, posicaoY - 6, linhaX, posicaoYAtual)

        largurasColunas.forEach((largura) => {
          linhaX += largura
          pdf.line(linhaX, posicaoY - 6, linhaX, posicaoYAtual)
        })

        return posicaoYAtual + 5
      }

      // Função para adicionar gráfico
      const adicionarGrafico = async (posicaoY) => {
        // Capturar o gráfico atual como imagem
        if (!chartRef.current) return posicaoY

        // Salvar o canvas original
        const canvas = chartRef.current

        // Criar um novo canvas com fundo branco para garantir qualidade
        const novoCanvas = document.createElement("canvas")
        novoCanvas.width = canvas.width
        novoCanvas.height = canvas.height
        const ctx = novoCanvas.getContext("2d")

        if (ctx) {
          // Fundo branco
          ctx.fillStyle = "white"
          ctx.fillRect(0, 0, novoCanvas.width, novoCanvas.height)

          // Desenhar o gráfico original
          ctx.drawImage(canvas, 0, 0)

          // Converter para imagem
          const imgData = novoCanvas.toDataURL("image/png", 1.0)

          // Calcular dimensões mantendo proporção
          const imgWidth = larguraUtil
          const imgHeight = (canvas.height * imgWidth) / canvas.width

          // Adicionar ao PDF
          pdf.addImage(imgData, "PNG", margemLateral, posicaoY, imgWidth, imgHeight)

          return posicaoY + imgHeight + 10
        }

        return posicaoY
      }

      // Preparar dados para o relatório
      const dadosTabela = dadosRelatorio.categorias.map((cat) => ({
        categoria: cat.nome,
        orcado: formatarValor(cat.orcado),
        realizado: formatarValor(cat.realizado),
        diferenca: (cat.diferenca >= 0 ? "" : "-") + formatarValor(Math.abs(cat.diferenca)),
        status: cat.status,
      }))

      // Adicionar linha de total
      dadosTabela.push({
        categoria: "Total",
        orcado: formatarValor(dadosRelatorio.total.orcado),
        realizado: formatarValor(dadosRelatorio.total.realizado),
        diferenca:
          (dadosRelatorio.total.diferenca >= 0 ? "" : "-") + formatarValor(Math.abs(dadosRelatorio.total.diferenca)),
        status: dadosRelatorio.total.status,
      })

      // Larguras das colunas (em mm, deve somar larguraUtil)
      const largurasColunas = [50, 35, 35, 35, 35]

      // Iniciar a primeira página
      let posicaoY = adicionarCabecalho("Relatório: Orçado X Realizado")

      // Adicionar resumo executivo
      posicaoY = adicionarTituloSecao("Resumo Executivo", posicaoY)
      posicaoY = adicionarTexto(
        `Este relatório apresenta uma análise comparativa entre os valores orçados e realizados`,
        posicaoY + 2,
      )
      posicaoY = adicionarTexto(
        `para diferentes categorias de despesas. O período analisado mostra um total orçado de`,
        posicaoY,
      )
      posicaoY = adicionarTexto(
        `${formatarValor(dadosRelatorio.total.orcado)} contra um realizado de ${formatarValor(dadosRelatorio.total.realizado)}.`,
        posicaoY,
      )

      // Status geral
      const statusGeral =
        dadosRelatorio.total.diferenca >= 0
          ? `O projeto está dentro do orçamento, com economia de ${formatarValor(Math.abs(dadosRelatorio.total.diferenca))}.`
          : `O projeto está acima do orçamento, com excedente de ${formatarValor(Math.abs(dadosRelatorio.total.diferenca))}.`

      posicaoY = adicionarTexto(statusGeral, posicaoY + 2)

      // Adicionar seção de gráfico
      posicaoY = adicionarTituloSecao("Análise Gráfica", posicaoY + 8)
      posicaoY = adicionarSubtitulo("Comparativo entre valores orçados e realizados por categoria", posicaoY)
      posicaoY = await adicionarGrafico(posicaoY)

      // Verificar se precisa de nova página para a tabela
      if (posicaoY > alturaPagina - 100) {
        pdf.addPage()
        posicaoY = adicionarCabecalho("Relatório: Orçado X Realizado (continuação)")
      }

      // Adicionar tabela de dados
      posicaoY = adicionarTituloSecao("Detalhamento por Categoria", posicaoY + 5)
      posicaoY = adicionarSubtitulo("Valores em Reais (R$)", posicaoY)
      posicaoY = criarTabela(
        dadosTabela,
        ["Categoria", "Orçado", "Realizado", "Diferença", "Status"],
        posicaoY + 5,
        largurasColunas,
      )

      // Adicionar conclusões
      if (posicaoY > alturaPagina - 60) {
        pdf.addPage()
        posicaoY = adicionarCabecalho("Relatório: Orçado X Realizado (continuação)")
      }

      posicaoY = adicionarTituloSecao("Conclusões e Recomendações", posicaoY + 5)

      // Calcular categorias com maior desvio
      const categoriasOrdenadas = [...dadosRelatorio.categorias].sort(
        (a, b) => Math.abs(b.diferenca) - Math.abs(a.diferenca),
      )

      const maiorDesvioPositivo = categoriasOrdenadas.find((cat) => cat.diferenca > 0)
      const maiorDesvioNegativo = categoriasOrdenadas.find((cat) => cat.diferenca < 0)

      if (maiorDesvioPositivo) {
        posicaoY = adicionarTexto(
          `• A categoria "${maiorDesvioPositivo.nome}" apresenta a maior economia, com ${formatarValor(Math.abs(maiorDesvioPositivo.diferenca))}`,
          posicaoY,
        )
        posicaoY = adicionarTexto(`  abaixo do orçamento previsto.`, posicaoY)
      }

      if (maiorDesvioNegativo) {
        posicaoY = adicionarTexto(
          `• A categoria "${maiorDesvioNegativo.nome}" apresenta o maior excedente, com ${formatarValor(Math.abs(maiorDesvioNegativo.diferenca))}`,
          posicaoY,
        )
        posicaoY = adicionarTexto(`  acima do orçamento previsto.`, posicaoY)
      }

      // Recomendações gerais
      posicaoY = adicionarTexto(
        `• Recomenda-se revisão dos processos de orçamentação para as categorias com maiores desvios.`,
        posicaoY + 2,
      )
      posicaoY = adicionarTexto(
        `• Para próximos projetos, considerar os valores realizados como base para estimativas mais precisas.`,
        posicaoY,
      )

      // Adicionar rodapés em todas as páginas
      const totalPaginas = pdf.getNumberOfPages()
      for (let i = 1; i <= totalPaginas; i++) {
        pdf.setPage(i)
        adicionarRodape(i, totalPaginas)
      }

      // Salvar PDF
      const dataFormatada = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")
      pdf.save(`Relatorio_Orcado_Realizado_${dataFormatada}.pdf`)

      setExportando(false)
    } catch (error) {
      console.error("Erro ao exportar PDF:", error)
      setExportando(false)
      alert("Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.")
    }
  }

  // Inicializar gráfico
  useEffect(() => {
    if (!chartRef.current) return

    // Destruir gráfico anterior se existir
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    const labels = dadosRelatorio.categorias.map((cat) => cat.nome)
    const orcados = dadosRelatorio.categorias.map((cat) => cat.orcado)
    const realizados = dadosRelatorio.categorias.map((cat) => cat.realizado)

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Orçado",
            data: orcados,
            backgroundColor: "rgba(245, 158, 11, 0.6)",
            borderColor: "rgba(245, 158, 11, 1)",
            borderWidth: 1,
          },
          {
            label: "Realizado",
            data: realizados,
            backgroundColor: "rgba(59, 130, 246, 0.6)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            align: "end",
            labels: {
              usePointStyle: true,
              boxWidth: 8,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || ""
                if (label) {
                  label += ": "
                }
                if (context.parsed.y !== null) {
                  label += formatarValor(context.parsed.y)
                }
                return label
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => formatarValor(Number(value)),
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  // Cálculos para a paginação
  const totalItens = dadosRelatorio.categorias.length
  const totalPaginas = Math.ceil(totalItens / itensPorPagina)

  // Índices dos itens a serem exibidos na página atual
  const indiceInicial = (paginaAtual - 1) * itensPorPagina
  const indiceFinal = Math.min(indiceInicial + itensPorPagina, totalItens)

  // Itens da página atual
  const itensPaginaAtual = useMemo(() => {
    return dadosRelatorio.categorias.slice(indiceInicial, indiceFinal)
  }, [paginaAtual, itensPorPagina])

  // Função para mudar de página
  const mudarPagina = (novaPagina: number) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina)
    }
  }

  // Gerar botões de página
  const botoesNumericos = useMemo(() => {
    const botoes = []
    const maxBotoes = 3 // Número máximo de botões a serem exibidos

    let inicio = Math.max(1, paginaAtual - Math.floor(maxBotoes / 2))
    const fim = Math.min(totalPaginas, inicio + maxBotoes - 1)

    // Ajustar o início se o fim estiver no limite
    if (fim === totalPaginas) {
      inicio = Math.max(1, fim - maxBotoes + 1)
    }

    for (let i = inicio; i <= fim; i++) {
      botoes.push(
        <Button
          key={i}
          variant={i === paginaAtual ? "default" : "outline"}
          size="sm"
          className={`h-8 w-8 p-0 ${i === paginaAtual ? "bg-[#007EA3]" : ""}`}
          onClick={() => mudarPagina(i)}
        >
          {i}
        </Button>,
      )
    }

    return botoes
  }, [paginaAtual, totalPaginas])

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto" id="relatorio-conteudo">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={voltarParaRelatorios} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Orçado X Realizado</h1>
          </div>
          <Button
            onClick={exportarDados}
            className="bg-[#1e2a4a] hover:bg-[#15203a] text-white flex items-center gap-2"
            disabled={exportando}
          >
            {exportando ? (
              "Gerando PDF..."
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                Exportar dados
              </>
            )}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Comparativo entre cenários</h2>
            <p className="text-sm text-gray-500">Análise comparativa</p>
          </div>
          <div className="h-[300px]">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {itensPaginaAtual.map((categoria, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="font-medium">{categoria.nome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatarValor(categoria.orcado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatarValor(categoria.realizado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={categoria.diferenca >= 0 ? "text-green-600" : "text-red-600"}>
                      {categoria.diferenca >= 0 ? "" : "-"}
                      {formatarValor(Math.abs(categoria.diferenca))}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        categoria.status === "Dentro do orçamento"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {categoria.status === "Dentro do orçamento" ? "Dentro do orçamento" : "Acima do orçamento"}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Total</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatarValor(dadosRelatorio.total.orcado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatarValor(dadosRelatorio.total.realizado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  {dadosRelatorio.total.diferenca >= 0 ? "" : "-"}
                  {formatarValor(Math.abs(dadosRelatorio.total.diferenca))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {dadosRelatorio.total.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <div>
            Mostrando {indiceInicial + 1}-{indiceFinal} de {totalItens}
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => mudarPagina(paginaAtual - 1)}
              disabled={paginaAtual === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {botoesNumericos}

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => mudarPagina(paginaAtual + 1)}
              disabled={paginaAtual === totalPaginas}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
