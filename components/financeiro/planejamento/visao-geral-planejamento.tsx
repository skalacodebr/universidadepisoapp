import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign, Percent } from "lucide-react"

interface VisaoGeralPlanejamentoProps {
  receitaPlanejada: number
  despesaPlanejada: number
  margemLucro: number
}

export default function VisaoGeralPlanejamento({
  receitaPlanejada,
  despesaPlanejada,
  margemLucro,
}: VisaoGeralPlanejamentoProps) {
  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  return (
    <Card className="shadow-sm border-0">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Visão Geral</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Receita Planejada</p>
              <p className="text-xl font-semibold text-green-600">{formatarValor(receitaPlanejada)}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Despesa Planejada</p>
              <p className="text-xl font-semibold text-red-600">{formatarValor(despesaPlanejada)}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Percent className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Margem de Lucro Projetada</p>
              <p className="text-xl font-semibold text-blue-600">{margemLucro.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
