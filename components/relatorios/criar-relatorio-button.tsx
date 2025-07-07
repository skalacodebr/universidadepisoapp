"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CriarRelatorioButton() {
  const [open, setOpen] = useState(false)
  const [tipoRelatorio, setTipoRelatorio] = useState("")
  const [nomeRelatorio, setNomeRelatorio] = useState("")
  const [obra, setObra] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Criando relatório:", { tipoRelatorio, nomeRelatorio, obra })
    // Aqui você pode implementar a lógica para criar o relatório
    setOpen(false)
    // Resetar o formulário
    setTipoRelatorio("")
    setNomeRelatorio("")
    setObra("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#007EA3] hover:bg-[#006A8A]">
          <Plus className="h-4 w-4 mr-2" />
          Criar Relatório
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Novo Relatório</DialogTitle>
            <DialogDescription>Preencha as informações abaixo para gerar um novo relatório.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                value={nomeRelatorio}
                onChange={(e) => setNomeRelatorio(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo" className="text-right">
                Tipo
              </Label>
              <Select value={tipoRelatorio} onValueChange={setTipoRelatorio} required>
                <SelectTrigger className="col-span-3" id="tipo">
                  <SelectValue placeholder="Selecione o tipo de relatório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="orcado-realizado">Orçado vs. Realizado</SelectItem>
                  <SelectItem value="lucro-prejuizo">Lucro/Prejuízo</SelectItem>
                  <SelectItem value="fluxo-caixa">Fluxo de Caixa</SelectItem>
                  <SelectItem value="desempenho">Desempenho</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="obra" className="text-right">
                Obra
              </Label>
              <Select value={obra} onValueChange={setObra} required>
                <SelectTrigger className="col-span-3" id="obra">
                  <SelectValue placeholder="Selecione a obra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="obra-1">Residencial Vila Nova</SelectItem>
                  <SelectItem value="obra-2">Comercial Centro Empresarial</SelectItem>
                  <SelectItem value="obra-3">Reforma Apartamento 302</SelectItem>
                  <SelectItem value="obra-4">Condomínio Jardim das Flores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-[#007EA3] hover:bg-[#006A8A]">
              Gerar Relatório
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
