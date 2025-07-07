-- Configurar RLS para a tabela custofixo_usuario
-- Este script permite acesso público à tabela para simplificar o uso inicial

-- Primeiro, verificar se RLS está habilitado
ALTER TABLE custofixo_usuario ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Allow public read access" ON custofixo_usuario;
DROP POLICY IF EXISTS "Allow public insert access" ON custofixo_usuario;
DROP POLICY IF EXISTS "Allow public update access" ON custofixo_usuario;
DROP POLICY IF EXISTS "Allow public delete access" ON custofixo_usuario;

-- Criar políticas que permitem acesso público (sem autenticação)
-- Isso é útil para desenvolvimento e testes iniciais

-- Política para SELECT (leitura)
CREATE POLICY "Allow public read access" ON custofixo_usuario
    FOR SELECT
    TO public
    USING (true);

-- Política para INSERT (criação)
CREATE POLICY "Allow public insert access" ON custofixo_usuario
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Política para UPDATE (atualização)
CREATE POLICY "Allow public update access" ON custofixo_usuario
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- Política para DELETE (exclusão)
CREATE POLICY "Allow public delete access" ON custofixo_usuario
    FOR DELETE
    TO public
    USING (true);

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'custofixo_usuario'; 