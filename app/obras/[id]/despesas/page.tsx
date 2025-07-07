"use client"

import React from "react"
import { useState, useRef, type ChangeEvent } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CalendarIcon, MoreHorizontal, Trash2, FileText, ImageIcon, X, Upload, Search, Edit2, Eye, PlusCircle, ArrowLeft } from "lucide-react"
import { FiltrosDespesa } from "@/components/obras/despesas/filtros-despesa"
import { TabelaDespesa } from "@/components/obras/despesas/tabela-despesa"
import { ModalNovaDespesa } from "@/components/obras/despesas/modal-nova-despesa"
import { useModal } from "../../../hooks/use-modal"
import Link from "next/link"

interface Despesa {
  id: number
  descricao: string
  valor: string
  data: string
  categoria: string
  cadastradoPor: string
  fornecedor: string
  comprovante: string
  observacoes: string
}

const DespesasObra = ({ params }: { params: { id: string } }) => {
  const [pesquisaDescricao, setPesquisaDescricao] = useState("")
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos")
  const { isOpen, onOpen, onOpenChange } = useModal()

  // Estado para armazenar as despesas
  const [despesas, setDespesas] = useState<Despesa[]>([
    {
      id: 1,
      descricao: "Compra de tijolos",
      valor: "R$ 1.200,00",
      data: "10/07/2023",
      categoria: "Materiais",
      cadastradoPor: "João Silva",
      fornecedor: "Depósito Central",
      comprovante: "nota-fiscal-123.pdf",
      observacoes: "Entrega realizada no prazo estipulado.",
    },
    {
      id: 2,
      descricao: "Mão de obra - Fase inicial",
      valor: "R$ 3.500,00",
      data: "15/07/2023",
      categoria: "Mão de obra",
      cadastradoPor: "Maria Oliveira",
      fornecedor: "Construtora XYZ",
      comprovante: "recibo-345.pdf",
      observacoes: "Pagamento referente à primeira semana de trabalho.",
    },
    {
      id: 3,
      descricao: "Ferramentas diversas",
      valor: "R$ 780,00",
      data: "18/07/2023",
      categoria: "Ferramenta",
      cadastradoPor: "Carlos Mendes",
      fornecedor: "Casa do Construtor",
      comprovante: "nf-456.pdf",
      observacoes: "Incluindo betoneira e andaimes.",
    },
    {
      id: 4,
      descricao: "Cimento (20 sacos)",
      valor: "R$ 650,00",
      data: "22/07/2023",
      categoria: "Materiais",
      cadastradoPor: "José Pereira",
      fornecedor: "Loja de Materiais ABC",
      comprovante: "nota-789.pdf",
      observacoes: "Entrega agendada para o dia seguinte.",
    },
    {
      id: 5,
      descricao: "Alimentação equipe",
      valor: "R$ 350,00",
      data: "25/07/2023",
      categoria: "Alimentação",
      cadastradoPor: "Ana Santos",
      fornecedor: "Restaurante Popular",
      comprovante: "cupom-123.pdf",
      observacoes: "Referente a uma semana de almoços para equipe.",
    },
  ])

  // Função para adicionar uma nova despesa
  const handleAddDespesa = (novaDespesa: Omit<Despesa, "id">) => {
    const novaId = despesas.length > 0 ? Math.max(...despesas.map(d => d.id)) + 1 : 1
    setDespesas([...despesas, { ...novaDespesa, id: novaId }])
  }

  // Função para excluir uma despesa
  const handleDeleteDespesa = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta despesa?")) {
      setDespesas(despesas.filter(despesa => despesa.id !== id))
    }
  }

  // Filtragem das despesas
  const despesasFiltradas = despesas.filter(despesa => {
    const matchDescricao = despesa.descricao
      .toLowerCase()
      .includes(pesquisaDescricao.toLowerCase())

    let matchPeriodo = true
    if (filtroPeriodo === "mes-atual") {
      const dataHoje = new Date()
      const mesAtual = dataHoje.getMonth()
      const anoAtual = dataHoje.getFullYear()
      
      const partesData = despesa.data.split("/")
      const dataDespesa = new Date(
        parseInt(partesData[2]), // Ano
        parseInt(partesData[1]) - 1, // Mês (0-11)
        parseInt(partesData[0]) // Dia
      )
      
      matchPeriodo = 
        dataDespesa.getMonth() === mesAtual && 
        dataDespesa.getFullYear() === anoAtual
    } else if (filtroPeriodo === "ultimo-mes") {
      const dataHoje = new Date()
      dataHoje.setMonth(dataHoje.getMonth() - 1)
      const mesAnterior = dataHoje.getMonth()
      const anoAnterior = dataHoje.getFullYear()
      
      const partesData = despesa.data.split("/")
      const dataDespesa = new Date(
        parseInt(partesData[2]), // Ano
        parseInt(partesData[1]) - 1, // Mês (0-11)
        parseInt(partesData[0]) // Dia
      )
      
      matchPeriodo = 
        dataDespesa.getMonth() === mesAnterior && 
        dataDespesa.getFullYear() === anoAnterior
    }

    return matchDescricao && matchPeriodo
  })

  // Renderização do componente
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href={`/obras/${params.id}`}>
            <Button variant="ghost" className="p-0 h-auto" aria-label="Voltar">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 font-family: Roboto;">
            Registro de despesas
          </h1>
        </div>
        <Button
          className="bg-[#007EA3] hover:bg-[#006a8a] focus:outline-none focus:ring-2 focus:ring-offset-0"
          onClick={onOpen}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo registro
        </Button>
      </div>

      <FiltrosDespesa
        pesquisaDescricao={pesquisaDescricao}
        setPesquisaDescricao={setPesquisaDescricao}
        filtroPeriodo={filtroPeriodo}
        setFiltroPeriodo={setFiltroPeriodo}
      />

      <TabelaDespesa
        despesas={despesasFiltradas}
        onDeleteDespesa={handleDeleteDespesa}
      />

      <ModalNovaDespesa
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onAddDespesa={handleAddDespesa}
      />
    </div>
  )
}

export default DespesasObra
