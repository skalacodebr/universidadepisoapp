"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, PieChart } from "lucide-react"
import Chart from "chart.js/auto"

export function GraficoRelatorios() {
  const barChartRef = useRef<HTMLCanvasElement | null>(null)
  const pieChartRef = useRef<HTMLCanvasElement | null>(null)
  const barChartInstance = useRef<Chart | null>(null)
  const pieChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (barChartRef.current) {
      // Destruir gráfico anterior se existir
      if (barChartInstance.current) {
        barChartInstance.current.destroy()
      }

      const ctx = barChartRef.current.getContext("2d")
      if (ctx) {
        barChartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
            datasets: [
              {
                label: "Relatórios Gerados",
                data: [4, 6, 8, 5, 7, 9],
                backgroundColor: "#007EA3",
                borderColor: "#007EA3",
                borderWidth: 1,
              },
              {
                label: "Relatórios Exportados",
                data: [2, 4, 5, 3, 5, 7],
                backgroundColor: "#FFC107",
                borderColor: "#FFC107",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          },
        })
      }
    }

    if (pieChartRef.current) {
      // Destruir gráfico anterior se existir
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy()
      }

      const ctx = pieChartRef.current.getContext("2d")
      if (ctx) {
        pieChartInstance.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: ["Orçado vs. Realizado", "Lucro/Prejuízo", "Fluxo de Caixa", "Desempenho"],
            datasets: [
              {
                data: [12, 8, 6, 4],
                backgroundColor: ["#007EA3", "#4CAF50", "#9C27B0", "#FF9800"],
                borderColor: "#FFFFFF",
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "right",
              },
            },
          },
        })
      }
    }

    // Cleanup
    return () => {
      if (barChartInstance.current) {
        barChartInstance.current.destroy()
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Análise de Relatórios</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar">
          <TabsList className="mb-4">
            <TabsTrigger value="bar">
              <BarChart3 className="h-4 w-4 mr-2" />
              Relatórios por Mês
            </TabsTrigger>
            <TabsTrigger value="pie">
              <PieChart className="h-4 w-4 mr-2" />
              Tipos de Relatórios
            </TabsTrigger>
          </TabsList>
          <TabsContent value="bar" className="h-[300px]">
            <canvas ref={barChartRef} />
          </TabsContent>
          <TabsContent value="pie" className="h-[300px]">
            <canvas ref={pieChartRef} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
