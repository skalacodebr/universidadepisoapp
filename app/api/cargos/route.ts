import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

// GET - Listar todos os cargos
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from("cargos").select("*").order("nome", { ascending: true })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
