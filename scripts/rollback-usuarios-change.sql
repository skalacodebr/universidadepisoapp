-- Este script reverte as alterações na tabela 'usuarios' para um estado estável.

-- Remove a chave estrangeira, se foi criada
ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS fk_auth_users;

-- Remove a chave primária da nova coluna 'id', se foi criada
ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;

-- Remove a nova coluna 'id' (UUID) que pode conter nulos
ALTER TABLE public.usuarios DROP COLUMN IF EXISTS id;

-- Renomeia a coluna de ID antiga de volta para 'id'
ALTER TABLE public.usuarios RENAME COLUMN IF EXISTS legacy_id TO id;

-- Recria a chave primária na coluna 'id' original para garantir a integridade
-- (Este comando pode falhar se a chave primária nunca foi removida, o que não é um problema)
DO $$
BEGIN
   IF NOT EXISTS (
       SELECT 1 FROM pg_constraint
       WHERE conname = 'usuarios_pkey'
   ) THEN
       ALTER TABLE public.usuarios ADD PRIMARY KEY (id);
   END IF;
END;
$$; 