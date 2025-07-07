import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react"

interface IndicadoresFluxoCaixaProps {
  saldoAtual: number
  totalEntradas: number
  totalSaidas: number
}

export default function IndicadoresFluxoCaixa({ saldoAtual, totalEntradas, totalSaidas }: IndicadoresFluxoCaixaProps) {
  const formatarValor = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  }

  return (
    <Card className="shadow-sm border-0">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Indicadores Resumidos</h3>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Wallet className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Saldo Atual</p>
              <p className="text-xl font-semibold">{formatarValor(saldoAtual)}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <ArrowUpCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Entradas</p>
              <p className="text-xl font-semibold text-green-600">{formatarValor(totalEntradas)}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <ArrowDownCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total de Saídas</p>
              <p className="text-xl font-semibold text-red-600">{formatarValor(totalSaidas)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
