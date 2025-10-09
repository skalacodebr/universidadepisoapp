"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Plus, Search } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"


interface Equipamento {
  id: number
  nome: string
  valor_dia: number
  user_id: string
  created_at: string
  isPadrao?: boolean
  desativado?: boolean
}

interface NovoEquipamento {
  nome: string
  valor_dia: number
}

export function EquipamentosObra() {
  const { user } = useAuth()
  const supabase = useMemo(() => getSupabaseClient(), [user]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [novoEquipamento, setNovoEquipamento] = useState<NovoEquipamento>({
    nome: "",
    valor_dia: 0
  })

  useEffect(() => {
    if (user?.id) {
      carregarEquipamentos()
    } else {
      setLoading(false)
    }
  }, [user, supabase])

  const carregarEquipamentos = async () => {
    setLoading(true)
    try {
      // Buscar todos os equipamentos
      const { data, error } = await supabase
        .from('equipamentos')
        .select('*')

      if (error) throw error

      // Buscar equipamentos desativados pelo usuário
      const { data: desativados, error: errorDesativados } = await supabase
        .from('equipamentos_desativados')
        .select('equipamento_id')
        .eq('usuario_id', user?.id || 0)

      if (errorDesativados) {
        console.error('Erro ao buscar equipamentos desativados:', errorDesativados)
      }

      const idsDesativados = new Set(desativados?.map(d => d.equipamento_id) || [])

      const equipamentosComFlag = (data || []).map((equipamento: Equipamento) => ({
        ...equipamento,
        isPadrao: equipamento.user_id === '0',
        desativado: idsDesativados.has(equipamento.id)
      }))

      setEquipamentos(equipamentosComFlag)
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error)
      toast.error('Erro ao carregar equipamentos')
    } finally {
      setLoading(false)
    }
  }

  const adicionarEquipamento = async () => {
    if (!novoEquipamento.nome || !novoEquipamento.valor_dia) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (!user?.id) {
      toast.error('Usuário não autenticado')
      return
    }

    try {
      const { error } = await supabase
        .from('equipamentos')
        .insert({
          nome: novoEquipamento.nome,
          valor_dia: novoEquipamento.valor_dia,
          user_id: user.id
        })

      if (error) {
        console.error('Erro detalhado:', error)
        if (error.code === '42501') {
          toast.error('Erro de permissão. Execute o script: scripts/configure-rls-equipamentos.sql')
          return
        }
        throw error
      }

      toast.success('Equipamento adicionado com sucesso!')
      setIsAddDialogOpen(false)
      setNovoEquipamento({ nome: "", valor_dia: 0 })
      carregarEquipamentos()
    } catch (error: any) {
      console.error('Erro ao adicionar equipamento:', error)
      toast.error(`Erro ao adicionar equipamento: ${error.message || 'Erro desconhecido'}`)
    }
  }

  const excluirEquipamento = async (id: number) => {
    try {
      const { error } = await supabase
        .from('equipamentos')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Equipamento removido com sucesso!')
      carregarEquipamentos()
    } catch (error) {
      console.error('Erro ao excluir equipamento:', error)
      toast.error('Erro ao remover equipamento')
    }
  }

  const toggleDesativarEquipamento = async (equipamentoId: number, desativado: boolean) => {
    if (!user?.id) {
      toast.error('Usuário não autenticado')
      return
    }

    try {
      if (desativado) {
        // Reativar: remover da tabela de desativados
        const { error } = await supabase
          .from('equipamentos_desativados')
          .delete()
          .eq('usuario_id', user.id)
          .eq('equipamento_id', equipamentoId)

        if (error) throw error
        toast.success('Equipamento reativado com sucesso!')
      } else {
        // Desativar: adicionar na tabela de desativados
        const { error } = await supabase
          .from('equipamentos_desativados')
          .insert({
            usuario_id: user.id,
            equipamento_id: equipamentoId
          })

        if (error) throw error
        toast.success('Equipamento desativado com sucesso!')
      }

      carregarEquipamentos()
    } catch (error) {
      console.error('Erro ao alterar status do equipamento:', error)
      toast.error('Erro ao alterar status do equipamento')
    }
  }

  const equipamentosFiltrados = equipamentos.filter(equipamento =>
    equipamento.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007EA3]"></div>
        <span className="ml-2">Carregando equipamentos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com busca e botão adicionar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Palavra-Chave"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button 
            variant="outline"
            className="bg-[#007EA3] hover:bg-[#006a8a] text-white"
          >
            Pesquisar
          </Button>
        </div>

        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#007EA3] hover:bg-[#006a8a] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Novo Equipamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Equipamento</DialogTitle>
                <DialogDescription>
                  Cadastre um novo equipamento no banco de dados.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Equipamento</Label>
                  <Input
                    id="nome"
                    value={novoEquipamento.nome}
                    onChange={(e) => setNovoEquipamento(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Betoneira, Serra Circular, etc"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor-dia">Valor por Dia (R$)</Label>
                  <Input
                    id="valor-dia"
                    type="number"
                    step="0.01"
                    min="0"
                    value={novoEquipamento.valor_dia}
                    onChange={(e) => setNovoEquipamento(prev => ({ ...prev, valor_dia: parseFloat(e.target.value) }))}
                    placeholder="0.00"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={adicionarEquipamento}
                    className="bg-[#007EA3] hover:bg-[#006a8a] text-white"
                  >
                    Confirmar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Voltar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Informação de registros encontrados */}
      <div className="text-sm text-gray-600">
        Foram encontrados {equipamentosFiltrados.length} registros de equipamentos.
      </div>

      {/* Tabela de equipamentos */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Valor por Dia</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[120px]">Opções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipamentosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Nenhum equipamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                equipamentosFiltrados.map((equipamento) => (
                  <TableRow key={equipamento.id} className={equipamento.desativado ? 'opacity-50' : ''}>
                    <TableCell className="font-medium">
                      {equipamento.nome}
                      {equipamento.isPadrao && (
                        <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          Padrão
                        </span>
                      )}
                    </TableCell>
                    <TableCell>R$ {equipamento.valor_dia.toFixed(2)}/dia</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!equipamento.desativado}
                          onCheckedChange={() => toggleDesativarEquipamento(equipamento.id, equipamento.desativado || false)}
                        />
                        <span className="text-sm text-gray-600">
                          {equipamento.desativado ? 'Desativado' : 'Ativo'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => excluirEquipamento(equipamento.id)}
                        className="h-8"
                        disabled={equipamento.isPadrao}
                        title={equipamento.isPadrao ? "Equipamentos padrão não podem ser excluídos" : ""}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 