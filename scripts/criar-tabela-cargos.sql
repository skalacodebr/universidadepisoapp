-- Criar tabela cargos
CREATE TABLE IF NOT EXISTS cargos (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir cargos padrão
INSERT INTO cargos (id, nome, descricao) VALUES
  (1, 'Engenheiro Civil', 'Responsável por projetos e execução de obras'),
  (2, 'Gerente de Projetos', 'Gerencia múltiplos projetos e equipes'),
  (3, 'Técnico de Obras', 'Realiza inspeções e acompanhamento técnico'),
  (4, 'Analista Financeiro', 'Gerencia orçamentos e finanças'),
  (5, 'Supervisor de Obras', 'Supervisiona a execução das obras'),
  (6, 'Assistente Administrativo', 'Suporte administrativo geral')
ON CONFLICT (id) DO NOTHING;

-- Resetar sequência para o próximo ID correto
SELECT setval('cargos_id_seq', (SELECT MAX(id) FROM cargos));

-- Criar índice para busca por nome
CREATE INDEX IF NOT EXISTS idx_cargos_nome ON cargos(nome);

-- Comentários na tabela
COMMENT ON TABLE cargos IS 'Tabela de cargos/funções dos usuários do sistema';
COMMENT ON COLUMN cargos.nome IS 'Nome do cargo';
COMMENT ON COLUMN cargos.descricao IS 'Descrição das responsabilidades do cargo';
