"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface DadosGrafico {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
  }[]
}

interface GraficoLucroPrejuizoProps {
  dados: DadosGrafico
}

export default function GraficoLucroPrejuizo({ dados }: GraficoLucroPrejuizoProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destruir gráfico anterior se existir
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Criar novo gráfico
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: dados.labels,
        datasets: [
          {
            label: "Receita",
            data: dados.datasets[0].data,
            backgroundColor: dados.datasets[0].backgroundColor,
            borderColor: dados.datasets[0].backgroundColor,
            borderWidth: 1,
          },
          {
            label: "Despesa",
            data: dados.datasets[1].data,
            backgroundColor: dados.datasets[1].backgroundColor,
            borderColor: dados.datasets[1].backgroundColor,
            borderWidth: 1,
          },
          {
            label: "Lucro",
            data: dados.datasets[2].data,
            backgroundColor: dados.datasets[2].backgroundColor,
            borderColor: dados.datasets[2].backgroundColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              font: {
                size: 12,
              },
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
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) =>
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  notation: "compact",
                  compactDisplay: "short",
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
    <div className="w-full h-full min-h-[400px] flex items-center justify-center">
      <canvas ref={chartRef} className="max-h-[400px]"></canvas>
    </div>
  )
}
