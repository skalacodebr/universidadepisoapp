-- Este script implementa a abordagem final e mais robusta para a segurança da tabela 'equipamentos'.
-- Utiliza duas políticas de SELECT separadas, que são unidas por OR, para máxima clareza e confiabilidade.
-- Ele lê o ID do usuário de um token JWT customizado.

-- Passo 1: Remover TODAS as políticas de segurança anteriores para evitar conflitos.
DROP POLICY IF EXISTS "Policy 1: Allow users to read their own equipment" ON public.equipamentos;
DROP POLICY IF EXISTS "Policy 2: Allow users to read default equipment" ON public.equipamentos;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.equipamentos;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.equipamentos;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.equipamentos;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.equipamentos;
DROP POLICY IF EXISTS "DEBUG - Allow public read access to default equipments" ON public.equipamentos;

-- Passo 2: Garantir que a RLS esteja ativa.
ALTER TABLE public.equipamentos ENABLE ROW LEVEL SECURITY;

-- Passo 3: Criar as políticas de SELECT separadas.
-- Política 1: Permite que um usuário logado veja os equipamentos que ele mesmo criou.
-- Acessa o campo 'sub' (subject) do nosso JWT customizado.
CREATE POLICY "Policy 1: Allow users to read their own equipment"
ON public.equipamentos
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'sub')::bigint = user_id::bigint
);

-- Política 2: Permite que um usuário logado veja os equipamentos padrão do sistema.
CREATE POLICY "Policy 2: Allow users to read default equipment"
ON public.equipamentos
FOR SELECT
TO authenticated
USING (
  user_id::bigint = 0
);

-- Passo 4: Recriar as políticas de modificação (INSERT, UPDATE, DELETE).
-- Política de INSERT: Usuários podem criar equipamentos apenas para si mesmos.
CREATE POLICY "Enable insert for authenticated users"
ON public.equipamentos
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.jwt() ->> 'sub')::bigint = user_id::bigint
);

-- Política de UPDATE: Usuários podem atualizar apenas seus próprios equipamentos.
CREATE POLICY "Enable update for users based on user_id"
ON public.equipamentos
FOR UPDATE
TO authenticated
USING (
  auth.uid()::text = user_id
);

-- Política de DELETE: Usuários podem deletar apenas seus próprios equipamentos.
CREATE POLICY "Enable delete for users based on user_id"
ON public.equipamentos
FOR DELETE
TO authenticated
USING (
  auth.uid()::text = user_id
);

-- A função para inserir dados padrão permanece a mesma.
CREATE OR REPLACE FUNCTION insert_default_equipamentos()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.equipamentos WHERE user_id = '0';
  INSERT INTO public.equipamentos (nome, valor_dia, user_id) VALUES
    ('Régua Vibratória', 50.00, '0'),
    ('Acabadora de Superfície', 45.00, '0'),
    ('Alisador de Piso', 35.00, '0'),
    ('Cortadora de Piso', 40.00, '0'),
    ('Desempenadeira Mecânica', 55.00, '0'),
    ('Bomba de Concreto', 150.00, '0'),
    ('Betoneira', 30.00, '0'),
    ('Serra Circular', 25.00, '0');
END;
$$; 