import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Clock, CheckCircle } from "lucide-react"
import type { SimulacaoItem } from "../hooks/useSimulacoes"

interface SimulacaoHeaderProps {
  simulacoes: SimulacaoItem[]
}

export function SimulacaoHeader({ simulacoes }: SimulacaoHeaderProps) {
  const projetosFechados = simulacoes.filter((s) => s.status.toLowerCase() === "fechada").length

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Simulação de Preço de Venda</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total de simulações</h3>
              <p className="text-2xl font-semibold">{simulacoes.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Última simulação</h3>
              <p className="text-base font-medium">
                {simulacoes.length > 0 ? simulacoes[0].data : "Nenhuma simulação"}
              </p>
              <p className="text-sm text-gray-500">{simulacoes.length > 0 ? simulacoes[0].nome : ""}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Projetos fechados</h3>
              <p className="text-2xl font-semibold">{projetosFechados}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
