import { NextRequest, NextResponse } from "next/server"
import { listarUsuarios, criarUsuario } from "@/lib/usuarios-api"

// GET - Listar todos os usuários
export async function GET() {
  try {
    const usuarios = await listarUsuarios()
    return NextResponse.json({ success: true, data: usuarios })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// POST - Criar novo usuário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await criarUsuario(body)
    return NextResponse.json(result, { status: result.success ? 201 : 400 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
