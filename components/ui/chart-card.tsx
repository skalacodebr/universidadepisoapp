"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface ChartCardProps {
  title?: string
  description?: string
  type: "bar" | "line" | "pie" | "doughnut"
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string | string[]
      borderWidth?: number
      fill?: boolean
    }[]
  }
  className?: string
  height?: number
  options?: any
}

export function ChartCard({ title, description, type, data, className, height = 300, options = {} }: ChartCardProps) {
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

    // Configurações padrão
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            padding: 20,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              let label = context.dataset.label || ""
              if (label) {
                label += ": "
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(context.parsed.y || context.parsed)
              }
              return label
            },
          },
        },
      },
      scales:
        type !== "pie" && type !== "doughnut"
          ? {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value: any) =>
                    new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(Number(value)),
                },
              },
            }
          : undefined,
    }

    // Criar novo gráfico
    chartInstance.current = new Chart(ctx, {
      type,
      data,
      options: { ...defaultOptions, ...options },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, type, options])

  return (
    <Card className={cn("overflow-hidden", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="p-6">
        <div style={{ height: `${height}px` }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  )
}
