"use client"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart } from "@/components/dashboard/bar-chart"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { useState, useEffect } from "react"

// Mock data for different filter combinations
const mockData = {
  // Status filters
  ativo: {
    obrasEmAndamento: 3,
    orcamentosRealizados: 4,
    lucroMedioPorObra: 180000,
    chartData: {
      labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto"],
      fechados: [180, 150, 35, 20, 15, 12, 8, 0],
      enviados: [200, 160, 320, 30, 22, 8, 8, 0],
    },
  },
  inativo: {
    obrasEmAndamento: 2,
    orcamentosRealizados: 1,
    lucroMedioPorObra: 120000,
    chartData: {
      labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto"],
      fechados: [45, 26, 8, 5, 3, 3, 2, 1],
      enviados: [56, 29, 74, 7, 5, 2, 2, 1],
    },
  },
  // City filters
  "sao-paulo": {
    obrasEmAndamento: 3,
    orcamentosRealizados: 3,
    lucroMedioPorObra: 200000,
    chartData: {
      labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto"],
      fechados: [150, 120, 30, 18, 12, 10, 7, 0],
      enviados: [170, 130, 280, 25, 20, 7, 7, 0],
    },
  },
  "rio-de-janeiro": {
    obrasEmAndamento: 2,
    orcamentosRealizados: 2,
    lucroMedioPorObra: 100000,
    chartData: {
      labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto"],
      fechados: [75, 56, 13, 7, 6, 5, 3, 1],
      enviados: [86, 59, 114, 12, 7, 3, 3, 1],
    },
  },
  // Period filters
  "mes-atual": {
    obrasEmAndamento: 4,
    orcamentosRealizados: 3,
    lucroMedioPorObra: 160000,
    chartData: {
      labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
      fechados: [40, 35, 30, 25],
      enviados: [45, 40, 35, 30],
    },
  },
  "ultimo-mes": {
    obrasEmAndamento: 5,
    orcamentosRealizados: 4,
    lucroMedioPorObra: 140000,
    chartData: {
      labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
      fechados: [50, 45, 40, 35],
      enviados: [55, 50, 45, 40],
    },
  },
  // Constructor filters
  "construtora-a": {
    obrasEmAndamento: 3,
    orcamentosRealizados: 3,
    lucroMedioPorObra: 170000,
    chartData: {
      labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto"],
      fechados: [125, 100, 30, 15, 10, 8, 6, 0],
      enviados: [140, 110, 220, 20, 15, 6, 6, 0],
    },
  },
  "construtora-b": {
    obrasEmAndamento: 2,
    orcamentosRealizados: 2,
    lucroMedioPorObra: 130000,
    chartData: {
      labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto"],
      fechados: [100, 76, 13, 10, 8, 7, 4, 1],
      enviados: [116, 79, 174, 17, 12, 4, 4, 1],
    },
  },
  // Default data
  todos: {
    obrasEmAndamento: 5,
    orcamentosRealizados: 5,
    lucroMedioPorObra: 150000,
    chartData: {
      labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto"],
      fechados: [225, 176, 43, 25, 18, 15, 10, 1],
      enviados: [256, 189, 394, 37, 27, 10, 10, 1],
    },
  },
}

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()

  // State for filters
  const [statusFilter, setStatusFilter] = useState("todos")
  const [cidadeFilter, setCidadeFilter] = useState("todos")
  const [periodoFilter, setPeriodoFilter] = useState("todos")
  const [construtoraFilter, setConstrutoraFilter] = useState("todos")

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    obrasEmAndamento: 5,
    orcamentosRealizados: 5,
    lucroMedioPorObra: 150000,
    chartData: {
      labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto"],
      fechados: [225, 176, 43, 25, 18, 15, 10, 1],
      enviados: [256, 189, 394, 37, 27, 10, 10, 1],
    },
  })

  // Update dashboard data when filters change
  useEffect(() => {
    // Determine which filter to use (prioritize in this order)
    let newData

    if (statusFilter !== "todos") {
      newData = mockData[statusFilter]
    } else if (cidadeFilter !== "todos") {
      newData = mockData[cidadeFilter]
    } else if (periodoFilter !== "todos") {
      newData = mockData[periodoFilter]
    } else if (construtoraFilter !== "todos") {
      newData = mockData[construtoraFilter]
    } else {
      newData = mockData.todos
    }

    setDashboardData(newData)
  }, [statusFilter, cidadeFilter, periodoFilter, construtoraFilter])

  // Format currency
  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

            {/* Filters */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <Select defaultValue="todos" onValueChange={(value) => setStatusFilter(value)}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Cidade</p>
                <Select defaultValue="todos" onValueChange={(value) => setCidadeFilter(value)}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="sao-paulo">São Paulo</SelectItem>
                    <SelectItem value="rio-de-janeiro">Rio de Janeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Período</p>
                <Select defaultValue="todos" onValueChange={(value) => setPeriodoFilter(value)}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="mes-atual">Mês Atual</SelectItem>
                    <SelectItem value="ultimo-mes">Último Mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Construtora</p>
                <Select defaultValue="todos" onValueChange={(value) => setConstrutoraFilter(value)}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="construtora-a">Construtora A</SelectItem>
                    <SelectItem value="construtora-b">Construtora B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <Card className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-4">Obras em Andamento</h3>
                    <p className="text-[1.5rem] font-bold">{dashboardData.obrasEmAndamento}</p>
                  </div>
                  <div className="h-14 w-14 bg-yellow-100 rounded-[23px] flex items-center justify-center">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vector-79lSrdS1vu5kQZPFzCZCdyEMJWDKpU.png"
                      alt="Obras em Andamento"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-4">Orçamentos Realizados</h3>
                    <p className="text-[1.5rem] font-bold">{dashboardData.orcamentosRealizados}</p>
                  </div>
                  <div className="h-14 w-14 bg-blue-100 rounded-[23px] flex items-center justify-center">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vector%20%281%29-0Bub2gjR6xcJge7V1pTB9ftbLCUR7w.png"
                      alt="Orçamentos Realizados"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-500 text-sm font-medium mb-4">Lucro Médio por Obra</h3>
                    <p className="text-[1.5rem] font-bold">{formatCurrency(dashboardData.lucroMedioPorObra)}</p>
                  </div>
                  <div className="h-14 w-14 bg-orange-100 rounded-[23px] flex items-center justify-center">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vector%20%282%29-G0w9lNyfGEM75s6Sb2LYPs1TiNo2it.png"
                      alt="Lucro Médio por Obra"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Chart */}
            <Card className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-gray-800 text-lg font-medium mb-6">Orçamento do mês</h3>
              <div className="h-80">
                <BarChart
                  labels={dashboardData.chartData.labels}
                  fechadosData={dashboardData.chartData.fechados}
                  enviadosData={dashboardData.chartData.enviados}
                />
              </div>
              <div className="flex justify-center mt-4 space-x-8">
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-[#007EA3] mr-2"></div>
                  <span className="text-sm text-gray-600">Fechados</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-[#F9C74F] mr-2"></div>
                  <span className="text-sm text-gray-600">Enviados</span>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
