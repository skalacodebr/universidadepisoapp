import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Rota temporária para criar a tabela cargos e popular com dados
export async function POST() {
  try {
    // Tentar criar a tabela (pode falhar se já existir)
    const cargos = [
      { id: 1, nome: "Administrador Geral", descricao: "Acesso total ao sistema, incluindo gestão de usuários" },
      { id: 2, nome: "Engenheiro Civil", descricao: "Responsável por projetos e execução de obras" },
      { id: 3, nome: "Gerente de Projetos", descricao: "Gerencia múltiplos projetos e equipes" },
      { id: 4, nome: "Técnico de Obras", descricao: "Realiza inspeções e acompanhamento técnico" },
      { id: 5, nome: "Analista Financeiro", descricao: "Gerencia orçamentos e finanças" },
      { id: 6, nome: "Supervisor de Obras", descricao: "Supervisiona a execução das obras" },
      { id: 7, nome: "Assistente Administrativo", descricao: "Suporte administrativo geral" },
    ]

    const resultados = []

    for (const cargo of cargos) {
      const { data, error } = await supabaseAdmin.from("cargos").upsert(cargo, { onConflict: "id" }).select()

      if (error) {
        resultados.push({ cargo: cargo.nome, sucesso: false, erro: error.message })
      } else {
        resultados.push({ cargo: cargo.nome, sucesso: true })
      }
    }

    // Verificar os cargos inseridos
    const { data: todosOsCargos, error: selectError } = await supabaseAdmin.from("cargos").select("*").order("id")

    if (selectError) {
      return NextResponse.json({
        success: false,
        message: "Erro ao verificar cargos",
        error: selectError.message,
        resultados,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Cargos criados/atualizados com sucesso!",
      resultados,
      cargos: todosOsCargos,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    )
  }
}
