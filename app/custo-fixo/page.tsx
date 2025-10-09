"use client"

import { useState, useMemo, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { NumericFormat } from "react-number-format"
import { getSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

const supabase = getSupabaseClient()

// Componente personalizado para input de moeda
const CurrencyInput = ({ id, value, onChange, label }: { 
  id: string
  value: string
  onChange: (value: string) => void
  label: string 
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <NumericFormat
      id={id}
      value={value}
      onValueChange={(values) => onChange(values.value)}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      prefix="R$ "
      placeholder="R$ 0,00"
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-transform-uppercase"
    />
  </div>
)

// Componente personalizado para input numérico simples
const NumberInput = ({ id, value, onChange, label, placeholder }: { 
  id: string
  value: string
  onChange: (value: string) => void
  label: string
  placeholder?: string
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <NumericFormat
      id={id}
      value={value}
      onValueChange={(values) => onChange(values.value)}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      placeholder={placeholder || "0,00"}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
)

interface CustoCustomizado {
  id: number
  nome: string
  valor: number
}

interface CustoFixoFormData {
  // Instalações (I)
  aluguel: string
  irpjSobreAluguel: string
  iptu: string
  segurancaMonitorada: string
  seguroPredial: string
  contaAgua: string
  contaLuz: string
  materialHigieneLimpeza: string
  manutencaoPredial: string

  // Funcionários (F)
  seguroVidaColaboradores: string
  servicoLimpeza: string
  assistenciaMedica: string
  equipeAdministrativa: string
  alimentacaoEquipe: string
  prolaboreSocios: string
  beneficios: string

  // Administrativo (A)
  cipa: string
  ppra: string
  pcmat: string
  assessoriaJuridica: string
  telefoneFixo: string
  telefoneCelular: string
  telefoneRadio: string
  combustivelVeiculos: string
  seguroVeiculos: string
  ipva: string
  dpvat: string
  licenciamentoVeicular: string
  manutencaoVeiculos: string
  assessoriaContabil: string
  softwaresLicenciamento: string
  pedagios: string
  assessoriaInformatica: string
  bandaLarga: string
  servicosCartorio: string
  servicoMensageiro: string
  materialEscritorio: string
  alvaraFuncionamento: string
  despesasCorreio: string
  custosBancarios: string
  taxasMunicipais: string
  sindicatos: string
  hospedagemSite: string

  // Média de metro quadrado por mês
  mediaMes: string

  // Valor da diária por pessoa (mão de obra)
  valorPessoaDia: string
}

export default function CustoFixoPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState<CustoFixoFormData>({
    // Instalações (I)
    aluguel: "",
    irpjSobreAluguel: "",
    iptu: "",
    segurancaMonitorada: "",
    seguroPredial: "",
    contaAgua: "",
    contaLuz: "",
    materialHigieneLimpeza: "",
    manutencaoPredial: "",

    // Funcionários (F)
    seguroVidaColaboradores: "",
    servicoLimpeza: "",
    assistenciaMedica: "",
    equipeAdministrativa: "",
    alimentacaoEquipe: "",
    prolaboreSocios: "",
    beneficios: "",

    // Administrativo (A)
    cipa: "",
    ppra: "",
    pcmat: "",
    assessoriaJuridica: "",
    telefoneFixo: "",
    telefoneCelular: "",
    telefoneRadio: "",
    combustivelVeiculos: "",
    seguroVeiculos: "",
    ipva: "",
    dpvat: "",
    licenciamentoVeicular: "",
    manutencaoVeiculos: "",
    assessoriaContabil: "",
    softwaresLicenciamento: "",
    pedagios: "",
    assessoriaInformatica: "",
    bandaLarga: "",
    servicosCartorio: "",
    servicoMensageiro: "",
    materialEscritorio: "",
    alvaraFuncionamento: "",
    despesasCorreio: "",
    custosBancarios: "",
    taxasMunicipais: "",
    sindicatos: "",
    hospedagemSite: "",

    // Média de metro quadrado por mês
    mediaMes: "",

    // Valor da diária por pessoa (mão de obra)
    valorPessoaDia: ""
  })

  const [isLoading, setIsLoading] = useState(false)
  const [existingRecordId, setExistingRecordId] = useState<number | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Estados para custos customizados
  const [custosCustomizados, setCustosCustomizados] = useState<CustoCustomizado[]>([])
  const [isAddCustoDialogOpen, setIsAddCustoDialogOpen] = useState(false)
  const [novoCusto, setNovoCusto] = useState({ nome: "", valor: "" })

  // Debug: Monitor changes in formData and existingRecordId
  useEffect(() => {
    console.log('🔄 Estado atualizado - existingRecordId:', existingRecordId)
    console.log('🔄 Estado atualizado - formData aluguel:', formData.aluguel)
  }, [existingRecordId, formData])

  // Carregar dados existentes ao acessar a página
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        setIsLoadingData(true)
        
        console.log('🔍 Iniciando busca de dados - User ID:', user?.id)
        
        if (!user?.id) {
          console.log('⚠️ Usuário não autenticado ou ID não disponível')
          setIsLoadingData(false)
          return
        }
        
        const { data, error } = await supabase
          .from('custofixo_usuario')
          .select('*')
          .eq('userid', user.id)
          .order('created_at', { ascending: false })
          .limit(1)

        console.log('📊 Resposta do Supabase:', { 
          success: !error,
          recordCount: data?.length || 0,
          error: error?.message,
          firstRecord: data?.[0] ? {
            id: data[0].id,
            userid: data[0].userid,
            total: data[0].total,
            created_at: data[0].created_at
          } : null
        })

        if (error) {
          console.error('❌ Erro ao buscar dados existentes:', error)
          return
        }

        if (data && data.length > 0) {
          const record = data[0]
          console.log('✅ Registro encontrado:', {
            id: record.id,
            userid: record.userid,
            total: record.total,
            created_at: record.created_at,
            aluguel: record.aluguel,
            // Log first few fields as example
          })
          
          setExistingRecordId(record.id)
          
          // Converter números de volta para strings formatadas
          const formatNumber = (value: number | null) => {
            if (value === null || value === undefined) return ""
            
            try {
              // Garante que o valor tem no máximo 2 casas decimais
              const fixedValue = Math.round((value + Number.EPSILON) * 100) / 100
              
              // Formata como moeda brasileira
              return fixedValue.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            } catch (error) {
              console.error('Erro ao formatar número:', value, error)
              return "R$ 0,00"
            }
          }

          // Função para formatar números simples (sem formatação monetária)
          const formatSimpleNumber = (value: number | null) => {
            if (value === null || value === undefined) return ""
            
            try {
              // Garante que o valor tem no máximo 2 casas decimais
              const fixedValue = Math.round((value + Number.EPSILON) * 100) / 100
              
              // Formata como número simples
              return fixedValue.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            } catch (error) {
              console.error('Erro ao formatar número simples:', value, error)
              return "0,00"
            }
          }

          const newFormData = {
            aluguel: formatNumber(record.aluguel),
            irpjSobreAluguel: formatNumber(record.irpj_sobre_aluguel),
            iptu: formatNumber(record.iptu),
            segurancaMonitorada: formatNumber(record.seguranca_monitorada),
            seguroPredial: formatNumber(record.seguro_predial),
            contaAgua: formatNumber(record.conta_agua),
            contaLuz: formatNumber(record.conta_luz),
            materialHigieneLimpeza: formatNumber(record.material_higiene_limpeza),
            manutencaoPredial: formatNumber(record.manutencao_predial),
            seguroVidaColaboradores: formatNumber(record.seguro_vida_colaboradores),
            servicoLimpeza: formatNumber(record.servico_limpeza),
            assistenciaMedica: formatNumber(record.assistencia_medica),
            equipeAdministrativa: formatNumber(record.equipe_administrativa),
            alimentacaoEquipe: formatNumber(record.alimentacao_equipe_administrativa),
            prolaboreSocios: formatNumber(record.pro_labore_socios),
            beneficios: formatNumber(record.beneficios_cesta_basica),
            cipa: formatNumber(record.cipa),
            ppra: formatNumber(record.ppra),
            pcmat: formatNumber(record.pcmat),
            assessoriaJuridica: formatNumber(record.assessoria_juridica),
            telefoneFixo: formatNumber(record.telefonia_fixa),
            telefoneCelular: formatNumber(record.telefonia_celular),
            telefoneRadio: formatNumber(record.telefonia_radio),
            combustivelVeiculos: formatNumber(record.combustivel_veiculos),
            seguroVeiculos: formatNumber(record.seguro_veiculos),
            ipva: formatNumber(record.ipva),
            dpvat: formatNumber(record.dpvat),
            licenciamentoVeicular: formatNumber(record.licenciamento_veicular),
            manutencaoVeiculos: formatNumber(record.manutencao_veiculos),
            assessoriaContabil: formatNumber(record.assessoria_contabil),
            softwaresLicenciamento: formatNumber(record.softwares_licenciamento),
            pedagios: formatNumber(record.sem_parar_pedagios),
            assessoriaInformatica: formatNumber(record.assessoria_em_informatica),
            bandaLarga: formatNumber(record.banda_larga),
            servicosCartorio: formatNumber(record.servicos_cartorio),
            servicoMensageiro: formatNumber(record.servico_mensageiro_motoboy),
            materialEscritorio: formatNumber(record.material_escritorio),
            alvaraFuncionamento: formatNumber(record.alvara_funcionamento),
            despesasCorreio: formatNumber(record.despesas_correio),
            custosBancarios: formatNumber(record.custos_bancarios),
            taxasMunicipais: formatNumber(record.taxas_municipais_estaduais_federais),
            sindicatos: formatNumber(record.sindicatos_patronal),
            hospedagemSite: formatNumber(record.hospedagem_manutencao_site),
            mediaMes: formatSimpleNumber(record.media_mes),
            valorPessoaDia: formatNumber(record.valor_pessoa_dia)
          }

          console.log('📝 Dados formatados para o form:', newFormData)
          console.log('📌 Definindo formData...')
          setFormData(newFormData)
        } else {
          console.log('ℹ️ Nenhum registro encontrado - modo criação')
        }
      } catch (error) {
        console.error('💥 Erro geral ao carregar dados existentes:', error)
      } finally {
        setIsLoadingData(false)
        console.log('✅ Carregamento finalizado')
      }
    }

    fetchExistingData()
  }, [])

  // Carregar custos customizados
  useEffect(() => {
    const fetchCustosCustomizados = async () => {
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from('custofixo_usuario_customizado')
          .select('*')
          .eq('usuario_id', user.id)
          .order('nome')

        if (error) {
          console.error('Erro ao carregar custos customizados:', error)
          return
        }

        setCustosCustomizados(data || [])
      } catch (error) {
        console.error('Erro geral ao carregar custos customizados:', error)
      }
    }

    fetchCustosCustomizados()
  }, [user])

  // Adicionar novo custo customizado
  const adicionarCustoCustomizado = async () => {
    if (!novoCusto.nome || !novoCusto.valor) {
      toast.error('Por favor, preencha nome e valor')
      return
    }

    if (!user?.id) {
      toast.error('Usuário não autenticado')
      return
    }

    try {
      // O valor já vem como string numérica pura do NumericFormat (ex: "500")
      const valorNumerico = parseFloat(novoCusto.valor) || 0

      const { data, error } = await supabase
        .from('custofixo_usuario_customizado')
        .insert({
          usuario_id: user.id,
          nome: novoCusto.nome,
          valor: valorNumerico
        })
        .select()
        .single()

      if (error) throw error

      setCustosCustomizados(prev => [...prev, data])
      setNovoCusto({ nome: "", valor: "" })
      setIsAddCustoDialogOpen(false)
      toast.success('Custo adicionado com sucesso!')
    } catch (error) {
      console.error('Erro ao adicionar custo:', error)
      toast.error('Erro ao adicionar custo')
    }
  }

  // Excluir custo customizado
  const excluirCustoCustomizado = async (id: number) => {
    try {
      const { error } = await supabase
        .from('custofixo_usuario_customizado')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCustosCustomizados(prev => prev.filter(c => c.id !== id))
      toast.success('Custo removido com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir custo:', error)
      toast.error('Erro ao remover custo')
    }
  }

  const handleChange = (field: keyof CustoFixoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const total = useMemo(() => {
    const sum = Object.entries(formData).reduce((acc, [key, curr]) => {
      // Excluir campos que não fazem parte do custo fixo mensal
      if (key === 'mediaMes' || key === 'valorPessoaDia') return acc;

      // Se o valor estiver vazio ou for zero
      if (!curr || curr === "0") return acc;

      // Se o valor já estiver no formato "X.XX"
      if (/^\d+\.\d{2}$/.test(curr)) {
        const value = parseFloat(curr);
        console.log(`Campo ${key}: Original="${curr}" -> Número=${value} (formato decimal)`);
        return acc + value;
      }

      // Se o valor estiver no formato "R$ X.XXX,XX"
      let cleanValue = curr;
      // Remove R$ e espaços
      cleanValue = cleanValue.replace(/R\$\s*/g, '');
      // Remove pontos de milhar
      cleanValue = cleanValue.replace(/\./g, '');
      // Substitui vírgula por ponto
      cleanValue = cleanValue.replace(',', '.');

      const value = parseFloat(cleanValue) || 0;
      console.log(`Campo ${key}: Original="${curr}" -> Limpo="${cleanValue}" -> Número=${value}`);

      return acc + value;
    }, 0);

    // Adicionar custos customizados ao total
    const totalCustomizados = custosCustomizados.reduce((acc, custo) => acc + custo.valor, 0)
    const totalFinal = sum + totalCustomizados

    console.log('Total calculado:', sum);
    console.log('Total custos customizados:', totalCustomizados);
    console.log('Total final:', totalFinal);
    return totalFinal;
  }, [formData, custosCustomizados])

  // Calcular média final (total / media_mes)
  const mediaFinal = useMemo(() => {
    if (!formData.mediaMes || formData.mediaMes === "0" || formData.mediaMes === "") {
      return 0;
    }

    // Converter mediaMes para número (sem formatação monetária)
    let mediaMesValue = formData.mediaMes;
    // Remove pontos de milhar e substitui vírgula por ponto
    mediaMesValue = mediaMesValue.replace(/\./g, '').replace(',', '.');
    
    const mediaMesNum = parseFloat(mediaMesValue) || 0;
    
    if (mediaMesNum === 0) return 0;
    
    const result = total / mediaMesNum;
    console.log('🔍 DEBUG - Média final calculada:', { 
      mediaMesOriginal: formData.mediaMes,
      mediaMesLimpo: mediaMesValue,
      mediaMesNum: mediaMesNum,
      total: total,
      result: result 
    });
    return result;
  }, [total, formData.mediaMes])

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const parseFormDataForDB = (data: CustoFixoFormData) => {
    const parsed: Record<string, number> = {}
    Object.entries(data).forEach(([key, value]) => {
      // Se o valor estiver vazio, retorna 0
      if (!value) {
        parsed[key] = 0
        return
      }

      try {
        // Remove o prefixo R$ e espaços
        let cleanValue = value.replace(/R\$\s*/g, '').trim()
        
        // Se não houver valor após limpar, retorna 0
        if (!cleanValue) {
          parsed[key] = 0
          return
        }

        // Remove TODOS os caracteres não numéricos (exceto vírgula)
        cleanValue = cleanValue.replace(/[^\d,]/g, '')
        
        // Agora temos algo como "5700,00"
        // Removemos a vírgula e convertemos para número
        const number = parseInt(cleanValue.replace(',', ''), 10)
        
        // Como removemos a vírgula decimal, precisamos dividir por 100
        // para obter o valor correto
        parsed[key] = number / 100

        console.log(`Convertendo ${key}:`, {
          original: value,
          limpo: cleanValue,
          numero: number,
          final: parsed[key]
        })
      } catch (error) {
        console.error(`Erro ao processar valor para ${key}:`, value, error)
        parsed[key] = 0
      }
    })
    return parsed
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Valores do formulário antes do parsing:', formData)
      const parsedData = parseFormDataForDB(formData)
      console.log('Valores após parsing para o banco:', parsedData)

      if (existingRecordId) {
        // Atualizar registro existente
        const { data, error } = await supabase
          .from('custofixo_usuario')
          .update({
            total: total,
            media_mes: parseFloat((formData.mediaMes || '0').replace(/\./g, '').replace(',', '.')) || 0,
            media_final: mediaFinal,
            valor_pessoa_dia: parsedData.valorPessoaDia,
            aluguel: parsedData.aluguel,
            irpj_sobre_aluguel: parsedData.irpjSobreAluguel,
            iptu: parsedData.iptu,
            seguranca_monitorada: parsedData.segurancaMonitorada,
            seguro_predial: parsedData.seguroPredial,
            conta_agua: parsedData.contaAgua,
            conta_luz: parsedData.contaLuz,
            material_higiene_limpeza: parsedData.materialHigieneLimpeza,
            manutencao_predial: parsedData.manutencaoPredial,
            seguro_vida_colaboradores: parsedData.seguroVidaColaboradores,
            servico_limpeza: parsedData.servicoLimpeza,
            assistencia_medica: parsedData.assistenciaMedica,
            equipe_administrativa: parsedData.equipeAdministrativa,
            alimentacao_equipe_administrativa: parsedData.alimentacaoEquipe,
            pro_labore_socios: parsedData.prolaboreSocios,
            beneficios_cesta_basica: parsedData.beneficios,
            cipa: parsedData.cipa,
            ppra: parsedData.ppra,
            pcmat: parsedData.pcmat,
            assessoria_juridica: parsedData.assessoriaJuridica,
            telefonia_fixa: parsedData.telefoneFixo,
            telefonia_celular: parsedData.telefoneCelular,
            telefonia_radio: parsedData.telefoneRadio,
            combustivel_veiculos: parsedData.combustivelVeiculos,
            seguro_veiculos: parsedData.seguroVeiculos,
            ipva: parsedData.ipva,
            dpvat: parsedData.dpvat,
            licenciamento_veicular: parsedData.licenciamentoVeicular,
            manutencao_veiculos: parsedData.manutencaoVeiculos,
            assessoria_contabil: parsedData.assessoriaContabil,
            softwares_licenciamento: parsedData.softwaresLicenciamento,
            sem_parar_pedagios: parsedData.pedagios,
            assessoria_em_informatica: parsedData.assessoriaInformatica,
            banda_larga: parsedData.bandaLarga,
            servicos_cartorio: parsedData.servicosCartorio,
            servico_mensageiro_motoboy: parsedData.servicoMensageiro,
            material_escritorio: parsedData.materialEscritorio,
            alvara_funcionamento: parsedData.alvaraFuncionamento,
            despesas_correio: parsedData.despesasCorreio,
            custos_bancarios: parsedData.custosBancarios,
            taxas_municipais_estaduais_federais: parsedData.taxasMunicipais,
            sindicatos_patronal: parsedData.sindicatos,
            hospedagem_manutencao_site: parsedData.hospedagemSite,
          })
          .eq('id', existingRecordId)
          .select()

        if (error) {
          console.error('Erro do Supabase:', error)
          throw error
        }

        console.log('Dados salvos no banco:', data)
        alert("Custos fixos atualizados com sucesso!")
      } else {
        // Criar novo registro
        const { error } = await supabase
          .from('custofixo_usuario')
          .insert({
            userid: user?.id,
            total: total,
            media_mes: parseFloat((formData.mediaMes || '0').replace(/\./g, '').replace(',', '.')) || 0,
            media_final: mediaFinal,
            valor_pessoa_dia: parsedData.valorPessoaDia,
            aluguel: parsedData.aluguel,
            irpj_sobre_aluguel: parsedData.irpjSobreAluguel,
            iptu: parsedData.iptu,
            seguranca_monitorada: parsedData.segurancaMonitorada,
            seguro_predial: parsedData.seguroPredial,
            conta_agua: parsedData.contaAgua,
            conta_luz: parsedData.contaLuz,
            material_higiene_limpeza: parsedData.materialHigieneLimpeza,
            manutencao_predial: parsedData.manutencaoPredial,
            seguro_vida_colaboradores: parsedData.seguroVidaColaboradores,
            servico_limpeza: parsedData.servicoLimpeza,
            assistencia_medica: parsedData.assistenciaMedica,
            equipe_administrativa: parsedData.equipeAdministrativa,
            alimentacao_equipe_administrativa: parsedData.alimentacaoEquipe,
            pro_labore_socios: parsedData.prolaboreSocios,
            beneficios_cesta_basica: parsedData.beneficios,
            cipa: parsedData.cipa,
            ppra: parsedData.ppra,
            pcmat: parsedData.pcmat,
            assessoria_juridica: parsedData.assessoriaJuridica,
            telefonia_fixa: parsedData.telefoneFixo,
            telefonia_celular: parsedData.telefoneCelular,
            telefonia_radio: parsedData.telefoneRadio,
            combustivel_veiculos: parsedData.combustivelVeiculos,
            seguro_veiculos: parsedData.seguroVeiculos,
            ipva: parsedData.ipva,
            dpvat: parsedData.dpvat,
            licenciamento_veicular: parsedData.licenciamentoVeicular,
            manutencao_veiculos: parsedData.manutencaoVeiculos,
            assessoria_contabil: parsedData.assessoriaContabil,
            softwares_licenciamento: parsedData.softwaresLicenciamento,
            sem_parar_pedagios: parsedData.pedagios,
            assessoria_em_informatica: parsedData.assessoriaInformatica,
            banda_larga: parsedData.bandaLarga,
            servicos_cartorio: parsedData.servicosCartorio,
            servico_mensageiro_motoboy: parsedData.servicoMensageiro,
            material_escritorio: parsedData.materialEscritorio,
            alvara_funcionamento: parsedData.alvaraFuncionamento,
            despesas_correio: parsedData.despesasCorreio,
            custos_bancarios: parsedData.custosBancarios,
            taxas_municipais_estaduais_federais: parsedData.taxasMunicipais,
            sindicatos_patronal: parsedData.sindicatos,
            hospedagem_manutencao_site: parsedData.hospedagemSite,
          })

        if (error) {
          console.error('Erro do Supabase:', error)
          throw error
        }

        alert("Custos fixos salvos com sucesso!")
      }

    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert("Erro ao salvar os custos fixos. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Carregando dados...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            {existingRecordId ? "Editar Custos Fixos" : "Custos Fixos"}
          </h1>
          {existingRecordId && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                ✏️ Modo de edição: Você já possui custos fixos cadastrados. Faça as alterações necessárias e clique em "Atualizar".
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="instalacoes" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="instalacoes">Instalações</TabsTrigger>
                <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
                <TabsTrigger value="administrativo">Administrativo</TabsTrigger>
                <TabsTrigger value="customizados">Personalizados</TabsTrigger>
              </TabsList>

              <TabsContent value="instalacoes">
                <Card className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CurrencyInput
                      id="aluguel"
                      value={formData.aluguel}
                      onChange={(value) => handleChange("aluguel", value)}
                      label="Aluguel"
                    />
                    <CurrencyInput
                      id="irpjSobreAluguel"
                      value={formData.irpjSobreAluguel}
                      onChange={(value) => handleChange("irpjSobreAluguel", value)}
                      label="IRPJ sobre Aluguel"
                    />
                    <CurrencyInput
                      id="iptu"
                      value={formData.iptu}
                      onChange={(value) => handleChange("iptu", value)}
                      label="IPTU"
                    />
                    <CurrencyInput
                      id="segurancaMonitorada"
                      value={formData.segurancaMonitorada}
                      onChange={(value) => handleChange("segurancaMonitorada", value)}
                      label="Segurança Monitorada"
                    />
                    <CurrencyInput
                      id="seguroPredial"
                      value={formData.seguroPredial}
                      onChange={(value) => handleChange("seguroPredial", value)}
                      label="Seguro Predial"
                    />
                    <CurrencyInput
                      id="contaAgua"
                      value={formData.contaAgua}
                      onChange={(value) => handleChange("contaAgua", value)}
                      label="Conta de Água"
                    />
                    <CurrencyInput
                      id="contaLuz"
                      value={formData.contaLuz}
                      onChange={(value) => handleChange("contaLuz", value)}
                      label="Conta de Luz"
                    />
                    <CurrencyInput
                      id="materialHigieneLimpeza"
                      value={formData.materialHigieneLimpeza}
                      onChange={(value) => handleChange("materialHigieneLimpeza", value)}
                      label="Material de Higiene e Limpeza"
                    />
                    <CurrencyInput
                      id="manutencaoPredial"
                      value={formData.manutencaoPredial}
                      onChange={(value) => handleChange("manutencaoPredial", value)}
                      label="Manutenção Predial"
                    />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="funcionarios">
                <Card className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CurrencyInput
                      id="seguroVidaColaboradores"
                      value={formData.seguroVidaColaboradores}
                      onChange={(value) => handleChange("seguroVidaColaboradores", value)}
                      label="Seguro Vida - Colaboradores"
                    />
                    <CurrencyInput
                      id="servicoLimpeza"
                      value={formData.servicoLimpeza}
                      onChange={(value) => handleChange("servicoLimpeza", value)}
                      label="Serviço de Limpeza"
                    />
                    <CurrencyInput
                      id="assistenciaMedica"
                      value={formData.assistenciaMedica}
                      onChange={(value) => handleChange("assistenciaMedica", value)}
                      label="Assistência Médica"
                    />
                    <CurrencyInput
                      id="equipeAdministrativa"
                      value={formData.equipeAdministrativa}
                      onChange={(value) => handleChange("equipeAdministrativa", value)}
                      label="Equipe Administrativa"
                    />
                    <CurrencyInput
                      id="alimentacaoEquipe"
                      value={formData.alimentacaoEquipe}
                      onChange={(value) => handleChange("alimentacaoEquipe", value)}
                      label="Alimentação Equipe Administrativa"
                    />
                    <CurrencyInput
                      id="prolaboreSocios"
                      value={formData.prolaboreSocios}
                      onChange={(value) => handleChange("prolaboreSocios", value)}
                      label="Pró-labore Sócios"
                    />
                    <CurrencyInput
                      id="beneficios"
                      value={formData.beneficios}
                      onChange={(value) => handleChange("beneficios", value)}
                      label="Benefícios (Cesta Básica, Auxílio Educação, etc)"
                    />
                    <CurrencyInput
                      id="valorPessoaDia"
                      value={formData.valorPessoaDia}
                      onChange={(value) => handleChange("valorPessoaDia", value)}
                      label="Valor da Diária por Pessoa (Mão de Obra)"
                    />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="administrativo">
                <Card className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CurrencyInput
                      id="cipa"
                      value={formData.cipa}
                      onChange={(value) => handleChange("cipa", value)}
                      label="CIPA"
                    />
                    <CurrencyInput
                      id="ppra"
                      value={formData.ppra}
                      onChange={(value) => handleChange("ppra", value)}
                      label="PPRA"
                    />
                    <CurrencyInput
                      id="pcmat"
                      value={formData.pcmat}
                      onChange={(value) => handleChange("pcmat", value)}
                      label="PCMAT"
                    />
                    <CurrencyInput
                      id="assessoriaJuridica"
                      value={formData.assessoriaJuridica}
                      onChange={(value) => handleChange("assessoriaJuridica", value)}
                      label="Assessoria Jurídica"
                    />
                    <CurrencyInput
                      id="telefoneFixo"
                      value={formData.telefoneFixo}
                      onChange={(value) => handleChange("telefoneFixo", value)}
                      label="Telefonia Fixa"
                    />
                    <CurrencyInput
                      id="telefoneCelular"
                      value={formData.telefoneCelular}
                      onChange={(value) => handleChange("telefoneCelular", value)}
                      label="Telefonia Celular"
                    />
                    <CurrencyInput
                      id="telefoneRadio"
                      value={formData.telefoneRadio}
                      onChange={(value) => handleChange("telefoneRadio", value)}
                      label="Telefonia Rádio"
                    />
                    <CurrencyInput
                      id="combustivelVeiculos"
                      value={formData.combustivelVeiculos}
                      onChange={(value) => handleChange("combustivelVeiculos", value)}
                      label="Combustível Veículos"
                    />
                    <CurrencyInput
                      id="seguroVeiculos"
                      value={formData.seguroVeiculos}
                      onChange={(value) => handleChange("seguroVeiculos", value)}
                      label="Seguro Veículos"
                    />
                    <CurrencyInput
                      id="ipva"
                      value={formData.ipva}
                      onChange={(value) => handleChange("ipva", value)}
                      label="IPVA"
                    />
                    <CurrencyInput
                      id="dpvat"
                      value={formData.dpvat}
                      onChange={(value) => handleChange("dpvat", value)}
                      label="DPVAT"
                    />
                    <CurrencyInput
                      id="licenciamentoVeicular"
                      value={formData.licenciamentoVeicular}
                      onChange={(value) => handleChange("licenciamentoVeicular", value)}
                      label="Licenciamento Veicular"
                    />
                    <CurrencyInput
                      id="manutencaoVeiculos"
                      value={formData.manutencaoVeiculos}
                      onChange={(value) => handleChange("manutencaoVeiculos", value)}
                      label="Manutenção Veículos"
                    />
                    <CurrencyInput
                      id="assessoriaContabil"
                      value={formData.assessoriaContabil}
                      onChange={(value) => handleChange("assessoriaContabil", value)}
                      label="Assessoria Contábil"
                    />
                    <CurrencyInput
                      id="softwaresLicenciamento"
                      value={formData.softwaresLicenciamento}
                      onChange={(value) => handleChange("softwaresLicenciamento", value)}
                      label="Softwares - Licenciamento"
                    />
                    <CurrencyInput
                      id="pedagios"
                      value={formData.pedagios}
                      onChange={(value) => handleChange("pedagios", value)}
                      label="Sem Parar - Pedágios"
                    />
                    <CurrencyInput
                      id="assessoriaInformatica"
                      value={formData.assessoriaInformatica}
                      onChange={(value) => handleChange("assessoriaInformatica", value)}
                      label="Assessoria em Informática"
                    />
                    <CurrencyInput
                      id="bandaLarga"
                      value={formData.bandaLarga}
                      onChange={(value) => handleChange("bandaLarga", value)}
                      label="Banda Larga"
                    />
                    <CurrencyInput
                      id="servicosCartorio"
                      value={formData.servicosCartorio}
                      onChange={(value) => handleChange("servicosCartorio", value)}
                      label="Serviços de Cartório"
                    />
                    <CurrencyInput
                      id="servicoMensageiro"
                      value={formData.servicoMensageiro}
                      onChange={(value) => handleChange("servicoMensageiro", value)}
                      label="Serviço de Mensageiro - Motoboy"
                    />
                    <CurrencyInput
                      id="materialEscritorio"
                      value={formData.materialEscritorio}
                      onChange={(value) => handleChange("materialEscritorio", value)}
                      label="Material de Escritório"
                    />
                    <CurrencyInput
                      id="alvaraFuncionamento"
                      value={formData.alvaraFuncionamento}
                      onChange={(value) => handleChange("alvaraFuncionamento", value)}
                      label="Alvará de Funcionamento"
                    />
                    <CurrencyInput
                      id="despesasCorreio"
                      value={formData.despesasCorreio}
                      onChange={(value) => handleChange("despesasCorreio", value)}
                      label="Despesas com Correio"
                    />
                    <CurrencyInput
                      id="custosBancarios"
                      value={formData.custosBancarios}
                      onChange={(value) => handleChange("custosBancarios", value)}
                      label="Custos Bancários"
                    />
                    <CurrencyInput
                      id="taxasMunicipais"
                      value={formData.taxasMunicipais}
                      onChange={(value) => handleChange("taxasMunicipais", value)}
                      label="Taxas Municipais, Estaduais e Federais"
                    />
                    <CurrencyInput
                      id="sindicatos"
                      value={formData.sindicatos}
                      onChange={(value) => handleChange("sindicatos", value)}
                      label="Sindicatos (Patronal)"
                    />
                    <CurrencyInput
                      id="hospedagemSite"
                      value={formData.hospedagemSite}
                      onChange={(value) => handleChange("hospedagemSite", value)}
                      label="Hospedagem/Manutenção Site"
                    />
                    <NumberInput
                      id="mediaMes"
                      value={formData.mediaMes}
                      onChange={(value) => handleChange("mediaMes", value)}
                      label="Média de Metro Quadrado por Mês"
                      placeholder="0,00"
                    />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="customizados">
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Custos Personalizados</h3>
                    <Dialog open={isAddCustoDialogOpen} onOpenChange={setIsAddCustoDialogOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Custo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adicionar Custo Personalizado</DialogTitle>
                          <DialogDescription>
                            Adicione um custo fixo personalizado que será incluído no cálculo total.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="nome-custo">Nome do Custo</Label>
                            <Input
                              id="nome-custo"
                              placeholder="Ex: Seguro adicional"
                              value={novoCusto.nome}
                              onChange={(e) => setNovoCusto(prev => ({ ...prev, nome: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="valor-custo">Valor</Label>
                            <NumericFormat
                              id="valor-custo"
                              value={novoCusto.valor}
                              onValueChange={(values) => setNovoCusto(prev => ({ ...prev, valor: values.value }))}
                              thousandSeparator="."
                              decimalSeparator=","
                              decimalScale={2}
                              fixedDecimalScale
                              prefix="R$ "
                              placeholder="R$ 0,00"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsAddCustoDialogOpen(false)
                              setNovoCusto({ nome: "", valor: "" })
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button type="button" onClick={adicionarCustoCustomizado}>
                            Adicionar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {custosCustomizados.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Nenhum custo personalizado cadastrado.</p>
                      <p className="text-sm mt-2">Clique em "Adicionar Custo" para criar um novo.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead className="w-[100px] text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {custosCustomizados.map((custo) => (
                          <TableRow key={custo.id}>
                            <TableCell className="font-medium">{custo.nome}</TableCell>
                            <TableCell className="text-right">{formatCurrency(custo.valor)}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => excluirCustoCustomizado(custo.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="p-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total dos Custos Fixos:</span>
                <span className="text-xl font-bold text-green-700">{formatCurrency(total)}</span>
              </div>
              {formData.mediaMes && formData.mediaMes !== "0" && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Média Final (por m²):</span>
                    <span className="text-xl font-bold text-blue-700">{formatCurrency(mediaFinal)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Total ÷ Média de m² por mês = {formatCurrency(total)} ÷ {formData.mediaMes.replace(/\./g, '').replace(',', '.')} m² = {formatCurrency(mediaFinal)}
                  </p>
                </div>
              )}
            </Card>

            <div className="flex justify-end space-x-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? "Salvando..." 
                  : existingRecordId 
                    ? "Atualizar" 
                    : "Salvar"
                }
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}
