"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Adicionar após as importações
const scrollbarStyle = `
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`

interface MovimentacaoModalProps {
  isOpen: boolean
  onClose: () => void
  movimentacaoParaEditar?: {
    id: number
    tipo: string
    valor: number
    data: string
    descricao: string
  }
}

export default function MovimentacaoModal({ isOpen, onClose, movimentacaoParaEditar }: MovimentacaoModalProps) {
  // Adicionar logo após a declaração da função
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada")
  const [valor, setValor] = useState("")
  const [formattedValue, setFormattedValue] = useState<string>("")
  const [data, setData] = useState<Date | undefined>(undefined)
  const [descricao, setDescricao] = useState("")
  const [calendarOpen, setCalendarOpen] = useState(false)

  useEffect(() => {
    if (movimentacaoParaEditar) {
      setTipo(movimentacaoParaEditar.tipo as "entrada" | "saida")
      setValor(movimentacaoParaEditar.valor.toString())
      setData(new Date(movimentacaoParaEditar.data))
      setDescricao(movimentacaoParaEditar.descricao)
    } else {
      // Reset values when adding a new entry
      setTipo("entrada")
      setValor("")
      setFormattedValue("")
      setData(undefined)
      setDescricao("")
    }
  }, [movimentacaoParaEditar])

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove todos os caracteres não numéricos
    const numericValue = e.target.value.replace(/\D/g, "")

    // Formata o valor para exibição (sem o símbolo R$)
    if (numericValue) {
      const numberValue = Number(numericValue) / 100
      setValor(numberValue.toString())

      // Formata apenas com separadores de milhar e decimal, sem o símbolo R$
      const formatted = numberValue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      setFormattedValue(formatted)
    } else {
      setValor("")
      setFormattedValue("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você pode adicionar a lógica para salvar/atualizar a movimentação
    console.log({
      tipo,
      valor,
      data,
      descricao,
    })
    onClose() // Fechar o modal após o envio
  }

  // Função para lidar com a seleção de data
  const handleDateSelect = (date: Date | undefined) => {
    setData(date)
    setCalendarOpen(false) // Fechar o calendário após a seleção
  }

  // Função para prevenir o fechamento do modal ao clicar no calendário
  const handleCalendarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Atualizar o estado global quando o calendário é aberto/fechado
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.hasOpenCalendar = calendarOpen
    }
  }, [calendarOpen])

  return (
    <>
      <style jsx global>
        {scrollbarStyle}
      </style>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          // Só permite fechar o modal se o calendário não estiver aberto
          if (!calendarOpen || !open) {
            onClose()
          }
        }}
      >
        <DialogContent
          className="sm:max-w-[550px] p-0 overflow-hidden max-h-[90vh] min-h-[500px] flex flex-col"
          onPointerDownOutside={(e) => {
            // Previne o fechamento do modal quando clicar fora, se o calendário estiver aberto
            if (calendarOpen) {
              e.preventDefault()
            }
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 overflow-y-auto flex-1 pr-4 scrollbar-thin flex flex-col"
          >
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <Label htmlFor="tipo" className="text-base font-medium">
                  Tipo de Movimentação
                </Label>
                <RadioGroup id="tipo" value={tipo} onValueChange={setTipo} className="flex gap-6">
                  <div
                    className={`flex items-center space-x-2 p-3 rounded-lg border ${tipo === "entrada" ? "bg-green-50 border-green-200" : "bg-white"}`}
                  >
                    <RadioGroupItem value="entrada" id="entrada" className="text-green-600 border-green-600" />
                    <Label htmlFor="entrada" className="font-medium flex items-center cursor-pointer">
                      <ArrowUpCircle className="mr-2 h-5 w-5 text-green-600" />
                      Entrada
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-2 p-3 rounded-lg border ${tipo === "saida" ? "bg-red-50 border-red-200" : "bg-white"}`}
                  >
                    <RadioGroupItem value="saida" id="saida" className="text-red-600 border-red-600" />
                    <Label htmlFor="saida" className="font-medium flex items-center cursor-pointer">
                      <ArrowDownCircle className="mr-2 h-5 w-5 text-red-600" />
                      Saída
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor" className="text-base font-medium">
                  Valor (R$)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10">
                    R$
                  </span>
                  <Input
                    id="valor"
                    type="text"
                    placeholder="0,00"
                    value={formattedValue}
                    onChange={handleValorChange}
                    required
                    className="text-base pl-10 h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data" className="text-base font-medium">
                  Data
                </Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 border-gray-300",
                        !data && "text-muted-foreground",
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCalendarOpen(true)
                      }}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {data ? format(data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    onClick={handleCalendarClick}
                    onInteractOutside={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <div onClick={handleCalendarClick}>
                      <Calendar
                        mode="single"
                        selected={data}
                        onSelect={handleDateSelect}
                        initialFocus
                        locale={ptBR}
                        className="border rounded-md"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-base font-medium">
                  Descrição
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva a movimentação"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="min-h-[120px] text-base resize-none"
                />
              </div>
            </div>
            <DialogFooter className="pt-4 flex gap-3 mt-auto border-t p-6">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button
                type="submit"
                className={`flex-1 ${tipo === "entrada" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {movimentacaoParaEditar ? "Atualizar" : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
