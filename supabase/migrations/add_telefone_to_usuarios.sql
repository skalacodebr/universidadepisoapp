-- Adicionar coluna telefone na tabela usuarios
ALTER TABLE usuarios
ADD COLUMN telefone VARCHAR(15);

-- Adicionar comentário na coluna
COMMENT ON COLUMN usuarios.telefone IS 'Telefone do usuário no formato (XX) XXXXX-XXXX';
