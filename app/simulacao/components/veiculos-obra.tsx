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
import { useAuth } from "@/contexts/auth-context"
import { getSupabaseClient } from "@/lib/supabase"
import { toast } from "sonner"

interface VeiculoObra {
  id: number
  userid: number
  veiculo: string
  tipo?: string
  quantidade?: number
  created_at: string
}

interface VeiculoDisponivel {
  id: number
  veiculo: string
  rs_km: number
  created_at: string
}

interface NovoVeiculo {
  quantidade: string
  veiculo: string
  tipo: string
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
    quantidade: "",
    veiculo: "",
    tipo: ""
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
      // Buscar veículos disponíveis
      const { data, error } = await supabase
        .from('veiculos')
        .select('*')
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
        setVeiculosDisponiveis(data)
      }
    } catch (error) {
      console.error('Erro ao carregar veículos disponíveis:', error)
      toast.error('Erro ao carregar veículos disponíveis')
    }
  }

  const adicionarVeiculo = async () => {
    if (!novoVeiculo.veiculo || !novoVeiculo.tipo) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (!user?.id) {
      toast.error('Usuário não autenticado')
      return
    }

    try {
      const dadosVeiculo = {
        userid: parseInt(user.id),
        veiculo: novoVeiculo.veiculo,
        tipo: novoVeiculo.tipo,
        quantidade: parseInt(novoVeiculo.quantidade) || 1
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
          const novoVeiculoObj: VeiculoObra = {
            id: Math.max(...veiculosObra.map(v => v.id), 0) + 1,
            userid: parseInt(user.id),
            veiculo: novoVeiculo.veiculo,
            tipo: novoVeiculo.tipo,
            quantidade: parseInt(novoVeiculo.quantidade) || 1,
            created_at: new Date().toISOString()
          }

          setVeiculosObra(prev => [novoVeiculoObj, ...prev])
          toast.success('Veículo adicionado temporariamente (execute o script SQL para salvar no banco)')
          setIsAddDialogOpen(false)
          setNovoVeiculo({ quantidade: "", veiculo: "", tipo: "" })
          return
        }
        
        // Se erro por causa das colunas tipo/quantidade, tentar apenas com campos básicos
        if (error.message.includes('column') && (error.message.includes('tipo') || error.message.includes('quantidade'))) {
          const dadosBasicos = {
            userid: parseInt(user.id),
            veiculo: novoVeiculo.veiculo
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
      setNovoVeiculo({ quantidade: "", veiculo: "", tipo: "" })
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
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#007EA3] hover:bg-[#006a8a] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Incluir Registro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Veículo</DialogTitle>
                <DialogDescription>
                  Preencha os dados do veículo que deseja adicionar à obra.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    min="1"
                    value={novoVeiculo.quantidade}
                    onChange={(e) => setNovoVeiculo(prev => ({ ...prev, quantidade: e.target.value }))}
                    placeholder="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="veiculo">Veículos</Label>
                  <Select
                    value={novoVeiculo.veiculo}
                    onValueChange={(value) => setNovoVeiculo(prev => ({ ...prev, veiculo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={veiculosDisponiveis.length > 0 ? "Selecione um veículo" : "Carregando veículos..."} />
                    </SelectTrigger>
                    <SelectContent>
                      {veiculosDisponiveis.length === 0 ? (
                        <SelectItem value="loading" disabled>
                          Nenhum veículo disponível
                        </SelectItem>
                      ) : (
                        veiculosDisponiveis.map((veiculo) => (
                          <SelectItem key={veiculo.id} value={veiculo.veiculo}>
                            {veiculo.veiculo}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={novoVeiculo.tipo}
                    onValueChange={(value) => setNovoVeiculo(prev => ({ ...prev, tipo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_VEICULO.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={adicionarVeiculo}
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
        Foram encontrados {veiculosFiltrados.length} registros de "Veículos da Obra".
      </div>

      {/* Tabela de veículos */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Código / Quantidade</TableHead>
                <TableHead>Veículos</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="w-[120px]">Opções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {veiculosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    Nenhum veículo encontrado
                  </TableCell>
                </TableRow>
              ) : (
                veiculosFiltrados.map((veiculo) => (
                  <TableRow key={veiculo.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        {veiculo.id} / {veiculo.quantidade || 1}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{veiculo.veiculo}</TableCell>
                    <TableCell>{veiculo.tipo || obterTipoVeiculo(veiculo.veiculo)}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => excluirVeiculo(veiculo.id)}
                        className="h-8"
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
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