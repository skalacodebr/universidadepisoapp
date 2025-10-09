import { NextRequest, NextResponse } from "next/server"
import { atualizarUsuario, excluirUsuario, buscarUsuarioPorId } from "@/lib/usuarios-api"

// GET - Buscar usuário por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const usuario = await buscarUsuarioPorId(id)
    return NextResponse.json({ success: true, data: usuario })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 404 })
  }
}

// PUT - Atualizar usuário
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const result = await atualizarUsuario(id, body)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// DELETE - Excluir usuário
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id)
    const result = await excluirUsuario(id)
    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
