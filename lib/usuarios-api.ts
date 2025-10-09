import { supabaseAdmin } from "./supabase-admin"
import { hashSHA256 } from "./crypto"

export interface Usuario {
  id?: number
  nome: string
  cpf: string
  email: string
  senha?: string
  cargo: string
  telefone?: string
  salario?: string
  beneficios?: string
  encargos?: string
  custoTotal?: string
  status?: string
  cargos_id?: number
  faturamento_anual?: number
}

// Mapear cargo para cargos_id (temporário até criar a tabela cargos)
const cargoToId: { [key: string]: number } = {
  "Engenheiro Civil": 1,
  "Gerente de Projetos": 2,
  "Técnico de Obras": 3,
  "Analista Financeiro": 4,
  "Supervisor de Obras": 5,
  "Assistente Administrativo": 6,
}

// Converter valores monetários para números
const parseCurrency = (value: string | undefined): number => {
  if (!value) return 0
  return parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")) || 0
}

// Listar todos os usuários
export async function listarUsuarios() {
  try {
    const { data, error } = await supabaseAdmin.from("usuarios").select("*").order("id", { ascending: true })

    if (error) throw error

    // Mapear os dados do banco para o formato do frontend
    return data.map((user) => {
      // Converter salário para número (pode vir como string ou number)
      const salarioNum = typeof user.salario === "string" ? parseFloat(user.salario) || 0 : user.salario || 0

      return {
        id: user.id,
        nome: user.nome,
        cpf: user.cpf,
        email: user.email,
        cargo: Object.keys(cargoToId).find((key) => cargoToId[key] === user.cargos_id) || "Não definido",
        telefone: "",
        salario: `R$ ${salarioNum.toFixed(2)}`,
        beneficios: user.beneficios || "",
        encargos: user.encargos || "",
        status: user.status ? "Ativo" : "Inativo",
      }
    })
  } catch (error) {
    console.error("Erro ao listar usuários:", error)
    throw error
  }
}

// Criar novo usuário
export async function criarUsuario(usuario: Usuario) {
  try {
    // Hash da senha (CPF sem formatação por padrão)
    const senhaHash = await hashSHA256(usuario.cpf.replace(/\D/g, ""))

    // Preparar dados para inserção
    const dadosUsuario = {
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      senha: senhaHash,
      cargos_id: cargoToId[usuario.cargo] || 1,
      status: usuario.status === "Ativo",
      salario: parseCurrency(usuario.salario),
      beneficios: usuario.beneficios || "",
      encargos: usuario.encargos || "",
      faturamento_anual: 0,
    }

    const { data, error } = await supabaseAdmin.from("usuarios").insert(dadosUsuario).select().single()

    if (error) throw error

    return { success: true, data, message: "Usuário cadastrado com sucesso!" }
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error)
    return { success: false, message: error.message || "Erro ao cadastrar usuário" }
  }
}

// Atualizar usuário existente
export async function atualizarUsuario(id: number, usuario: Usuario) {
  try {
    // Preparar dados para atualização
    const dadosUsuario: any = {
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      cargos_id: cargoToId[usuario.cargo] || 1,
      status: usuario.status === "Ativo",
      salario: parseCurrency(usuario.salario),
      beneficios: usuario.beneficios || "",
      encargos: usuario.encargos || "",
    }

    // Se a senha foi fornecida, atualiza também
    if (usuario.senha) {
      dadosUsuario.senha = await hashSHA256(usuario.senha)
    }

    const { data, error } = await supabaseAdmin.from("usuarios").update(dadosUsuario).eq("id", id).select().single()

    if (error) throw error

    return { success: true, data, message: "Usuário atualizado com sucesso!" }
  } catch (error: any) {
    console.error("Erro ao atualizar usuário:", error)
    return { success: false, message: error.message || "Erro ao atualizar usuário" }
  }
}

// Excluir usuário
export async function excluirUsuario(id: number) {
  try {
    const { error } = await supabaseAdmin.from("usuarios").delete().eq("id", id)

    if (error) throw error

    return { success: true, message: "Usuário excluído com sucesso!" }
  } catch (error: any) {
    console.error("Erro ao excluir usuário:", error)
    return { success: false, message: error.message || "Erro ao excluir usuário" }
  }
}

// Buscar usuário por ID
export async function buscarUsuarioPorId(id: number) {
  try {
    const { data, error } = await supabaseAdmin.from("usuarios").select("*").eq("id", id).single()

    if (error) throw error

    // Converter salário para número (pode vir como string ou number)
    const salarioNum = typeof data.salario === "string" ? parseFloat(data.salario) || 0 : data.salario || 0

    // Mapear os dados para o formato do frontend
    return {
      id: data.id,
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      cargo: Object.keys(cargoToId).find((key) => cargoToId[key] === data.cargos_id) || "Não definido",
      telefone: "",
      salario: `R$ ${salarioNum.toFixed(2)}`,
      beneficios: data.beneficios || "",
      encargos: data.encargos || "",
      status: data.status ? "Ativo" : "Inativo",
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    throw error
  }
}
