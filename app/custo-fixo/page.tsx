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
}

export default function CustoFixoPage() {
  const router = useRouter()
  
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
    hospedagemSite: ""
  })

  const [isLoading, setIsLoading] = useState(false)
  const [existingRecordId, setExistingRecordId] = useState<number | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)

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
        
        console.log('🔍 Buscando dados existentes...')
        
        const { data, error } = await supabase
          .from('custofixo_usuario')
          .select('*')
          .eq('userid', 1) // Usando o mesmo userid padrão
          .order('created_at', { ascending: false })
          .limit(1)

        console.log('📊 Resposta do Supabase:', { data, error })

        if (error) {
          console.error('❌ Erro ao buscar dados existentes:', error)
          return
        }

        if (data && data.length > 0) {
          const record = data[0]
          console.log('✅ Registro encontrado:', record)
          
          console.log('📌 Definindo existingRecordId:', record.id)
          setExistingRecordId(record.id)
          
          // Converter números de volta para strings formatadas
          const formatNumber = (value: number | null) => {
            console.log('🔄 Formatando valor:', value, 'tipo:', typeof value)
            if (value === null || value === undefined) return ""
            return value.toString()
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

  const handleChange = (field: keyof CustoFixoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const total = useMemo(() => {
    return Object.values(formData).reduce((acc, curr) => {
      const value = parseFloat(curr.replace(/[^\d,]/g, '').replace(',', '.')) || 0
      return acc + value
    }, 0)
  }, [formData])

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const parseFormDataForDB = (data: CustoFixoFormData) => {
    const parsed: Record<string, number> = {}
    Object.entries(data).forEach(([key, value]) => {
      parsed[key] = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    })
    return parsed
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const parsedData = parseFormDataForDB(formData)

      if (existingRecordId) {
        // Atualizar registro existente
        const { error } = await supabase
          .from('custofixo_usuario')
          .update({
            total: total,
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

        if (error) {
          console.error('Erro do Supabase:', error)
          throw error
        }

        alert("Custos fixos atualizados com sucesso!")
      } else {
        // Criar novo registro
        const { error } = await supabase
          .from('custofixo_usuario')
          .insert({
            userid: 1,
            total: total,
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="instalacoes">Instalações</TabsTrigger>
                <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
                <TabsTrigger value="administrativo">Administrativo</TabsTrigger>
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
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="p-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total dos Custos Fixos:</span>
                <span className="text-xl font-bold text-green-700">{formatCurrency(total)}</span>
              </div>
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
