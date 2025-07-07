"use client"
import { ChartCard } from "@/components/ui/chart-card"

export function ExemploGrafico() {
  // Dados de exemplo para o gráfico
  const dadosGrafico = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Receita",
        data: [120000, 150000, 180000, 220000, 250000, 280000],
        backgroundColor: "#4CAF50",
        borderColor: "#4CAF50",
        borderWidth: 1,
      },
      {
        label: "Despesa",
        data: [100000, 120000, 160000, 180000, 210000, 230000],
        backgroundColor: "#F44336",
        borderColor: "#F44336",
        borderWidth: 1,
      },
      {
        label: "Lucro",
        data: [20000, 30000, 20000, 40000, 40000, 50000],
        backgroundColor: "#2196F3",
        borderColor: "#2196F3",
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <ChartCard
        title="Evolução Financeira"
        description="Receitas, despesas e lucros nos últimos 6 meses"
        type="bar"
        data={dadosGrafico}
      />

      <ChartCard
        title="Distribuição de Receitas"
        description="Participação por mês no semestre"
        type="pie"
        data={{
          labels: dadosGrafico.labels,
          datasets: [
            {
              label: "Receita",
              data: dadosGrafico.datasets[0].data,
              backgroundColor: ["#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800"],
              borderWidth: 1,
            },
          ],
        }}
      />

      <ChartCard
        title="Tendência de Lucro"
        description="Evolução do lucro ao longo do tempo"
        type="line"
        data={{
          labels: dadosGrafico.labels,
          datasets: [
            {
              label: "Lucro",
              data: dadosGrafico.datasets[2].data,
              backgroundColor: "rgba(33, 150, 243, 0.2)",
              borderColor: "#2196F3",
              borderWidth: 2,
              fill: true,
            },
          ],
        }}
      />

      <ChartCard
        title="Comparativo Receita vs Despesa"
        description="Análise mensal"
        type="bar"
        data={{
          labels: dadosGrafico.labels,
          datasets: [
            {
              label: "Receita",
              data: dadosGrafico.datasets[0].data,
              backgroundColor: "#4CAF50",
            },
            {
              label: "Despesa",
              data: dadosGrafico.datasets[1].data,
              backgroundColor: "#F44336",
            },
          ],
        }}
        options={{
          scales: {
            x: {
              stacked: false,
            },
            y: {
              stacked: false,
            },
          },
        }}
      />
    </div>
  )
}
