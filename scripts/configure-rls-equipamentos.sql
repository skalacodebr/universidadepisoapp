-- Remover políticas existentes para a tabela 'equipamentos' para evitar conflitos.
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.equipamentos;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.equipamentos;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.equipamentos;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.equipamentos;
DROP POLICY IF EXISTS "DEBUG - Allow public read access to default equipments" ON public.equipamentos;

-- 1. Ativar RLS (Row-Level Security) na tabela 'equipamentos'
-- Garante que as políticas abaixo serão aplicadas.
ALTER TABLE public.equipamentos ENABLE ROW LEVEL SECURITY;

-- 2. Política de SELECT (VERSÃO CORRIGIDA E FINAL)
-- Permite que um usuário autenticado leia equipamentos que
-- pertencem a ele (user_id = seu uid) OU que são padrão (user_id = '0').
-- Usar 'IN' é mais robusto que 'OR' para este caso.
CREATE POLICY "Enable read access for all authenticated users"
ON public.equipamentos
    FOR SELECT
    TO authenticated
USING (
  user_id IN ((auth.jwt() ->> 'sub'), '0')
);

-- 3. Política de INSERT
-- Permite que um usuário autenticado insira um novo equipamento
-- somente se o user_id for o seu próprio.
CREATE POLICY "Enable insert for authenticated users"
ON public.equipamentos
    FOR INSERT
    TO authenticated
WITH CHECK (
  (auth.jwt() ->> 'sub') = user_id
);

-- 4. Política de UPDATE
-- Permite que um usuário autenticado atualize somente seus próprios equipamentos.
-- Equipamentos padrão (user_id = '0') não podem ser atualizados por esta política.
CREATE POLICY "Enable update for users based on user_id"
ON public.equipamentos
    FOR UPDATE
    TO authenticated
USING (
  (auth.jwt() ->> 'sub') = user_id
)
WITH CHECK (
  (auth.jwt() ->> 'sub') = user_id
);

-- 5. Política de DELETE
-- Permite que um usuário autenticado delete somente seus próprios equipamentos.
-- Equipamentos padrão (user_id = '0') não podem ser deletados.
CREATE POLICY "Enable delete for users based on user_id"
ON public.equipamentos
    FOR DELETE
    TO authenticated
USING (
  (auth.jwt() ->> 'sub') = user_id
);

-- Função para inserir equipamentos padrão com privilégios de administrador.
-- Esta função contorna a RLS de INSERT definida acima.
CREATE OR REPLACE FUNCTION insert_default_equipamentos()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Limpa apenas os equipamentos padrão antes de inserir os novos.
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