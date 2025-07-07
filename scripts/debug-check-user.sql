-- Este script cria uma função de diagnóstico para verificar qual UID o banco de dados
-- está recebendo da sessão do usuário autenticado.

-- A função simplesmente retorna o resultado de auth.uid() como texto.
CREATE OR REPLACE FUNCTION who_am_i()
RETURNS TEXT
LANGUAGE SQL
AS $$
  SELECT auth.uid()::text;
$$; 