"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Info, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Vamos adicionar tipos para melhorar a tipagem
interface Usuario {
  nome?: string
  cpf?: string
  cargo?: string
  email?: string
  telefone?: string
  salario?: string
  beneficios?: string
  encargos?: string
  custoTotal?: string
  status?: string
  permissoes?: {
    gestaoObras: boolean
    relatoriosFinanceiros: boolean
    fluxoCaixa: boolean
    registroDespesas: boolean
  }
  permissoesPersonalizadas?: {
    combustivel: boolean
    refeicao: boolean
    hospedagem: boolean
    aluguelEquipamentos: boolean
    materiais: boolean
    outros: boolean
  }
}

interface CadastroUsuarioFormProps {
  usuario?: Usuario
  onClose: () => void
  isEditing?: boolean
  onSave?: (dadosUsuario: Usuario) => void
}

// Vamos adicionar um tipo para os erros de validação
interface FormErrors {
  nome?: string
  cpf?: string
  email?: string
  cargo?: string
}

export function CadastroUsuarioForm({ usuario, onClose, isEditing = false, onSave }: CadastroUsuarioFormProps) {
  // Estados para os campos do formulário
  const [nome, setNome] = useState(usuario?.nome || "")
  const [cpf, setCpf] = useState(usuario?.cpf || "")
  const [cargo, setCargo] = useState(usuario?.cargo || "")
  const [email, setEmail] = useState(usuario?.email || "")
  const [telefone, setTelefone] = useState(usuario?.telefone || "")
  const [salario, setSalario] = useState(usuario?.salario || "")
  const [beneficios, setBeneficios] = useState(usuario?.beneficios || "")
  const [encargos, setEncargos] = useState(usuario?.encargos || "")
  const [custoTotal, setCustoTotal] = useState(usuario?.custoTotal || "")
  const [status, setStatus] = useState(usuario?.status || "Ativo")
  const [activeTab, setActiveTab] = useState("dados-pessoais")
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Estados para as permissões
  const [permissoes, setPermissoes] = useState({
    gestaoObras: usuario?.permissoes?.gestaoObras || false,
    relatoriosFinanceiros: usuario?.permissoes?.relatoriosFinanceiros || false,
    fluxoCaixa: usuario?.permissoes?.fluxoCaixa || false,
    registroDespesas: usuario?.permissoes?.registroDespesas || false,
  })

  // Estados para as permissões personalizadas
  const [permissoesPersonalizadas, setPermissoesPersonalizadas] = useState({
    combustivel: usuario?.permissoesPersonalizadas?.combustivel || true,
    refeicao: usuario?.permissoesPersonalizadas?.refeicao || true,
    hospedagem: usuario?.permissoesPersonalizadas?.hospedagem || true,
    aluguelEquipamentos: usuario?.permissoesPersonalizadas?.aluguelEquipamentos || false,
    materiais: usuario?.permissoesPersonalizadas?.materiais || false,
    outros: usuario?.permissoesPersonalizadas?.outros || false,
  })

  // Função para formatar o CPF (000.000.000-00)
  const formatCPF = (value: string) => {
    // Remove todos os caracteres não numéricos
    const cpfNumbers = value.replace(/\D/g, "")

    // Limita a 11 dígitos
    const cpfLimited = cpfNumbers.slice(0, 11)

    // Aplica a máscara
    if (cpfLimited.length <= 3) {
      return cpfLimited
    } else if (cpfLimited.length <= 6) {
      return `${cpfLimited.slice(0, 3)}.${cpfLimited.slice(3)}`
    } else if (cpfLimited.length <= 9) {
      return `${cpfLimited.slice(0, 3)}.${cpfLimited.slice(3, 6)}.${cpfLimited.slice(6)}`
    } else {
      return `${cpfLimited.slice(0, 3)}.${cpfLimited.slice(3, 6)}.${cpfLimited.slice(6, 9)}-${cpfLimited.slice(9)}`
    }
  }

  // Função para formatar telefone
  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    const limited = numbers.slice(0, 11)

    if (limited.length <= 2) {
      return `(${limited}`
    } else if (limited.length <= 7) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`
    }
  }

  // Função para formatar valores monetários
  const formatCurrency = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, "")

    // Converte para número e formata como moeda
    const formattedValue = (Number(numericValue) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })

    return formattedValue
  }

  // Função para calcular o custo total automaticamente
  const calcularCustoTotal = () => {
    const salarioNum = Number.parseFloat(salario.replace(/[^\d,]/g, "").replace(",", ".")) || 0
    const beneficiosNum = Number.parseFloat(beneficios.replace(/[^\d,]/g, "").replace(",", ".")) || 0
    const encargosNum = Number.parseFloat(encargos.replace(/[^\d,]/g, "").replace(",", ".")) || 0

    const total = salarioNum + beneficiosNum + encargosNum
    setCustoTotal(formatCurrency(String(total * 100)))
  }

  // Atualizar o custo total quando os valores financeiros mudarem
  useEffect(() => {
    calcularCustoTotal()
  }, [salario, beneficios, encargos])

  // Função para lidar com a mudança nas permissões
  const handlePermissaoChange = (permissao: string, checked: boolean) => {
    setPermissoes({
      ...permissoes,
      [permissao]: checked,
    })
  }

  // Função para lidar com a mudança nas permissões personalizadas
  const handlePermissaoPersonalizadaChange = (permissao: string, checked: boolean) => {
    setPermissoesPersonalizadas({
      ...permissoesPersonalizadas,
      [permissao]: checked,
    })
  }

  // Função para validar o formulário
  const validateForm = () => {
    const errors: FormErrors = {}

    if (!nome.trim()) {
      errors.nome = "Nome é obrigatório"
    }

    if (!cpf.trim() || cpf.length < 14) {
      errors.cpf = "CPF inválido"
    }

    if (!cargo) {
      errors.cargo = "Cargo é obrigatório"
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "E-mail inválido"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Função para salvar o usuário
  const handleSave = async () => {
    if (!validateForm()) {
      setActiveTab("dados-pessoais")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulação de uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const dadosUsuario = {
        nome,
        cpf,
        cargo,
        email,
        telefone,
        salario,
        beneficios,
        encargos,
        custoTotal,
        status,
        permissoes,
        permissoesPersonalizadas,
      }

      console.log(dadosUsuario)

      setSubmitSuccess(true)

      // Chamar a função onSave se ela existir
      if (onSave) {
        onSave(dadosUsuario)
      }

      // Fechar o modal após 1.5 segundos
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error("Erro ao salvar usuário:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para navegar para a próxima aba
  const nextTab = () => {
    if (activeTab === "dados-pessoais") {
      if (nome && cpf && cargo && email) {
        setActiveTab("dados-financeiros")
      } else {
        validateForm()
      }
    } else if (activeTab === "dados-financeiros") {
      setActiveTab("permissoes")
    }
  }

  // Função para navegar para a aba anterior
  const prevTab = () => {
    if (activeTab === "dados-financeiros") {
      setActiveTab("dados-pessoais")
    } else if (activeTab === "permissoes") {
      setActiveTab("dados-financeiros")
    }
  }

  return (
    <>
      <DialogHeader className="mb-8 px-8 pt-8 relative">
        <div className="absolute right-8 top-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <DialogTitle className="text-2xl font-semibold text-gray-800">
          {isEditing ? "Editar Usuário" : "Cadastro de Usuário"}
        </DialogTitle>
        <DialogDescription className="text-base text-gray-600 mt-2">
          {isEditing
            ? "Edite as informações do usuário no sistema"
            : "Preencha os dados para cadastrar um novo usuário no sistema"}
        </DialogDescription>
      </DialogHeader>

      {submitSuccess && (
        <Alert className="mb-8 mx-8 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Usuário {isEditing ? "atualizado" : "cadastrado"} com sucesso!
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6 max-h-[70vh] overflow-y-auto px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8 rounded-lg bg-gray-100 p-1">
            <TabsTrigger
              value="dados-pessoais"
              className={cn(
                "rounded-md data-[state=active]:bg-[#007EA3] data-[state=active]:text-white transition-all",
                Object.keys(formErrors).length > 0 && "focus:ring-red-500",
              )}
            >
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger
              value="dados-financeiros"
              className="rounded-md data-[state=active]:bg-[#007EA3] data-[state=active]:text-white transition-all"
            >
              Dados Financeiros
            </TabsTrigger>
            <TabsTrigger
              value="permissoes"
              className="rounded-md data-[state=active]:bg-[#007EA3] data-[state=active]:text-white transition-all"
            >
              Permissões
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dados-pessoais" className="space-y-6">
            <div className="space-y-8">
              <h3 className="text-lg font-medium mb-6">Dados Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome" className={formErrors.nome ? "text-red-500" : ""}>
                    Nome Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value)
                      if (formErrors.nome) {
                        setFormErrors({ ...formErrors, nome: undefined })
                      }
                    }}
                    placeholder="Digite o nome completo"
                    required
                    className={formErrors.nome ? "border-red-500 focus:ring-red-500" : ""}
                    aria-invalid={!!formErrors.nome}
                    aria-describedby={formErrors.nome ? "nome-error" : undefined}
                  />
                  {formErrors.nome && (
                    <p id="nome-error" className="text-sm text-red-500 mt-1">
                      {formErrors.nome}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf" className={formErrors.cpf ? "text-red-500" : ""}>
                    CPF <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cpf"
                    value={cpf}
                    onChange={(e) => {
                      setCpf(formatCPF(e.target.value))
                      if (formErrors.cpf) {
                        setFormErrors({ ...formErrors, cpf: undefined })
                      }
                    }}
                    placeholder="000.000.000-00"
                    required
                    maxLength={14}
                    className={formErrors.cpf ? "border-red-500 focus:ring-red-500" : ""}
                    aria-invalid={!!formErrors.cpf}
                    aria-describedby={formErrors.cpf ? "cpf-error" : undefined}
                  />
                  {formErrors.cpf && (
                    <p id="cpf-error" className="text-sm text-red-500 mt-1">
                      {formErrors.cpf}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo" className={formErrors.cargo ? "text-red-500" : ""}>
                    Cargo/Função <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={cargo}
                    onValueChange={(value) => {
                      setCargo(value)
                      if (formErrors.cargo) {
                        setFormErrors({ ...formErrors, cargo: undefined })
                      }
                    }}
                  >
                    <SelectTrigger
                      className={formErrors.cargo ? "border-red-500 focus:ring-red-500" : ""}
                      aria-invalid={!!formErrors.cargo}
                      aria-describedby={formErrors.cargo ? "cargo-error" : undefined}
                    >
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engenheiro Civil">Engenheiro Civil</SelectItem>
                      <SelectItem value="Gerente de Projetos">Gerente de Projetos</SelectItem>
                      <SelectItem value="Técnico de Obras">Técnico de Obras</SelectItem>
                      <SelectItem value="Analista Financeiro">Analista Financeiro</SelectItem>
                      <SelectItem value="Supervisor de Obras">Supervisor de Obras</SelectItem>
                      <SelectItem value="Assistente Administrativo">Assistente Administrativo</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.cargo && (
                    <p id="cargo-error" className="text-sm text-red-500 mt-1">
                      {formErrors.cargo}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className={formErrors.email ? "text-red-500" : ""}>
                    E-mail <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (formErrors.email) {
                        setFormErrors({ ...formErrors, email: undefined })
                      }
                    }}
                    placeholder="email@exemplo.com"
                    required
                    className={formErrors.email ? "border-red-500 focus:ring-red-500" : ""}
                    aria-invalid={!!formErrors.email}
                    aria-describedby={formErrors.email ? "email-error" : undefined}
                  />
                  {formErrors.email && (
                    <p id="email-error" className="text-sm text-red-500 mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button className="bg-[#007EA3] hover:bg-[#006a8a]" onClick={nextTab}>
                Próximo
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="dados-financeiros" className="space-y-6">
            <div className="space-y-8">
              <h3 className="text-lg font-medium mb-6">Dados Financeiros</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="salario">Salário</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-sm">Valor bruto do salário sem benefícios ou encargos</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="salario"
                    value={salario}
                    onChange={(e) => {
                      setSalario(formatCurrency(e.target.value.replace(/\D/g, "")))
                    }}
                    placeholder="R$ 0,00"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="beneficios">Benefícios</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-sm">Vale alimentação, transporte, plano de saúde, etc.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="beneficios"
                    value={beneficios}
                    onChange={(e) => {
                      setBeneficios(formatCurrency(e.target.value.replace(/\D/g, "")))
                    }}
                    placeholder="R$ 0,00"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="encargos">Encargos</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-sm">FGTS, INSS e outros encargos trabalhistas</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="encargos"
                    value={encargos}
                    onChange={(e) => {
                      setEncargos(formatCurrency(e.target.value.replace(/\D/g, "")))
                    }}
                    placeholder="R$ 0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custoTotal">Custo Total</Label>
                  <Input id="custoTotal" value={custoTotal} readOnly className="bg-gray-50 font-medium text-gray-700" />
                  <p className="text-xs text-gray-500">Calculado automaticamente</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-4 pt-6">
              <Button variant="outline" onClick={prevTab}>
                Voltar
              </Button>
              <Button className="bg-[#007EA3] hover:bg-[#006a8a]" onClick={nextTab}>
                Próximo
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="permissoes" className="space-y-6">
            {/* Permissões de Acesso */}
            <div className="space-y-8">
              <h3 className="text-lg font-medium mb-6">Permissões de Acesso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gestao-obras"
                    checked={permissoes.gestaoObras}
                    onCheckedChange={(checked) => handlePermissaoChange("gestaoObras", checked === true)}
                  />
                  <Label htmlFor="gestao-obras" className="cursor-pointer">
                    Gestão de Obras
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="relatorios-financeiros"
                    checked={permissoes.relatoriosFinanceiros}
                    onCheckedChange={(checked) => handlePermissaoChange("relatoriosFinanceiros", checked === true)}
                  />
                  <Label htmlFor="relatorios-financeiros" className="cursor-pointer">
                    Relatórios Financeiros
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fluxo-caixa"
                    checked={permissoes.fluxoCaixa}
                    onCheckedChange={(checked) => handlePermissaoChange("fluxoCaixa", checked === true)}
                  />
                  <Label htmlFor="fluxo-caixa" className="cursor-pointer">
                    Fluxo de Caixa
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="registro-despesas"
                    checked={permissoes.registroDespesas}
                    onCheckedChange={(checked) => handlePermissaoChange("registroDespesas", checked === true)}
                  />
                  <Label htmlFor="registro-despesas" className="cursor-pointer">
                    Registro de Despesas
                  </Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Permissões Personalizadas */}
            <div className="space-y-8">
              <h3 className="text-lg font-medium mb-2">Permissões Personalizadas</h3>
              <p className="text-sm text-gray-500 mb-3">
                Quais tipos de despesas podem ser registrados no aplicativo móvel:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="combustivel"
                    checked={permissoesPersonalizadas.combustivel}
                    onCheckedChange={(checked) => handlePermissaoPersonalizadaChange("combustivel", checked === true)}
                  />
                  <Label htmlFor="combustivel" className="cursor-pointer">
                    Combustível
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="refeicao"
                    checked={permissoesPersonalizadas.refeicao}
                    onCheckedChange={(checked) => handlePermissaoPersonalizadaChange("refeicao", checked === true)}
                  />
                  <Label htmlFor="refeicao" className="cursor-pointer">
                    Refeição
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hospedagem"
                    checked={permissoesPersonalizadas.hospedagem}
                    onCheckedChange={(checked) => handlePermissaoPersonalizadaChange("hospedagem", checked === true)}
                  />
                  <Label htmlFor="hospedagem" className="cursor-pointer">
                    Hospedagem
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="aluguel-equipamentos"
                    checked={permissoesPersonalizadas.aluguelEquipamentos}
                    onCheckedChange={(checked) =>
                      handlePermissaoPersonalizadaChange("aluguelEquipamentos", checked === true)
                    }
                  />
                  <Label htmlFor="aluguel-equipamentos" className="cursor-pointer">
                    Aluguel de Equipamentos
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="materiais"
                    checked={permissoesPersonalizadas.materiais}
                    onCheckedChange={(checked) => handlePermissaoPersonalizadaChange("materiais", checked === true)}
                  />
                  <Label htmlFor="materiais" className="cursor-pointer">
                    Materiais
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="outros"
                    checked={permissoesPersonalizadas.outros}
                    onCheckedChange={(checked) => handlePermissaoPersonalizadaChange("outros", checked === true)}
                  />
                  <Label htmlFor="outros" className="cursor-pointer">
                    Outros
                  </Label>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-between gap-4 pt-6">
              <Button variant="outline" onClick={prevTab}>
                Voltar
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button
                  className="bg-[#007EA3] hover:bg-[#006a8a] min-w-[100px]"
                  onClick={handleSave}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Salvando...
                    </div>
                  ) : isEditing ? (
                    "Atualizar"
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
