import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// Rota para adicionar coluna telefone na tabela usuarios
export async function POST() {
  try {
    // Adicionar coluna telefone
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        ALTER TABLE usuarios
        ADD COLUMN IF NOT EXISTS telefone VARCHAR(15);
      `
    })

    if (error) {
      // Se a função RPC não existir, tentar via query direta
      const { error: directError } = await supabaseAdmin
        .from('usuarios')
        .select('telefone')
        .limit(1)

      if (directError?.message?.includes('column') && directError?.message?.includes('does not exist')) {
        return NextResponse.json({
          success: false,
          message: "Não foi possível adicionar a coluna automaticamente. Execute o SQL manualmente no Supabase Dashboard.",
          sql: "ALTER TABLE usuarios ADD COLUMN telefone VARCHAR(15);",
          error: error.message
        }, { status: 500 })
      }

      // Se não houver erro ao selecionar, significa que a coluna já existe
      return NextResponse.json({
        success: true,
        message: "Coluna telefone já existe na tabela usuarios"
      })
    }

    return NextResponse.json({
      success: true,
      message: "Coluna telefone adicionada com sucesso à tabela usuarios"
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
      sql: "ALTER TABLE usuarios ADD COLUMN telefone VARCHAR(15);"
    }, { status: 500 })
  }
}
