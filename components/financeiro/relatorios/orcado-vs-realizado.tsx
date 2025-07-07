"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface Categoria {
  nome: string
  planejado: number
  realizado: number
  diferenca: number
  percentual: number
}

interface OrcadoVsRealizadoProps {
  dados: {
    totalPlanejado: number
    totalRealizado: number
    diferencaPercentual: number
    categorias: Categoria[]
  }
}

export default function OrcadoVsRealizado({ dados }: OrcadoVsRealizadoProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  useEffect(() => {
    if (!chartRef.current) return

    // Destruir gráfico anterior se existir
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    const labels = dados.categorias.map((cat) => cat.nome)
    const planejados = dados.categorias.map((cat) => cat.planejado)
    const realizados = dados.categorias.map((cat) => cat.realizado)

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Planejado",
            data: planejados,
            backgroundColor: "rgba(59, 130, 246, 0.6)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
          },
          {
            label: "Realizado",
            data: realizados,
            backgroundColor: "rgba(245, 158, 11, 0.6)",
            borderColor: "rgba(245, 158, 11, 1)",
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
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  maximumFractionDigits: 0,
                }).format(Number(value)),
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
  }, [dados])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-sm border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Indicadores Principais</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Total Planejado</p>
                <p className="text-xl font-semibold text-blue-600">{formatarValor(dados.totalPlanejado)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Realizado</p>
                <p className="text-xl font-semibold text-orange-500">{formatarValor(dados.totalRealizado)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Diferença</p>
                <p
                  className={`text-xl font-semibold ${dados.diferencaPercentual >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {dados.diferencaPercentual.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 shadow-sm border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Comparativo por Categoria</h3>
            <div className="h-[200px]">
              <canvas ref={chartRef}></canvas>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-0">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Tabela Comparativa</h3>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor Planejado (R$)</TableHead>
                  <TableHead>Valor Realizado (R$)</TableHead>
                  <TableHead>Diferença (R$)</TableHead>
                  <TableHead>Diferença (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dados.categorias.map((categoria, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{categoria.nome}</TableCell>
                    <TableCell>{formatarValor(categoria.planejado)}</TableCell>
                    <TableCell>{formatarValor(categoria.realizado)}</TableCell>
                    <TableCell className={categoria.diferenca >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatarValor(categoria.diferenca)}
                    </TableCell>
                    <TableCell className={categoria.percentual >= 0 ? "text-green-600" : "text-red-600"}>
                      {categoria.percentual.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={() => {
                // Preparar os dados para exportação
                const dadosExportacao = dados.categorias.map((cat) => ({
                  Categoria: cat.nome,
                  "Valor Planejado": formatarValor(cat.planejado),
                  "Valor Realizado": formatarValor(cat.realizado),
                  Diferença: formatarValor(cat.diferenca),
                  "Diferença (%)": `${cat.percentual.toFixed(1)}%`,
                }))

                // Converter para CSV
                const headers = ["Categoria", "Valor Planejado", "Valor Realizado", "Diferença", "Diferença (%)"]
                const csvContent = [
                  headers.join(","),
                  ...dadosExportacao.map((row) =>
                    headers.map((header) => JSON.stringify(row[header as keyof typeof row])).join(","),
                  ),
                ].join("\n")

                // Criar blob e iniciar download
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.setAttribute("href", url)
                link.setAttribute(
                  "download",
                  `relatorio-orcado-vs-realizado-${new Date().toISOString().split("T")[0]}.csv`,
                )
                link.style.visibility = "hidden"
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)

                // Feedback visual
                alert("Relatório exportado com sucesso!")
              }}
            >
              <FileText className="mr-2 h-4 w-4" /> Exportar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
