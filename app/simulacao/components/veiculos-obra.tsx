"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, AlertTriangle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"

interface VeiculoObra {
  id: number
  userid: number
  veiculo: string
  veiculo_id?: number
  tipo?: string
  quantidade?: number
  created_at: string
}

interface VeiculoDisponivel {
  id: number
  veiculo: string
  rs_km: number
  created_at: string
  user_id?: string
  isPadrao?: boolean
  desativado?: boolean
}

interface NovoVeiculo {
  veiculo: string
}

interface NovoVeiculoBanco {
  veiculo: string
  rs_km: number
}

const TIPOS_VEICULO = [
  "PREPARAÇÃO DA OBRA",
  "CONCRETAGEM E ACABAMENTO", 
  "CORTE E/OU FINALIZAÇÃO"
]

export function VeiculosObra() {
  const { user } = useAuth()
  const supabase = useMemo(() => getSupabaseClient(), [user]);
  const [veiculosObra, setVeiculosObra] = useState<VeiculoObra[]>([])
  const [veiculosDisponiveis, setVeiculosDisponiveis] = useState<VeiculoDisponivel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [novoVeiculo, setNovoVeiculo] = useState<NovoVeiculo>({
    veiculo: ""
  })
  const [isAddVeiculoBancoDialogOpen, setIsAddVeiculoBancoDialogOpen] = useState(false)
  const [novoVeiculoBanco, setNovoVeiculoBanco] = useState<NovoVeiculoBanco>({
    veiculo: "",
    rs_km: 0
  })

  // Carregar veículos da obra e veículos disponíveis
  useEffect(() => {
    if (user?.id) {
      Promise.all([
        carregarVeiculosObra(),
        carregarVeiculosDisponiveis()
      ]).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user, supabase])

  const carregarVeiculosObra = async () => {
    try {
      const { data, error } = await supabase
        .from('obras_veiculos_simulacao')
        .select('*')
        .eq('userid', parseInt(user?.id || '0'))
        .order('created_at', { ascending: false })

      if (error) throw error
      setVeiculosObra(data || [])
    } catch (error) {
      console.error('Erro ao carregar veículos da obra:', error)
      toast.error('Erro ao carregar veículos da obra')
    }
  }

  const carregarVeiculosDisponiveis = async () => {
    try {
      // Buscar veículos disponíveis (padrão + do usuário)
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
        .or(`user_id.eq.0,user_id.eq.${user?.id}`)
        .order('veiculo')

      if (error) {
        console.error('Erro na query de veículos:', error)
        toast.error(`Erro ao carregar veículos: ${error.message}`)
        return
      }

      // Se não há dados, usar mock para teste
      if (!data || data.length === 0) {
        const mockVeiculos = [
          { id: 1, veiculo: 'Pick Up', rs_km: 0.8, created_at: new Date().toISOString() },
          { id: 2, veiculo: 'Caminhão', rs_km: 1.2, created_at: new Date().toISOString() },
          { id: 3, veiculo: 'Kombi', rs_km: 0.7, created_at: new Date().toISOString() },
          { id: 4, veiculo: 'Passeio 5 pessoas', rs_km: 0.6, created_at: new Date().toISOString() }
        ]
        setVeiculosDisponiveis(mockVeiculos)
      } else {
        // Buscar veículos desativados pelo usuário
        const { data: desativados, error: errorDesativados } = await supabase
          .from('veiculos_desativados')
          .select('veiculo_id')
          .eq('usuario_id', user?.id || 0)

        if (errorDesativados) {
          console.error('Erro ao buscar veículos desativados:', errorDesativados)
        }

        const idsDesativados = new Set(desativados?.map(d => d.veiculo_id) || [])

        // Marcar veículos como padrão e desativados
        const veiculosComFlag = data.map((veiculo: VeiculoDisponivel) => {
          // Veículo é padrão se user_id é '0' (string), 0 (number) ou null
          const isPadrao = veiculo.user_id === '0' || veiculo.user_id === 0 || veiculo.user_id === null

          console.log(`Veículo ${veiculo.veiculo}: user_id=${veiculo.user_id} (tipo: ${typeof veiculo.user_id}), isPadrao=${isPadrao}`)

          return {
            ...veiculo,
            isPadrao,
            desativado: idsDesativados.has(veiculo.id)
          }
        })

        setVeiculosDisponiveis(veiculosComFlag)
      }
    } catch (error) {
      console.error('Erro ao carregar veículos disponíveis:', error)
      toast.error('Erro ao carregar veículos disponíveis')
    }
  }

  const adicionarVeiculo = async () => {
    if (!novoVeiculo.veiculo) {
      toast.error('Por favor, selecione um veículo')
      return
    }

    if (!user?.id) {
      toast.error('Usuário não autenticado')
      return
    }

    // Verificar se o veículo já foi adicionado
    const veiculoExistente = veiculosObra.find(v => v.veiculo === novoVeiculo.veiculo)
    if (veiculoExistente) {
      toast.error(`O veículo "${novoVeiculo.veiculo}" já foi adicionado`)
      return
    }

    try {
      // Buscar o ID do veículo selecionado
      const veiculoSelecionado = veiculosDisponiveis.find(v => v.veiculo === novoVeiculo.veiculo)
      
      const dadosVeiculo = {
        userid: parseInt(user.id),
        veiculo: novoVeiculo.veiculo,
        veiculo_id: veiculoSelecionado?.id || null
      }

      const { data, error } = await supabase
        .from('obras_veiculos_simulacao')
        .insert(dadosVeiculo)
        .select()

      if (error) {
        // Se erro de RLS, tentar apenas com campos básicos
        if (error.code === '42501' && error.message.includes('row-level security policy')) {
          toast.error('Erro de permissão na tabela. Execute o script: scripts/configure-rls-obras-veiculos-simulacao.sql')
          
          // Como fallback, adicionar ao estado local temporariamente
          const veiculoSelecionado = veiculosDisponiveis.find(v => v.veiculo === novoVeiculo.veiculo)
          const novoVeiculoObj: VeiculoObra = {
            id: Math.max(...veiculosObra.map(v => v.id), 0) + 1,
            userid: parseInt(user.id),
            veiculo: novoVeiculo.veiculo,
            veiculo_id: veiculoSelecionado?.id || undefined,
            created_at: new Date().toISOString()
          }

          setVeiculosObra(prev => [novoVeiculoObj, ...prev])
          toast.success('Veículo adicionado temporariamente (execute o script SQL para salvar no banco)')
          setIsAddDialogOpen(false)
          setNovoVeiculo({ veiculo: "" })
          return
        }
        
        // Se erro por causa das colunas tipo/quantidade, tentar apenas com campos básicos
        if (error.message.includes('column') && (error.message.includes('tipo') || error.message.includes('quantidade'))) {
          // Buscar o ID do veículo selecionado
          const veiculoSelecionado = veiculosDisponiveis.find(v => v.veiculo === novoVeiculo.veiculo)
          
          const dadosBasicos = {
            userid: parseInt(user.id),
            veiculo: novoVeiculo.veiculo,
            veiculo_id: veiculoSelecionado?.id || null
          }
          
          const { data: dataBasica, error: errorBasico } = await supabase
            .from('obras_veiculos_simulacao')
            .insert(dadosBasicos)
            .select()

          if (errorBasico) throw errorBasico
          
          toast.success('Veículo adicionado com sucesso! (Para adicionar tipo/quantidade, execute: scripts/add-columns-obras-veiculos-simulacao.sql)')
        } else {
          throw error
        }
      } else {
        toast.success('Veículo adicionado com sucesso!')
      }

      setIsAddDialogOpen(false)
      setNovoVeiculo({ veiculo: "" })
      carregarVeiculosObra()
    } catch (error: any) {
      console.error('Erro ao adicionar veículo:', error)
      toast.error(`Erro ao adicionar veículo: ${error.message || 'Erro desconhecido'}`)
    }
  }

  const excluirVeiculo = async (id: number) => {
    try {
      const { error } = await supabase
        .from('obras_veiculos_simulacao')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Veículo removido com sucesso!')
      carregarVeiculosObra()
    } catch (error) {
      console.error('Erro ao excluir veículo:', error)
      toast.error('Erro ao remover veículo')
    }
  }

  const toggleDesativarVeiculo = async (veiculoId: number, desativado: boolean) => {
    if (!user?.id) {
      toast.error('Usuário não autenticado')
      return
    }

    try {
      if (desativado) {
        // Reativar: remover da tabela de desativados
        const { error } = await supabase
          .from('veiculos_desativados')
          .delete()
          .eq('usuario_id', user.id)
          .eq('veiculo_id', veiculoId)

        if (error) throw error
        toast.success('Veículo reativado com sucesso!')
      } else {
        // Desativar: adicionar na tabela de desativados
        const { error } = await supabase
          .from('veiculos_desativados')
          .insert({
            usuario_id: user.id,
            veiculo_id: veiculoId
          })

        if (error) throw error
        toast.success('Veículo desativado com sucesso!')
      }

      carregarVeiculosDisponiveis()
    } catch (error) {
      console.error('Erro ao alterar status do veículo:', error)
      toast.error('Erro ao alterar status do veículo')
    }
  }

  const excluirVeiculoBanco = async (id: number) => {
    try {
      const { error } = await supabase
        .from('veiculos')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Veículo removido com sucesso do banco!')
      carregarVeiculosDisponiveis()
    } catch (error) {
      console.error('Erro ao excluir veículo do banco:', error)
      toast.error('Erro ao remover veículo do banco')
    }
  }

  const adicionarVeiculoBanco = async (novoVeiculo: NovoVeiculoBanco) => {
    if (!novoVeiculo.veiculo || !novoVeiculo.rs_km) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (!user?.id) {
      toast.error('Usuário não autenticado')
      return
    }

    try {
      const { data, error } = await supabase
        .from('veiculos')
        .insert({
          veiculo: novoVeiculo.veiculo,
          rs_km: novoVeiculo.rs_km,
          user_id: user.id
        })
        .select()

      if (error) {
        // Se erro de RLS, mostrar mensagem específica
        if (error.code === '42501') {
          toast.error('Erro de permissão. Execute o script: scripts/configure-rls-veiculos.sql')
          return
        }
        throw error
      }

      toast.success('Veículo adicionado com sucesso ao banco de dados!')
      carregarVeiculosDisponiveis()
    } catch (error: any) {
      console.error('Erro ao adicionar veículo ao banco:', error)
      toast.error(`Erro ao adicionar veículo: ${error.message || 'Erro desconhecido'}`)
    }
  }

  const veiculosFiltrados = veiculosObra.filter(veiculo =>
    veiculo.veiculo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const obterTipoVeiculo = (veiculoNome: string) => {
    // Mapear tipos baseado no nome do veículo - isso pode ser ajustado conforme necessário
    const nome = veiculoNome.toLowerCase()
    if (nome.includes('pick') || nome.includes('caminhão')) {
      return 'PREPARAÇÃO DA OBRA'
    } else if (nome.includes('kombi') || nome.includes('passeio')) {
      return 'CONCRETAGEM E ACABAMENTO'
    }
    return 'CORTE E/OU FINALIZAÇÃO'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007EA3]"></div>
        <span className="ml-2">Carregando veículos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com botão adicionar */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Veículos Disponíveis no Banco de Dados</h2>

        <Dialog open={isAddVeiculoBancoDialogOpen} onOpenChange={setIsAddVeiculoBancoDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#007EA3] hover:bg-[#006a8a] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Novo Veículo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Veículo ao Banco</DialogTitle>
              <DialogDescription>
                Cadastre um novo veículo no banco de dados.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="veiculo-banco">Nome do Veículo</Label>
                <Input
                  id="veiculo-banco"
                  value={novoVeiculoBanco.veiculo}
                  onChange={(e) => setNovoVeiculoBanco(prev => ({ ...prev, veiculo: e.target.value }))}
                  placeholder="Ex: Caminhão, Pick Up, etc"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rs-km">Custo por KM (R$)</Label>
                <Input
                  id="rs-km"
                  type="number"
                  step="0.01"
                  min="0"
                  value={novoVeiculoBanco.rs_km}
                  onChange={(e) => setNovoVeiculoBanco(prev => ({ ...prev, rs_km: parseFloat(e.target.value) }))}
                  placeholder="0.00"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    adicionarVeiculoBanco(novoVeiculoBanco)
                    setIsAddVeiculoBancoDialogOpen(false)
                    setNovoVeiculoBanco({ veiculo: "", rs_km: 0 })
                  }}
                  className="bg-[#007EA3] hover:bg-[#006a8a] text-white"
                >
                  Confirmar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddVeiculoBancoDialogOpen(false)}
                >
                  Voltar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Informação de registros encontrados */}
      <div className="text-sm text-gray-600">
        Gerencie os veículos disponíveis para seleção. Foram encontrados {veiculosDisponiveis.length} veículos cadastrados.
      </div>

      {/* Tabela de Veículos */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Custo por KM</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[120px]">Opções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {veiculosDisponiveis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Nenhum veículo disponível
                  </TableCell>
                </TableRow>
              ) : (
                veiculosDisponiveis.map((veiculo) => (
                  <TableRow key={veiculo.id} className={veiculo.desativado ? 'opacity-50' : ''}>
                    <TableCell className="font-medium">
                      {veiculo.veiculo}
                      {veiculo.isPadrao && (
                        <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          Padrão
                        </span>
                      )}
                    </TableCell>
                    <TableCell>R$ {veiculo.rs_km.toFixed(2)}/km</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!veiculo.desativado}
                          onCheckedChange={() => toggleDesativarVeiculo(veiculo.id, veiculo.desativado || false)}
                        />
                        <span className="text-sm text-gray-600">
                          {veiculo.desativado ? 'Desativado' : 'Ativo'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => excluirVeiculoBanco(veiculo.id)}
                        className="h-8"
                        disabled={veiculo.isPadrao}
                        title={veiculo.isPadrao ? "Veículos padrão não podem ser excluídos" : ""}
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