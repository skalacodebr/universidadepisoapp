# Como Corrigir o Erro "Invalid API key"

## Problema
A `SUPABASE_SERVICE_ROLE_KEY` no arquivo `.env.local` está incompleta/incorreta.

## Solução

### Passo 1: Pegar a Service Role Key do Supabase

1. Acesse: https://supabase.com/dashboard/project/qxkwqonrfnpnhusxsppn/settings/api
2. Faça login se necessário
3. Role a página até "Project API keys"
4. Copie a key que está na linha **"service_role"** (é a key SECRET, não compartilhe publicamente!)

### Passo 2: Atualizar o .env.local

Abra o arquivo `.env.local` e substitua a linha:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4a3dxb25yZm5wbmh1c3hzcHBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzkzNTUwMSwiZXhwIjoyMDYzNTExNTAxfQ.hGh5hNJlBJWKzqXdQZqZQOqZQOqZQOqZQOqZQOqZQOq
```

Pela key completa que você copiou do Supabase (ela é bem maior e termina de forma diferente).

### Passo 3: Reiniciar o servidor

Depois de atualizar o `.env.local`:

1. Pare o servidor (Ctrl+C no terminal)
2. Inicie novamente: `npm run dev`
3. Acesse: http://localhost:3000/usuarios

Agora os usuários devem aparecer! ✅

## Nota Importante

⚠️ **NUNCA** compartilhe a `SUPABASE_SERVICE_ROLE_KEY` publicamente! Ela dá acesso total ao seu banco de dados, ignorando todas as regras de segurança (RLS).
