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

// Cache de cargos para evitar múltiplas requisições
let cargosCache: { id: number; nome: string }[] | null = null

// Função para buscar cargos e cachear
async function obterCargos() {
  if (cargosCache) return cargosCache

  const { data, error } = await supabaseAdmin.from("cargos").select("id, nome")

  if (error) {
    console.error("Erro ao buscar cargos:", error)
    return []
  }

  cargosCache = data || []
  return cargosCache
}

// Função para obter ID do cargo pelo nome
async function obterCargoIdPorNome(nomeCargo: string): Promise<number | null> {
  const cargos = await obterCargos()
  const cargo = cargos.find((c) => c.nome === nomeCargo)
  return cargo ? cargo.id : null
}

// Função para obter nome do cargo pelo ID
async function obterCargoNomePorId(cargoId: number): Promise<string> {
  const cargos = await obterCargos()
  const cargo = cargos.find((c) => c.id === cargoId)
  return cargo ? cargo.nome : "Não definido"
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
    const usuariosComCargos = await Promise.all(
      data.map(async (user) => {
        // Converter salário para número (pode vir como string ou number)
        const salarioNum = typeof user.salario === "string" ? parseFloat(user.salario) || 0 : user.salario || 0

        // Buscar nome do cargo
        const cargoNome = await obterCargoNomePorId(user.cargos_id)

        return {
          id: user.id,
          nome: user.nome,
          cpf: user.cpf,
          email: user.email,
          cargo: cargoNome,
          telefone: user.telefone || "",
          salario: `R$ ${salarioNum.toFixed(2)}`,
          beneficios: user.beneficios || "",
          encargos: user.encargos || "",
          status: user.status ? "Ativo" : "Inativo",
        }
      })
    )

    return usuariosComCargos
  } catch (error) {
    console.error("Erro ao listar usuários:", error)
    throw error
  }
}

// Criar novo usuário
export async function criarUsuario(usuario: Usuario) {
  try {
    // Hash da senha (usa a senha fornecida ou CPF sem formatação como fallback)
    const senhaHash = await hashSHA256(usuario.senha || usuario.cpf.replace(/\D/g, ""))

    // Buscar ID do cargo pelo nome
    const cargoId = await obterCargoIdPorNome(usuario.cargo)

    if (!cargoId) {
      return { success: false, message: `Cargo "${usuario.cargo}" não encontrado` }
    }

    // Preparar dados para inserção
    const dadosUsuario = {
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      senha: senhaHash,
      telefone: usuario.telefone || null,
      cargos_id: cargoId,
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
    // Buscar ID do cargo pelo nome
    const cargoId = await obterCargoIdPorNome(usuario.cargo)

    if (!cargoId) {
      return { success: false, message: `Cargo "${usuario.cargo}" não encontrado` }
    }

    // Preparar dados para atualização
    const dadosUsuario: any = {
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      telefone: usuario.telefone || null,
      cargos_id: cargoId,
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

    // Buscar nome do cargo
    const cargoNome = await obterCargoNomePorId(data.cargos_id)

    // Mapear os dados para o formato do frontend
    return {
      id: data.id,
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      cargo: cargoNome,
      telefone: data.telefone || "",
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
