-- Criar tabela para custos fixos customizados por usuário
CREATE TABLE IF NOT EXISTS custofixo_usuario_customizado (
  id SERIAL PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  nome VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Foreign key para users (assumindo que existe uma tabela users)
  CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Criar índice para melhorar performance nas queries por usuário
CREATE INDEX IF NOT EXISTS idx_custofixo_customizado_usuario ON custofixo_usuario_customizado(usuario_id);

-- Adicionar comentários para documentação
COMMENT ON TABLE custofixo_usuario_customizado IS 'Custos fixos personalizados criados pelos usuários';
COMMENT ON COLUMN custofixo_usuario_customizado.usuario_id IS 'ID do usuário que criou o custo';
COMMENT ON COLUMN custofixo_usuario_customizado.nome IS 'Nome/descrição do custo fixo';
COMMENT ON COLUMN custofixo_usuario_customizado.valor IS 'Valor do custo fixo em reais';
