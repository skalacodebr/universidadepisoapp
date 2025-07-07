import { createClient } from "@supabase/supabase-js"

// Cliente administrativo que bypassa RLS para operações específicas
const SUPABASE_URL = "https://qxkwqonrfnpnhusxsppn.supabase.co"
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4a3dxb25yZm5wbmh1c3hzcHBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzkzNTUwMSwiZXhwIjoyMDYzNTExNTAxfQ.hGh5hNJlBJWKzqXdQZqZQOqZQOqZQOqZQOqZQOqZQOq"

// Cliente para operações que precisam bypassar RLS
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
