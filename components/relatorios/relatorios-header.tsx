import { FileText } from "lucide-react"
import { CriarRelatorioButton } from "./criar-relatorio-button"

export function RelatoriosHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex items-center mb-4 md:mb-0">
        <div className="p-3 rounded-full bg-[#007EA3] mr-4">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-gray-500">Gerencie e visualize todos os relatórios do sistema</p>
        </div>
      </div>
      <CriarRelatorioButton />
    </div>
  )
}
