"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Info, X, Eye, EyeOff } from "lucide-react"
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
  senha?: string
  confirmarSenha?: string
}

export function CadastroUsuarioForm({ usuario, onClose, isEditing = false, onSave }: CadastroUsuarioFormProps) {
  // Estados para os campos do formulário
  const [nome, setNome] = useState(usuario?.nome || "")
  const [cpf, setCpf] = useState(usuario?.cpf || "")
  const [cargo, setCargo] = useState(usuario?.cargo || "")
  const [email, setEmail] = useState(usuario?.email || "")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
  const [cargos, setCargos] = useState<{ id: number; nome: string }[]>([])
  const [isLoadingCargos, setIsLoadingCargos] = useState(true)

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

  // Carregar cargos ao montar o componente
  useEffect(() => {
    carregarCargos()
  }, [])

  // Atualizar o custo total quando os valores financeiros mudarem
  useEffect(() => {
    calcularCustoTotal()
  }, [salario, beneficios, encargos])

  // Função para carregar cargos da API
  const carregarCargos = async () => {
    try {
      setIsLoadingCargos(true)
      const response = await fetch("/api/cargos")
      const result = await response.json()

      if (result.success) {
        setCargos(result.data)
      } else {
        console.error("Erro ao carregar cargos:", result.message)
      }
    } catch (error) {
      console.error("Erro ao carregar cargos:", error)
    } finally {
      setIsLoadingCargos(false)
    }
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

    // Validação de senha
    if (!isEditing) {
      // Ao criar novo usuário, senha é obrigatória
      if (!senha) {
        errors.senha = "Senha é obrigatória"
      } else if (senha.length < 6) {
        errors.senha = "Senha deve ter no mínimo 6 caracteres"
      }

      if (!confirmarSenha) {
        errors.confirmarSenha = "Confirmação de senha é obrigatória"
      } else if (senha !== confirmarSenha) {
        errors.confirmarSenha = "As senhas não coincidem"
      }
    } else {
      // Ao editar, senha é opcional, mas se informada deve ser válida
      if (senha) {
        if (senha.length < 6) {
          errors.senha = "Senha deve ter no mínimo 6 caracteres"
        }
        if (senha !== confirmarSenha) {
          errors.confirmarSenha = "As senhas não coincidem"
        }
      }
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
      const dadosUsuario: any = {
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
      }

      // Adicionar senha apenas se foi preenchida
      if (senha) {
        dadosUsuario.senha = senha
      }

      let response
      if (isEditing && usuario?.id) {
        // Atualizar usuário existente
        response = await fetch(`/api/usuarios/${usuario.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosUsuario),
        })
      } else {
        // Criar novo usuário
        response = await fetch("/api/usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosUsuario),
        })
      }

      const result = await response.json()

      if (result.success) {
        setSubmitSuccess(true)

        // Chamar a função onSave se ela existir
        if (onSave) {
          onSave(dadosUsuario)
        }

        // Fechar o modal após 1.5 segundos
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        throw new Error(result.message || "Erro ao salvar usuário")
      }
    } catch (error: any) {
      console.error("Erro ao salvar usuário:", error)
      alert(error.message || "Erro ao salvar usuário. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para navegar para a próxima aba
  const nextTab = () => {
    if (activeTab === "dados-pessoais") {
      // Validar apenas campos da aba atual
      const errors: FormErrors = {}

      if (!nome.trim()) errors.nome = "Nome é obrigatório"
      if (!cpf.trim() || cpf.length < 14) errors.cpf = "CPF inválido"
      if (!cargo) errors.cargo = "Cargo é obrigatório"
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "E-mail inválido"

      // Validação de senha para novo usuário
      if (!isEditing) {
        if (!senha) errors.senha = "Senha é obrigatória"
        else if (senha.length < 6) errors.senha = "Senha deve ter no mínimo 6 caracteres"
        if (!confirmarSenha) errors.confirmarSenha = "Confirmação de senha é obrigatória"
        else if (senha !== confirmarSenha) errors.confirmarSenha = "As senhas não coincidem"
      } else {
        // Para edição, validar apenas se senha foi informada
        if (senha) {
          if (senha.length < 6) errors.senha = "Senha deve ter no mínimo 6 caracteres"
          if (senha !== confirmarSenha) errors.confirmarSenha = "As senhas não coincidem"
        }
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors)
        return
      }

      setActiveTab("dados-financeiros")
    }
  }

  // Função para navegar para a aba anterior
  const prevTab = () => {
    if (activeTab === "dados-financeiros") {
      setActiveTab("dados-pessoais")
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
          <TabsList className="grid grid-cols-2 mb-8 rounded-lg bg-gray-100 p-1">
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
                    disabled={isLoadingCargos}
                  >
                    <SelectTrigger
                      className={formErrors.cargo ? "border-red-500 focus:ring-red-500" : ""}
                      aria-invalid={!!formErrors.cargo}
                      aria-describedby={formErrors.cargo ? "cargo-error" : undefined}
                    >
                      <SelectValue placeholder={isLoadingCargos ? "Carregando cargos..." : "Selecione o cargo"} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingCargos ? (
                        <SelectItem value="loading" disabled>
                          Carregando...
                        </SelectItem>
                      ) : cargos.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          Nenhum cargo disponível
                        </SelectItem>
                      ) : (
                        cargos.map((cargoItem) => (
                          <SelectItem key={cargoItem.id} value={cargoItem.nome}>
                            {cargoItem.nome}
                          </SelectItem>
                        ))
                      )}
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
                  <Label htmlFor="senha" className={formErrors.senha ? "text-red-500" : ""}>
                    Senha {!isEditing && <span className="text-red-500">*</span>}
                    {isEditing && <span className="text-xs text-gray-500 font-normal ml-2">(deixe em branco para manter a atual)</span>}
                  </Label>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={showPassword ? "text" : "password"}
                      value={senha}
                      onChange={(e) => {
                        setSenha(e.target.value)
                        if (formErrors.senha) {
                          setFormErrors({ ...formErrors, senha: undefined })
                        }
                      }}
                      placeholder={isEditing ? "••••••••" : "Digite a senha"}
                      className={`${formErrors.senha ? "border-red-500 focus:ring-red-500" : ""} pr-10`}
                      aria-invalid={!!formErrors.senha}
                      aria-describedby={formErrors.senha ? "senha-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formErrors.senha && (
                    <p id="senha-error" className="text-sm text-red-500 mt-1">
                      {formErrors.senha}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha" className={formErrors.confirmarSenha ? "text-red-500" : ""}>
                    Confirmar Senha {!isEditing && <span className="text-red-500">*</span>}
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmarSenha"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmarSenha}
                      onChange={(e) => {
                        setConfirmarSenha(e.target.value)
                        if (formErrors.confirmarSenha) {
                          setFormErrors({ ...formErrors, confirmarSenha: undefined })
                        }
                      }}
                      placeholder={isEditing ? "••••••••" : "Confirme a senha"}
                      className={`${formErrors.confirmarSenha ? "border-red-500 focus:ring-red-500" : ""} pr-10`}
                      aria-invalid={!!formErrors.confirmarSenha}
                      aria-describedby={formErrors.confirmarSenha ? "confirmarSenha-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {formErrors.confirmarSenha && (
                    <p id="confirmarSenha-error" className="text-sm text-red-500 mt-1">
                      {formErrors.confirmarSenha}
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
