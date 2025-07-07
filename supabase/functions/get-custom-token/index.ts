import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts"

// Interface para o payload que esperamos do cliente
interface UserPayload {
  userId: number;
  email: string;
}

serve(async (req) => {
  // Define os cabeçalhos CORS diretamente aqui para máxima robustez
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Permite qualquer origem
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Trata a requisição pre-flight do CORS de forma explícita
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const payload: UserPayload = await req.json()
    const { userId, email } = payload
    if (!userId || !email) {
      throw new Error("O ID e o email do usuário são obrigatórios no payload.")
    }

    const jwtSecret = Deno.env.get('CUSTOM_JWT_SECRET')
    if (!jwtSecret) {
      throw new Error("A variável de ambiente CUSTOM_JWT_SECRET não está definida.")
    }
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    if (!supabaseUrl) {
        throw new Error("A variável de ambiente SUPABASE_URL não está definida.")
    }

    // A API djwt@v3 usa a API Crypto padrão do Deno
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(jwtSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    
    // Cria o token JWT com as claims necessárias para o Supabase
    const customToken = await create({ alg: "HS256", typ: "JWT" }, {
        sub: userId.toString(),
        email: email,
        role: "authenticated",
        aud: "authenticated",
        aal: "aal1", // Nível de Autenticação
        session_id: crypto.randomUUID(), // ID de Sessão Único
        iss: `${supabaseUrl}/auth/v1`, // Emissor do Token
        iat: getNumericDate(0), // issued at: now
        exp: getNumericDate(60 * 60 * 24 * 7), // expires in: 7 days
    }, key);

    return new Response(JSON.stringify({ token: customToken }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    // Garante que o erro seja logado no servidor da função para depuração
    console.error("Erro na Edge Function:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500, // Usar 500 para erros de servidor
    })
  }
}) 