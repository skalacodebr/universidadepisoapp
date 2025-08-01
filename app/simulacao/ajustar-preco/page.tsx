"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calculator } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

interface SimulacaoData {
  id: number
  nome: string
  preco_venda_metro_quadrado_calculo: number
  area_total_metros_quadrados: number
  valor_total: number
  lucro_total: number
  custo_total_obra: number
  percentual_comissao: number
  percentual_lucro_desejado: number
}

export default function AjustarPrecoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const supabase = getSupabaseClient()
  
  const simulacaoId = searchParams.get('id')
  
  const [simulacao, setSimulacao] = useState<SimulacaoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [precoManual, setPrecoManual] = useState("")
  const [resultado, setResultado] = useState({
    valorTotal: 0,
    lucro: 0,
    percentualLucro: 0
  })

  useEffect(() => {
    if (!simulacaoId || !isAuthenticated || !user) return

    const carregarSimulacao = async () => {
      try {
        setLoading(true)
        
        const { data, error } = await supabase
          .from('obras')
          .select(`
            id,
            nome,
            preco_venda_metro_quadrado_calculo,
            area_total_metros_quadrados,
            valor_total,
            lucro_total,
            custo_total_obra,
            percentual_comissao,
            percentual_lucro_desejado
          `)
          .eq('id', simulacaoId)
          .eq('simulacao', true)
          .single()

        if (error) {
          console.error('Erro ao carregar simulação:', error)
          return
        }

        setSimulacao(data)
        setPrecoManual(data.preco_venda_metro_quadrado_calculo.toString())
      } catch (error) {
        console.error('Erro ao carregar simulação:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarSimulacao()
  }, [simulacaoId, isAuthenticated, user, supabase])

  // Função para calcular apenas o lucro baseado no preço manual
  const calcularLucroManual = async () => {
    if (!simulacao || !precoManual) return

    const precoM2 = parseFloat(precoManual) || 0
    const areaTotal = simulacao.area_total_metros_quadrados
    const precoTotalManual = precoM2 * areaTotal
    const custoTotal = simulacao.custo_total_obra
    const comissaoPercentual = simulacao.percentual_comissao || 0

    // Buscar alíquota do simples nacional (mesmo cálculo do simulador)
    try {
      const { data: custoFixo } = await supabase
        .from('custofixo_usuario')
        .select('faturamento_12')
        .eq('userid', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      let aliquota = 6.54 // Padrão
      
      if (custoFixo?.faturamento_12) {
        const faixaFaturamento = custoFixo.faturamento_12
        const valorMaximo = faixaFaturamento.split('-')[1]
        const faturamentoMaximo = parseFloat(valorMaximo) || 360000
        const faturamentoFormatado = faturamentoMaximo.toFixed(2)
        
        const { data: bracket } = await supabase
          .from('simples_brackets')
          .select('aliquota')
          .eq('faturamento_ate', faturamentoFormatado)
          .single()
        
        if (bracket) {
          aliquota = bracket.aliquota
        }
      }

      // Calcular impostos e comissões baseados no preço manual
      const impostoSimples = precoTotalManual * (aliquota / 100)
      const comissoes = precoTotalManual * (comissaoPercentual / 100)
      
      // Lucro = preço total - custos - impostos - comissões
      const lucro = precoTotalManual - custoTotal - impostoSimples - comissoes
      const percentualLucro = precoTotalManual > 0 ? (lucro / precoTotalManual) * 100 : 0

      setResultado({
        valorTotal: precoTotalManual,
        lucro: lucro,
        percentualLucro: percentualLucro
      })
    } catch (error) {
      console.error('Erro ao calcular lucro:', error)
    }
  }

  useEffect(() => {
    if (simulacao && precoManual) {
      calcularLucroManual()
    }
  }, [simulacao, precoManual])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-2 text-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Carregando simulação...</span>
        </div>
      </div>
    )
  }

  if (!simulacao) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Simulação não encontrada</h1>
          <Link href="/simulacao">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Simulações
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/simulacao">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Simulações
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Ajustar Preço</h1>
        <p className="text-gray-600 mt-2">Simulação: {simulacao.nome}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados Originais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5" />
              Valores Originais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Preço de venda calculado</Label>
              <p className="text-lg font-semibold">
                R$ {simulacao.preco_venda_metro_quadrado_calculo.toFixed(2)}/m²
              </p>
            </div>
            <div>
              <Label>Área total</Label>
              <p className="text-lg">{simulacao.area_total_metros_quadrados.toFixed(0)} m²</p>
            </div>
            <div>
              <Label>Valor total original</Label>
              <p className="text-lg font-semibold text-green-600">
                R$ {simulacao.valor_total.toFixed(2)}
              </p>
            </div>
            <div>
              <Label>Lucro desejado original</Label>
              <p className="text-lg">{simulacao.percentual_lucro_desejado}%</p>
            </div>
          </CardContent>
        </Card>

        {/* Ajuste de Preço */}
        <Card>
          <CardHeader>
            <CardTitle>Ajustar Preço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="precoManual">Se o preço de venda por m² for:</Label>
              <Input
                id="precoManual"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={precoManual}
                onChange={(e) => setPrecoManual(e.target.value)}
                className="text-lg"
              />
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <h3 className="font-semibold">Resultado:</h3>
              <div>
                <Label>Valor total</Label>
                <p className="text-lg font-semibold text-blue-600">
                  R$ {resultado.valorTotal.toFixed(2)}
                </p>
              </div>
              <div>
                <Label>Lucro líquido</Label>
                <p className={`text-lg font-semibold ${resultado.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {resultado.lucro.toFixed(2)}
                </p>
              </div>
              <div>
                <Label>Percentual de lucro</Label>
                <p className={`text-lg font-semibold ${resultado.percentualLucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {resultado.percentualLucro.toFixed(2)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}