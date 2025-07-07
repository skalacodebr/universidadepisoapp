import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Armazenamos uma instância do cliente globalmente para não recriá-la desnecessariamente
let supabaseClient: ReturnType<typeof createClient> | null = null;

// Exportação direta do cliente para compatibilidade com código existente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseClient = () => {
  // Se o código está rodando no servidor (SSR/RSC), não há localStorage.
  // Criamos um cliente padrão sem token de autorização.
  if (typeof window === 'undefined') {
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  // No cliente, tentamos pegar o token.
  const token = localStorage.getItem("custom_token") || sessionStorage.getItem("custom_token");

  // Se já temos um cliente e não há token, ou se não temos um cliente, criamos um novo.
  // A lógica é criar um cliente com o token se ele existir.
  if (!supabaseClient || !token) {
    const headers: { [key: string]: string } = {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${token || supabaseAnonKey}`,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers,
      },
    });
  }
  
  // Se o token mudou (login/logout), podemos precisar re-instanciar ou atualizar os headers.
  // Para simplificar, vamos assumir que o contexto de auth irá gerenciar a atualização da página,
  // e na recarga, o token correto será pego.
  
  return supabaseClient;
};

// Para manter uma única instância e permitir atualizações de token
export const updateSupabaseClientToken = (token: string | null) => {
    supabaseClient = null; // Força a recriação na próxima chamada de getSupabaseClient
};
