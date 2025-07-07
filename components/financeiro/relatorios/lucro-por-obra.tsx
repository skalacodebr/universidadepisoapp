"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface Obra {
  nome: string
  receitaTotal: number
  despesaTotal: number
  lucro: number
  percentual: number
}

interface LucroPorObraProps {
  dados: {
    lucroTotal: number
    obrasComPrejuizo: number
    obras: Obra[]
  }
}

export default function LucroPorObra({ dados }: LucroPorObraProps) {
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

    const labels = dados.obras.map((obra) => obra.nome)
    const lucros = dados.obras.map((obra) => obra.lucro)
    const cores = lucros.map((lucro) => (lucro >= 0 ? "rgba(34, 197, 94, 0.6)" : "rgba(239, 68, 68, 0.6)"))
    const bordas = lucros.map((lucro) => (lucro >= 0 ? "rgba(34, 197, 94, 1)" : "rgba(239, 68, 68, 1)"))

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Lucro/Prejuízo",
            data: lucros,
            backgroundColor: cores,
            borderColor: bordas,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Indicador Resumido</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Lucro Total</p>
                <p className="text-2xl font-semibold text-green-600">{formatarValor(dados.lucroTotal)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Obras com prejuízo</p>
                <p className="text-2xl font-semibold text-red-600">{dados.obrasComPrejuizo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Gráfico Resumido</h3>
            <div className="h-[200px]">
              <canvas ref={chartRef}></canvas>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-0">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Tabela de Obras</h3>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Obra</TableHead>
                  <TableHead>Receita Total (R$)</TableHead>
                  <TableHead>Despesa Total (R$)</TableHead>
                  <TableHead>Lucro ou Prejuízo (R$)</TableHead>
                  <TableHead>Percentual (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dados.obras.map((obra, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{obra.nome}</TableCell>
                    <TableCell>{formatarValor(obra.receitaTotal)}</TableCell>
                    <TableCell>{formatarValor(obra.despesaTotal)}</TableCell>
                    <TableCell className={obra.lucro >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatarValor(obra.lucro)}
                    </TableCell>
                    <TableCell className={obra.percentual >= 0 ? "text-green-600" : "text-red-600"}>
                      {obra.percentual.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end mt-6">
            <Button>
              <FileText className="mr-2 h-4 w-4" /> Exportar Relatório
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
