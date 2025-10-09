import { createClient } from "@supabase/supabase-js"

// Cliente administrativo que bypassa RLS para operações específicas
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qxkwqonrfnpnhusxsppn.supabase.co"
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY não encontrada. Adicione a chave correta no arquivo .env.local"
  )
}

// Cliente para operações que precisam bypassar RLS
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
