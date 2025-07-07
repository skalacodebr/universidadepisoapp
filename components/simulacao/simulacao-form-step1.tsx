"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"
import { useEffect } from "react"

interface Props {
  setStep: (step: number) => void
  setSimulacaoData: (data: any) => void
  simulacaoData: any
}

export default function SimulacaoFormStep1({ setStep, setSimulacaoData, simulacaoData }: Props) {
  const { toast } = useToast()
  const router = useRouter()
  const [errors, setErrors] = useState({})
  const [equipesAcabamento, setEquipesAcabamento] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  useEffect(() => {
    const fetchEquipes = async () => {
      const { data, error } = await supabase.from("equipes_acabamento").select("id, nome, qtd_pessoas").order("nome")

      if (!error) {
        setEquipesAcabamento(data || [])
      }
      setLoadingOptions(false)
    }

    fetchEquipes()
  }, [])

  const validate = () => {
    const errors: any = {}

    if (!simulacaoData.nome_cliente) {
      errors.nome_cliente = "Nome do cliente é obrigatório"
    }

    if (!simulacaoData.telefone_cliente) {
      errors.telefone_cliente = "Telefone do cliente é obrigatório"
    }

    if (!simulacaoData.email_cliente) {
      errors.email_cliente = "Email do cliente é obrigatório"
    }

    if (!simulacaoData.cep) {
      errors.cep = "CEP é obrigatório"
    }

    if (!simulacaoData.endereco) {
      errors.endereco = "Endereço é obrigatório"
    }

    if (!simulacaoData.numero) {
      errors.numero = "Número é obrigatório"
    }

    if (!simulacaoData.bairro) {
      errors.bairro = "Bairro é obrigatório"
    }

    if (!simulacaoData.cidade) {
      errors.cidade = "Cidade é obrigatória"
    }

    if (!simulacaoData.estado) {
      errors.estado = "Estado é obrigatório"
    }

    if (!simulacaoData.tipo_servico) {
      errors.tipo_servico = "Tipo de serviço é obrigatório"
    }

    if (!simulacaoData.equipe_acabamento_id) {
      errors.equipe_acabamento_id = "Equipe de acabamento é obrigatória"
    }

    setErrors(errors)

    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (validate()) {
      setStep(2)
    } else {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="nome_cliente">Nome do cliente</Label>
        <Input
          type="text"
          id="nome_cliente"
          placeholder="Nome do cliente"
          value={simulacaoData.nome_cliente}
          onChange={(e) => setSimulacaoData({ ...simulacaoData, nome_cliente: e.target.value })}
        />
        {errors.nome_cliente && <p className="text-sm text-red-500">{errors.nome_cliente}</p>}
      </div>

      <div>
        <Label htmlFor="telefone_cliente">Telefone do cliente</Label>
        <Input
          type="text"
          id="telefone_cliente"
          placeholder="Telefone do cliente"
          value={simulacaoData.telefone_cliente}
          onChange={(e) =>
            setSimulacaoData({
              ...simulacaoData,
              telefone_cliente: e.target.value,
            })
          }
        />
        {errors.telefone_cliente && <p className="text-sm text-red-500">{errors.telefone_cliente}</p>}
      </div>

      <div>
        <Label htmlFor="email_cliente">Email do cliente</Label>
        <Input
          type="email"
          id="email_cliente"
          placeholder="Email do cliente"
          value={simulacaoData.email_cliente}
          onChange={(e) =>
            setSimulacaoData({
              ...simulacaoData,
              email_cliente: e.target.value,
            })
          }
        />
        {errors.email_cliente && <p className="text-sm text-red-500">{errors.email_cliente}</p>}
      </div>

      <Separator />

      <div>
        <Label htmlFor="cep">CEP</Label>
        <Input
          type="text"
          id="cep"
          placeholder="CEP"
          value={simulacaoData.cep}
          onChange={(e) => setSimulacaoData({ ...simulacaoData, cep: e.target.value })}
        />
        {errors.cep && <p className="text-sm text-red-500">{errors.cep}</p>}
      </div>

      <div>
        <Label htmlFor="endereco">Endereço</Label>
        <Input
          type="text"
          id="endereco"
          placeholder="Endereço"
          value={simulacaoData.endereco}
          onChange={(e) => setSimulacaoData({ ...simulacaoData, endereco: e.target.value })}
        />
        {errors.endereco && <p className="text-sm text-red-500">{errors.endereco}</p>}
      </div>

      <div>
        <Label htmlFor="numero">Número</Label>
        <Input
          type="text"
          id="numero"
          placeholder="Número"
          value={simulacaoData.numero}
          onChange={(e) => setSimulacaoData({ ...simulacaoData, numero: e.target.value })}
        />
        {errors.numero && <p className="text-sm text-red-500">{errors.numero}</p>}
      </div>

      <div>
        <Label htmlFor="bairro">Bairro</Label>
        <Input
          type="text"
          id="bairro"
          placeholder="Bairro"
          value={simulacaoData.bairro}
          onChange={(e) => setSimulacaoData({ ...simulacaoData, bairro: e.target.value })}
        />
        {errors.bairro && <p className="text-sm text-red-500">{errors.bairro}</p>}
      </div>

      <div>
        <Label htmlFor="cidade">Cidade</Label>
        <Input
          type="text"
          id="cidade"
          placeholder="Cidade"
          value={simulacaoData.cidade}
          onChange={(e) => setSimulacaoData({ ...simulacaoData, cidade: e.target.value })}
        />
        {errors.cidade && <p className="text-sm text-red-500">{errors.cidade}</p>}
      </div>

      <div>
        <Label htmlFor="estado">Estado</Label>
        <Input
          type="text"
          id="estado"
          placeholder="Estado"
          value={simulacaoData.estado}
          onChange={(e) => setSimulacaoData({ ...simulacaoData, estado: e.target.value })}
        />
        {errors.estado && <p className="text-sm text-red-500">{errors.estado}</p>}
      </div>

      <Separator />

      <div>
        <Label htmlFor="tipo_servico">Tipo de serviço</Label>
        <Input
          type="text"
          id="tipo_servico"
          placeholder="Tipo de serviço"
          value={simulacaoData.tipo_servico}
          onChange={(e) => setSimulacaoData({ ...simulacaoData, tipo_servico: e.target.value })}
        />
        {errors.tipo_servico && <p className="text-sm text-red-500">{errors.tipo_servico}</p>}
      </div>

      <div>
        <Label htmlFor="equipe_acabamento_id">Equipe de acabamento</Label>
        <Select onValueChange={(value) => setSimulacaoData({ ...simulacaoData, equipe_acabamento_id: value })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione a equipe de acabamento" />
          </SelectTrigger>
          <SelectContent>
            {loadingOptions ? (
              <SelectItem value="" disabled>
                Carregando...
              </SelectItem>
            ) : equipesAcabamento.length > 0 ? (
              equipesAcabamento.map((equipe) => (
                <SelectItem key={equipe.id} value={String(equipe.id)}>
                  {equipe.nome} (Até {equipe.qtd_pessoas} pessoas)
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                Nenhuma equipe encontrada
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {errors.equipe_acabamento_id && <p className="text-sm text-red-500">{errors.equipe_acabamento_id}</p>}
      </div>

      <Button type="submit">Próximo</Button>
    </form>
  )
}
