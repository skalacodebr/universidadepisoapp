"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface BarChartProps {
  labels: string[]
  fechadosData: number[]
  enviadosData: number[]
}

export function BarChart({ labels, fechadosData, enviadosData }: BarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Fechados",
            data: fechadosData,
            backgroundColor: "#007EA3",
            borderColor: "#007EA3",
            borderWidth: 1,
            barPercentage: 0.6,
            categoryPercentage: 0.5,
          },
          {
            label: "Enviados",
            data: enviadosData,
            backgroundColor: "#F9C74F",
            borderColor: "#F9C74F",
            borderWidth: 1,
            barPercentage: 0.6,
            categoryPercentage: 0.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#E5E7EB",
              drawBorder: false,
            },
            ticks: {
              stepSize: 50,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#1F2937",
            padding: 10,
            cornerRadius: 4,
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
            },
          },
        },
      },
    })

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [labels, fechadosData, enviadosData])

  return <canvas ref={chartRef} />
}
