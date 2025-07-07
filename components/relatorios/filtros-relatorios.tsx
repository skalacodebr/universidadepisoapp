"use client"

import { useState } from "react"
import { Calendar, ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface FiltrosRelatoriosProps {
  onFiltroChange: (filtros: {
    tipo: string
    periodo: { de: Date | undefined; ate: Date | undefined }
    obra: string
  }) => void
}

export function FiltrosRelatorios({ onFiltroChange }: FiltrosRelatoriosProps) {
  const [tipo, setTipo] = useState<string>("todos")
  const [obra, setObra] = useState<string>("todas")
  const [dataInicio, setDataInicio] = useState<Date>()
  const [dataFim, setDataFim] = useState<Date>()

  const handleTipoChange = (value: string) => {
    setTipo(value)
    onFiltroChange({
      tipo: value,
      periodo: { de: dataInicio, ate: dataFim },
      obra,
    })
  }

  const handleObraChange = (value: string) => {
    setObra(value)
    onFiltroChange({
      tipo,
      periodo: { de: dataInicio, ate: dataFim },
      obra: value,
    })
  }

  const handleDataInicioChange = (date: Date | undefined) => {
    setDataInicio(date)
    onFiltroChange({
      tipo,
      periodo: { de: date, ate: dataFim },
      obra,
    })
  }

  const handleDataFimChange = (date: Date | undefined) => {
    setDataFim(date)
    onFiltroChange({
      tipo,
      periodo: { de: dataInicio, ate: date },
      obra,
    })
  }

  const formatPeriodo = () => {
    if (dataInicio && dataFim) {
      return `${format(dataInicio, "dd/MM/yyyy")} - ${format(dataFim, "dd/MM/yyyy")}`
    }
    return "Selecionar período"
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-medium">Filtros</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Relatório</label>
          <Select value={tipo} onValueChange={handleTipoChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="orcado-realizado">Orçado vs. Realizado</SelectItem>
              <SelectItem value="lucro-prejuizo">Lucro/Prejuízo</SelectItem>
              <SelectItem value="fluxo-caixa">Fluxo de Caixa</SelectItem>
              <SelectItem value="desempenho">Desempenho</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {formatPeriodo()}
                <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="grid grid-cols-2 gap-2 p-2">
                <div>
                  <p className="text-sm font-medium mb-1">De:</p>
                  <CalendarComponent
                    mode="single"
                    selected={dataInicio}
                    onSelect={handleDataInicioChange}
                    locale={ptBR}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Até:</p>
                  <CalendarComponent mode="single" selected={dataFim} onSelect={handleDataFimChange} locale={ptBR} />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Obra</label>
          <Select value={obra} onValueChange={handleObraChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a obra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as obras</SelectItem>
              <SelectItem value="obra-1">Residencial Vila Nova</SelectItem>
              <SelectItem value="obra-2">Comercial Centro Empresarial</SelectItem>
              <SelectItem value="obra-3">Reforma Apartamento 302</SelectItem>
              <SelectItem value="obra-4">Condomínio Jardim das Flores</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
