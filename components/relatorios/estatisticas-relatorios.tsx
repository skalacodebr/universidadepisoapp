import { FileText, Download, TrendingUp } from "lucide-react"

export function EstatisticasRelatorios() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total de Relatórios</p>
            <h3 className="text-2xl font-bold">24</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <Download className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Exportações este mês</p>
            <h3 className="text-2xl font-bold">12</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 mr-4">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Relatórios Recentes</p>
            <h3 className="text-2xl font-bold">8</h3>
            <p className="text-xs text-green-500">+14% este mês</p>
          </div>
        </div>
      </div>
    </div>
  )
}
